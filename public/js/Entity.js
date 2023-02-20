import { Vec2 } from './math.js';

export class Trait {
  constructor(name) {
    this.name = name;
  }

  update() {
    console.warn('Unhandled update call in Trait');
  }
}

export default class Entity {
  constructor() {
    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);

    this.traits = [];
  }

  addTrait(trait) {
    this.traits.push(trait);

    this[trait.name] = trait;
  }

  update(deltaTime) {
    this.traits.forEach((trait) => trait.update(this, deltaTime));
  }
}
