import Compositor from './compositor.js';
import Timer from './timer.js';
import { loadLevel } from './loaders.js';
import { createMario } from './entities.js';
import { loadBackgroundSprites } from './sprites.js';
import { createBackgroundLayer, createSpriteLayer } from './layers.js';

import KeyboardState from './KeyboardState.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

Promise.all([createMario(), loadBackgroundSprites(), loadLevel('1-1')]).then(
  ([mario, backgroundSprites, level]) => {
    const compositor = new Compositor();

    const backgroundLayer = createBackgroundLayer(
      level.backgrounds,
      backgroundSprites
    );

    const spriteLayer = createSpriteLayer(mario);

    compositor.layers.push(backgroundLayer);
    compositor.layers.push(spriteLayer);

    const timer = new Timer(1 / 60);

    const gravity = 2000;

    mario.pos.set(64, 180);

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
      mario.update(deltaTime);

      compositor.draw(context);

      mario.vel.y += gravity * deltaTime;
    };

    timer.start();
  }
);
