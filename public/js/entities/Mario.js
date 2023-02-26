import Entity from '../Entity.js';
import Jump from '../traits/Jump.js';
import Go from '../traits/Go.js';
import { loadSpriteSheet } from '../loaders.js';

const FASTER_SPEED = 1 / 5000;
const SLOWER_SPEED = 1 / 1500;

export async function loadMario() {
  const sprite = await loadSpriteSheet('mario');

  return createMarioFactory(sprite);
}

function createMarioFactory(sprite) {
  const runAnimation = sprite.animations.get('run');

  function routeFrame(mario) {
    if (mario.jump.falling) {
      return 'jump';
    }

    if (mario.go.distance > 0) {
      if (
        (mario.vel.x > 0 && mario.go.dir < 0) ||
        (mario.vel.x < 0 && mario.go.dir > 0)
      ) {
        return 'break';
      }

      return runAnimation(mario.go.distance);
    }

    return 'idle';
  }

  function setTurboState(turboOn) {
    const runningDragResistance = turboOn ? FASTER_SPEED : SLOWER_SPEED;

    this.go.dragFactor = runningDragResistance;
  }

  function drawMario(context) {
    const frame = routeFrame(this);
    const flip = this.go.heading < 0;

    sprite.draw(frame, context, 0, 0, flip);
  }

  return function createMario() {
    const mario = new Entity();

    mario.size.set(14, 16);

    mario.addTrait(new Go());
    mario.addTrait(new Jump());

    mario.turbo = setTurboState;
    mario.draw = drawMario;

    mario.turbo(false);

    return mario;
  };
}
