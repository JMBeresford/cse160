import Stats from 'stats.js';

export class Monitor {
  constructor(pane = 0) {
    this.stats = new Stats();

    this.stats.showPanel(pane); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
    this.begin = this.stats.begin;
    this.end = this.stats.end;
  }
}
