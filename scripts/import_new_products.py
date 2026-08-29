#!/usr/bin/env python3
"""
Import new products from peterbot99.com into products.json.
Fetches product details via JSON-LD, categorizes by team/league, skips duplicates.
"""

import json
import re
import time
import os
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

PRODUCTS_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'products.json')
NEW_HANDLES_FILE = '/tmp/new_handles.txt'
FETCH_CACHE_FILE = '/tmp/peterbot_fetch_cache.json'
BASE_URL = 'https://peterbot99.com/products/'

# Team name mappings: keywords in handle/title -> (team_id, team_name, league_slug, league_name)
# This maps common team identifiers to the existing team structure
TEAM_MAP = {}  # Will be built from existing data


def build_team_map(data):
    """Build a lookup map from team names/slugs to team info."""
    team_map = {}
    for team_id, team in data['teams'].items():
        slug = team.get('slug', team_id.split('__')[-1] if '__' in team_id else team_id)
        name_lower = team['name'].lower()
        league = team['league']
        league_name = team['leagueName']
        info = {
            'team_id': team_id,
            'team_name': team['name'],
            'league': league,
            'leagueName': league_name,
            'slug': slug,
            'subLeague': team.get('subLeague'),
        }
        # Map by slug
        team_map[slug] = info
        # Map by name parts
        for part in name_lower.split():
            if len(part) > 2 and part not in ('fc', 'sc', 'sv', 'de', 'cf', 'cd', 'ac', 'as', 'ss', 'us', 'rb', 'vfb', 'tsg', 'bsc', 'fk', 'nk'):
                if part not in team_map:
                    team_map[part] = info
    return team_map


