const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
  constructor() {
    // Holds the current state of a given key
    this.keyStates = new Map();

    // Holds the callback functions for a code
    this.keyMap = new Map();
  }

  addMapping(code, callback) {
    this.keyMap.set(code, callback);
  }

  handleEvent(event) {
    const { code } = event;

    if (!this.keyMap.has(code)) {
      // Did not have code mapped
      return;
    }

    event.preventDefault();

    const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

    if (this.keyStates.get(code) === keyState) {
      return;
    }

    this.keyStates.set(code, keyState);

    this.keyMap.get(code)(keyState);
  }

  listenTo(window, left, right, run, jump) {
    ['mousedown', 'mouseup', 'touchstart', 'touchend'].forEach((eventName) => {
      left.addEventListener(eventName, (event) => {
        this.handleEvent({
          code: 'KeyA',
          type:
            event.type === 'mousedown' || event.type === 'touchstart'
              ? 'keydown'
              : 'keyup',
          preventDefault: () => event.preventDefault,
        });
      });

      right.addEventListener(eventName, (event) => {
        this.handleEvent({
          code: 'KeyD',
          type:
            event.type === 'mousedown' || event.type === 'touchstart'
              ? 'keydown'
              : 'keyup',
          preventDefault: () => event.preventDefault,
        });
      });

      run.addEventListener(eventName, (event) => {
        this.handleEvent({
          code: 'KeyZ',
          type:
            event.type === 'mousedown' || event.type === 'touchstart'
              ? 'keydown'
              : 'keyup',
          preventDefault: () => event.preventDefault,
        });
      });

      jump.addEventListener(eventName, (event) => {
        this.handleEvent({
          code: 'KeyW',
          type:
            event.type === 'mousedown' || event.type === 'touchstart'
              ? 'keydown'
              : 'keyup',
          preventDefault: () => event.preventDefault,
        });
      });
    });

    ['keydown', 'keyup'].forEach((eventName) => {
      window.addEventListener(eventName, (event) => {
        this.handleEvent(event);
      });
    });
  }
}
