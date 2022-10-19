import { App } from './App';
import Worker from './worker?worker';

const droppable = <HTMLDivElement>document.getElementById('drop');
const canvas = <HTMLCanvasElement>document.getElementById('app');
const helper = <HTMLCanvasElement>document.getElementById('helper');
const closer = <HTMLDivElement>document.getElementById('closer');
const download = <HTMLButtonElement>document.getElementById('download');
const worker = new Worker();
const app = new App({
  worker,
  helper,
  canvas,
  closer,
  droppable,
  download,
});

app.init();