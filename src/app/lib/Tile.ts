import { PERMISSIONS } from "./Permissions";

export class Tile {
  x: number;
  y: number;
  id: number;
  permissions: number;

  constructor(x: number, y: number, id: number, permissions: number) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.permissions = permissions;
  }
  getPermissions() {
    return PERMISSIONS[this.permissions];
  }
}
