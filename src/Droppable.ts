import EventEmitter from 'eventemitter3';

export class Dropppable {
  dropElement: HTMLElement;
  events = new EventEmitter<{
    'onImageFileDrop': (params: { imageFile: File }) => unknown;
  }>();

  constructor(dropElement: HTMLElement) {
    this.dropElement = dropElement;
  }

  init() {
    this.dropElement.addEventListener('dragover', this.onDragOver);
    this.dropElement.addEventListener('dragleave', this.onDragLeave);
    this.dropElement.addEventListener('drop', this.onDrop);

    return () => {
      this.dropElement.removeEventListener('dragover', this.onDragOver);
      this.dropElement.removeEventListener('dragleave', this.onDragLeave);
      this.dropElement.removeEventListener('drop', this.onDrop);
    }
  }

  private onDragOver = (e: DragEvent) => {
    e.preventDefault();

    this.dropElement.classList.add('over');
  }

  private onDragLeave = () => {
    this.dropElement.classList.remove('over');
  }

  private onDrop = (event: DragEvent) => {
    event.preventDefault();
    this.dropElement.classList.remove('over');

    const items = event.dataTransfer?.items;

    if (!items || items.length === 0) {
      return;
    }

    const file = Array.from(items).find(item => {
      return item.kind === 'file' && /image/.test(item.type);
    });

    if (!file) {
      return;
    }

    const imageFile = file.getAsFile()!;

    this.events.emit('onImageFileDrop', {
      imageFile,
    });
  }

  hide() {
    this.dropElement.classList.remove('active');
  }

  show() {
    this.dropElement.classList.add('active');
  }
}