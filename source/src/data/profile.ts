import type { Figure, ProfileLink } from "./types";

export const profile = {
  name: "Yara Al-Mansouri",
  fullName: "Yara Saud Al-Mansouri",
  honorific: "PhD",
  currentRole: "Principal Product Engineer at Faseela Ventures",
  location: "Riyadh, Saudi Arabia",
  email: "yara.almansouri@mail.example",
  phone: { display: "+966 55 000 0000", href: "tel:+966550000000" },
  cv: { href: "cv.pdf", filename: "Yara_Al-Mansouri_CV.pdf" },
  headline: "I design, build and research products that feel natural in Arabic and English.",
  intro:
    "I lead product teams from the first interview to launch, and I still design and write code every week. My PhD was on adaptive Arabic typography, which is why my name above reacts to you.",
  offTheClock:
    "Arabic calligraphy (shown in 2 group exhibitions), 3 half marathons so far, restoring old film cameras, and chess at an online rating of 1,850.",
} as const;

/** The only place these four career totals appear. */
export const headlineFigures: readonly Figure[] = [
  { value: "16", label: "years building digital products" },
  { value: "40+", label: "products shipped" },
  { value: "9M+", label: "people using them" },
  { value: "64", label: "people led at once" },
];

export const languages: readonly { name: string; level: string }[] = [
  { name: "Arabic", level: "native" },
  { name: "English", level: "C2 (IELTS 8.5)" },
  { name: "French", level: "B2 (DELF)" },
  { name: "German", level: "A2" },
  { name: "Turkish", level: "A1, learning" },
];

export const profileLinks: readonly ProfileLink[] = [
  { label: "LinkedIn", href: "https://linkedin.example/in/yaramansouri" },
  { label: "GitHub", href: "https://github.example/yara-mansouri" },
  { label: "Google Scholar", href: "https://scholar.example/yaram" },
  { label: "Dribbble", href: "https://dribbble.example/yaram" },
  { label: "Behance", href: "https://behance.example/yaram" },
  { label: "Medium", href: "https://medium.example/@yaram" },
  { label: "YouTube", href: "https://youtube.example/@YaraBuilds" },
  { label: "yara.example", href: "https://yara.example" },
];

/** Copyable summary for recruiters. Intentionally restates highlights; it is an export, not page content. */
export const summary: readonly { label: string; value: string }[] = [
  { label: "Who", value: "Yara Saud Al-Mansouri, PhD · Riyadh" },
  {
    label: "Now",
    value: "Principal Product Engineer & Design Technology Lead, Faseela Ventures (since 2023)",
  },
  { label: "Track record", value: "16 years · 40+ products · 9M+ people · led up to 64 people" },
  {
    label: "Strengths",
    value:
      "Design systems, front-end engineering, user research, accessibility, Arabic and right-to-left interfaces",
  },
  {
    label: "Stack",
    value: "TypeScript, React, Next.js, React Native, Node.js, GraphQL, Figma, AWS, Google Cloud",
  },
  {
    label: "Education",
    value: "PhD in HCI · MSc Interaction Design (Distinction) · BSc Computer Science (First Class)",
  },
  { label: "Languages", value: "Arabic (native), English (C2), French (B2)" },
  { label: "Contact", value: "yara.almansouri@mail.example · +966 55 000 0000" },
];
