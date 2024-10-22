"use client";

import { Canvas } from "@/app/lib/Canvas";
import { GameMap } from "@/app/lib/GameMap";
import GLOBALS from "@/app/lib/globals";
import axios from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./page.module.scss";

const colorMap = {
  0: "blue",
  1: "red",
  2: "green",
};

export default function Map() {
  const [ready, setReady] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isSelectingBackgroundTile, setIsSelectingBackgroundTile] =
    useState(false);
  const params = useParams();
  const mapRef = useRef<GameMap>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameCanvasRef = useRef<Canvas>();
  const topCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameTopCanvasRef = useRef<Canvas>();

  const draw = useCallback(() => {
    gameCanvasRef.current?.reset();
    gameTopCanvasRef.current?.reset();
    mapRef.current?.drawMap();

    //draw overlaid tiles
    for (let y = 0; y < mapRef.current.height; y++) {
      for (let x = 0; x < mapRef.current.width; x++) {
        const tile = mapRef.current.tiles[y][x];
        gameTopCanvasRef.current.drawRect(x, y, {
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
      gameCanvasRef.current = new Canvas(canvasRef.current);
      gameTopCanvasRef.current = new Canvas(topCanvasRef.current);

      mapRef.current = await GameMap.loadMap(
        "littleroot/overworld",
        Buffer.from(result.data.map),
        gameCanvasRef.current
      );
      canvasRef.current.width =
        mapRef.current.width * GLOBALS.tileSize * GLOBALS.scale;
      canvasRef.current.height =
        mapRef.current.height * GLOBALS.tileSize * GLOBALS.scale;

      topCanvasRef.current.width =
        mapRef.current.width * GLOBALS.tileSize * GLOBALS.scale;
      topCanvasRef.current.height =
        mapRef.current.height * GLOBALS.tileSize * GLOBALS.scale;
      setReady(true);
    }
    fetch();
  }, [params.name, canvasRef]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    let animationFrameId;
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
    var rect = topCanvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / mapRef.current?.tileSize);
    const y = Math.floor((e.clientY - rect.top) / mapRef.current?.tileSize);
    mapRef.current.tiles[y][x].permissions = activeColor;
  };

  const onMouseDown = (e) => {
    const rect = topCanvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / mapRef.current?.tileSize);
    const y = Math.floor((e.clientY - rect.top) / mapRef.current?.tileSize);
    if (isSelectingBackgroundTile) {
      mapRef.current.backgroundTile = mapRef.current?.tiles[y][x].id;
      document.getElementById("background").innerText =
        mapRef.current.backgroundTile;
      setIsSelectingBackgroundTile(false);
    } else {
      setIsMouseDown(true);
      mapRef.current.tiles[y][x].permissions = activeColor;
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
    <div>
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
        <button className={styles.blue} onClick={() => setActiveColor(0)}>
          0
        </button>
        <button className={styles.red} onClick={() => setActiveColor(1)}>
          1
        </button>
        <button className={styles.green} onClick={() => setActiveColor(2)}>
          2
        </button>
        <button
          id="background"
          onClick={() => setIsSelectingBackgroundTile(true)}
        >
          X
        </button>
        <button onClick={saveMap}>Save</button>
      </div>
    </div>
  );
}
