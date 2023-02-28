import { Vec2 } from './math.js';
import AudioBoard from './AudioBoard.js';
import BoundingBox from './BoundingBox.js';
import EventEmitter from './EventEmitter.js';

export const Sides = {
  TOP: Symbol('top'),
  BOTTOM: Symbol('bottom'),
  RIGHT: Symbol('right'),
  LEFT: Symbol('left'),
};

export class Trait {
  constructor(name) {
    this.name = name;

    this.events = new EventEmitter();
    this.sounds = new Set();

    this.tasks = [];
  }

  finalize() {
    this.tasks.forEach((task) => task());

    this.tasks = [];
  }

  queue(task) {
    this.tasks.push(task);
  }

  collides(us, them) {}

  obstruct() {}

  playSounds(audioBoard, audioContext) {
    this.sounds.forEach((name) => audioBoard.playAudio(name, audioContext));

    this.sounds.clear();
  }

  update() {}
}

export default class Entity {
  constructor() {
    this.audio = new AudioBoard();

    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);
    this.size = new Vec2(0, 0);
    this.offset = new Vec2(0, 0);

    this.bounds = new BoundingBox(this.pos, this.size, this.offset);

    this.lifetime = 0;

    this.traits = [];
  }

  addTrait(trait) {
    this.traits.push(trait);

    this[trait.name] = trait;
  }

  collides(candidate) {
    this.traits.forEach((trait) => trait.collides(this, candidate));
  }

  obstruct(side, match) {
    this.traits.forEach((trait) => trait.obstruct(this, side, match));
  }

  draw() {}

  finalize() {
    this.traits.forEach((trait) => trait.finalize());
  }

  update(gameContext, level) {
    this.traits.forEach((trait) => {
      trait.update(this, gameContext, level);
      trait.playSounds(this.audio, gameContext.audioContext);
    });

    this.lifetime += gameContext.deltaTime;
  }
}
