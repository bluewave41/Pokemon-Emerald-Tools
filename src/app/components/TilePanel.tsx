import { Tile } from "../lib/Tile";

interface TilePanelProps {
  selectedTile: Tile | null;
}

export function TilePanel({ selectedTile }: TilePanelProps) {
  if (!selectedTile) {
    return null;
  }

  const permissions = selectedTile.getPermissions();

  return (
    <div>
      <h1>Tile</h1>
      <h2>{permissions.label}</h2>
      <p>X: {selectedTile.x}</p>
      <p>Y: {selectedTile.y}</p>
      <p>Permissions: {selectedTile.permissions}</p>
      <p>ID: {selectedTile.id}</p>
      <label>Interact Text: </label>
      {permissions.interactable && <input type="text" />}
    </div>
  );
}
