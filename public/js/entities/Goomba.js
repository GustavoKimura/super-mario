import Entity from '../Entity.js';
import Trait from '../Trait.js';
import PendulumMove from '../traits/PendulumMove.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import { loadSpriteSheet } from '../loaders/sprite.js';

export async function loadGoomba() {
  const sprite = await loadSpriteSheet('goomba');

  return createGoombaFactory(sprite);
}

class Behavior extends Trait {
  constructor() {
    super('behavior');
  }

  collides(us, them) {
    if (us.killable.dead) {
      return;
    }

    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        us.killable.kill();

        us.pendulumMove.speed = 0;
      } else {
        them.killable.kill();
      }
    }
  }
}

function createGoombaFactory(sprite) {
  const walkAnimation = sprite.animations.get('walk');

  function routeAnimation(goomba) {
    if (goomba.killable.dead) {
      return 'flat';
    }

    return walkAnimation(goomba.lifetime);
  }

  function drawGoomba(context) {
    sprite.draw(routeAnimation(this), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();

    goomba.size.set(16, 16);

    goomba.addTrait(new Solid());
    goomba.addTrait(new Physics());
    goomba.addTrait(new PendulumMove());
    goomba.addTrait(new Killable());
    goomba.addTrait(new Behavior());

    goomba.draw = drawGoomba;

    return goomba;
  };
}
