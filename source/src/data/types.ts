/**
 * Content model. Every fact on the site comes from the CV and lives in exactly one module.
 * Cross-references use ids, never copied text.
 */

export const PROJECT_IDS = [
  "mizan",
  "telemedicine",
  "hirfa",
  "khatt",
  "savings",
  "qalam",
  "dalil",
  "rafeeq",
] as const;
export type ProjectId = (typeof PROJECT_IDS)[number];

export const SECTION_IDS = ["top", "work", "experience", "skills", "research", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export type ResearchTab = "awards" | "writing" | "talks" | "education" | "certifications";

/** A figure shown as a big number with a short label, such as "38%" / "faster UI builds". */
export interface Figure {
  readonly value: string;
  readonly label: string;
}

export type Tint = "sun" | "blue" | "mint" | "coral";

export interface Project {
  readonly id: ProjectId;
  readonly name: string;
  readonly org: string;
  readonly period: string;
  readonly role: string;
  readonly team: string;
  /** One-line description for the card. Must not repeat the problem statement. */
  readonly summary: string;
  /** Two or three figures. The card shows the first two. */
  readonly figures: readonly [Figure, Figure, ...Figure[]];
  readonly problem: string;
  readonly approach: string;
  /** Only facts not already given by the figures or by the linked award. */
  readonly outcome?: string;
  readonly stack: readonly string[];
  readonly link?: { readonly label: string; readonly href: string };
  readonly tint: Tint;
}

export type ExperienceKind = "role" | "startup" | "community";

export interface ExperienceEntry {
  readonly id: string;
  readonly kind: ExperienceKind;
  readonly from: string;
  /** Omit for ongoing positions. */
  readonly to?: string;
  readonly title: string;
  readonly org: string;
  readonly points: readonly { readonly label: string; readonly text: string }[];
  readonly projects?: readonly ProjectId[];
}

export type SkillLevel = "Expert" | "Advanced" | "Intermediate";

export interface Skill {
  readonly name: string;
  readonly level: SkillLevel;
  readonly years: number;
  readonly tools: readonly string[];
}

export interface Award {
  readonly year: number;
  readonly title: string;
  readonly by: string;
  readonly project?: ProjectId;
}

export interface Citation {
  readonly title: string;
  readonly detail: string;
}

export interface Degree {
  readonly period: string;
  readonly title: string;
  readonly institution: string;
  readonly notes: readonly string[];
}

export type CertStatus = "active" | "lifetime" | "expired" | "in-progress";

export interface Certification {
  readonly name: string;
  readonly issuer: string;
  readonly year: number;
  readonly status: CertStatus;
  /** Credential ID, or a note for certifications still in progress. */
  readonly credential: string;
  readonly expired?: number;
}

export interface ProfileLink {
  readonly label: string;
  readonly href: string;
}
