import { useEffect } from "react";

let locks = 0;

/** Prevents the page behind a modal from scrolling. Reference-counted so stacked dialogs behave. */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    document.body.style.overflow = "hidden";
    return () => {
      locks -= 1;
      if (locks === 0) document.body.style.overflow = "";
    };
  }, [active]);
}