# Explicit handle keyword -> team_id mapping for common teams
HANDLE_TEAM_MAP = {
    'arsenal': 'premier-league__arsenal',
    'aston-villa': 'premier-league__astonvilla',
    'bournemouth': 'premier-league__bournemouth',
    'brighton': 'premier-league__brighton',
    'chelsea': 'premier-league__chelsea',
    'crystal-palace': 'premier-league__crystalpalace',
    'everton': 'premier-league__everton',
    'fulham': 'premier-league__fulham',
    'ipswich': 'premier-league__ipswich',
    'leicester': 'premier-league__leicester',
    'liverpool': 'premier-league__liverpool',
    'lvp': 'premier-league__liverpool',
    'man-city': 'premier-league__mancity',
    'manchester-city': 'premier-league__mancity',
    'man-utd': 'premier-league__manutd',
    'manchester-united': 'premier-league__manutd',
    'newcastle': 'premier-league__newcastle',
    'nottingham': 'premier-league__nottingham',
    'southampton': 'premier-league__southampton',
    'tottenham': 'premier-league__tottenham',
    'west-ham': 'premier-league__westham',
    'wolves': 'premier-league__wolves',
    'wolverhampton': 'premier-league__wolves',
    'barcelona': 'la-liga__barcelona',
    'real-madrid': 'la-liga__realmadrid',
    'atletico': 'la-liga__atletico',
    'atlético-madrid': 'la-liga__atletico',
    'atletico-de-madrid': 'la-liga__atletico',
    'sevilla': 'la-liga__sevilla',
    'valencia': 'la-liga__valencia',
    'villarreal': 'la-liga__villarreal',
    'real-sociedad': 'la-liga__realsociedad',
    'real-betis': 'la-liga__realbetis',
    'athletic-bilbao': 'la-liga__bilbao',
    'bilbao': 'la-liga__bilbao',
    'celta-vigo': 'la-liga__celtavigo',
    'celta': 'la-liga__celtavigo',
    'girona': 'la-liga__girona',
    'getafe': 'la-liga__getafe',
    'mallorca': 'la-liga__mallorca',
    'osasuna': 'la-liga__osasuna',
    'rayo-vallecano': 'la-liga__rayovallecano',
    'espanyol': 'la-liga__espanyol',
    'alaves': 'la-liga__alaves',
    'valladolid': 'la-liga__valladolid',
    'las-palmas': 'la-liga__laspalmas',
    'leganes': 'la-liga__leganes',
    'almeria': 'la-liga__almeria',
    'bayern': 'bundesliga__bayern',
    'bayern-munich': 'bundesliga__bayern',
    'bayern-münchen': 'bundesliga__bayern',
    'bayern-munichen': 'bundesliga__bayern',
    'dortmund': 'bundesliga__dortmund',
    'borussia-dortmund': 'bundesliga__dortmund',
    'leverkusen': 'bundesliga__leverkusen',
    'leipzig': 'bundesliga__leipzig',
    'rb-leipzig': 'bundesliga__leipzig',
    'frankfurt': 'bundesliga__fsvfrankfurt',
    'eintracht-frankfurt': 'bundesliga__fsvfrankfurt',
    'wolfsburg': 'bundesliga__wolfsburg',
    'gladbach': 'bundesliga__gladbach',
    'monchengladbach': 'bundesliga__gladbach',
    'moenchengladbach': 'bundesliga__gladbach',
    'stuttgart': 'bundesliga__stuttgart',
    'vfb-stuttgart': 'bundesliga__stuttgart',
    'werder': 'bundesliga__werder',
    'werder-bremen': 'bundesliga__werder',
    'mainz': 'bundesliga__mainz',
    'hoffenheim': 'bundesliga__hoffenheim',
    'augsburg': 'bundesliga__augsburg',
    'union-berlin': 'bundesliga__unionberlin',
    'st-pauli': 'bundesliga__stpauli',
    'heidenheim': 'bundesliga__heidenheim',
    'koeln': 'bundesliga__koeln',
    'cologne': 'bundesliga__koeln',
    'hsv': 'bundesliga__hsv',
    'hamburger': 'bundesliga__hsv',
    'hamburg': 'bundesliga__hsv',
    'ac-milan': 'serie-a__acmilan',
    'milan': 'serie-a__acmilan',
    'inter-milan': 'serie-a__intermilan',
    'inter': 'serie-a__intermilan',
    'juventus': 'serie-a__juventus',
    'napoli': 'serie-a__napoli',
    'naples': 'serie-a__napoli',
    'roma': 'serie-a__roma',
    'as-roma': 'serie-a__roma',
    'lazio': 'serie-a__lazio',
    'fiorentina': 'serie-a__fiorentina',
    'atalanta': 'serie-a__atalanta',
    'torino': 'serie-a__torino',
    'bologna': 'serie-a__bologna',
    'genoa': 'serie-a__genoa',
    'parma': 'serie-a__parma',
    'monza': 'serie-a__monza',
    'cagliari': 'serie-a__cagliari',
    'udinese': 'serie-a__udinese',
    'sampdoria': 'serie-a__sampdoria',
    'venezia': 'serie-a__venezia',
    'como': 'serie-a__como',
    'psg': 'ligue-1__psg',
    'paris': 'ligue-1__psg',
    'paris-saint-germain': 'ligue-1__psg',
    'marseille': 'ligue-1__marseille',
    'olympique-marseille': 'ligue-1__marseille',
    'lyon': 'ligue-1__lyon',
    'olympique-lyon': 'ligue-1__lyon',
    'monaco': 'ligue-1__monaco',
    'lille': 'ligue-1__lille',
    'nice': 'ligue-1__nice',
    'lens': 'ligue-1__lens',
    'rennes': 'ligue-1__rennes',
    'strasbourg': 'ligue-1__strasbourg',
    'nantes': 'ligue-1__nantes',
    'benfica': 'liga-portugal__benfica',
    'porto': 'liga-portugal__porto',
    'sporting': 'liga-portugal__sporting',
    'sporting-cp': 'liga-portugal__sporting',
    'braga': 'liga-portugal__braga',
    'ajax': 'eredivisie__ajax',
    'psv': 'eredivisie__eindhoven',
    'eindhoven': 'eredivisie__eindhoven',
    'celtic': 'eredivisie__celtic',
    'aberdeen': 'eredivisie__aberdeen',
    'alkmaar': 'eredivisie__alkmaar',
    'galatasaray': 'europa-andere__galatasaray',
    'fenerbahce': 'europa-andere__fenerbahce',
    'besiktas': 'europa-andere__besiktas',
    'trabzonspor': 'europa-andere__trabzonspor',
    'crvena-zvezda': 'europa-andere__crvenazvedza',
    'red-star': 'europa-andere__crvenazvedza',
    'olympiacos': 'europa-andere__olympiacos',
    'panathinaikos': 'europa-andere__panathinaikos',
    'rangers': 'europa-andere__rangers',
    'steaua': 'europa-andere__steaua',
    'dinamo-zagreb': 'europa-andere__dinamozagreb',
    'copenhagen': 'europa-andere__copenhagen',
    'inter-miami': 'clubs-world__intermiami',
    'al-nassr': 'clubs-world__alnassr',
    'al-hilal': 'clubs-world__alhilal',
    'flamengo': 'clubs-world__flamengo',
    'palmeiras': 'clubs-world__palmeiras',
    'corinthians': 'clubs-world__corinthians',
    'santos': 'clubs-world__santos',
    'sao-paulo': 'clubs-world__saopaulo',
    'boca-juniors': 'clubs-world__bocajuniors',
    'river-plate': 'clubs-world__riverplate',
    'chivas': 'clubs-world__chivas',
    'cruz-azul': 'clubs-world__cruzazul',
    'tigres': 'clubs-world__tigres',
    'monterrey': 'clubs-world__monterrey',
    'america': 'clubs-world__america',
    'la-galaxy': 'clubs-world__lagalaxy',
    'galaxy': 'clubs-world__lagalaxy',
    'lafc': 'clubs-world__lafc',
    'atlanta-utd': 'clubs-world__atlantautd',
    'atlanta-united': 'clubs-world__atlantautd',
    'pumas': 'clubs-world__pumas',
    'pachuca': 'clubs-world__pachuca',
    'leon': 'clubs-world__leon',
    'toluca': 'clubs-world__toluca',
    'necaxa': 'clubs-world__necaxa',
    'internacional': 'clubs-world__internacional',
    'fluminense': 'clubs-world__fluminense',
    'colo-colo': 'clubs-world__colocolo',
    'independiente': 'clubs-world__independiente',
    'racing': 'clubs-world__racingavellaneda',
    'san-diego': 'clubs-world__sandiegofc',
    'portland': 'clubs-world__portland',
    'philadelphia': 'clubs-world__philadelphia',
    'orlando': 'clubs-world__orlandocity',
    'toronto': 'clubs-world__torontofc',
    'vancouver': 'clubs-world__vancouver',
    'charlotte': 'clubs-world__charlottefc',
    'columbus': 'clubs-world__columbus',
    'chicago-fire': 'clubs-world__chicagofire',
    'austin': 'clubs-world__austinfc',
    'dc-united': 'clubs-world__dcunited',
    'nyc': 'clubs-world__nycfc',
    'sanjose': 'clubs-world__sanjose',
    'rosario': 'clubs-world__rosariocentral',
    'palestino': 'clubs-world__palestinodep',
    'u-de-chile': 'clubs-world__udechile',
    # Nationalmannschaften
    'germany': 'nationalmannschaften__germany',
    'deutschland': 'nationalmannschaften__germany',
    'france': 'nationalmannschaften__france',
    'brazil': 'nationalmannschaften__brazil',
    'brasil': 'nationalmannschaften__brazil',
    'argentina': 'nationalmannschaften__argentina',
    'england': 'nationalmannschaften__england',
    'spain': 'nationalmannschaften__spain',
    'italy': 'nationalmannschaften__italy',
    'portugal': 'nationalmannschaften__portugal',
    'netherlands': 'nationalmannschaften__netherlands',
    'belgium': 'nationalmannschaften__belgium',
    'croatia': 'nationalmannschaften__croatia',
    'mexico': 'nationalmannschaften__mexico',
    'japan': 'nationalmannschaften__japan',
    'south-korea': 'nationalmannschaften__southkorea',
    'korea': 'nationalmannschaften__southkorea',
    'usa': 'nationalmannschaften__usa',
    'colombia': 'nationalmannschaften__colombia',
    'nigeria': 'nationalmannschaften__nigeria',
    'senegal': 'nationalmannschaften__senegal',
    'ghana': 'nationalmannschaften__ghana',
    'cameroon': 'nationalmannschaften__cameroon',
    'egypt': 'nationalmannschaften__egypt',
    'morocco': 'nationalmannschaften__morocco',
    'algeria': 'nationalmannschaften__algeria',
    'ivory-coast': 'nationalmannschaften__ivorycoast',
    'tunisia': 'nationalmannschaften__tunisia',
    'turkey': 'nationalmannschaften__turkey',
    'wales': 'nationalmannschaften__wales',
    'scotland': 'nationalmannschaften__scotland',
    'ireland': 'nationalmannschaften__ireland',
    'denmark': 'nationalmannschaften__denmark',
    'sweden': 'nationalmannschaften__sweden',
    'norway': 'nationalmannschaften__norway',
    'switzerland': 'nationalmannschaften__switzerland',
    'austria': 'nationalmannschaften__austria',
    'czech': 'nationalmannschaften__czech',
    'poland': 'nationalmannschaften__poland',
    'ukraine': 'nationalmannschaften__ukraine',
    'serbia': 'nationalmannschaften__serbia',
    'romania': 'nationalmannschaften__romania',
    'hungary': 'nationalmannschaften__hungary',
    'greece': 'nationalmannschaften__greece',
    'chile': 'nationalmannschaften__chile',
    'uruguay': 'nationalmannschaften__uruguay',
    'paraguay': 'nationalmannschaften__paraguay',
    'peru': 'nationalmannschaften__peru',
    'ecuador': 'nationalmannschaften__ecuador',
    'venezuela': 'nationalmannschaften__venezuela',
    'jamaica': 'nationalmannschaften__jamaica',
    'canada': 'nationalmannschaften__canada',
    'australia': 'nationalmannschaften__australia',
    'iran': 'nationalmannschaften__iran',
    'saudi': 'nationalmannschaften__saudi',
    'iraq': 'nationalmannschaften__iraq',
    'palestine': 'nationalmannschaften__palestine',
    'china': 'nationalmannschaften__china',
}

