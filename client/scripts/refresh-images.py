"""Refresh the attributed image assets. Requires Pillow; no credentials needed."""
import io,json,pathlib,urllib.request
from PIL import Image,ImageOps
base=pathlib.Path(__file__).resolve().parents[1]
credits=json.loads((base/'src/lib/image-credits.json').read_text())
for name,credit in credits.items():
 request=urllib.request.Request(credit['url'].split('?')[0],headers={'User-Agent':'ExclusiveAssets/1.0 (https://github.com/islamrakibul9274/exclusive-ecommerce)'})
 with urllib.request.urlopen(request,timeout=40) as response:
  photo=ImageOps.exif_transpose(Image.open(io.BytesIO(response.read())))
 photo.thumbnail((1600,1600));photo.save(base/'public'/credit['path'].lstrip('/'),'WEBP',quality=90)
 print(name,credit['license'])
