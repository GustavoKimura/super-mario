import Camera from './Camera.js';
import TileCollider from './TileCollider.js';
import EntityCollider from './EntityCollider.js';
import MusicController from './MusicController.js';
import Scene from './Scene.js';
import { findPlayers } from './player.js';

function focusPlayer(level) {
  for (const player of findPlayers(level.entities)) {
    level.camera.pos.x = Math.max(0, player.pos.x - 100);
  }
}

export default class Level extends Scene {
  static EVENT_TRIGGER = Symbol('trigger');

  constructor() {
    super();

    this.name = '';
    this.gravity = 1500;
    this.totalTime = 0;

    this.camera = new Camera();
    this.entities = new Set();

    this.tileCollider = new TileCollider();
    this.entityCollider = new EntityCollider(this.entities);
    this.musicController = new MusicController();
  }

  draw(gameContext) {
    this.compositor.draw(gameContext.videoContext, this.camera);
  }

  update(gameContext) {
    this.entities.forEach((entity) => {
      entity.update(gameContext, this);
    });

    this.entities.forEach((entity) => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach((entity) => {
      entity.finalize();
    });

    focusPlayer(this);

    this.totalTime += gameContext.deltaTime;
  }

  pause() {
    this.musicController.pause();
  }
}