# Categories based on keywords
def classify_product(handle, title):
    """Determine product categories from handle/title."""
    h = handle.lower()
    t = title.lower() if title else ''
    combined = h + ' ' + t
    cats = []

    if 'player-version' in combined or 'player version' in combined:
        cats.append('player')
    elif 'kids' in combined or 'kid' in combined or 'youth' in combined or 'junior' in combined:
        cats.append('kids')
    elif 'female' in combined or 'women' in combined or 'damen' in combined:
        cats.append('female')

    if 'retro' in combined or 'vintage' in combined:
        cats.append('retro')
    if 'long-sleeve' in combined or 'long sleeve' in combined or 'longsleeve' in combined:
        cats.append('longsleeve')
    if 'training' in combined or 'pre-match' in combined or 'prematch' in combined or 'tiro' in combined:
        cats.append('training')
    if 'sweater' in combined or 'hoodie' in combined or 'jacket' in combined or 'tracksuit' in combined:
        cats.append('sweater')
    if 'windbreaker' in combined or 'wind-breaker' in combined:
        cats.append('windbreaker')
    if 'goalkeeper' in combined or 'gk' in h.split('-'):
        cats.append('goalkeeper')
    if 'special' in combined:
        cats.append('special')
    if 'polo' in combined:
        cats.append('training')
    if 'socks' in combined:
        cats.append('training')

    # Default: fan version jersey
    if not cats:
        cats.append('fan')

    return cats


