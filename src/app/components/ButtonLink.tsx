import { Icon, IconName } from "./Icon";
import Link from "next/link";

import styles from "./ButtonLink.module.scss";

interface ButtonLinkProps {
  variant: "primary" | "secondary";
  icon?: IconName;
  label: string;
  to: string;
}

export function ButtonLink({ icon, variant, label, to }: ButtonLinkProps) {
  return (
    <Link className={styles.button} href={to}>
      {icon && <Icon name={icon} variant={variant} />}
      <p>{label}</p>
    </Link>
  );
}
