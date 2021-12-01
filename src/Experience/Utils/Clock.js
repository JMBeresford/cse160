import EventEmitter from './EventEmitter';

export default class Clock extends EventEmitter {
  constructor() {
    super();

    this.started = performance.now();
    this.current = this.started;
    this.elapsed = 0;
    this.delta = 16; // initial val of 0 causes bugs
    this.averageFPS = 60;

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => this.tick());
    }

    return this;
  }

  tick() {
    // upperformance clock
    let cur = performance.now();
    this.delta = cur - this.current;
    this.current = cur;
    this.elapsed = (this.current - this.started) / 1000; // in seconds
    this.averageFPS = (this.averageFPS + 1000 / this.delta) / 2;

    // console.log(this.averageFPS);

    this.trigger('tick');

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => this.tick());
    }
  }
}
