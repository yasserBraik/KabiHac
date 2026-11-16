import { useId, useMemo, useState } from "react";
import { experience, experienceKinds } from "@/data/experience";
import { getProject } from "@/data/projects";
import type { ExperienceEntry, ExperienceKind } from "@/data/types";
import { controls } from "@/components/ui/controls";
import { FilterGroup } from "@/components/ui/FilterGroup";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePortfolio } from "@/state/portfolio-context";
import styles from "./Experience.module.css";

type Filter = ExperienceKind | "all";
const BADGE: Record<ExperienceKind, string | null> = {
  role: null,
  startup: "Startup",
  community: "Community",
};

function Entry({ entry, defaultOpen }: { entry: ExperienceEntry; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const { showProject } = usePortfolio();
  const badge = BADGE[entry.kind];
  return (
    <li className={styles.item}>
      <p className={styles.when}>
        <strong>{entry.from}</strong>
        {entry.to ? `to ${entry.to}` : <span className={`${styles.badge} ${styles.now}`}>Now</span>}
      </p>
      <div>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <h3 className={styles.title}>
            <span>
              {entry.title}
              {badge && <span className={`${styles.badge} ${styles[entry.kind]}`}>{badge}</span>}
            </span>
            <span className={styles.plus} aria-hidden="true">
              +
            </span>
          </h3>
          <span className={styles.org}>{entry.org}</span>
        </button>
        <div id={panelId} className={styles.panel} data-open={open} inert={!open}>
          <div>
            <ul className={styles.points}>
              {entry.points.map((point) => (
                <li key={point.text}>
                  <strong>{point.label}</strong>
                  {point.text}
                </li>
              ))}
            </ul>
            {entry.projects && (
              <p className={styles.related}>
                Projects from this role
                {entry.projects.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={controls.linkChip}
                    onClick={() => showProject(id)}
                  >
                    {getProject(id).name}
                  </button>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export function ExperienceSection() {
  const [filter, setFilter] = useState<Filter>("all");
  const options = useMemo(
    () => [
      { value: "all" as const, label: "Everything", count: experience.length },
      ...experienceKinds.map(({ kind, label }) => ({
        value: kind,
        label,
        count: experience.filter((e) => e.kind === kind).length,
      })),
    ],
    [],
  );
  const visible = filter === "all" ? experience : experience.filter((e) => e.kind === filter);

  return (
    <section id="experience" className="page section" aria-labelledby="experience-title">
      <SectionHeader
        id="experience-title"
        index={2}
        accent="coral"
        title="Experience"
        lede="Written like a release changelog: newest first, with what I added and improved."
      />
      <FilterGroup
        label="Filter experience"
        options={options}
        value={filter}
        onChange={setFilter}
        className={styles.filters}
      />
      <ol className={styles.list}>
        {visible.map((entry) => (
          <Entry key={entry.id} entry={entry} defaultOpen={entry.id === experience[0]?.id} />
        ))}
      </ol>
    </section>
  );
}
