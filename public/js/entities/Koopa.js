import Entity, { Sides } from '../Entity.js';
import PendulumWalk from '../traits/PendulumWalk.js';
import { loadSpriteSheet } from '../loaders.js';

export async function loadKoopa() {
  const sprite = await loadSpriteSheet('koopa');

  return createKoopaFactory(sprite);
}

function createKoopaFactory(sprite) {
  const walkAnimation = sprite.animations.get('walk');

  function drawKoopa(context) {
    const flip = this.vel.x < 0;

    sprite.draw(walkAnimation(this.lifetime), context, 0, 0, flip);
  }

  return function createKoopa() {
    const koopa = new Entity();

    koopa.size.set(16, 16);
    koopa.offset.y = 8;

    koopa.addTrait(new PendulumWalk());

    koopa.draw = drawKoopa;

    return koopa;
  };
}
