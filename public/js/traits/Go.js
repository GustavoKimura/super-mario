import Trait from '../Trait.js';

export default class Go extends Trait {
  constructor() {
    super();

    this.dir = 0;
    this.acceleration = 400;
    this.deceleration = 300;
    this.dragFactor = 1 / 5000;

    this.distance = 0;
    this.heading = 1;
  }

  update(entity, { deltaTime }) {
    const absX = Math.abs(entity.vel.x);

    if (this.dir !== 0) {
      entity.vel.x += this.acceleration * deltaTime * this.dir;

      if (entity.jump) {
        if (!entity.jump.falling) {
          this.heading = this.dir;
        }
      } else {
        this.heading = this.dir;
      }
    } else if (entity.vel.x !== 0) {
      const deceleration = Math.min(absX, this.deceleration * deltaTime);

      entity.vel.x += entity.vel.x > 0 ? -deceleration : deceleration;
    } else {
      this.distance = 0;
    }

    const drag = this.dragFactor * entity.vel.x * absX;
    entity.vel.x -= drag;

    this.distance += absX * deltaTime;
  }
}
