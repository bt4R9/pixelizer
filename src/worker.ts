import { WorkerApp } from './WorkerApp';

const app = new WorkerApp();

export type WorkerMessages =
  | { type: 'initialize', canvas: HTMLCanvasElement, helper: HTMLCanvasElement }
  | { type: 'loadImage', file: File }
  | { type: 'setPixelSize', size: number }
  | { type: 'setImageRatio', ratio: number }
  | { type: 'clear' };

self.addEventListener('message', (event: MessageEvent<WorkerMessages>) => {
  const type = event.data.type;

  if (type === 'initialize') {
    app.init(event.data);
  }

  if (type === 'loadImage') {
    app.loadImage(event.data.file);
  }

  if (type === 'setImageRatio') {
    app.setImageRatio(event.data.ratio);
  }

  if (type === 'setPixelSize') {
    app.setPixelSize(event.data.size);
  }

  if (type === 'clear') {
    app.clear();
  }
});