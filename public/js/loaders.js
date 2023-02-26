import SpriteSheet from './SpriteSheet.js';
import { createAnimation } from './animation.js';

export function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();

    image.addEventListener('load', () => resolve(image));

    image.src = url;
  });
}

export async function loadJSON(url) {
  return (await fetch(url)).json();
}

export async function loadSpriteSheet(name) {
  const sheetSpecification = await loadJSON(`./sprites/${name}.json`);

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
