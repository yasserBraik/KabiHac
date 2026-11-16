import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import styles from "./Dialog.module.css";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly labelledBy: string;
  readonly placement?: "side" | "center";
  /** Extra key handling for the dialog content (e.g. arrow keys). Escape and Tab are handled here. */
  readonly onKeyDown?: (event: KeyboardEvent) => void;
  readonly children: ReactNode;
}

/**
 * Modal dialog: traps focus, closes on Escape or backdrop click, restores focus to the opener,
 * and locks page scroll. Rendered into document.body so it sits above every stacking context.
 */
export function Dialog({ open, onClose, labelledBy, placement = "side", onKeyDown, children }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const first = panel.current?.querySelector<HTMLElement>("[data-autofocus]") ?? panel.current;
    first?.focus({ preventScroll: true });
    return () => opener.current?.focus({ preventScroll: true });
  }, [open]);

  // Keyboard handling is attached natively: the dialog element itself is not an interactive control.
  const keyHandler = useRef(onKeyDown);
  keyHandler.current = onKeyDown;
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const node = panel.current;
    if (!open || !node) return;
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close.current();
        return;
      }
      if (event.key === "Tab") {
        // Skip controls inside hidden or inert regions (collapsed panels, inactive tabs).
        const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
          (el) => !el.closest("[hidden], [inert]"),
        );
        const first = items[0];
        const last = items.at(-1);
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      keyHandler.current?.(event);
    };
    node.addEventListener("keydown", handle);
    return () => node.removeEventListener("keydown", handle);
  }, [open]);

  if (!open) return null;

  return createPortal(
    // The backdrop closes the dialog on click; keyboard users close it with Escape (handled on the panel).
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={`${styles.backdrop} ${styles[placement]}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={styles.panel}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
