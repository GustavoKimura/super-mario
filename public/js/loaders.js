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

export async function loadLevel(name) {
  const [levelSpecification, backgroundSprites] = await Promise.all([
    fetch(`/levels/${name}.json`).then((response) => response.json()),
    loadBackgroundSprites(),
  ]);

  const level = new Level();

  const backgroundLayer = createBackgroundLayer(
    levelSpecification.backgrounds,
    backgroundSprites
  );

  const spriteLayer = createSpriteLayer(level.entities);

  level.compositor.layers.push(backgroundLayer);
  level.compositor.layers.push(spriteLayer);

  return level;
}
