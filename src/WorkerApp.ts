import { Pixelizer } from './Pixelizer';
import { Renderer } from './Renderer';
import { WorkerImageLoader } from './WorkerImageLoader';

export interface WorkerAppInitParams {
  canvas: HTMLCanvasElement;
  helper: HTMLCanvasElement;
}

export class WorkerApp {
  canvas: HTMLCanvasElement | null = null;
  helper: HTMLCanvasElement | null = null;

  renderer: Renderer | null = null;
  imageLoader: WorkerImageLoader | null = null;

  pixels: Uint8ClampedArray | null = null;
  width: number = 0;
  height: number = 0;

  pixelSize: number = 4;
  imageRatio: number = 1;

  init({ canvas, helper }: WorkerAppInitParams) {
    this.canvas = canvas;
    this.helper = helper;

    this.canvas.height = 480;

    this.renderer = new Renderer(this.canvas);
    this.imageLoader = new WorkerImageLoader(this.helper);
  }

  async loadImage(image: File) {
    self.postMessage({ type: 'processingStart' });

    const { pixels, width, height } = await this.imageLoader!.load(image);

    this.pixels = pixels;
    this.width = width;
    this.height = height;

    this.draw(false);
  }

  setPixelSize(size: number) {
    this.pixelSize = size;
    this.draw();
  }

  setImageRatio(ratio: number) {
    this.imageRatio = ratio;
    this.draw();
  }

  draw(sendProgressEvent = true) {
    if (sendProgressEvent) {
      self.postMessage({ type: 'processingStart' });
    }

    const pixelizer = new Pixelizer({
      pixels: this.pixels!,
      width: this.width,
      height: this.height,
    });

    const particles = pixelizer.pixelize({
      pixelSize: this.pixelSize,
      ratio: this.imageRatio,
    });

    this.renderer!.particles = particles;
    this.renderer!.width = this.width,
    this.renderer!.height = this.height;
    this.renderer!.pixelSize = this.pixelSize;
    this.renderer!.ratio = this.imageRatio;

    this.renderer!.draw();

    self.postMessage({ type: 'processingEnd' });
  }

  clear() {
    this.renderer!.clear();
  }
}