#!/usr/bin/env python3
"""Process remaining product images: download, remove background, save with dark bg."""
import json
import sys
import os
import io
import requests
from PIL import Image
from rembg import remove

BATCH_IDX = int(sys.argv[1])
INPUT_FILE = f"/tmp/rm_round2_{BATCH_IDX}.json"
RESULTS_FILE = f"/tmp/rm_round2_results_{BATCH_IDX}.json"
PRODUCTS_DIR = "/Users/loreto81016/Documents/T24/website/public/products"
BG_COLOR = (26, 26, 26)  # #1a1a1a

def process_image(url, out_path):
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    input_img = Image.open(io.BytesIO(resp.content)).convert("RGBA")
    result = remove(input_img)
    bg = Image.new("RGBA", result.size, (*BG_COLOR, 255))
    composite = Image.alpha_composite(bg, result)
    final = composite.convert("RGB")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    final.save(out_path, "JPEG", quality=90)

def main():
    items = json.load(open(INPUT_FILE))
    results = {}
    if os.path.exists(RESULTS_FILE):
        results = json.load(open(RESULTS_FILE))

    total = len(items)
    done = 0
    errors = 0

    for item in items:
        handle = item["handle"]
        if handle in results:
            done += 1
            continue

        team_id = item["team_id"]
        league = team_id.split("__")[0]
        team = team_id.split("__")[1] if "__" in team_id else "other"
        out_path = os.path.join(PRODUCTS_DIR, league, team, f"{handle}.jpg")

        if os.path.exists(out_path):
            results[handle] = {"ok": True, "path": out_path}
            done += 1
            continue

        try:
            process_image(item["img"], out_path)
            results[handle] = {"ok": True, "path": out_path}
            done += 1
        except Exception as e:
            results[handle] = {"ok": False, "error": str(e)}
            errors += 1
            done += 1

        if done % 10 == 0:
            with open(RESULTS_FILE, "w") as f:
                json.dump(results, f)
            print(f"Batch {BATCH_IDX}: {done}/{total} done, {errors} errors", flush=True)

    with open(RESULTS_FILE, "w") as f:
        json.dump(results, f)

    success = sum(1 for v in results.values() if v.get("ok"))
    failed = sum(1 for v in results.values() if not v.get("ok"))
    print(f"Batch {BATCH_IDX} COMPLETE: {success} success, {failed} failed out of {total}")

if __name__ == "__main__":
    main()
