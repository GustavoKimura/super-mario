import Entity from '../Entity.js';
import Trait from '../Trait.js';
import Killable from '../traits/Killable.js';
import Velocity from '../traits/Velocity.js';
import Gravity from '../traits/Gravity.js';
import { loadSpriteSheet } from '../loaders/sprite.js';

export async function loadBullet() {
  const sprite = await loadSpriteSheet('bullet');

  return createBulletFactory(sprite);
}

class Behavior extends Trait {
  constructor() {
    super('behavior');

    this.gravity = new Gravity();
  }

  collides(us, them) {
    if (us.killable.dead) {
      return;
    }

    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        const KILL_TO_RIGHT = 1;
        const KILL_TO_LEFT = -1;

        const killDirection = us.vel.x < 0 ? KILL_TO_LEFT : KILL_TO_RIGHT;

        us.vel.set(100 * killDirection, -200);

        us.killable.kill();
      } else {
        them.killable.kill();
      }
    }
  }

  update(entity, gameContext, level) {
    if (entity.killable.dead) {
      this.gravity.update(entity, gameContext, level);
    }
  }
}

function createBulletFactory(sprite) {
  function drawBullet(context) {
    const flip = this.vel.x < 0;

    sprite.draw('bullet', context, 0, 0, flip);
  }

  return function createBullet() {
    const bullet = new Entity();

    bullet.size.set(16, 14);

    bullet.addTrait(new Killable());
    bullet.addTrait(new Behavior());
    bullet.addTrait(new Velocity());

    bullet.draw = drawBullet;

    return bullet;
  };
}
