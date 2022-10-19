export interface ParticleParams {
  y: number;
  x: number;

  r: number;
  g: number;
  b: number;
  a: number;

  size: number;
}

export class Particle {
  y: number;
  x: number;

  color: string;
  size: number;

  constructor(params: ParticleParams) {
    const { r, g, b, a, size } = params;

    this.y = params.y;
    this.x = params.x;

    this.color = `rgba(${r}, ${g}, ${b}, ${a})`;
    this.size = size;
  }
}