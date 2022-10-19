export class ImageReader {
  imageFile: File;

  constructor(imageFile: File) {
    this.imageFile = imageFile;
  }

  async read() {
    const base64 = await this.readAsBase64();
    const image = await this.readImage(base64);

    return image;
  }

  readAsBase64() {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(this.imageFile);

      reader.onload = (e) => {
        resolve(e.target!.result as string);
      };

      reader.onerror = (e) => {
        reject(e);
      }
    });
  }

  readImage(base64: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = base64;

      img.onload = () => {
        resolve(img);
      }

      img.onerror = (e) => {
        reject(e);
      }
    });
  }
}