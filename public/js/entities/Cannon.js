import Entity from '../Entity.js';
import Emitter from '../traits/Emitter.js';
import { loadAudioBoard } from '../loaders/audio.js';

export async function loadCannon(audioContext, entityFactories) {
  const audioBoard = await loadAudioBoard('mario', audioContext);

  return createCannonFactory(audioBoard, entityFactories);
}

function createCannonFactory(audioBoard, entityFactories) {
  function emitBullet(cannon, level) {
    const bullet = entityFactories.bullet();

    bullet.pos.copy(cannon.pos);

    level.entities.add(bullet);
  }

  return function createCannon() {
    const cannon = new Entity();

    cannon.audio = audioBoard;

    const emitter = new Emitter();
    emitter.emitters.push(emitBullet);

    cannon.addTrait(emitter);

    return cannon;
  };
}
