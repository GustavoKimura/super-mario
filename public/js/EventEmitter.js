export default class EventEmitter {
  constructor() {
    this.listeners = [];
  }

  listen(name, callback) {
    const listener = { name, callback };

    this.listeners.push(listener);
  }

  emit(name, ...args) {
    const listeners = this.listeners.filter(
      (listener) => listener.name === name
    );

    listeners.forEach((listener) => listener.callback(...args));
  }
}
