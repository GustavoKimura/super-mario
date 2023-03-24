import Entity from '../Entity.js';
import Trait from '../Trait.js';
import PendulumMove from '../traits/PendulumMove.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import Stomper from '../traits/Stomper.js';
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
    super();

    this.hideTime = 0;
    this.hideDuration = 5;

    this.wakeSpeed = null;
    this.panicSpeed = 300;

    this.state = STATE_WALKING;
  }

  collides(us, them) {
    if (us.traits.get(Killable).dead) {
      return;
    }

    if (them.traits.has(Stomper)) {
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
      us.traits.get(Killable).kill();

      us.vel.set(100, -200);

      us.traits.get(Solid).obstructs = false;
    } else if (this.state === STATE_PANIC) {
      this.hide(us);
    }
  }

  hide(us) {
    us.vel.x = 0;
    us.traits.get(PendulumMove).enabled = false;

    if (this.wakeSpeed === null) {
      this.wakeSpeed = us.traits.get(PendulumMove).speed;
    }

    this.hideTime = 0;
    this.state = STATE_HIDING;
  }

  unhide(us) {
    us.traits.get(PendulumMove).enabled = true;

    us.traits.get(PendulumMove).speed = this.wakeSpeed;

    this.state = STATE_WALKING;
  }

  handleNudge(us, them) {
    if (this.state === STATE_WALKING) {
      them.traits.get(Killable).kill();
    } else if (this.state === STATE_HIDING) {
      this.panic(us, them);
    } else if (this.state === STATE_PANIC) {
      const travelDirection = Math.sign(us.vel.x);
      const impactDirection = Math.sign(us.pos.x - them.pos.x);

      if (travelDirection !== 0 && travelDirection !== impactDirection) {
        them.traits.get(Killable).kill();
      }
    }
  }

  panic(us, them) {
    us.traits.get(PendulumMove).enabled = true;

    us.traits.get(PendulumMove).speed = this.panicSpeed * Math.sign(them.vel.x);

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
    if (koopa.traits.get(Behavior).state === STATE_HIDING) {
      if (koopa.traits.get(Behavior).hideTime > 3) {
        return wakeAnimation(koopa.traits.get(Behavior).hideTime);
      }

      return 'hiding';
    }

    if (koopa.traits.get(Behavior).state === STATE_PANIC) {
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
