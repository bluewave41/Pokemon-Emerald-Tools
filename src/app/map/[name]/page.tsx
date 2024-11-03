"use client";

import { Canvas } from "@/app/lib/Canvas";
import { GameMap } from "@/app/lib/GameMap";
import GLOBALS from "@/app/lib/globals";
import axios from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { TilePanel } from "@/app/components/TilePanel";

import styles from "./page.module.scss";
import { isCanvas } from "@/app/utils/isCanvas";
import { Tile } from "@/app/lib/Tile";

const colorMap = {
  0: "blue",
  1: "red",
  2: "green",
  3: "yellow",
};

export default function Map() {
  const [ready, setReady] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isSelectingBackgroundTile, setIsSelectingBackgroundTile] = useState({
    selecting: false,
    background: -1,
  });
  const [selectedTile, setSelectedTile] = useState<{
    selecting: boolean;
    tile: Tile | null;
  }>({
    selecting: false,
    tile: null,
  });
  const params = useParams();
  const mapRef = useRef<GameMap>();

  const canvasRef = useRef<HTMLCanvasElement | Canvas>();
  const topCanvasRef = useRef<HTMLCanvasElement | Canvas>();

  const getRefs = () => {
    const map = mapRef.current;
    const canvas = canvasRef.current;
    const topCanvas = topCanvasRef.current;

    // Are they initialized?
    if (!map || !canvas || !topCanvas) {
      throw new Error("Refs aren't initialized!");
    }

    if (!isCanvas(canvas) || !isCanvas(topCanvas)) {
      throw new Error("Refs are wrong type!");
    }

    return { map, canvas, topCanvas };
  };

  const draw = useCallback(() => {
    const { map, canvas, topCanvas } = getRefs();

    canvas.reset();
    topCanvas.reset();
    map.drawMap();

    //draw overlaid tiles
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.tiles[y][x];
        canvas.drawRect(x, y, {
          color: colorMap[tile.permissions],
          opacity: 0.5,
        });
      }
    }
  }, []);

  useEffect(() => {
    async function fetch() {
      if (!canvasRef.current || !topCanvasRef.current) {
        return;
      }
      const result = await axios.post("/api/maps", { name: params.name });
      canvasRef.current = new Canvas(canvasRef.current as HTMLCanvasElement);
      topCanvasRef.current = new Canvas(
        topCanvasRef.current as HTMLCanvasElement
      );

      mapRef.current = await GameMap.loadMap(
        "littleroot/overworld",
        Buffer.from(result.data.map),
        canvasRef.current
      );

      const { canvas, topCanvas } = getRefs();

      canvas.innerCanvas.width =
        mapRef.current.width * GLOBALS.tileSize * GLOBALS.scale;
      canvas.innerCanvas.height =
        mapRef.current.height * GLOBALS.tileSize * GLOBALS.scale;

      topCanvas.innerCanvas.width =
        mapRef.current.width * GLOBALS.tileSize * GLOBALS.scale;
      topCanvas.innerCanvas.height =
        mapRef.current.height * GLOBALS.tileSize * GLOBALS.scale;
      setReady(true);
    }
    fetch();
  }, [params.name, canvasRef]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    let animationFrameId: number = 0;

    const render = () => {
      draw();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, ready]);

  const onMouseMove = (e) => {
    if (!isMouseDown) {
      return;
    }

    const { map, topCanvas } = getRefs();
    const rect = topCanvas.innerCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / map.tileSize);
    const y = Math.floor((e.clientY - rect.top) / map.tileSize);
    map.tiles[y][x].permissions = activeColor;
  };

  const onMouseDown = (e) => {
    console.log(selectedTile);
    const { map, topCanvas } = getRefs();

    const rect = topCanvas.innerCanvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / map.tileSize);
    const y = Math.floor((e.clientY - rect.top) / map.tileSize);
    if (isSelectingBackgroundTile.selecting) {
      map.backgroundTile = mapRef.current?.tiles[y][x].id;
      document.getElementById("background").innerText = map.backgroundTile;
      setIsSelectingBackgroundTile({
        ...isSelectingBackgroundTile,
        selecting: false,
      });
    } else if (selectedTile.selecting) {
      console.log("ttt");
      setSelectedTile({
        selecting: false,
        tile: map.getTile(x, y),
      });
    } else {
      setIsMouseDown(true);
      map.tiles[y][x].permissions = activeColor;
    }
  };

  const onMouseUp = () => {
    setIsMouseDown(false);
  };

  const saveMap = async () => {
    await axios.post("/api/maps/update", {
      permissions: mapRef.current?.tiles.map((row) =>
        row.map((tile) => tile.permissions)
      ),
      name: mapRef.current?.area.split("/")[0],
      backgroundTile: mapRef.current?.backgroundTile,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftCol}>
        <h1>Map</h1>
        <div style={{ position: "relative" }}>
          <canvas ref={canvasRef} />
          <canvas
            ref={topCanvasRef}
            className={styles.topCanvas}
            onMouseMove={onMouseMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          />
        </div>
        <div className={styles.row}>
          <button
            onClick={() =>
              setSelectedTile({
                ...selectedTile,
                selecting: true,
              })
            }
          >
            S
          </button>
          <button className={styles.blue} onClick={() => setActiveColor(0)}>
            0
          </button>
          <button className={styles.red} onClick={() => setActiveColor(1)}>
            1
          </button>
          <button className={styles.green} onClick={() => setActiveColor(2)}>
            2
          </button>
          <button className={styles.yellow} onClick={() => setActiveColor(3)}>
            3
          </button>
          <button
            id="background"
            onClick={() =>
              setIsSelectingBackgroundTile({
                ...isSelectingBackgroundTile,
                selecting: true,
              })
            }
          >
            X
          </button>
          <button onClick={saveMap}>Save</button>
        </div>
      </div>
      <div className={styles.rightCol}>
        <TilePanel selectedTile={selectedTile.tile} />
      </div>
    </div>
  );
}
