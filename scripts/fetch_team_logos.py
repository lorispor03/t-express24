"""
Fetch team logos from Wikipedia API.
Downloads crest/logo images for all teams.
"""
import json
import urllib.request
import urllib.parse
import os
import time
import ssl

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "teams")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Skip SSL verification for Wikipedia
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Mapping: team_slug -> Wikipedia article title (English Wikipedia)
WIKI_MAP = {
    # Premier League
    "arsenal": "Arsenal_F.C.",
    "astonvilla": "Aston_Villa_F.C.",
    "bournemouth": "AFC_Bournemouth",
    "chelsea": "Chelsea_F.C.",
    "everton": "Everton_F.C.",
    "fulham": "Fulham_F.C.",
    "leeds": "Leeds_United_F.C.",
    "leicester": "Leicester_City_F.C.",
    "liverpool": "Liverpool_F.C.",
    "mancity": "Manchester_City_F.C.",
    "manutd": "Manchester_United_F.C.",
    "newcastle": "Newcastle_United_F.C.",
    "nottingham": "Nottingham_Forest_F.C.",
    "tottenham": "Tottenham_Hotspur_F.C.",
    "westham": "West_Ham_United_F.C.",
    "wolves": "Wolverhampton_Wanderers_F.C.",

    # La Liga
    "realmadrid": "Real_Madrid_CF",
    "barcelona": "FC_Barcelona",
    "atletico": "Atlético_Madrid",
    "sevilla": "Sevilla_FC",
    "betis": "Real_Betis",
    "sociedad": "Real_Sociedad",
    "valencia": "Valencia_CF",
    "bilbao": "Athletic_Bilbao",
    "celta": "Celta_de_Vigo",
    "mallorca": "RCD_Mallorca",
    "cadiz": "Cádiz_CF",
    "laspalmas": "UD_Las_Palmas",
    "valladolid": "Real_Valladolid",
    "elche": "Elche_CF",
    "levante": "Levante_UD",
    "albacete": "Albacete_Balompié",
    "coruna": "Deportivo_de_La_Coruña",
    "gijon": "Sporting_de_Gijón",
    "malaga": "Málaga_CF",
    "oviedo": "Real_Oviedo",
    "racingsantander": "Racing_de_Santander",
    "tenerife": "CD_Tenerife",
    "zaragoza": "Real_Zaragoza",

    # Bundesliga
    "bayern": "FC_Bayern_Munich",
    "dortmund": "Borussia_Dortmund",
    "leverkusen": "Bayer_04_Leverkusen",
    "leipzig": "RB_Leipzig",
    "fsvfrankfurt": "Eintracht_Frankfurt",
    "wolfsburg": "VfL_Wolfsburg",
    "stuttgart": "VfB_Stuttgart",
    "werder": "SV_Werder_Bremen",
    "koeln": "1._FC_Köln",
    "hertha": "Hertha_BSC",
    "schalke": "FC_Schalke_04",
    "augsburg": "FC_Augsburg",
    "heidenheim": "1._FC_Heidenheim",
    "bochum": "VfL_Bochum",
    "hsv": "Hamburger_SV",
    "hannover": "Hannover_96",
    "kaiserslautern": "1._FC_Kaiserslautern",
    "nuernberg": "1._FC_Nürnberg",
    "bielefeld": "Arminia_Bielefeld",
    "dresden": "Dynamo_Dresden",

    # Serie A
    "juventus": "Juventus_FC",
    "inter": "Inter_Milan",
    "milan": "AC_Milan",
    "napoli": "S.S.C._Napoli",
    "roma": "AS_Roma",
    "lazio": "S.S._Lazio",
    "fiorentina": "ACF_Fiorentina",
    "atalanta": "Atalanta_BC",
    "como": "Como_1907",
    "venezia": "Venezia_FC",
    "cagliari": "Cagliari_Calcio",
    "parma": "Parma_Calcio_1913",

    # Ligue 1
    "psg": "Paris_Saint-Germain_F.C.",
    "marseille": "Olympique_de_Marseille",
    "lyon": "Olympique_Lyonnais",
    "lens": "RC_Lens",
    "rennes": "Stade_Rennais_F.C.",

    # Liga Portugal
    "porto": "FC_Porto",
    "benfica": "S.L._Benfica",
    "sporting": "Sporting_CP",
    "braga": "S.C._Braga",
    "guimaraes": "Vitória_S.C.",
    "estoril": "G.D._Estoril_Praia",
    "famalicao": "F.C._Famalicão",
    "alverca": "F.C._Alverca",

    # Eredivisie
    "ajax": "AFC_Ajax",
    "feyenoord": "Feyenoord",
    "eindhoven": "PSV_Eindhoven",
    "alkmaar": "AZ_Alkmaar",
    "heerenveen": "SC_Heerenveen",
    "celtic": "Celtic_F.C.",
    "rangers": "Rangers_F.C.",
    "aberdeen": "Aberdeen_F.C.",
    "hearts": "Heart_of_Midlothian_F.C.",
    "birmingham": "Birmingham_City_F.C.",
    "coventry": "Coventry_City_F.C.",
    "ipswich": "Ipswich_Town_F.C.",
    "preston": "Preston_North_End_F.C.",
    "sheffieldwed": "Sheffield_Wednesday_F.C.",
    "stoke": "Stoke_City_F.C.",
    "wimbledon": "AFC_Wimbledon",
    "wrexham": "Wrexham_A.F.C.",

    # Clubs World
    "alhilal": "Al_Hilal_SFC",
    "alnassr": "Al_Nassr_FC",
    "intermiami": "Inter_Miami_CF",
    "lagalaxy": "LA_Galaxy",
    "lafc": "Los_Angeles_FC",
    "nycfc": "New_York_City_FC",
    "atlantautd": "Atlanta_United_FC",
    "austinfc": "Austin_FC",
    "columbus": "Columbus_Crew",
    "flamengo": "CR_Flamengo",
    "fluminense": "Fluminense_FC",
    "palmeiras": "Sociedade_Esportiva_Palmeiras",
    "corinthians": "Sport_Club_Corinthians_Paulista",
    "santos": "Santos_FC",
    "saopaulo": "São_Paulo_FC",
    "internacional": "Sport_Club_Internacional",
    "bocajuniors": "Boca_Juniors",
    "riverplate": "Club_Atlético_River_Plate",
    "independiente": "Club_Atlético_Independiente",
    "racingavellaneda": "Racing_Club_de_Avellaneda",
    "rosariocentral": "Rosario_Central",
    "colocolo": "Colo-Colo",
    "udechile": "Universidad_de_Chile_(football)",
    "chivas": "C.D._Guadalajara",
    "tigres": "Tigres_UANL",
    "monterrey": "C.F._Monterrey",
    "pumas": "Club_Universidad_Nacional",
    "cruzazul": "Cruz_Azul",
    "toluca": "Deportivo_Toluca_F.C.",
    "necaxa": "Club_Necaxa",
    "palestinodep": "Club_Deportivo_Palestino",

    # National Teams (use Wikipedia)
    "england": "England_national_football_team",
    "france": "France_national_football_team",
    "germany": "Germany_national_football_team",
    "spain": "Spain_national_football_team",
    "italy": "Italy_national_football_team",
    "portugal": "Portugal_national_football_team",
    "netherlands": "Netherlands_national_football_team",
    "belgium": "Belgium_national_football_team",
    "croatia": "Croatia_national_football_team",
    "scotland": "Scotland_national_football_team",
    "wales": "Wales_national_football_team",
    "argentina": "Argentina_national_football_team",
    "brazil": "Brazil_national_football_team",
    "colombia": "Colombia_national_football_team",
    "mexico": "Mexico_national_football_team",
    "usa": "United_States_men%27s_national_soccer_team",
    "canada": "Canada_men%27s_national_soccer_team",
    "japan": "Japan_national_football_team",
    "korea": "South_Korea_national_football_team",
    "australia": "Australia_men%27s_national_soccer_team",
    "morocco": "Morocco_national_football_team",
    "nigeria": "Nigeria_national_football_team",
    "senegal": "Senegal_national_football_team",
    "cameroon": "Cameroon_national_football_team",
    "egypt": "Egypt_national_football_team",
    "algeria": "Algeria_national_football_team",
    "tunisia": "Tunisia_national_football_team",
    "southafrica": "South_Africa_national_soccer_team",
    "chile": "Chile_national_football_team",
    "ecuador": "Ecuador_national_football_team",
    "peru": "Peru_national_football_team",
    "venezuela": "Venezuela_national_football_team",
    "jamaica": "Jamaica_national_football_team",
    "panama": "Panama_national_football_team",
    "guatemala": "Guatemala_national_football_team",
    "haiti": "Haiti_national_football_team",
    "china": "China_national_football_team",
    "saudiarabia": "Saudi_Arabia_national_football_team",
    "malaysia": "Malaysia_national_football_team",
    "congo": "DR_Congo_national_football_team",
    "palestine": "Palestine_national_football_team",
    "caboverde": "Cape_Verde_national_football_team",
    "newzealand": "New_Zealand_national_football_team",
    "philippines": "Philippines_national_football_team",
}

