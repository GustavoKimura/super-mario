import Level from './Level.js';
import { createBackgroundLayer, createSpriteLayer } from './layers.js';
import { loadBackgroundSprites } from './sprites.js';

export function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();

    image.addEventListener('load', () => resolve(image));

    image.src = url;
  });
}

function createTiles(level, backgrounds) {
  backgrounds.forEach((background) => {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
      for (let x = x1; x < x2; x++) {
        for (let y = y1; y < y2; y++) {
          level.tiles.set(x, y, { name: background.tile });
        }
      }
    });
  });
}

export async function loadLevel(name) {
  const [levelSpecification, backgroundSprites] = await Promise.all([
    fetch(`/levels/${name}.json`).then((response) => response.json()),
    loadBackgroundSprites(),
  ]);

  const level = new Level();

  createTiles(level, levelSpecification.backgrounds);

  const backgroundLayer = createBackgroundLayer(level, backgroundSprites);

  const spriteLayer = createSpriteLayer(level.entities);

  level.compositor.layers.push(backgroundLayer);
  level.compositor.layers.push(spriteLayer);

  return level;
}
