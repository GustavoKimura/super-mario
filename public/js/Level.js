import Compositor from './compositor.js';

export default class Level {
  constructor() {
    this.compositor = new Compositor();
    this.entities = new Set();
  }

  update(deltaTime) {
    this.entities.forEach((entity) => entity.update(deltaTime));
  }
}
