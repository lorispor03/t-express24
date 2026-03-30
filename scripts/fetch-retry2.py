#!/usr/bin/env python3
import json, re, time, os, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

PROGRESS_FILE = os.path.join(os.path.dirname(__file__), 'image-fetch-progress.json')
BASE_URL = 'https://peterbot99.com/products/'

def fetch_images(handle):
    url = BASE_URL + handle
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        })
        with urllib.request.urlopen(req, timeout=20) as resp:
            html = resp.read().decode('utf-8', errors='replace')
        blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
        for block in blocks:
            try:
                data = json.loads(block)
                if isinstance(data, dict) and data.get('@type') == 'Product':
                    images = data.get('image', [])
                    if isinstance(images, str):
                        images = [images]
                    return images
            except json.JSONDecodeError:
                continue
        return []
    except:
        return None

with open(PROGRESS_FILE) as f:
    progress = json.load(f)

errors = [h for h, v in progress.items() if v.get('error')]
print(f"Retrying {len(errors)} handles...")

fixed = 0
still_bad = 0

for batch_start in range(0, len(errors), 10):
    batch = errors[batch_start:batch_start + 10]
    with ThreadPoolExecutor(max_workers=5) as ex:
        futures = {ex.submit(fetch_images, h): h for h in batch}
        for f in as_completed(futures):
            h = futures[f]
            r = f.result()
            if r is None:
                still_bad += 1
            else:
                progress[h] = {"images": r, "error": False}
                fixed += 1
    done = batch_start + len(batch)
    if done % 200 == 0 or done >= len(errors):
        print(f"{done}/{len(errors)} - fixed: {fixed}, fails: {still_bad}")
        with open(PROGRESS_FILE, 'w') as f:
            json.dump(progress, f)
    time.sleep(0.5)

with open(PROGRESS_FILE, 'w') as f:
    json.dump(progress, f)
print(f"\nDone! Fixed: {fixed}, Still errors: {still_bad}")
