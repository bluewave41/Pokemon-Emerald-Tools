"use client";

import axios from "axios";
import { Wrapper } from "../components/Wrapper";
import { useState } from "react";

export default function Page() {
  const [count, setCount] = useState<number | null>(null);

  const onClick = async () => {
    const response = await axios.post("/api/images/parse");
    setCount(response.data.count);
  };
  return (
    <Wrapper>
      <h1>Images</h1>
      <button onClick={onClick}>Parse</button>
      {count && <p>{count} maps created.</p>}
    </Wrapper>
  );
}
