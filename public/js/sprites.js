import SpriteSheet from './SpriteSheet.js';
import { loadImage } from './loaders.js';

export async function loadMarioSprite() {
  const image = await loadImage('/img/characters.gif');

  const sprites = new SpriteSheet(image, 16, 16);

  sprites.define('idle', 276, 44, 16, 16);

  return sprites;
}
