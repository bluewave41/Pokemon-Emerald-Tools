import { Jimp } from "jimp";
import { promises as fs } from "fs";
import { BufferedWriter } from "@/app/lib/BufferedWriter";
import { NextResponse } from "next/server";

export async function POST() {
  const images = await fs.readdir("./public/images");
  for (const image of images) {
    await parseImage(`./public/images/${image}`, image.split(".")[0]);
  }

  return NextResponse.json({
    count: images.length,
  });
}

async function parseImage(path: string, fileName: string) {
  const hashes: string[] = [];
  const images = [];
  const map = [];
  const image = await Jimp.read(await fs.readFile(path));
  for (let y = 0; y < image.bitmap.height; y += 16) {
    const row = [];
    for (let x = 0; x < image.bitmap.width; x += 16) {
      const piece = image.clone().crop({ x, y, w: 16, h: 16 });
      const hash = piece.hash();
      if (!hashes.includes(hash)) {
        hashes.push(hash);
        images.push(await piece.getBase64("image/png"));
      }
      row.push(hashes.indexOf(hash) + 1);
    }
    map.push(row);
  }

  const m = new BufferedWriter();
  m.writeByte(image.bitmap.width / 16);
  m.writeByte(image.bitmap.height / 16);

  m.writeShort(images.length);
  for (const image of images) {
    m.writeString(image);
  }

  for (const row of map) {
    for (const tile of row) {
      m.writeByte(tile);
      m.writeByte(0);
    }
  }

  await fs.writeFile(`./public/maps/${fileName}.map`, m.getBuffer());
}
