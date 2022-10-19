import { EventEmitter } from "eventemitter3";

export class Settings {
  events = new EventEmitter<{
    onPixelSizeChange: (size: number) => unknown;
    onRatioChange: (ratio: number) => unknown;
  }>();

  pixelSizeElement = document.getElementById('pixel-size') as HTMLInputElement;
  pixelSizeValueElement = document.getElementById('pixel-size-value') as HTMLSpanElement;
  imageRatioElement = document.getElementById('image-ratio') as HTMLInputElement;
  imageRatioValueElement = document.getElementById('image-ratio-value') as HTMLSpanElement;

  init() {
    this.pixelSizeElement.addEventListener('change', this.onPixelSizeChange);
    this.imageRatioElement.addEventListener('change', this.onImageRatioChange);

    this.pixelSizeElement.dispatchEvent(new Event('change'));
    this.imageRatioElement.dispatchEvent(new Event('change'));

    return () => {
      this.pixelSizeElement.removeEventListener('change', this.onPixelSizeChange);
      this.imageRatioElement.removeEventListener('change', this.onImageRatioChange);
    }
  }

  onPixelSizeChange = () => {
    const value = this.pixelSizeElement.value;
    this.pixelSizeValueElement.textContent = `${value}px`;
    this.events.emit('onPixelSizeChange', parseInt(value, 10));
  }

  onImageRatioChange = () => {
    const value = parseFloat(this.imageRatioElement.value);
    this.imageRatioValueElement.textContent = `${(value * 100).toFixed(0)}%`;
    this.events.emit('onRatioChange', value);
  }
}