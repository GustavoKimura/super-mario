import Entity from './Entity.js';
import Jump from './traits/Jump.js';
import Go from './traits/Go.js';
import { loadMarioSprite } from './sprites.js';

export async function createMario() {
  const sprite = await loadMarioSprite();

  const mario = new Entity();

  mario.size.set(16, 16);

  mario.addTrait(new Go());
  mario.addTrait(new Jump());

  mario.draw = function drawMario(context) {
    sprite.draw('idle', context, 0, 0);
  };

  return mario;
}