def match_team(handle, title, data):
    """Find the best matching team_id for a product handle/title."""
    h = handle.lower()

    # Try explicit handle mappings (longest match first)
    sorted_keys = sorted(HANDLE_TEAM_MAP.keys(), key=len, reverse=True)
    for key in sorted_keys:
        if key in h:
            tid = HANDLE_TEAM_MAP[key]
            if tid in data['teams']:
                return tid

    # Try WM 2026 teams
    if 'world-cup' in h or 'wm-2026' in h or '2026-world' in h:
        for key in sorted_keys:
            if key in h:
                # Check if there's a WM 2026 version
                wm_tid = f'wm-2026__{key.replace("-", "")}'
                if wm_tid in data['teams']:
                    return wm_tid

    return None


def fetch_product(handle):
    """Fetch product details from peterbot99.com."""
    url = BASE_URL + handle
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})
        with urllib.request.urlopen(req, timeout=20) as resp:
            html = resp.read().decode('utf-8', errors='replace')

        # Extract JSON-LD Product data
        blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
        for block in blocks:
            try:
                d = json.loads(block)
                if isinstance(d, dict) and d.get('@type') == 'Product':
                    name = d.get('name', '')
                    images = d.get('image', [])
                    if isinstance(images, str):
                        images = [images]

                    # Get price from offers
                    price = '0'
                    offers = d.get('offers', [])
                    if isinstance(offers, list):
                        for offer in offers:
                            if isinstance(offer, dict) and offer.get('price'):
                                price = str(offer['price'])
                                break
                    elif isinstance(offers, dict) and offers.get('price'):
                        price = str(offers['price'])

                    return {
                        'name': name,
                        'images': images,
                        'price': price,
                    }
            except json.JSONDecodeError:
                continue
        return None
    except Exception as e:
        return None


