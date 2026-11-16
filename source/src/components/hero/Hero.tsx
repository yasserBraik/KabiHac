import { headlineFigures, profile } from "@/data/profile";
import { ButtonLink } from "@/components/ui/Button";
import { ReactiveName } from "./ReactiveName";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="top" className={`page ${styles.hero}`} aria-label="Introduction">
      <p className={styles.row}>
        <span className={styles.hello}>Hello, I’m Yara</span>
        <span className={styles.live}>{profile.currentRole}</span>
        <span>{profile.location}</span>
      </p>
      <ReactiveName lines={["Yara", "Al-Mansouri"]} label={profile.name} />
      <div className={styles.intro}>
        <p className={styles.headline}>
          I design, build and research products that feel natural in Arabic <em>and</em> English.
        </p>
        <div>
          <p className={styles.copy}>{profile.intro}</p>
          <div className={styles.actions}>
            <ButtonLink variant="primary" href="#work">
              See my work
            </ButtonLink>
            <ButtonLink href="#contact">Get in touch</ButtonLink>
          </div>
        </div>
      </div>
      <dl className={styles.stats} aria-label="Career highlights">
        {headlineFigures.map((figure) => (
          <div key={figure.label} className={styles.stat}>
            <dt>{figure.label}</dt>
            <dd>{figure.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
