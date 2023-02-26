import Entity, { Sides } from '../Entity.js';
import PendulumWalk from '../traits/PendulumWalk.js';
import { loadSpriteSheet } from '../loaders.js';

export async function loadGoomba() {
  const sprite = await loadSpriteSheet('goomba');

  return createGoombaFactory(sprite);
}

function createGoombaFactory(sprite) {
  const walkAnimation = sprite.animations.get('walk');

  function drawGoomba(context) {
    sprite.draw(walkAnimation(this.lifetime), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();

    goomba.size.set(16, 16);

    goomba.addTrait(new PendulumWalk());

    goomba.draw = drawGoomba;

    return goomba;
  };
}