def main():
    # Load existing products
    with open(PRODUCTS_FILE, 'r') as f:
        data = json.load(f)

    # Collect existing handles
    existing_handles = set()
    for team in data['teams'].values():
        for p in team['products']:
            existing_handles.add(p['h'])

    print(f"Existing products: {len(existing_handles)}")

    # Load new handles
    with open(NEW_HANDLES_FILE, 'r') as f:
        new_handles = [line.strip() for line in f if line.strip()]

    # Filter out already existing
    new_handles = [h for h in new_handles if h not in existing_handles]
    print(f"New handles to fetch: {len(new_handles)}")

    if not new_handles:
        print("Nothing new to add!")
        return

    # Load cache if exists
    cache = {}
    if os.path.exists(FETCH_CACHE_FILE):
        with open(FETCH_CACHE_FILE, 'r') as f:
            cache = json.load(f)
        print(f"Cache loaded: {len(cache)} entries")

    # Fetch product details
    to_fetch = [h for h in new_handles if h not in cache]
    print(f"Need to fetch: {len(to_fetch)}")

    if to_fetch:
        completed = 0
        errors = 0
        batch_size = 20

        for batch_start in range(0, len(to_fetch), batch_size):
            batch = to_fetch[batch_start:batch_start + batch_size]

            with ThreadPoolExecutor(max_workers=10) as executor:
                futures = {executor.submit(fetch_product, h): h for h in batch}
                for future in as_completed(futures):
                    handle = futures[future]
                    result = future.result()
                    if result is None:
                        cache[handle] = {'error': True}
                        errors += 1
                    else:
                        cache[handle] = result
                    completed += 1

            if completed % 100 == 0 or batch_start + batch_size >= len(to_fetch):
                print(f"Fetched: {completed}/{len(to_fetch)} ({errors} errors)")
                with open(FETCH_CACHE_FILE, 'w') as f:
                    json.dump(cache, f, ensure_ascii=False)

            time.sleep(0.2)

        # Save final cache
        with open(FETCH_CACHE_FILE, 'w') as f:
            json.dump(cache, f, ensure_ascii=False)

    # Now add products to data
    added = 0
    skipped = 0
    unmatched = []
    new_teams = {}  # team_id -> team info for teams we need to create

    for handle in new_handles:
        if handle in existing_handles:
            continue

        info = cache.get(handle)
        if not info or info.get('error'):
            skipped += 1
            continue

        title = info['name']
        images = info.get('images', [])
        price = info.get('price', '0')

        # Convert USD price to CHF (roughly 1 USD = 0.88 CHF, but we use markup)
        try:
            usd_price = float(price)
            # Apply markup: roughly 3-4x for retail
            chf_price = round(usd_price * 3.5, 2)
            if chf_price < 20:
                chf_price = 49.90
            elif chf_price < 40:
                chf_price = 59.90
            elif chf_price < 60:
                chf_price = 64.90
            elif chf_price < 80:
                chf_price = 69.90
            else:
                chf_price = 79.90
        except:
            chf_price = 64.90

        # Match to team
        team_id = match_team(handle, title, data)

        if not team_id:
            unmatched.append(handle)
            skipped += 1
            continue

        # Classify product
        cats = classify_product(handle, title)

        # Build product entry
        main_img = images[0] if images else ''
        product = {
            't': title,
            'h': handle,
            'i': main_img,
            'hi': main_img,
            'p': f"{chf_price:.2f}",
            'c': cats,
        }
        if len(images) > 1:
            product['imgs'] = images

        # Add to team
        data['teams'][team_id]['products'].append(product)
        existing_handles.add(handle)
        added += 1

    print(f"\nAdded: {added}")
    print(f"Skipped: {skipped}")
    print(f"Unmatched teams: {len(unmatched)}")

    if unmatched:
        print("\n--- Unmatched handles (first 50) ---")
        for h in unmatched[:50]:
            info = cache.get(h, {})
            print(f"  {h} -> {info.get('name', '?')}")

    # Recalculate counts
    for team in data['teams'].values():
        team['productCount'] = len(team['products'])
    for league in data['leagues'].values():
        for ref in league['teams']:
            team = data['teams'].get(ref['id'])
            if team:
                ref['count'] = len(team['products'])
        league['teamCount'] = len(league['teams'])
        league['productCount'] = sum(ref.get('count', 0) for ref in league['teams'])

    # Save
    with open(PRODUCTS_FILE, 'w') as f:
        json.dump(data, f, ensure_ascii=False)

    print(f"\nproducts.json updated! Total products now: {len(existing_handles)}")


if __name__ == '__main__':
    main()
