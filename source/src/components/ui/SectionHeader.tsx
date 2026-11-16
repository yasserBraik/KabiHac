import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./SectionHeader.module.css";

interface Props {
  readonly id: string;
  readonly index: number;
  readonly title: string;
  readonly lede: string;
  readonly accent: "sun" | "blue" | "mint" | "coral";
}

/**
 * Section title whose font weight grows as it scrolls into view (a variable-font effect).
 * The effect writes a CSS custom property directly, so scrolling never re-renders React.
 */
export function SectionHeader({ id, index, title, lede, accent }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const node = heading.current;
    if (!node || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = node.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (window.innerHeight - top) / (window.innerHeight * 0.55)));
      node.style.setProperty("--weight", String(Math.round(240 + progress * 500)));
      node.style.setProperty("--width", String(Math.round(75 + progress * 25)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={styles.header}>
      <span className={`${styles.index} ${styles[accent]}`} aria-hidden="true">
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <h2 ref={heading} id={id} className={styles.title}>
          {title}
        </h2>
        <p className={styles.lede}>{lede}</p>
      </div>
    </header>
  );
}
