import { useMemo } from "react";
import { projects, sharedStack, stackCounts } from "@/data/projects";
import { FilterGroup, type FilterOption } from "@/components/ui/FilterGroup";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePortfolio } from "@/state/portfolio-context";
import { ProjectCard } from "./ProjectCard";
import { ProjectDialog } from "./ProjectDialog";
import styles from "./Work.module.css";

const ALL = "All";

export function WorkSection() {
  const { openProject, showProject, closeProject, stackFilter, setStackFilter } = usePortfolio();
  const options = useMemo((): FilterOption<string>[] => {
    const counts = stackCounts();
    return [
      { value: ALL, label: ALL },
      ...sharedStack().map((tech) => ({ value: tech, label: tech, count: counts.get(tech) ?? 0 })),
    ];
  }, []);

  return (
    <section id="work" className="page section" aria-labelledby="work-title">
      <SectionHeader
        id="work-title"
        index={1}
        accent="sun"
        title="Selected work"
        lede="Eight projects. Open any card for the full story and a demo you can try."
      />
      <FilterGroup
        label="Filter projects by stack"
        prefix="Filter by stack"
        options={options}
        value={stackFilter}
        onChange={setStackFilter}
        className={styles.filters}
      />
      <p className="sr-only" role="status">
        {stackFilter === ALL
          ? ""
          : `${options.find((o) => o.value === stackFilter)?.count ?? 0} projects use ${stackFilter}`}
      </p>
      <ul className={styles.grid}>
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard
              project={project}
              dimmed={stackFilter !== ALL && !project.stack.includes(stackFilter)}
              onOpen={() => showProject(project.id)}
            />
          </li>
        ))}
      </ul>
      <ProjectDialog id={openProject} onNavigate={showProject} onClose={closeProject} />
    </section>
  );
}
