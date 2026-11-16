import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { buttonClass, type ButtonStyle } from "./controls";

export function Button({
  variant,
  size,
  className = "",
  type = "button",
  ...props
}: ButtonStyle & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonClass({ variant, size }, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className = "",
  children,
  ...props
}: ButtonStyle & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClass({ variant, size }, className)} {...props}>
      {children}
    </a>
  );
}
