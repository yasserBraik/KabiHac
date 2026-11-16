import { useRef, type PointerEvent } from "react";
import { awardForProject } from "@/data/research";
import type { Project } from "@/data/types";
import { useInView } from "@/hooks/useInView";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { Illustration } from "./illustrations/Illustration";
import styles from "./Work.module.css";

const MAX_TILT_DEG = { x: 6, y: 8 };

interface Props {
  readonly project: Project;
  readonly dimmed: boolean;
  readonly onOpen: () => void;
}

export function ProjectCard({ project, dimmed, onOpen }: Props) {
  const [ref, inView] = useInView<HTMLElement>(0.35);
  const tilt = useRef(false);
  const titleId = `project-${project.id}-title`;
  const award = awardForProject(project.id);

  // Tilt is purely decorative: only for fine pointers and when motion is allowed.
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tilt.current = true;
    card.dataset.tilting = "true";
    card.style.setProperty("--ry", `${(x * 2 * MAX_TILT_DEG.y).toFixed(2)}deg`);
    card.style.setProperty("--rx", `${(-y * 2 * MAX_TILT_DEG.x).toFixed(2)}deg`);
  };
  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (!tilt.current) return;
    const card = event.currentTarget;
    card.dataset.tilting = "false";
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--rx", "0deg");
  };

  return (
    <article
      ref={ref}
      className={styles.card}
      data-dimmed={dimmed}
      aria-labelledby={titleId}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <figure className={styles.figure}>
        <Illustration project={project.id} tint={project.tint} drawn={inView} />
      </figure>
      <div className={styles.tags}>
        <span>{project.period}</span>
        {award && <span className={styles.award}>★ Award</span>}
      </div>
      <div className={styles.body}>
        <p className={styles.meta}>
          <span>{project.org.split(",")[0]}</span>
          <span>{project.role}</span>
        </p>
        <h3 className={styles.title} id={titleId}>
          <button type="button" className={styles.open} onClick={onOpen} aria-haspopup="dialog">
            {project.name}
          </button>
        </h3>
        <p className={styles.summary}>{project.summary}</p>
        <dl className={styles.figures}>
          {project.figures.slice(0, 2).map((figure) => (
            <div key={figure.label}>
              <dt>{figure.label}</dt>
              <dd>{figure.value}</dd>
            </div>
          ))}
        </dl>
        <span className={styles.more} aria-hidden="true">
          Read the story
        </span>
      </div>
    </article>
  );
}
