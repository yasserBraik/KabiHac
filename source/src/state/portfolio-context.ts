import { createContext, useContext } from "react";
import type { ProjectId, ResearchTab } from "@/data/types";
import type { EvidenceTarget } from "@/lib/fit";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

export interface PortfolioState {
  /** The project open in the detail dialog, mirrored in the URL hash (e.g. #savings) so it can be shared. */
  readonly openProject: ProjectId | null;
  readonly showProject: (id: ProjectId) => void;
  readonly closeProject: () => void;
  readonly stackFilter: string;
  readonly setStackFilter: (tech: string) => void;
  readonly researchTab: ResearchTab;
  readonly setResearchTab: (tab: ResearchTab) => void;
  /** Scrolls to (and if needed opens) the place where a piece of evidence lives. */
  readonly goTo: (target: EvidenceTarget) => void;
}

export const PortfolioContext = createContext<PortfolioState | null>(null);

export function usePortfolio(): PortfolioState {
  const value = useContext(PortfolioContext);
  if (!value) throw new Error("usePortfolio must be used inside <PortfolioProvider>");
  return value;
}

export function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
