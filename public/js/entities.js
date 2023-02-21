import Entity from './Entity.js';
import Jump from './traits/Jump.js';
import Go from './traits/Go.js';
import { loadSpriteSheet } from './loaders.js';
import { createAnimation } from './animation.js';

const FASTER_SPEED = 1 / 5000;
const SLOWER_SPEED = 1 / 1500;

export async function createMario() {
  const sprite = await loadSpriteSheet('mario');

  const mario = new Entity();

  mario.size.set(14, 16);

  mario.addTrait(new Go());
  mario.go.dragFactor = SLOWER_SPEED;

  mario.addTrait(new Jump());

  mario.turbo = function setTurboState(turboOn) {
    const runningDragResistance = turboOn ? FASTER_SPEED : SLOWER_SPEED;

    mario.go.dragFactor = runningDragResistance;
  };

  const runAnimation = createAnimation(['run-1', 'run-2', 'run-3'], 6);

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

  mario.draw = function drawMario(context) {
    const frame = routeFrame(mario);
    const flip = mario.go.heading < 0;

    sprite.draw(frame, context, 0, 0, flip);
  };

  return mario;
}
