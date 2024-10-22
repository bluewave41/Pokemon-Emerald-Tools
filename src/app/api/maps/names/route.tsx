import { promises as fs } from "fs";
import { NextResponse } from "next/server";

export async function GET() {
  const files = (await fs.readdir("./public/maps")).map(
    (file) => file.split(".")[0]
  );
  return NextResponse.json({
    names: files,
  });
}
