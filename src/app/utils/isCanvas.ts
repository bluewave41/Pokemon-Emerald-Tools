import { Canvas } from "../lib/Canvas";

export function isCanvas(value: HTMLCanvasElement | Canvas): value is Canvas {
  return value instanceof Canvas;
}
