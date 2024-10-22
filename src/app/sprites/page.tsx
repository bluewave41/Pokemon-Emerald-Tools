"use client";

import axios from "axios";
import { useState } from "react";

export default function Sprites() {
  const [done, setDone] = useState(false);

  const onClick = async () => {
    await axios.post("/api/sprites/parse");
    setDone(true);
  };

  return (
    <div>
      <h1>Sprites</h1>
      <button onClick={onClick}>Build</button>
      {done && <p>Done</p>}
    </div>
  );
}
