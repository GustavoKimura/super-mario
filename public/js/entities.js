import Entity from './Entity.js';
import Jump from './traits/Jump.js';
import Go from './traits/Go.js';
import { loadSpriteSheet } from './loaders.js';
import { createAnimation } from './animation.js';

export async function createMario() {
  const sprite = await loadSpriteSheet('mario');

  const mario = new Entity();

  mario.size.set(14, 16);

  mario.addTrait(new Go());
  mario.addTrait(new Jump());

  const runAnimation = createAnimation(['run-1', 'run-2', 'run-3'], 10);

  function routeFrame(mario) {
    if (mario.go.dir !== 0) {
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
