"""Quita el fondo de una imagen y guarda un PNG con transparencia.

Uso:
    python scripts/remove_bg.py "public/.../foto.png"
    python scripts/remove_bg.py "entrada.png" "salida.png" --matting

- Si no se pasa salida, genera "<nombre>-nobg.png" junto al original.
- --matting activa alpha matting (bordes más finos, mucho más lento).
- Recorta al bounding box del objeto para no dejar margen transparente.

Requiere: pip install rembg onnxruntime pillow
"""
import argparse
import io
from pathlib import Path

from PIL import Image
from rembg import remove, new_session


def main() -> None:
    parser = argparse.ArgumentParser(description="Quitar fondo -> PNG transparente")
    parser.add_argument("src", help="Ruta de la imagen original")
    parser.add_argument("out", nargs="?", help="Ruta de salida (opcional)")
    parser.add_argument("--model", default="isnet-general-use", help="Modelo rembg")
    parser.add_argument("--matting", action="store_true", help="Alpha matting (lento)")
    parser.add_argument("--no-crop", action="store_true", help="No recortar al objeto")
    args = parser.parse_args()

    src = Path(args.src)
    out = Path(args.out) if args.out else src.with_name(f"{src.stem}-nobg.png")

    session = new_session(args.model)
    data = src.read_bytes()

    kwargs = {"session": session, "post_process_mask": True}
    if args.matting:
        kwargs.update(
            alpha_matting=True,
            alpha_matting_foreground_threshold=250,
            alpha_matting_background_threshold=15,
            alpha_matting_erode_size=10,
        )

    result = remove(data, **kwargs)
    img = Image.open(io.BytesIO(result)).convert("RGBA")

    if not args.no_crop:
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)

    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out)
    print(f"OK -> {out}  size={img.size}")


if __name__ == "__main__":
    main()
