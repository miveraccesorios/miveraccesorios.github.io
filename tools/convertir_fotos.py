#!/usr/bin/env python3
"""Convierte las fotos originales (HEIC/JPEG/PNG) a JPG optimizados para la web.

Uso: python3 tools/convertir_fotos.py <carpeta_originales> <carpeta_salida>

Por cada foto genera <nombre>.jpg (hasta 1600px) y <nombre>-chica.jpg (hasta 700px).
El nombre sale del archivo original en minusculas y con guiones: conviene renombrar
las fotos antes (ej: "collar-esmeralda-1.HEIC").
Requiere ffmpeg >= 7.1 (para HEIC en mosaico) y Pillow.
"""
import json, re, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageOps

MAX_LADO = 1600
MAX_LADO_CHICA = 700  # version liviana para la grilla del catalogo


def rotacion_heic(src: Path) -> float:
    """Lee la rotacion (displaymatrix) que guarda el iPhone en el HEIC."""
    salida = subprocess.run(["ffprobe", "-hide_banner", str(src)],
                            capture_output=True, text=True).stderr
    m = re.search(r"rotation of (-?[\d.]+) degrees", salida)
    return float(m.group(1)) if m else 0.0


def heic_a_png(src: Path, dst: Path):
    info = json.loads(subprocess.check_output(
        ["ffprobe", "-loglevel", "error", "-show_stream_groups", "-of", "json", str(src)]))
    grupos = [g for g in info.get("stream_groups", []) if g.get("type") == "Tile Grid"]
    if not grupos:
        subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-i", str(src),
                               "-frames:v", "1", str(dst)])
        return
    comp = grupos[0]["components"][0]
    tiles = comp["subcomponents"]
    entradas = "".join(f"[0:{t['stream_index']}]" for t in tiles)
    layout = "|".join(f"{t['tile_horizontal_offset']}_{t['tile_vertical_offset']}" for t in tiles)
    filtro = (f"{entradas}xstack=inputs={len(tiles)}:layout={layout},"
              f"crop={comp['width']}:{comp['height']}:{comp['horizontal_offset']}:{comp['vertical_offset']}[out]")
    subprocess.check_call(["ffmpeg", "-loglevel", "error", "-y", "-i", str(src),
                           "-filter_complex", filtro, "-map", "[out]",
                           "-frames:v", "1", "-update", "1", str(dst)])


def main():
    origen, salida = Path(sys.argv[1]), Path(sys.argv[2])
    salida.mkdir(parents=True, exist_ok=True)
    for f in sorted(origen.iterdir()):
        ext = f.suffix.lower()
        if ext not in {".heic", ".jpg", ".jpeg", ".png"}:
            continue
        nombre = f.stem.lower().replace(" ", "-")
        if ext == ".heic":
            with tempfile.TemporaryDirectory() as tmp:
                png = Path(tmp) / "x.png"
                heic_a_png(f, png)
                img = Image.open(png); img.load()
            rot = rotacion_heic(f)
            if rot:
                # PIL rota en sentido antihorario con angulos positivos, igual que displaymatrix
                img = img.rotate(rot, expand=True)
        else:
            img = ImageOps.exif_transpose(Image.open(f))
        conserva_alpha = ext == ".png" and img.mode in ("RGBA", "LA", "P")
        img.thumbnail((MAX_LADO, MAX_LADO), Image.LANCZOS)
        chica = img.copy()
        chica.thumbnail((MAX_LADO_CHICA, MAX_LADO_CHICA), Image.LANCZOS)
        if conserva_alpha:
            destino = salida / f"{nombre}.png"
            img.save(destino, optimize=True)
            chica.save(salida / f"{nombre}-chica.png", optimize=True)
        else:
            destino = salida / f"{nombre}.jpg"
            img.convert("RGB").save(destino, quality=82, optimize=True, progressive=True)
            chica.convert("RGB").save(salida / f"{nombre}-chica.jpg", quality=80, optimize=True, progressive=True)
        print(f"{f.name} -> {destino.name} {img.size}")


if __name__ == "__main__":
    main()
