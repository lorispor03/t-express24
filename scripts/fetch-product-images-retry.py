#!/usr/bin/env python3
"""
Retry fetching product images for handles that errored out.
Uses slower rate to avoid throttling.
"""

import json
import re
import time
import sys
import os
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

PRODUCTS_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'products.json')
PROGRESS_FILE = os.path.join(os.path.dirname(__file__), 'image-fetch-progress.json')
BASE_URL = 'https://peterbot99.com/products/'

def fetch_images(handle):
    """Fetch product images from peterbot99.com JSON-LD data."""
    url = BASE_URL + handle
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9',
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
    except Exception as e:
        return None

def main():
    with open(PROGRESS_FILE, 'r') as f:
        progress = json.load(f)

    # Find all errored handles
    errors = [h for h, v in progress.items() if v.get('error')]
    total_errors = len(errors)
    print(f"Retrying {total_errors} failed handles...")

    fixed = 0
    still_errors = 0
    batch_size = 5  # Smaller batches

    for batch_start in range(0, len(errors), batch_size):
        batch = errors[batch_start:batch_start + batch_size]

        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = {executor.submit(fetch_images, h): h for h in batch}
            for future in as_completed(futures):
                handle = futures[future]
                result = future.result()
                if result is None:
                    still_errors += 1
                else:
                    progress[handle] = {"images": result, "error": False}
                    fixed += 1

        done = batch_start + len(batch)
        if done % 100 == 0 or done >= total_errors:
            print(f"Progress: {done}/{total_errors} (fixed: {fixed}, still failing: {still_errors})")
            with open(PROGRESS_FILE, 'w') as f:
                json.dump(progress, f)

        # Longer delay between batches
        time.sleep(1.0)

    # Final save
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f)

    print(f"\nDone! Fixed: {fixed}, Still errors: {still_errors}")

    # Now apply to products.json
    print("\nApplying ALL images to products.json...")
    with open(PRODUCTS_FILE, 'r') as f:
        data = json.load(f)

    handle_map = {}
    for team_key, team in data['teams'].items():
        for i, product in enumerate(team['products']):
            h = product['h']
            if h not in handle_map:
                handle_map[h] = []
            handle_map[h].append((team_key, i))

    updated = 0
    for handle, locations in handle_map.items():
        if handle not in progress:
            continue
        images = progress[handle].get('images', [])
        if not images or len(images) <= 1:
            continue
        for team_key, idx in locations:
            data['teams'][team_key]['products'][idx]['imgs'] = images
            updated += 1

    with open(PRODUCTS_FILE, 'w') as f:
        json.dump(data, f, ensure_ascii=False)

    print(f"Updated {updated} product entries with extra images")
    print("products.json saved!")

if __name__ == '__main__':
    main()
