import { Tile } from "./Tile";
import { BufferedReader } from "../lib/BufferedReader";
import { Canvas } from "./Canvas";
import GLOBALS from "./globals";
import SpriteBank from "./SpriteBank";

export class GameMap {
  area: string;
  width: number;
  height: number;
  tiles: Tile[][];
  canvas: Canvas;
  tileSize: number;
  backgroundTile: number | null = null;

  constructor(
    area: string,
    width: number,
    height: number,
    tiles: Tile[][],
    canvas: Canvas
  ) {
    this.area = area;
    this.width = width;
    this.height = height;
    this.tiles = tiles;
    this.canvas = canvas;
    this.tileSize = 16 * GLOBALS.scale;
  }
  static async loadMap(area: string, buffer: Buffer, canvas: Canvas) {
    const reader = new BufferedReader(buffer);
    const width = reader.readByte();
    const height = reader.readByte();
    const imageCount = reader.readShort();
    const images = [];
    const tiles: Tile[][] = [];

    for (let i = 0; i < imageCount; i++) {
      images.push(reader.readString());
    }

    for (let y = 0; y < height; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < width; x++) {
        row.push({
          id: reader.readByte(),
          permissions: reader.readByte(),
        });
      }
      tiles.push(row);
    }

    await SpriteBank.loadSprites(area, images);

    return new GameMap(area, width, height, tiles, canvas);
  }
  drawMap() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.tiles[y][x];
        this.canvas.drawTile(x, y, SpriteBank.getTile(this.area, tile.id));
      }
    }
  }
  setBackgroundTile(backgroundTile: number) {
    this.backgroundTile = backgroundTile;
  }
}
