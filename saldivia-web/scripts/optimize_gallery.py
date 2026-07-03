"""Comprime las imágenes de la Galería de innovación a WebP optimizado.

- Redimensiona al lado mayor <= MAX_EDGE (suficiente para carrusel + lightbox).
- Exporta WebP con calidad Q en public/galeria-innovacion con nombres limpios.

Uso: python scripts/optimize_gallery.py
Requiere: pip install pillow
"""
from pathlib import Path

from PIL import Image, ImageOps

MAX_EDGE = 1920
Q = 80

BASE = Path("public/Imagenes para la web/1/planta y proceso fabricacion")
SCANIA = BASE / "El Expreso TV - Proceso Scania"
OUT = Path("public/galeria-innovacion")

# (archivo origen, nombre destino sin extensión)
SOURCES = [
    (BASE / "20240506_153804.jpg", "01-planta"),
    (BASE / "20250331_094852.jpg", "02-flota-entrega"),
    (BASE / "BF1FAE22-547C-46F9-96AE-F6C5745F5DFC.png", "03-buses-terminados"),
    (BASE / "DJI_0490.JPG.jpeg", "04-aerea-planta"),
    (BASE / "DJI_0500.JPG.jpeg", "05-aerea-instalaciones"),
    (BASE / "IMG_20241128_121215_812.jpg", "06-carroceria-elevador"),
    (BASE / "IMG_20250207_053351_238.jpg", "07-linea-produccion"),
    (SCANIA / "2-Estructura A.jpg", "08-estructura-carroceria"),
    (SCANIA / "16-Interior copy.jpg", "09-interior-terminado"),
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    total_in = total_out = 0
    for src, stem in SOURCES:
        if not src.exists():
            print(f"FALTA: {src}")
            continue
        img = Image.open(src)
        img = ImageOps.exif_transpose(img)  # respeta orientación de la cámara
        img = img.convert("RGB")
        img.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        dst = OUT / f"{stem}.webp"
        img.save(dst, "WEBP", quality=Q, method=6)
        in_kb = src.stat().st_size / 1024
        out_kb = dst.stat().st_size / 1024
        total_in += in_kb
        total_out += out_kb
        print(f"{in_kb:8.0f} KB -> {out_kb:7.0f} KB  {img.size}  {dst.name}")
    print("-" * 60)
    print(f"TOTAL: {total_in/1024:.1f} MB -> {total_out/1024:.2f} MB  "
          f"({100*(1-total_out/total_in):.0f}% menos)")


if __name__ == "__main__":
    main()