# WM 2026 teams reuse the base national team logo
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


def fetch_wiki_image(title, size=200):
    """Fetch page image URL from Wikipedia API."""
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize={size}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "T-EXPRESS24-LogoFetcher/1.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read())
            pages = data.get("query", {}).get("pages", {})
            for page in pages.values():
                thumb = page.get("thumbnail", {}).get("source")
                if thumb:
                    return thumb
    except Exception as e:
        print(f"  API error for {title}: {e}")
    return None


def download_image(url, filepath):
    """Download image from URL."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "T-EXPRESS24-LogoFetcher/1.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            data = resp.read()
            if len(data) > 500:  # skip tiny/error files
                with open(filepath, "wb") as f:
                    f.write(data)
                return True
    except Exception as e:
        print(f"  Download error: {e}")
    return False


def main():
    results = {}
    total = len(WIKI_MAP)

    print(f"Fetching {total} team logos from Wikipedia...\n")

    for i, (slug, wiki_title) in enumerate(WIKI_MAP.items()):
        filepath = os.path.join(OUTPUT_DIR, f"{slug}.png")

        # Skip if already downloaded
        if os.path.exists(filepath) and os.path.getsize(filepath) > 500:
            print(f"[{i+1}/{total}] {slug}: already exists, skipping")
            results[slug] = f"/teams/{slug}.png"
            continue

        print(f"[{i+1}/{total}] {slug} ({wiki_title})...", end=" ", flush=True)

        img_url = fetch_wiki_image(wiki_title)
        if img_url:
            if download_image(img_url, filepath):
                print(f"OK ({os.path.getsize(filepath)} bytes)")
                results[slug] = f"/teams/{slug}.png"
            else:
                print("download failed")
        else:
            print("no image found")

        time.sleep(0.2)  # rate limit

    # Handle WM 2026 aliases (symlinks/copies)
    print(f"\nCreating WM 2026 aliases...")
    for wm_slug, base_slug in WM2026_MAP.items():
        src = os.path.join(OUTPUT_DIR, f"{base_slug}.png")
        dst = os.path.join(OUTPUT_DIR, f"{wm_slug}.png")
        if os.path.exists(src) and not os.path.exists(dst):
            # Copy file
            with open(src, "rb") as f:
                data = f.read()
            with open(dst, "wb") as f:
                f.write(data)
            results[wm_slug] = f"/teams/{wm_slug}.png"
            print(f"  {wm_slug} -> {base_slug}")

    # Save mapping
    print(f"\nDone! {len(results)} logos downloaded.")

    # Generate TypeScript mapping
    ts_lines = ["export const TEAM_LOGOS: Record<string, string> = {"]
    for slug in sorted(results.keys()):
        ts_lines.append(f"  '{slug}': '{results[slug]}',")
    ts_lines.append("};")

    ts_path = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "teamLogos.ts")
    with open(ts_path, "w") as f:
        f.write("\n".join(ts_lines) + "\n")
    print(f"TypeScript mapping saved to {ts_path}")


if __name__ == "__main__":
    main()
