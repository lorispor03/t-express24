"""
Fetch team logos from TheSportsDB API.
"""
import json
import urllib.request
import urllib.parse
import os
import time
import ssl

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "teams")
os.makedirs(OUTPUT_DIR, exist_ok=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Search term -> slug mapping (TheSportsDB search terms)
SEARCH_MAP = {
    # Premier League
    "arsenal": "Arsenal",
    "astonvilla": "Aston Villa",
    "bournemouth": "Bournemouth",
    "chelsea": "Chelsea",
    "everton": "Everton",
    "fulham": "Fulham",
    "leeds": "Leeds United",
    "leicester": "Leicester City",
    "liverpool": "Liverpool",
    "mancity": "Manchester City",
    "manutd": "Manchester United",
    "newcastle": "Newcastle United",
    "nottingham": "Nottingham Forest",
    "tottenham": "Tottenham",
    "westham": "West Ham",
    "wolves": "Wolverhampton",

    # La Liga
    "realmadrid": "Real Madrid",
    "barcelona": "Barcelona",
    "atletico": "Atletico Madrid",
    "sevilla": "Sevilla",
    "betis": "Real Betis",
    "sociedad": "Real Sociedad",
    "valencia": "Valencia",
    "bilbao": "Athletic Bilbao",
    "celta": "Celta Vigo",
    "mallorca": "Mallorca",
    "cadiz": "Cadiz",
    "laspalmas": "Las Palmas",
    "valladolid": "Real Valladolid",
    "elche": "Elche",
    "levante": "Levante",
    "albacete": "Albacete",
    "coruna": "Deportivo La Coruna",
    "gijon": "Sporting Gijon",
    "malaga": "Malaga",
    "oviedo": "Real Oviedo",
    "racingsantander": "Racing Santander",
    "tenerife": "Tenerife",
    "zaragoza": "Real Zaragoza",

    # Bundesliga
    "bayern": "Bayern Munich",
    "dortmund": "Borussia Dortmund",
    "leverkusen": "Bayer Leverkusen",
    "leipzig": "RB Leipzig",
    "fsvfrankfurt": "Eintracht Frankfurt",
    "wolfsburg": "VfL Wolfsburg",
    "stuttgart": "VfB Stuttgart",
    "werder": "Werder Bremen",
    "koeln": "FC Koln",
    "hertha": "Hertha Berlin",
    "schalke": "Schalke 04",
    "augsburg": "FC Augsburg",
    "heidenheim": "Heidenheim",
    "bochum": "VfL Bochum",
    "hsv": "Hamburger SV",
    "hannover": "Hannover 96",
    "kaiserslautern": "Kaiserslautern",
    "nuernberg": "Nurnberg",
    "bielefeld": "Arminia Bielefeld",
    "dresden": "Dynamo Dresden",

    # Serie A
    "juventus": "Juventus",
    "inter": "Inter Milan",
    "milan": "AC Milan",
    "napoli": "Napoli",
    "roma": "AS Roma",
    "lazio": "Lazio",
    "fiorentina": "Fiorentina",
    "atalanta": "Atalanta",
    "como": "Como 1907",
    "venezia": "Venezia",
    "cagliari": "Cagliari",
    "parma": "Parma",

    # Ligue 1
    "psg": "Paris Saint-Germain",
    "marseille": "Marseille",
    "lyon": "Lyon",
    "lens": "RC Lens",
    "rennes": "Rennes",

    # Liga Portugal
    "porto": "FC Porto",
    "benfica": "Benfica",
    "sporting": "Sporting CP",
    "braga": "Sporting Braga",
    "guimaraes": "Vitoria Guimaraes",
    "estoril": "Estoril",
    "famalicao": "Famalicao",
    "alverca": "Alverca",

    # Eredivisie + European leagues
    "ajax": "Ajax",
    "feyenoord": "Feyenoord",
    "eindhoven": "PSV Eindhoven",
    "alkmaar": "AZ Alkmaar",
    "heerenveen": "Heerenveen",
    "celtic": "Celtic",
    "rangers": "Rangers",
    "aberdeen": "Aberdeen",
    "hearts": "Hearts",
    "birmingham": "Birmingham City",
    "coventry": "Coventry City",
    "ipswich": "Ipswich Town",
    "preston": "Preston North End",
    "sheffieldwed": "Sheffield Wednesday",
    "stoke": "Stoke City",
    "wimbledon": "AFC Wimbledon",
    "wrexham": "Wrexham",

    # Clubs World
    "alhilal": "Al-Hilal",
    "alnassr": "Al-Nassr",
    "intermiami": "Inter Miami",
    "lagalaxy": "LA Galaxy",
    "lafc": "Los Angeles FC",
    "nycfc": "New York City FC",
    "atlantautd": "Atlanta United",
    "austinfc": "Austin FC",
    "columbus": "Columbus Crew",
    "flamengo": "Flamengo",
    "fluminense": "Fluminense",
    "palmeiras": "Palmeiras",
    "corinthians": "Corinthians",
    "santos": "Santos",
    "saopaulo": "Sao Paulo",
    "internacional": "Internacional",
    "bocajuniors": "Boca Juniors",
    "riverplate": "River Plate",
    "independiente": "Independiente",
    "racingavellaneda": "Racing Club",
    "rosariocentral": "Rosario Central",
    "colocolo": "Colo Colo",
    "udechile": "Universidad de Chile",
    "chivas": "Guadalajara",
    "tigres": "Tigres UANL",
    "monterrey": "Monterrey",
    "pumas": "Pumas UNAM",
    "cruzazul": "Cruz Azul",
    "toluca": "Toluca",
    "necaxa": "Necaxa",
    "palestinodep": "Palestino",

    # National Teams
    "england": "England",
    "france": "France",
    "germany": "Germany",
    "spain": "Spain",
    "italy": "Italy",
    "portugal": "Portugal",
    "netherlands": "Netherlands",
    "belgium": "Belgium",
    "croatia": "Croatia",
    "scotland": "Scotland",
    "wales": "Wales",
    "argentina": "Argentina",
    "brazil": "Brazil",
    "colombia": "Colombia",
    "mexico": "Mexico",
    "usa": "USA",
    "canada": "Canada",
    "japan": "Japan",
    "korea": "South Korea",
    "australia": "Australia",
    "morocco": "Morocco",
    "nigeria": "Nigeria",
    "senegal": "Senegal",
    "cameroon": "Cameroon",
    "egypt": "Egypt",
    "algeria": "Algeria",
    "tunisia": "Tunisia",
    "southafrica": "South Africa",
    "chile": "Chile",
    "ecuador": "Ecuador",
    "peru": "Peru",
    "venezuela": "Venezuela",
    "jamaica": "Jamaica",
    "panama": "Panama",
    "guatemala": "Guatemala",
    "haiti": "Haiti",
    "china": "China",
    "saudiarabia": "Saudi Arabia",
    "malaysia": "Malaysia",
    "congo": "DR Congo",
    "palestine": "Palestine",
    "caboverde": "Cape Verde",
    "newzealand": "New Zealand",
    "philippines": "Philippines",
}

# WM 2026 teams reuse base logos
WM2026_MAP = {
    "argentina2026": "argentina",
    "brazil2026": "brazil",
    "france2026": "france",
    "germany2026": "germany",
    "spain2026": "spain",
    "italy2026": "italy",
    "portugal2026": "portugal",
    "netherlands2026": "netherlands",
    "belgium2026": "belgium",
    "colombia2026": "colombia",
    "mexico2026": "mexico",
    "usa2026": "usa",
    "canada2026": "canada",
    "japan2026": "japan",
    "australia2026": "australia",
    "senegal2026": "senegal",
    "uk2026": "england",
}


def search_team(query):
    """Search TheSportsDB for team badge URL."""
    url = f"https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read())
            teams = data.get("teams")
            if teams:
                # Prefer football/soccer teams
                for t in teams:
                    sport = (t.get("strSport") or "").lower()
                    if sport in ("soccer", "football", ""):
                        badge = t.get("strBadge") or t.get("strTeamBadge")
                        if badge:
                            return badge, t["strTeam"]
                # Fallback: first result
                badge = teams[0].get("strBadge") or teams[0].get("strTeamBadge")
                if badge:
                    return badge, teams[0]["strTeam"]
    except Exception as e:
        print(f"  API error: {e}")
    return None, None


def download_image(url, filepath):
    """Download image from URL."""
    try:
        # Append /small to get smaller version
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            data = resp.read()
            if len(data) > 500:
                with open(filepath, "wb") as f:
                    f.write(data)
                return True
    except Exception as e:
        print(f"  Download error: {e}")
    return False


def main():
    results = {}
    total = len(SEARCH_MAP)

    print(f"Fetching {total} team logos from TheSportsDB...\n")

    for i, (slug, search_term) in enumerate(SEARCH_MAP.items()):
        filepath = os.path.join(OUTPUT_DIR, f"{slug}.png")

        # Skip if already downloaded and valid
        if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
            print(f"[{i+1}/{total}] {slug}: exists ({os.path.getsize(filepath)} bytes)")
            results[slug] = f"/teams/{slug}.png"
            continue

        print(f"[{i+1}/{total}] {slug} ('{search_term}')...", end=" ", flush=True)

        badge_url, found_name = search_team(search_term)
        if badge_url:
            if download_image(badge_url, filepath):
                size = os.path.getsize(filepath)
                if size > 1000:
                    print(f"OK - {found_name} ({size} bytes)")
                    results[slug] = f"/teams/{slug}.png"
                else:
                    os.remove(filepath)
                    print(f"too small ({size} bytes)")
            else:
                print("download failed")
        else:
            print("not found")

        time.sleep(2)  # rate limit

    # WM 2026 aliases
    print(f"\nCreating WM 2026 aliases...")
    for wm_slug, base_slug in WM2026_MAP.items():
        src = os.path.join(OUTPUT_DIR, f"{base_slug}.png")
        dst = os.path.join(OUTPUT_DIR, f"{wm_slug}.png")
        if os.path.exists(src) and not os.path.exists(dst):
            with open(src, "rb") as f:
                data = f.read()
            with open(dst, "wb") as f:
                f.write(data)
            results[wm_slug] = f"/teams/{wm_slug}.png"
            print(f"  {wm_slug} -> {base_slug}")
        elif os.path.exists(dst):
            results[wm_slug] = f"/teams/{wm_slug}.png"

    print(f"\nDone! {len(results)} logos total.")

    # Generate TypeScript mapping
    ts_lines = ["export const TEAM_LOGOS: Record<string, string> = {"]
    for slug in sorted(results.keys()):
        ts_lines.append(f"  '{slug}': '{results[slug]}',")
    ts_lines.append("};")
    ts_lines.append("")

    ts_path = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "teamLogos.ts")
    with open(ts_path, "w") as f:
        f.write("\n".join(ts_lines))
    print(f"TypeScript mapping saved to {ts_path}")


if __name__ == "__main__":
    main()
