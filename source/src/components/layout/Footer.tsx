import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./Layout.module.css";

export function Footer() {
  return (
    <footer className={`page ${styles.footer}`}>
      <p>© 2026 {profile.fullName} · Set in Bricolage Grotesque and Newsreader</p>
      <p>
        Portfolio Summit 2026 entry. Organisations, credential IDs and .example links come from a fictional
        competition CV.
      </p>
    </footer>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      className={styles.toTop}
      data-visible={visible}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label="Back to the top"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        document.querySelector<HTMLElement>("#main")?.focus({ preventScroll: true });
      }}
    >
      ↑
    </button>
  );
}
