import Entity, { Sides, Trait } from '../Entity.js';
import PendulumMove from '../traits/PendulumMove.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import { loadSpriteSheet } from '../loaders/sprite.js';

export async function loadKoopa() {
  const sprite = await loadSpriteSheet('koopa');

  return createKoopaFactory(sprite);
}

const STATE_WALKING = Symbol('walking');
const STATE_HIDING = Symbol('hiding');
const STATE_PANIC = Symbol('panic');

class Behavior extends Trait {
  constructor() {
    super('behavior');

    this.hideTime = 0;
    this.hideDuration = 5;

    this.wakeSpeed = null;
    this.panicSpeed = 300;

    this.state = STATE_WALKING;
  }

  collides(us, them) {
    if (us.killable.dead) {
      return;
    }

    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us, them);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  handleStomp(us, them) {
    if (this.state === STATE_WALKING) {
      this.hide(us);
    } else if (this.state === STATE_HIDING) {
      us.killable.kill();

      us.vel.set(100, -200);

      us.solid.obstructs = false;
    } else if (this.state === STATE_PANIC) {
      this.hide(us);
    }
  }

  hide(us) {
    us.vel.x = 0;
    us.pendulumMove.enabled = false;

    if (this.wakeSpeed === null) {
      this.wakeSpeed = us.pendulumMove.speed;
    }

    this.hideTime = 0;
    this.state = STATE_HIDING;
  }

  unhide(us) {
    us.pendulumMove.enabled = true;

    us.pendulumMove.speed = this.wakeSpeed;

    this.state = STATE_WALKING;
  }

  handleNudge(us, them) {
    if (this.state === STATE_WALKING) {
      them.killable.kill();
    } else if (this.state === STATE_HIDING) {
      this.panic(us, them);
    } else if (this.state === STATE_PANIC) {
      const travelDirection = Math.sign(us.vel.x);
      const impactDirection = Math.sign(us.pos.x - them.pos.x);

      if (travelDirection !== 0 && travelDirection !== impactDirection) {
        them.killable.kill();
      }
    }
  }

  panic(us, them) {
    us.pendulumMove.enabled = true;

    us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);

    this.state = STATE_PANIC;
  }

  update(us, gameContext) {
    const deltaTime = gameContext.deltaTime;

    if (this.state === STATE_HIDING) {
      this.hideTime += deltaTime;

      if (this.hideTime > this.hideDuration) {
        this.unhide(us);
      }
    }
  }
}

function createKoopaFactory(sprite) {
  const walkAnimation = sprite.animations.get('walk');
  const wakeAnimation = sprite.animations.get('wake');

  function routeAnimation(koopa) {
    if (koopa.behavior.state === STATE_HIDING) {
      if (koopa.behavior.hideTime > 3) {
        return wakeAnimation(koopa.behavior.hideTime);
      }

      return 'hiding';
    }

    if (koopa.behavior.state === STATE_PANIC) {
      return 'hiding';
    }

    return walkAnimation(koopa.lifetime);
  }

  function drawKoopa(context) {
    const flip = this.vel.x < 0;

    sprite.draw(routeAnimation(this), context, 0, 0, flip);
  }

  return function createKoopa() {
    const koopa = new Entity();

    koopa.size.set(16, 16);
    koopa.offset.y = 8;

    koopa.addTrait(new Solid());
    koopa.addTrait(new Physics());
    koopa.addTrait(new PendulumMove());
    koopa.addTrait(new Killable());
    koopa.addTrait(new Behavior());

    koopa.draw = drawKoopa;

    return koopa;
  };
}
