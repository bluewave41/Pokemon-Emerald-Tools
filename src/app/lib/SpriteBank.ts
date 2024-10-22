import { maps } from "../interfaces/Maps";

class InternalSprteBank {
  tiles: Record<string, Record<string, Record<number, HTMLImageElement>>>;

  constructor() {
    const tiles: Record<string, Record<string, string>> = {};
    for (const map of maps) {
      tiles[map] = {};
    }
    this.tiles = tiles;
  }
  async loadSprites(area: string, images: string[]) {
    const [map, subArea] = area.split("/");
    const self = this;
    const promises = [];

    this.tiles[map][subArea] = {};

    for (let i = 0; i < images.length; i++) {
      promises.push(
        new Promise<void>((resolve) => {
          const index = i;
          const image = new Image();
          image.onload = function () {
            self.tiles[map][subArea][index + 1] = image;
            resolve();
          };

          image.src = images[i];
        })
      );
    }
    return await Promise.all(promises);
  }
  getTile(key: string, id: number) {
    const [area, subArea] = key.split("/");
    return this.tiles[area][subArea][id];
  }
  getBank(key: string) {
    const [area, subArea] = key.split("/");
    return this.tiles[area][subArea];
  }
}

const SpriteBank = new InternalSprteBank();
export default SpriteBank;
