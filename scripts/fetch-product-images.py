#!/usr/bin/env python3
"""
Fetch all product images from peterbot99.com and add them to products.json.
Each product gets an "imgs" field with ALL images from the product page.
The first image in "imgs" is the main image (same as "i").
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
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='replace')

        # Extract JSON-LD blocks
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
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, Exception) as e:
        return None  # None means error, [] means no images found

def main():
    # Load products
    with open(PRODUCTS_FILE, 'r') as f:
        data = json.load(f)

    # Collect all unique handles with their locations
    handle_map = {}  # handle -> list of (team_key, product_index)
    for team_key, team in data['teams'].items():
        for i, product in enumerate(team['products']):
            h = product['h']
            if h not in handle_map:
                handle_map[h] = []
            handle_map[h].append((team_key, i))

    total = len(handle_map)
    print(f"Total unique handles: {total}")

    # Load progress if exists
    progress = {}
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r') as f:
            progress = json.load(f)
        print(f"Resuming from progress file: {len(progress)} already fetched")

    # Filter handles that still need fetching
    todo = [h for h in handle_map if h not in progress]
    print(f"Remaining to fetch: {len(todo)}")

    if not todo:
        print("All handles already fetched, applying to products.json...")
    else:
        # Fetch in batches with threading
        batch_size = 20
        completed = len(progress)
        errors = 0

        for batch_start in range(0, len(todo), batch_size):
            batch = todo[batch_start:batch_start + batch_size]

            with ThreadPoolExecutor(max_workers=10) as executor:
                futures = {executor.submit(fetch_images, h): h for h in batch}
                for future in as_completed(futures):
                    handle = futures[future]
                    result = future.result()
                    if result is None:
                        errors += 1
                        progress[handle] = {"images": [], "error": True}
                    else:
                        progress[handle] = {"images": result, "error": False}
                    completed += 1

            # Progress update
            if completed % 100 == 0 or batch_start + batch_size >= len(todo):
                print(f"Progress: {completed}/{total} ({errors} errors)")
                # Save progress
                with open(PROGRESS_FILE, 'w') as f:
                    json.dump(progress, f)

            # Small delay between batches to be respectful
            time.sleep(0.3)

    # Save final progress
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f)

    # Apply images to products.json
    print("\nApplying images to products.json...")
    updated = 0
    no_extra = 0

    for handle, locations in handle_map.items():
        if handle not in progress:
            continue

        images = progress[handle].get('images', [])
        if not images or len(images) <= 1:
            no_extra += 1
            continue

        # All images from the page (includes the main one)
        for team_key, idx in locations:
            product = data['teams'][team_key]['products'][idx]
            # Store all images (the full gallery)
            product['imgs'] = images
            updated += 1

    print(f"Updated {updated} product entries with extra images")
    print(f"{no_extra} products had 0-1 images (no extras)")

    # Save updated products.json
    with open(PRODUCTS_FILE, 'w') as f:
        json.dump(data, f, ensure_ascii=False)

    print("Done! products.json updated.")

if __name__ == '__main__':
    main()
