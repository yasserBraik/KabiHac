import type { CSSProperties } from "react";
import { getProject, projects } from "@/data/projects";
import { awardForProject } from "@/data/research";
import type { ProjectId } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { ProjectDemo } from "./demos/Demos";
import { Illustration } from "./illustrations/Illustration";
import styles from "./Work.module.css";

interface Props {
  readonly id: ProjectId | null;
  readonly onNavigate: (id: ProjectId) => void;
  readonly onClose: () => void;
}

const TITLE_ID = "project-dialog-title";

export function ProjectDialog({ id, onNavigate, onClose }: Props) {
  if (!id) return null;

  const project = getProject(id);
  const index = projects.findIndex((p) => p.id === id);
  const neighbour = (step: number) => {
    const next = projects[(index + step + projects.length) % projects.length];
    if (!next) throw new Error("Project list is empty");
    return next;
  };
  const previous = neighbour(-1);
  const next = neighbour(1);
  const award = awardForProject(id);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (event.key === "ArrowRight") onNavigate(next.id);
    if (event.key === "ArrowLeft") onNavigate(previous.id);
  };

  return (
    <Dialog open onClose={onClose} labelledBy={TITLE_ID} onKeyDown={onKeyDown}>
      <div className={styles.head}>
        <span>
          Project {index + 1} of {projects.length}
        </span>
        <div className={styles.nav}>
          <Button
            size="icon"
            aria-label={`Previous project: ${previous.name}`}
            onClick={() => onNavigate(previous.id)}
          >
            ←
          </Button>
          <Button size="icon" aria-label={`Next project: ${next.name}`} onClick={() => onNavigate(next.id)}>
            →
          </Button>
          <Button size="icon" aria-label="Close" onClick={onClose} data-autofocus>
            ✕
          </Button>
        </div>
      </div>
      <article className={styles.content} key={id}>
        <p className={styles.org}>
          {project.org} · {project.period}
        </p>
        <h2 className={styles.dialogTitle} id={TITLE_ID}>
          {project.name}
        </h2>
        <figure className={styles.art}>
          <Illustration project={id} tint={project.tint} />
        </figure>
        <dl className={styles.stats} style={{ "--columns": project.figures.length } as CSSProperties}>
          {project.figures.map((figure) => (
            <div key={figure.label}>
              <dt>{figure.label}</dt>
              <dd>{figure.value}</dd>
            </div>
          ))}
        </dl>
        <dl className={styles.facts}>
          <dt>My role</dt>
          <dd>
            {project.role}, {project.team}
          </dd>
          <dt>Problem</dt>
          <dd>{project.problem}</dd>
          <dt>What I did</dt>
          <dd>{project.approach}</dd>
          {project.outcome && (
            <>
              <dt>Outcome</dt>
              <dd>{project.outcome}</dd>
            </>
          )}
          {award && (
            <>
              <dt>Recognition</dt>
              <dd>
                {award.title}, {award.by}, {award.year}
              </dd>
            </>
          )}
          <dt>Stack</dt>
          <dd>
            <ul className={styles.stack}>
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </dd>
          {project.link && (
            <>
              <dt>Link</dt>
              <dd>
                <a href={project.link.href} target="_blank" rel="noopener noreferrer">
                  {project.link.label} ↗
                </a>
              </dd>
            </>
          )}
        </dl>
        <ProjectDemo project={id} />
        <p className={styles.hint}>
          Tip: <kbd>←</kbd> <kbd>→</kbd> move between projects, <kbd>Esc</kbd> closes.
        </p>
      </article>
    </Dialog>
  );
}
