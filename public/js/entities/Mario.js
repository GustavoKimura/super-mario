import Entity from '../Entity.js';
import Jump from '../traits/Jump.js';
import Go from '../traits/Go.js';
import Stomper from '../traits/Stomper.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import { loadSpriteSheet } from '../loaders/sprite.js';
import { loadAudioBoard } from '../loaders/audio.js';

const FASTER_SPEED = 1 / 5000;
const SLOWER_SPEED = 1 / 1500;

export async function loadMario(audioContext) {
  const sprite = await loadSpriteSheet('mario');
  const audioBoard = await loadAudioBoard('mario', audioContext);

  return createMarioFactory(sprite, audioBoard);
}

function createMarioFactory(sprite, audioBoard) {
  const runAnimation = sprite.animations.get('run');

  function routeAnimation(mario) {
    if (mario.traits.get(Jump).falling) {
      return 'jump';
    }

    if (mario.traits.get(Go).distance > 0) {
      if (
        (mario.vel.x > 0 && mario.traits.get(Go).dir < 0) ||
        (mario.vel.x < 0 && mario.traits.get(Go).dir > 0)
      ) {
        return 'break';
      }

      return runAnimation(mario.traits.get(Go).distance);
    }

    return 'idle';
  }

  function setTurboState(turboOn) {
    const runningDragResistance = turboOn ? FASTER_SPEED : SLOWER_SPEED;

    this.traits.get(Go).dragFactor = runningDragResistance;
  }

  function drawMario(context) {
    const frame = routeAnimation(this);
    const flip = this.traits.get(Go).heading < 0;

    sprite.draw(frame, context, 0, 0, flip);
  }

  return function createMario() {
    const mario = new Entity();

    mario.audio = audioBoard;

    mario.size.set(14, 16);

    mario.addTrait(new Solid());
    mario.addTrait(new Physics());
    mario.addTrait(new Go());
    mario.addTrait(new Jump());
    mario.addTrait(new Stomper());
    mario.addTrait(new Killable());

    mario.traits.get(Killable).removeAfter = 0;

    mario.turbo = setTurboState;
    mario.draw = drawMario;

    mario.turbo(false);

    return mario;
  };
}
