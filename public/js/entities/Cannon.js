import Entity from '../Entity.js';
import Emitter from '../traits/Emitter.js';
import { findPlayers } from '../player.js';
import { loadAudioBoard } from '../loaders/audio.js';

const HOLD_FIRE_THRESHOLD = 30;

export async function loadCannon(audioContext, entityFactories) {
  const audioBoard = await loadAudioBoard('cannon', audioContext);

  return createCannonFactory(audioBoard, entityFactories);
}

function createCannonFactory(audioBoard, entityFactories) {
  function emitBullet(cannon, level) {
    const RIGHT_DIRECTION = 1;
    const LEFT_DIRECTION = -1;

    let direction = RIGHT_DIRECTION;

    for (const player of findPlayers(level)) {
      if (
        player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD &&
        player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD
      ) {
        return;
      }

      if (player.pos.x < cannon.pos.x) {
        direction = LEFT_DIRECTION;
      }
    }

    const bullet = entityFactories.bullet();

    bullet.pos.copy(cannon.pos);
    bullet.vel.set(80 * direction, 0);

    cannon.sounds.add('shoot');

    level.entities.add(bullet);
  }

  return function createCannon() {
    const cannon = new Entity();

    cannon.audio = audioBoard;

    const emitter = new Emitter();
    emitter.interval = 4;
    emitter.emitters.push(emitBullet);

    cannon.addTrait(emitter);

    return cannon;
  };
}
