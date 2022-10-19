export class WorkerImageLoader {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
  }

  async load(image: File) {
    const bitmap = await self.createImageBitmap(image);

    this.canvas.width = bitmap.width;
    this.canvas.height = bitmap.height;

    this.context.clearRect(0, 0, bitmap.width, bitmap.height);
    this.context.drawImage(bitmap, 0, 0);

    const pixels = this.context.getImageData(0, 0, bitmap.width, bitmap.height).data;

    return {
      pixels,
      width: bitmap.width,
      height: bitmap.height,
    };
  }
}