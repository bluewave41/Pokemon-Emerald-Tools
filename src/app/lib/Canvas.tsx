import GLOBALS from "./globals";

interface CanvasOptions {
  color?: string;
  opacity?: number;
}

export class Canvas {
  innerCanvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  tileSize: number;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw Error("Couldn't create context for canvas.");
    }
    this.innerCanvas = canvas;
    this.context = context;
    this.tileSize = 16 * GLOBALS.scale;
  }
  reset() {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.context.globalAlpha = 1;
  }
  drawTile(x: number, y: number, image: HTMLImageElement) {
    this.context.drawImage(
      image,
      x * GLOBALS.tileSize * GLOBALS.scale,
      y * GLOBALS.tileSize * GLOBALS.scale,
      this.tileSize,
      this.tileSize
    );
  }
  drawRect(x: number, y: number, options?: CanvasOptions) {
    if (options?.color) {
      this.context.fillStyle = options.color;
    }
    if (options?.opacity) {
      this.context.globalAlpha = options.opacity;
    }
    this.context.fillRect(
      x * GLOBALS.tileSize * GLOBALS.scale,
      y * GLOBALS.tileSize * GLOBALS.scale,
      this.tileSize,
      this.tileSize
    );
  }
}
