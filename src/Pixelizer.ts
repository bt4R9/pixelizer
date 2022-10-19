import { Particle } from "./Particle";

export interface PixelizerParams {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
}

export class Pixelizer {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;

  constructor(params: PixelizerParams) {
    const { pixels, width, height } = params;
    this.pixels = pixels;
    this.width = width;
    this.height = height;
  }

  average(y: number, x: number, size: number) {
    let R = 0;
    let G = 0;
    let B = 0;
    let A = 0;

    let count = 0;

    for (let dy = y; y < Math.min(this.height, y + size); y++) {
      for (let dx = x; x < Math.min(this.width, x + size); x++) {
        count += 1;
        const index = (dy * this.width + dx) * 4;

        const r = this.pixels[index];
        const g = this.pixels[index + 1];
        const b = this.pixels[index + 2];
        const a = this.pixels[index + 3];

        R += r;
        G += g;
        B += b;
        A += a;
      }
    }

    R = R / count | 0;
    G = G / count | 0;
    B = B / count | 0;
    A = A / count / 255;

    return {
      r: R,
      g: G,
      b: B,
      a: A,
    };
  }

  pixelize(params: { pixelSize: number; ratio: number }) {
    const { pixelSize, ratio } = params;
    const particles: Particle[] = [];

    for (let y = 0; y < this.height; y += pixelSize) {
      for (let x = 0; x < this.width; x += pixelSize) {
        const { r, g, b, a } = this.average(y, x, pixelSize);

        if (a !== 0) {
          const ny = Math.ceil(Math.floor(y * ratio) / pixelSize) * pixelSize;
          const nx = Math.ceil(Math.floor(x * ratio) / pixelSize) * pixelSize;

          particles.push(new Particle({ y: ny, x: nx, r, g, b, a, size: pixelSize }));
        }
      }
    }

    return particles;
  }
}