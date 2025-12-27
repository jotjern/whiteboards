import ffmpeg
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

SRC = Path("/Users/jogramnaestjernshaugen/whiteboards/data/whiteboards_nobg_manual")
DST = Path("/Users/jogramnaestjernshaugen/whiteboards-frontend/public/whiteboards")

DST.mkdir(parents=True, exist_ok=True)

pngs = list(SRC.glob("*.png"))

def convert(png: Path):
    out = DST / (png.stem + ".webp")

    if out.exists():
        return f"SKIP  {png.name}"

    try:
        (
            ffmpeg
            .input(str(png))
            .output(
                str(out),
                vcodec="libwebp",
                lossless=1,
                compression_level=6
            )
            .overwrite_output()
            .run(quiet=True)
        )
        return f"OK    {png.name}"
    except ffmpeg.Error as e:
        err = e.stderr.decode(errors="ignore").splitlines()
        return f"FAIL  {png.name}: {err[-1] if err else 'unknown error'}"

print(f"Found {len(pngs)} PNGs")

with ThreadPoolExecutor(max_workers=10) as pool:
    futures = [pool.submit(convert, p) for p in pngs]
    for f in as_completed(futures):
        print(f.result())
