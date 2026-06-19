#!/usr/bin/env python3
"""
Fetch patch/badge options from peterbot99.com for all products.
Uses the peterbot API: /homeapi/productproperties/attribute/{product_id}

For each product:
1. Visit the product page to get the product_id
2. Call the API to get patch options (images + names)
3. Download patch images to public/patches/peterbot/
4. Update src/data/product-patches.json

Usage:
  python3 scripts/fetch-patches.py                  # Process all products without patches
  python3 scripts/fetch-patches.py --force           # Re-fetch all products
  python3 scripts/fetch-patches.py --handle <handle> # Process a single product
"""

import json
import os
import re
import sys
import time
import hashlib
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = os.path.join(os.path.dirname(__file__), '..')
PRODUCTS_FILE = os.path.join(BASE_DIR, 'src', 'data', 'products.json')
PATCHES_FILE = os.path.join(BASE_DIR, 'src', 'data', 'product-patches.json')
PATCHES_IMG_DIR = os.path.join(BASE_DIR, 'public', 'patches', 'peterbot')
PETERBOT_BASE = 'https://peterbot99.com'

# Chinese -> German name mapping for common patch names
NAME_MAP = {
    '世界杯金章': 'WM 2026 Gold Badge',
    '欧洲世预赛章': 'WM Qualifikation + Respect',
    '无左臂章': None,  # "No patch" option, skip
    '小组赛二': 'Gruppenphase',
    '32强章': '1/8-Final',
    '1/8决赛章': '1/16-Final',
    '1/4决赛章': '1/4-Final',
    '半决赛章': '1/2-Final',
    '决赛章': 'Final',
    '世预赛 桃心 公平10': 'WM Qualifikation Set',
    '植绒世界杯章': 'WM 2026 Flock Badge',
    # UCL patches
    '欧冠': 'UCL Badge',
    '欧冠球': 'UCL Ball',
    '欧冠决赛': 'UCL Final',
    # Common general
    '无': None,
    'No': None,
    'No Patch': None,
}

# Fallback: use remark (English) if available, otherwise transliterate
def translate_name(chinese_name, remark=''):
    if chinese_name in NAME_MAP:
        return NAME_MAP[chinese_name]
    # Use English remark if available and meaningful
    if remark and len(remark) > 2 and not remark.startswith('http'):
        # Clean up remark - remove "(left arm patch)" etc.
        clean = re.sub(r'\s*\(.*?\)\s*', '', remark).strip()
        if clean:
            return clean
    # Return original if no translation found
    return chinese_name


def get_product_id(handle):
    """Get the peterbot product_id from a product page."""
    url = f'{PETERBOT_BASE}/products/{handle}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='replace')
        match = re.search(r'product_id":\s*(\d+)', html)
        if match:
            return int(match.group(1))
    except Exception:
        pass
    return None


def get_patches_from_api(product_id):
    """Fetch patch options from peterbot API."""
    url = f'{PETERBOT_BASE}/homeapi/productproperties/attribute/{product_id}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except Exception:
        return []

    patches = []
    plans = data.get('data', {}).get('plan', [])
    for plan in plans:
        for prop in plan.get('properties', []):
            ptype = prop.get('type', '')
            title = prop.get('title', '').lower()
            if ptype != 'image' or 'patch' not in title:
                continue
            for sel in prop.get('rule', {}).get('selected', []):
                img_url = sel.get('other', '')
                name_cn = sel.get('name', '')
                remark = sel.get('remark', '')
                price_raw = sel.get('price', '')

                if not img_url:
                    continue

                name = translate_name(name_cn, remark)
                if name is None:  # Skip "no patch" options
                    continue

                try:
                    price = float(price_raw) if price_raw else 0
                except (ValueError, TypeError):
                    price = 0

                # Convert peterbot USD price to CHF (~0.80 per $1)
                price_chf = round(price * 0.8, 2) if price > 0 else 0.8

                patches.append({
                    'name': name,
                    'price': price_chf,
                    'image_url': img_url,
                })
    return patches


def download_patch_image(img_url):
    """Download a patch image and return the local path."""
    os.makedirs(PATCHES_IMG_DIR, exist_ok=True)

    # Generate a stable filename from the URL
    url_hash = hashlib.md5(img_url.encode()).hexdigest()[:12]
    ext = '.png'
    if '.webp' in img_url:
        ext = '.webp'
    elif '.jpg' in img_url or '.jpeg' in img_url:
        ext = '.jpg'
    filename = f'auto_{url_hash}{ext}'
    local_path = os.path.join(PATCHES_IMG_DIR, filename)
    web_path = f'/patches/peterbot/{filename}'

    if os.path.exists(local_path) and os.path.getsize(local_path) > 100:
        return web_path

    try:
        req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        with open(local_path, 'wb') as f:
            f.write(data)
        return web_path
    except Exception as e:
        print(f'  Error downloading {img_url}: {e}')
        return None


def process_product(handle):
    """Process a single product: get product_id, fetch patches, download images."""
    pid = get_product_id(handle)
    if not pid:
        return None

    raw_patches = get_patches_from_api(pid)
    if not raw_patches:
        return []

    result = []
    for p in raw_patches:
        local_img = download_patch_image(p['image_url'])
        if local_img:
            result.append({
                'name': p['name'],
                'price': p['price'],
                'image': local_img,
            })
    return result


def main():
    force = '--force' in sys.argv
    single_handle = None
    if '--handle' in sys.argv:
        idx = sys.argv.index('--handle')
        if idx + 1 < len(sys.argv):
            single_handle = sys.argv[idx + 1]

    # Load products
    with open(PRODUCTS_FILE, 'r') as f:
        products_data = json.load(f)

    # Load existing patches
    if os.path.exists(PATCHES_FILE):
        with open(PATCHES_FILE, 'r') as f:
            patches_data = json.load(f)
    else:
        patches_data = {}

    # Collect handles to process
    handles = set()
    for team_key, team in products_data['teams'].items():
        for p in team.get('products', []):
            h = p['h']
            if single_handle and h != single_handle:
                continue
            if force or h not in patches_data or not patches_data[h]:
                handles.add(h)

    handles = sorted(handles)
    total = len(handles)
    print(f'Products to process: {total}')

    if not handles:
        print('Nothing to do.')
        return

    done = 0
    updated = 0
    errors = 0

    for handle in handles:
        done += 1
        try:
            result = process_product(handle)
            if result is None:
                errors += 1
                if done % 50 == 0:
                    print(f'  [{done}/{total}] {handle} - ERROR (no product_id)')
            elif len(result) > 0:
                patches_data[handle] = result
                updated += 1
                print(f'  [{done}/{total}] {handle} - {len(result)} patches')
            else:
                # No patches available on peterbot
                if handle not in patches_data:
                    patches_data[handle] = []
                if done % 50 == 0:
                    print(f'  [{done}/{total}] {handle} - no patches')
        except Exception as e:
            errors += 1
            print(f'  [{done}/{total}] {handle} - EXCEPTION: {e}')

        # Save progress every 50 products
        if done % 50 == 0:
            with open(PATCHES_FILE, 'w') as f:
                json.dump(patches_data, f, indent=2, ensure_ascii=False)
            print(f'Progress: {done}/{total}, {updated} updated, {errors} errors')

        # Rate limiting
        time.sleep(0.3)

    # Final save
    with open(PATCHES_FILE, 'w') as f:
        json.dump(patches_data, f, indent=2, ensure_ascii=False)

    print(f'\nDone! {updated} products updated with patches, {errors} errors out of {total}')


if __name__ == '__main__':
    main()
