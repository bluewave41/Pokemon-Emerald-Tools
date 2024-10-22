"use client";

import { useEffect, useState } from "react";
import { fetchMapNames } from "../promises/fetchMapNames";
import { ButtonLink } from "../components/ButtonLink";

import styles from "./page.module.scss";

export default function Map() {
  const [maps, setMaps] = useState<string[]>([]);
  useEffect(() => {
    async function fetch() {
      const names = await fetchMapNames();
      setMaps(names);
    }
    fetch();
  }, []);

  if (!maps) {
    return null;
  }

  return (
    <div>
      <h1>Maps</h1>
      <div>
        {maps.map((map) => (
          <div key={map} className={styles.row}>
            <div className={styles.row}>
              <ButtonLink
                label={map}
                variant="primary"
                icon="map"
                to={`/map/${map}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
