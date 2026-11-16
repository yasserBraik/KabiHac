import { useState } from "react";
import { profile } from "@/data/profile";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { CvLink } from "./CvLink";
import { NAV_SECTIONS } from "./sections";
import { SummaryDialog } from "./SummaryDialog";
import styles from "./Layout.module.css";

const SPY_IDS = ["top", ...NAV_SECTIONS.map((s) => s.id)];

export function Header() {
  const active = useScrollSpy(SPY_IDS);
  const progress = useScrollProgress();
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const night = theme === "night";

  const openSummary = () => {
    setMenuOpen(false);
    setSummaryOpen(true);
  };

  return (
    <>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <header className={styles.header}>
        <div className={`page ${styles.bar}`}>
          <a className={styles.brand} href="#top">
            {profile.name}
          </a>
          <nav className={styles.nav} aria-label="Sections">
            <ul>
              {NAV_SECTIONS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined}>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.actions}>
            <Button
              size="icon"
              className={styles.theme}
              aria-pressed={night}
              aria-label="Night mode"
              title="Switch between day and night"
              onClick={toggleTheme}
            >
              <span aria-hidden="true">{night ? "☀" : "☾"}</span>
            </Button>
            <Button size="small" className={styles.wideOnly} onClick={openSummary} aria-haspopup="dialog">
              Quick summary
            </Button>
            <CvLink variant="primary" size="small" className={styles.desktopOnly} />
            <Button
              size="small"
              className={styles.menuButton}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              Menu
            </Button>
          </div>
        </div>
        <div className={styles.progress} style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      </header>

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} labelledBy="menu-title" placement="side">
        <div className={styles.menu}>
          <div className={styles.menuHead}>
            <span id="menu-title">Menu</span>
            <Button size="icon" aria-label="Close menu" onClick={() => setMenuOpen(false)} data-autofocus>
              ✕
            </Button>
          </div>
          <nav aria-label="Sections">
            {NAV_SECTIONS.map((section) => (
              <a key={section.id} href={`#${section.id}`} onClick={() => setMenuOpen(false)}>
                {section.label}
              </a>
            ))}
          </nav>
          <div className={styles.menuMore}>
            <Button variant="primary" onClick={openSummary}>
              Quick summary
            </Button>
            <CvLink />
          </div>
        </div>
      </Dialog>
      <SummaryDialog open={summaryOpen} onClose={() => setSummaryOpen(false)} />
    </>
  );
}
