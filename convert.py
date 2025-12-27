#!/usr/bin/env python3
"""Convert whiteboard images to 1/3 size for gallery thumbnails."""

import subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

INPUT_DIR = Path("public/images/whiteboards")
OUTPUT_DIR = Path("public/images/whiteboards_small")
SCALE = 3  # Divide dimensions by this
WORKERS = 40


def convert_image(src: Path) -> tuple[Path, bool, str]:
    """Convert a single image. Returns (path, success, message)."""
    dst = OUTPUT_DIR / src.name
    cmd = [
        "ffmpeg", "-y",
        "-i", str(src),
        "-vf", f"scale=iw/{SCALE}:ih/{SCALE}",
        "-c:v", "libwebp",
        "-q:v", "80",
        str(dst)
    ]
    try:
        subprocess.run(cmd, capture_output=True, check=True)
        return src, True, "OK"
    except subprocess.CalledProcessError as e:
        return src, False, e.stderr.decode()


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    images = list(INPUT_DIR.glob("*.webp"))
    print(f"Converting {len(images)} images with {WORKERS} workers...")
    
    done = 0
    failed = 0
    
    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {executor.submit(convert_image, img): img for img in images}
        
        for future in as_completed(futures):
            src, success, msg = future.result()
            done += 1
            if success:
                print(f"[{done}/{len(images)}] {src.name}")
            else:
                failed += 1
                print(f"[{done}/{len(images)}] FAILED {src.name}: {msg}")
    
    print(f"\nDone! {len(images) - failed} succeeded, {failed} failed.")


if __name__ == "__main__":
    main()
