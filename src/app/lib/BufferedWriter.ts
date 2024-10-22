export class BufferedWriter {
  buffer: Buffer;
  index: number = 0;

  constructor() {
    this.buffer = Buffer.alloc(30000);
  }
  writeByte(b: number) {
    this.buffer.writeUInt8(b, this.index++);
  }
  writeShort(s: number) {
    this.buffer.writeUInt16LE(s, this.index);
    this.index += 2;
  }
  writeString(str: string) {
    this.writeShort(str.length);
    for (const c of str) {
      this.writeByte(c.charCodeAt(0));
    }
  }
  setIndex(index: number) {
    this.index = index;
  }
  getBuffer() {
    return this.buffer.subarray(0, this.index);
  }
}
