import { loadJSON, loadImage } from '../loaders.js';
import SpriteSheet from '../SpriteSheet.js';
import { createAnimation } from '../animation.js';

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
