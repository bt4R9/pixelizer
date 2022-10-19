import { Particle } from "./Particle";

export class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  particles: Particle[] = [];
  ratio: number = 1;
  pixelSize: number = 4;

  width: number = 0;
  height: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d')!;
  }

  draw() {
    this.canvas.width = Math.ceil(this.width * this.ratio);
    this.canvas.height = Math.ceil(this.height * this.ratio);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const particle of this.particles) {
      const { y, x, color } = particle;

      this.context.fillStyle = color;
      this.context.fillRect(x, y, this.pixelSize, this.pixelSize);
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}