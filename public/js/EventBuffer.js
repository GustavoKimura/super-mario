export default class EventBuffer {
  constructor() {
    this.events = [];
  }

  emit(name, ...args) {
    const event = { name, args };

    this.events.push(event);
  }

  process(name, callback) {
    const events = this.events.filter((event) => event.name === name);

    events.forEach((event) => callback(...event.args));
  }

  clear() {
    this.events = [];
  }
}
