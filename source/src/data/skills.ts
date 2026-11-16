import type { Skill } from "./types";

export const skills: readonly Skill[] = [
  {
    name: "Product Design",
    level: "Expert",
    years: 18,
    tools: ["Figma", "Design systems", "Prototyping", "Motion design", "Information architecture"],
  },
  {
    name: "Front-End Engineering",
    level: "Expert",
    years: 16,
    tools: ["TypeScript", "JavaScript", "React", "Next.js", "Vue", "Tailwind CSS", "Web Components"],
  },
  {
    name: "User Research",
    level: "Expert",
    years: 14,
    tools: ["Interviews", "Usability testing", "Diary studies", "A/B testing", "Eye-tracking"],
  },
  {
    name: "Accessibility",
    level: "Expert",
    years: 11,
    tools: ["WCAG 2.2 AA", "ARIA", "Screen-reader testing", "Arabic right-to-left accessibility"],
  },
  {
    name: "Back-End and APIs",
    level: "Advanced",
    years: 10,
    tools: ["Node.js", "NestJS", "GraphQL", "REST", "PostgreSQL", "Redis"],
  },
  {
    name: "Leadership",
    level: "Expert",
    years: 9,
    tools: ["Hiring", "Organisation design", "OKRs", "Budgeting", "Stakeholder management", "Mentoring"],
  },
  { name: "Mobile", level: "Advanced", years: 8, tools: ["React Native", "Flutter", "Swift (basic)"] },
  {
    name: "Cloud and DevOps",
    level: "Advanced",
    years: 7,
    tools: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
  },
  {
    name: "Security and Compliance",
    level: "Intermediate",
    years: 6,
    tools: ["Secure development lifecycle", "PCI DSS", "Health-data privacy", "Threat modelling"],
  },
  {
    name: "Data and AI",
    level: "Intermediate",
    years: 5,
    tools: ["Python", "SQL", "Data visualisation", "Recommendation systems", "AI product features"],
  },
];

export const SKILL_YEARS = { min: 5, max: 18 } as const;

/** Map years of practice onto the variable font's weight axis (220–780). */
export function weightForYears(years: number): number {
  const t = (years - SKILL_YEARS.min) / (SKILL_YEARS.max - SKILL_YEARS.min);
  return Math.round(220 + Math.min(1, Math.max(0, t)) * 560);
}
