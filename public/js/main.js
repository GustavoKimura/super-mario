import Timer from './timer.js';
import { loadLevel } from './loaders.js';
import { createMario } from './entities.js';

import KeyboardState from './KeyboardState.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([createMario(), loadLevel('1-1')]).then(([mario, level]) => {
  const timer = new Timer(1 / 60);

  const gravity = 2000;

  mario.pos.set(64, 64);

  level.entities.add(mario);

  const SPACE = 32;
  const input = new KeyboardState();

  input.addMapping(SPACE, (keyState) => {
    if (keyState) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  });

  input.listenTo(window);

  timer.update = function update(deltaTime) {
    level.update(deltaTime);

    level.compositor.draw(context);

    mario.vel.y += gravity * deltaTime;
  };

  timer.start();
});
