import { BufferedWriter } from "@/app/lib/BufferedWriter";
import { promises as fs } from "fs";
import { Jimp } from "jimp";
import { NextResponse } from "next/server";

export async function POST() {
  const folders = (await fs.readdir("./public/sprites")).filter(
    (el) => !el.endsWith(".pack")
  );
  for (const folder of folders) {
    await scanFolder(`./public/sprites/${folder}`);
  }
  return NextResponse.json({});
}

async function scanFolder(folder: string) {
  const subFolder = (await fs.readdir(folder)).filter(
    (el) => !el.endsWith(".pack")
  );
  for (const sf of subFolder) {
    const stat = await fs.stat(folder + "/" + sf);
    if (stat.isDirectory()) {
      await scanFolder(folder + "/" + sf);
    } else {
      // subFolder will be a list of images
      const writer = new BufferedWriter();
      writer.writeShort(subFolder.length);
      for (const file of subFolder) {
        const image = await Jimp.read(folder + "/" + file);
        writer.writeString(file.split(".")[0]);
        writer.writeString(await image.getBase64("image/png"));
      }

      await fs.writeFile(`${folder}.pack`, writer.getBuffer());
      break;
    }
  }
}
