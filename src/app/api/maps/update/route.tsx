import { BufferedWriter } from "@/app/lib/BufferedWriter";
import { NextResponse } from "next/server";
import { z } from "zod";
import { promises as fs } from "fs";
import { BufferedReader } from "@/app/lib/BufferedReader";

const updateSchema = z.object({
  name: z.string(),
  permissions: z.number().array().array(),
  backgroundTile: z.number(),
});

export async function POST(req: Request) {
  const result = updateSchema.safeParse(await req.json());
  if (result.error) {
    return NextResponse.json(
      {
        error: "Invalid map provided.",
      },
      { status: 400 }
    );
  }

  const { name, permissions, backgroundTile } = result.data;

  const map = await fs.readFile(`./public/maps/${name}.map`);

  const reader = new BufferedReader(map);
  const writer = new BufferedWriter();

  writer.writeByte(reader.readByte()); // width
  writer.writeByte(reader.readByte()); // height
  writer.writeByte(backgroundTile); // background tile

  const imageCount = reader.readShort();
  writer.writeShort(imageCount);

  for (let i = 0; i < imageCount; i++) {
    writer.writeString(reader.readString());
  }

  for (const row of permissions) {
    for (const permission of row) {
      writer.writeByte(reader.readByte());
      writer.writeByte(permission);
      reader.readByte(); // ignore the old value
    }
  }

  await fs.writeFile(`./public/maps/${name}.map`, writer.getBuffer());

  return NextResponse.json({});
}
