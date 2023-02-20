import SpriteSheet from './SpriteSheet.js';
import { loadImage } from './loaders.js';

export async function loadMarioSprite() {
  const image = await loadImage('/img/characters.gif');

  const sprites = new SpriteSheet(image, 16, 16);

  sprites.define('idle', 276, 44, 16, 16);

  return sprites;
}

export async function loadBackgroundSprites() {
  const image = await loadImage('/img/tiles.png');

  const sprites = new SpriteSheet(image, 16, 16);

  sprites.defineTile('ground', 0, 0);
  sprites.defineTile('sky', 3, 23);

  return sprites;
}
