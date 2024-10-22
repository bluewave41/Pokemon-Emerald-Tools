import axios from "axios";
import { z } from "zod";

const schema = z.array(z.string());

export async function fetchMapNames() {
  const { data } = await axios.get("/api/maps/names");
  const result = schema.safeParse(data.names);
  if (result.error) {
    throw new Error("Error fetching map names.");
  }
  return result.data;
}
