import Map from "../icons/map.svg";
import Link from "next/link";

import styles from "./Sidebar.module.scss";
import { ButtonLink } from "./ButtonLink";

export function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h1>Pokemon</h1>
      <hr className={styles.divider} />
      <div className={styles.items}>
        <ButtonLink variant="secondary" label="Maps" to="/map" icon="map" />
        <ButtonLink
          variant="secondary"
          label="Images"
          to="/image"
          icon="image"
        />
        <ButtonLink
          variant="secondary"
          label="Sprites"
          to="/sprites"
          icon="image"
        />
      </div>
    </div>
  );
}
