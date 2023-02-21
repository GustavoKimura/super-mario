import KeyboardState from './KeyboardState.js';

export function setupKeyboard(entity) {
  const input = new KeyboardState();

  const JUMP = 'KeyW';
  const LEFT = 'KeyA';
  const RIGHT = 'KeyD';

  input.addMapping(JUMP, (keyState) => {
    if (keyState) {
      entity.jump.start();
    } else {
      entity.jump.cancel();
    }
  });

  input.addMapping(LEFT, (keyState) => {
    entity.go.dir = -keyState;
  });

  input.addMapping(RIGHT, (keyState) => {
    entity.go.dir = keyState;
  });

  return input;
}
