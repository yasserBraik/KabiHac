import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { isProjectId } from "@/data/projects";
import type { ProjectId, ResearchTab } from "@/data/types";
import type { EvidenceTarget } from "@/lib/fit";
import { PortfolioContext, scrollToSection, type PortfolioState } from "./portfolio-context";

function projectFromHash(): ProjectId | null {
  const id = window.location.hash.slice(1);
  return isProjectId(id) ? id : null;
}

function replaceHash(hash: string): void {
  try {
    history.replaceState(null, "", hash ? `#${hash}` : window.location.pathname + window.location.search);
  } catch {
    // Some sandboxed hosts block history access; the dialog still works without the shareable hash.
  }
}

export function PortfolioProvider({ children }: { readonly children: ReactNode }) {
  const [openProject, setOpenProject] = useState<ProjectId | null>(projectFromHash);
  const [stackFilter, setStackFilter] = useState("All");
  const [researchTab, setResearchTab] = useState<ResearchTab>("awards");

  useEffect(() => {
    const onHashChange = () => {
      const id = projectFromHash();
      if (id) setOpenProject(id);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const showProject = useCallback((id: ProjectId) => {
    setOpenProject(id);
    replaceHash(id);
  }, []);

  const closeProject = useCallback(() => {
    setOpenProject(null);
    replaceHash("");
  }, []);

  const goTo = useCallback(
    (target: EvidenceTarget) => {
      if (target.kind === "project") {
        showProject(target.id);
        return;
      }
      if (target.tab) setResearchTab(target.tab);
      requestAnimationFrame(() => scrollToSection(target.id));
    },
    [showProject],
  );

  const value = useMemo<PortfolioState>(
    () => ({
      openProject,
      showProject,
      closeProject,
      stackFilter,
      setStackFilter,
      researchTab,
      setResearchTab,
      goTo,
    }),
    [openProject, showProject, closeProject, stackFilter, researchTab, goTo],
  );
  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}
