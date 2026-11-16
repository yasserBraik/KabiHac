import type { Project, ProjectId } from "./types";

export const projects: readonly Project[] = [
  {
    id: "mizan",
    name: "Mizan Design System",
    org: "Faseela Ventures",
    period: "2023 – 2025",
    role: "Lead designer and engineer",
    team: "team of 6",
    summary: "The bilingual design system behind a 4.2M-user fintech super-app.",
    figures: [
      { value: "180", label: "components" },
      { value: "38%", label: "faster UI builds" },
      { value: "41→96%", label: "screens meeting WCAG 2.2 AA" },
    ],
    problem:
      "Nine product teams built the same parts in different ways: 4 button styles and 11 shades of green.",
    approach:
      "I audited 1,300 screens, defined design tokens, and built and documented every component in both Figma and code.",
    outcome:
      "Adopted by all 9 product teams. A related system for bilingual component theming is now patent-pending.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Storybook", "Figma tokens"],
    tint: "sun",
  },
  {
    id: "telemedicine",
    name: "National Telemedicine Platform",
    org: "Zayna Health Tech",
    period: "2021 – 2022",
    role: "Product engineering lead",
    team: "team of 31",
    summary: "Video doctor visits for patients across Saudi Arabia.",
    figures: [
      { value: "3.1M", label: "consultations in 2022" },
      { value: "22→6 min", label: "average wait" },
      { value: "20→3%", label: "dropped calls" },
    ],
    problem: "Patients waited 22 minutes on average for a video consultation, and 1 in 5 calls dropped.",
    approach: "I led the redesign of the patient queue, the doctor console and the video layer.",
    stack: ["React", "React Native", "WebRTC", "Node.js", "Google Cloud"],
    tint: "blue",
  },
  {
    id: "hirfa",
    name: "Hirfa UI",
    org: "Open source",
    period: "2020 – now",
    role: "Founder and lead maintainer",
    team: "210 contributors",
    summary: "An open-source React library built for right-to-left from day one.",
    figures: [
      { value: "9,800", label: "GitHub stars" },
      { value: "1.2M", label: "npm downloads a year" },
      { value: "95", label: "components" },
    ],
    problem:
      "Popular component libraries handled right-to-left layouts poorly, so Arabic products had to patch them.",
    approach:
      "I designed and built every component with mirrored layouts, Arabic typography presets and full keyboard support.",
    stack: ["React", "TypeScript", "CSS logical properties", "Storybook"],
    link: { label: "View on GitHub", href: "https://github.example/yara-mansouri" },
    tint: "mint",
  },
  {
    id: "khatt",
    name: "Khatt Typography Engine",
    org: "PhD research, Eastmoor Institute of Technology",
    period: "2019 – 2022",
    role: "Researcher and sole developer",
    team: "solo",
    summary: "My PhD: Arabic text that adapts to its reader and screen.",
    figures: [
      { value: "+19%", label: "reading speed" },
      { value: "−31%", label: "reading errors" },
      { value: "312", label: "study participants" },
    ],
    problem: "Arabic text on screens is often too small, too dense and hard to scan.",
    approach:
      "I built an engine that adjusts Arabic font size, spacing and line length to the reader and the screen, then tested it in a controlled study.",
    outcome: "The method was granted a patent in June 2024 (SA 11223).",
    stack: ["TypeScript", "Canvas API", "Python"],
    tint: "coral",
  },
  {
    id: "savings",
    name: "Savings Goals",
    org: "Faseela Ventures",
    period: "2024",
    role: "Research and design lead",
    team: "team of 8",
    summary: "A goal-based way to save money, designed from field research.",
    figures: [
      { value: "610k", label: "goals opened in 6 months" },
      { value: "SAR 2,300", label: "saved per goal, on average" },
    ],
    problem: "70% of users had never saved money inside the app.",
    approach:
      "I ran 48 interviews in 5 cities, tested 3 prototypes and designed the final goal-setting flow.",
    stack: ["React Native", "GraphQL", "Figma"],
    tint: "blue",
  },
  {
    id: "qalam",
    name: "Qalam Learn Code Editor",
    org: "Qalam Learn",
    period: "2019 – 2021",
    role: "Co-founder, design and front-end",
    team: "team of 4",
    summary: "A code editor that explains programming errors in plain Arabic.",
    figures: [
      { value: "18→46%", label: "course completion" },
      { value: "230k", label: "learners in 14 countries" },
    ],
    problem: "Learners quit when English error messages stopped their code.",
    approach:
      "I designed and built a browser editor that explains each error in plain Arabic and suggests the next step.",
    stack: ["Vue", "TypeScript", "Monaco Editor", "Firebase"],
    tint: "sun",
  },
  {
    id: "dalil",
    name: "Dalil Accessibility Toolkit",
    org: "Side project",
    period: "2022",
    role: "Designer and developer",
    team: "solo",
    summary: "A browser extension that checks Arabic pages for accessibility.",
    figures: [
      { value: "42", label: "Arabic-specific checks" },
      { value: "3,400", label: "developers in 22 countries" },
    ],
    problem: "Accessibility checkers missed issues specific to Arabic and right-to-left pages.",
    approach: "I built an extension that flags these issues and explains how to fix each one.",
    stack: ["JavaScript", "Chrome Extensions API", "axe-core"],
    tint: "coral",
  },
  {
    id: "rafeeq",
    name: "Rafeeq Rides",
    org: "Rafeeq Rides",
    period: "2015 – 2016",
    role: "Co-founder and CTO",
    team: "team of 11",
    summary: "Safe, affordable ride-matching for university students.",
    figures: [
      { value: "140k", label: "rides in 20 months" },
      { value: "26k", label: "sign-ups" },
      { value: "80k", label: "readers of my post-mortem" },
    ],
    problem: "University students had few safe and affordable ways to commute.",
    approach: "I designed the matching system that paired riders by campus, timetable and route.",
    outcome: "The company closed in December 2016 after the market changed, and I wrote publicly about why.",
    stack: ["React Native", "Node.js", "MongoDB", "Google Maps APIs"],
    tint: "mint",
  },
];

const byId = new Map(projects.map((p) => [p.id, p]));

export function getProject(id: ProjectId): Project {
  const project = byId.get(id);
  if (!project) throw new Error(`Unknown project: ${id}`);
  return project;
}

export function isProjectId(value: string): value is ProjectId {
  return byId.has(value as ProjectId);
}

/** How many projects use each technology. */
export function stackCounts(): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tech of project.stack) counts.set(tech, (counts.get(tech) ?? 0) + 1);
  }
  return counts;
}

/** Technologies used by more than one project, most used first. These become filters. */
export function sharedStack(): readonly string[] {
  return [...stackCounts()]
    .filter(([, n]) => n > 1)
    .sort(([a, x], [b, y]) => y - x || a.localeCompare(b))
    .map(([tech]) => tech);
}
