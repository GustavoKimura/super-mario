import { loadImage } from '../loaders.js';
import SpriteSheet from '../SpriteSheet.js';

const CHARS =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

class Font {
  constructor(sprites, size) {
    this.sprites = sprites;
    this.size = size;
  }

  print(text, context, x, y) {
    [...text].forEach((char, pos) => {
      this.sprites.draw(char, context, x + pos * this.size, y);
    });
  }
}

export async function loadFont() {
  const image = await loadImage('./img/font.png');

  const fontSprite = new SpriteSheet(image);

  const size = 8;
  const rowLength = image.width;

  for (const [index, char] of [...CHARS].entries()) {
    const x = (index * size) % rowLength;
    const y = Math.floor((index * size) / rowLength) * size;

    fontSprite.define(char, x, y, size, size);
  }

  return new Font(fontSprite, size);
}
