import { Trait, Sides } from '../Entity.js';

export default class Jump extends Trait {
  constructor() {
    super('jump');

    this.ready = 0;
    this.duration = 0.5;
    this.velocity = 200;
    this.engageTime = 0;
    this.requestTime = 0;
    this.gracePeriod = 0.1;
  }

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;

    this.requestTime = 0;
  }

  obstruct(side) {
    if (side === Sides.BOTTOM) {
      this.ready = 1;
    } else if (side === Sides.TOP) {
      this.cancel();
    }
  }

  update(entity, deltaTime) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        this.engageTime = this.duration;

        this.requestTime = 0;
      }

      this.requestTime -= deltaTime;
    }

    if (this.engageTime > 0) {
      entity.vel.y = -this.velocity;

      this.engageTime -= deltaTime;
    }

    this.ready -= 1;
  }
}
