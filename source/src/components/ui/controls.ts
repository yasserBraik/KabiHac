import styles from "./controls.module.css";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "default" | "small" | "icon";

export interface ButtonStyle {
  readonly variant?: ButtonVariant | undefined;
  readonly size?: ButtonSize | undefined;
}

/** Class list for anything styled as a button. */
export function buttonClass(
  { variant = "secondary", size = "default" }: ButtonStyle = {},
  extra = "",
): string {
  return [styles.button, styles[variant], size !== "default" && styles[size], extra]
    .filter(Boolean)
    .join(" ");
}

export { styles as controls };
