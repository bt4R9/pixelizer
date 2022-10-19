import { Dropppable } from './Droppable';
import { Settings } from './Settings';

export interface AppParams {
  worker: Worker;
  droppable: HTMLDivElement;
  closer: HTMLDivElement;
  canvas: HTMLCanvasElement;
  helper: HTMLCanvasElement;
  download: HTMLButtonElement;
}

export class App {
  worker: Worker;
  canvas: HTMLCanvasElement;
  helper: HTMLCanvasElement;
  closer: HTMLDivElement;
  download: HTMLButtonElement;

  droppable: Dropppable;
  settings: Settings;
  image: HTMLImageElement | null = null;

  pixelSize: number = 4;
  imageRatio: number = 1;

  constructor(params: AppParams) {
    const { worker, droppable, canvas, helper, closer, download } = params;

    this.worker = worker;
    this.canvas = canvas;
    this.helper = helper;
    this.closer = closer;
    this.download = download;

    this.droppable = new Dropppable(droppable);
    this.settings = new Settings();
  }

  init() {
    const disposers = [
      this.settings.init(),
      this.droppable.init(),
      this.settings.init(),
    ];

    this.settings.events.on('onPixelSizeChange', this.onPixelSizeChange);
    this.settings.events.on('onRatioChange', this.onImageRatioChange);
    this.droppable.events.on('onImageFileDrop', this.onImageFileDrop);

    // @ts-ignore
    const offscreenCanvas = this.canvas.transferControlToOffscreen();
    // @ts-ignore
    const offscreenHelper = this.helper.transferControlToOffscreen();

    this.worker.postMessage({
      type: 'initialize',
      canvas: offscreenCanvas,
      helper: offscreenHelper,
    }, [offscreenCanvas, offscreenHelper]);

    this.worker.addEventListener('message', this.onMessage);
    this.closer.addEventListener('click', this.onCloserClick);
    this.download.addEventListener('click', this.onDownload);

    return () => {
      this.settings.events.off('onPixelSizeChange', this.onPixelSizeChange);
      this.settings.events.off('onRatioChange', this.onImageRatioChange);
      this.droppable.events.off('onImageFileDrop', this.onImageFileDrop);
      this.worker.removeEventListener('message', this.onMessage);
      this.closer.removeEventListener('click', this.onCloserClick);
      this.download.removeEventListener('click', this.onDownload);

      for (const disposer of disposers) {
        disposer();
      }
    }
  }

  private onMessage = (event: MessageEvent) => {
    if (event.data.type === 'processingStart') {
      this.canvas.classList.add('progress');
    } else if (event.data.type === 'processingEnd') {
      this.canvas.classList.add('active');
      this.download.classList.add('active');
      this.canvas.classList.remove('progress');
    }
  }

  private onImageFileDrop = async (params: { imageFile: File }) => {
    this.worker.postMessage({
      type: 'loadImage',
      file: params.imageFile
    });

    this.closer.classList.add('active');
    this.droppable.hide();
  }

  private onPixelSizeChange = (size: number) => {
    this.pixelSize = size;
    this.worker.postMessage({
      type: 'setPixelSize',
      size,
    })
  }

  private onImageRatioChange = (ratio: number) => {
    this.imageRatio = ratio;
    this.worker.postMessage({
      type: 'setImageRatio',
      ratio,
    })
  }

  private onCloserClick = () => {
    this.worker.postMessage({ type: 'clear' });
    this.droppable.show();
    this.closer.classList.remove('active');
    this.download.classList.remove('active');
    this.canvas.classList.remove('active');
  }

  private onDownload = () => {
    const a = document.createElement('a');
    a.setAttribute('download', 'pixelized.png');
    a.setAttribute('href', this.canvas.toDataURL());
    a.click();
  }
}