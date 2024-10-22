import MapIcon from "../icons/map.svg";
import ImageIcon from "../icons/image.svg";
import cn from "classnames";

import styles from "./Icon.module.scss";

export type IconName = "map" | "image";

interface IconProps {
  name: IconName;
  variant: "primary" | "secondary";
}

export function Icon({ name, variant }: IconProps) {
  const klass = variant === "primary" ? styles.primary : styles.secondary;

  switch (name) {
    case "map":
      return <MapIcon className={cn(styles.icon, klass)} />;
    case "image":
      return <ImageIcon className={cn(styles.icon, klass)} />;
  }
}
