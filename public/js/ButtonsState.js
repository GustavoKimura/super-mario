const PRESSED = 1;
const RELEASED = 0;

export default class ButtonsState {
  constructor() {
    this.buttonMap = new Map();

    this.buttonStates = new Map();
  }

  addMapping(buttonId, callback) {
    this.buttonMap.set(buttonId, callback);
  }

  handleEvent(event) {
    const { target } = event;

    const { id: buttonId } = target;

    if (!this.buttonMap.has(buttonId)) {
      return;
    }

    event.preventDefault();

    const buttonState =
      event.type === 'mousedown' || event.type === 'touchstart'
        ? PRESSED
        : RELEASED;

    if (this.buttonStates.get(buttonId) === buttonState) {
      return;
    }

    this.buttonStates.set(buttonId, buttonState);

    const callbackToExecute = this.buttonMap.get(buttonId);

    callbackToExecute(buttonState);
  }

  listenTo(left, right, run, jump) {
    ['mousedown', 'mouseup', 'touchstart', 'touchend'].forEach((eventName) => {
      left.addEventListener(eventName, (event) => this.handleEvent(event));
      right.addEventListener(eventName, (event) => this.handleEvent(event));
      run.addEventListener(eventName, (event) => this.handleEvent(event));
      jump.addEventListener(eventName, (event) => this.handleEvent(event));
    });
  }
}
