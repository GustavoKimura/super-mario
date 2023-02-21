import Level from './Level.js';
import SpriteSheet from './SpriteSheet.js';
import { createBackgroundLayer, createSpriteLayer } from './layers.js';
import { createAnimation } from './animation.js';

export function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();

    image.addEventListener('load', () => resolve(image));

    image.src = url;
  });
}

async function loadJSON(url) {
  return (await fetch(url)).json();
}

function createTiles(level, backgrounds) {
  function applyRange(background, xStart, xLength, yStart, yLength) {
    const xEnd = xStart + xLength;
    const yEnd = yStart + yLength;

    for (let x = xStart; x < xEnd; x++) {
      for (let y = yStart; y < yEnd; y++) {
        level.tiles.set(x, y, { name: background.tile, type: background.type });
      }
    }
  }

  backgrounds.forEach((background) => {
    background.ranges.forEach((range) => {
      if (range.length === 4) {
        const [xStart, xLength, yStart, yLength] = range;

        applyRange(background, xStart, xLength, yStart, yLength);
      } else if (range.length === 3) {
        const [xStart, xLength, yStart] = range;

        applyRange(background, xStart, xLength, yStart, 1);
      } else if (range.length === 2) {
        const [xStart, yStart] = range;

        applyRange(background, xStart, 1, yStart, 1);
      }
    });
  });
}

export async function loadSpriteSheet(name) {
  const sheetSpecification = await loadJSON(`/sprites/${name}.json`);

  const image = await loadImage(sheetSpecification.imageURL);

  const sprites = new SpriteSheet(
    image,
    sheetSpecification.tileW,
    sheetSpecification.tileH
  );

  if (sheetSpecification.tiles) {
    sheetSpecification.tiles.forEach((tileSpecification) => {
      sprites.defineTile(
        tileSpecification.name,
        tileSpecification.index[0],
        tileSpecification.index[1]
      );
    });
  }

  if (sheetSpecification.frames) {
    sheetSpecification.frames.forEach((frameSpecification) => {
      sprites.define(frameSpecification.name, ...frameSpecification.rect);
    });
  }

  if (sheetSpecification.animations) {
    sheetSpecification.animations.forEach((animationSpecification) => {
      const animation = createAnimation(
        animationSpecification.frames,
        animationSpecification.frameLength
      );

      sprites.defineAnimation(animationSpecification.name, animation);
    });
  }

  return sprites;
}

export async function loadLevel(name) {
  const levelSpecification = await loadJSON(`/levels/${name}.json`);

  const backgroundSprites = await loadSpriteSheet(
    levelSpecification.spriteSheet
  );

  const level = new Level();

  createTiles(level, levelSpecification.backgrounds);

  const backgroundLayer = createBackgroundLayer(level, backgroundSprites);

  const spriteLayer = createSpriteLayer(level.entities);

  level.compositor.layers.push(backgroundLayer);
  level.compositor.layers.push(spriteLayer);

  return level;
}
