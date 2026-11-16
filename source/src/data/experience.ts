import type { ExperienceEntry } from "./types";

/** Responsibilities and results that are not already on a project. Newest first within each kind. */
export const experience: readonly ExperienceEntry[] = [
  {
    id: "faseela",
    kind: "role",
    from: "Sep 2023",
    title: "Principal Product Engineer & Design Technology Lead",
    org: "Faseela Ventures, Riyadh",
    points: [
      {
        label: "Scope",
        text: "Front-end and design-system direction for 9 product teams across payments, savings and rewards.",
      },
      {
        label: "Improved",
        text: "Rebuilt the web app in Next.js and TypeScript: Largest Contentful Paint 4.8 s → 1.6 s.",
      },
      { label: "Added", text: "An accessibility review for every release." },
    ],
    projects: ["mizan", "savings"],
  },
  {
    id: "zayna-director",
    kind: "role",
    from: "Mar 2021",
    to: "Aug 2023",
    title: "Director of Product Engineering",
    org: "Zayna Health Tech, Riyadh",
    points: [
      {
        label: "Scope",
        text: "7 squads across engineering, design, quality and data, on a SAR 21M annual budget.",
      },
      { label: "Improved", text: "App crash rate 2.4% → 0.3%; app-store rating 3.6 → 4.7." },
      { label: "Passed", text: "Two health-data security audits with zero major findings." },
    ],
    projects: ["telemedicine"],
  },
  {
    id: "zayna-em",
    kind: "role",
    from: "Jan 2019",
    to: "Feb 2021",
    title: "Engineering Manager, Patient Apps",
    org: "Zayna Health Tech",
    points: [
      { label: "Scope", text: "Grew the team from 6 to 22; hired and mentored 4 team leads." },
      { label: "Added", text: "Appointment booking for 1.8M patients across 140 clinics." },
      { label: "Improved", text: "Release cycle 6 weeks → 1 week with CI/CD and feature flags." },
    ],
  },
  {
    id: "zayna-fe",
    kind: "role",
    from: "Jul 2017",
    to: "Dec 2018",
    title: "Senior Front-End Engineer",
    org: "Zayna Health Tech",
    points: [
      {
        label: "Improved",
        text: "Rebuilt the clinic dashboard in React; doctors’ average task time fell 27%.",
      },
      {
        label: "Added",
        text: "The first shared component library, which grew into the Zayna design system.",
      },
    ],
  },
  {
    id: "qalam",
    kind: "startup",
    from: "Feb 2019",
    to: "Nov 2022",
    title: "Co-founder, Qalam Learn (part-time)",
    org: "Arabic-first coding school · acquired by Mirqab Group",
    points: [
      { label: "Scope", text: "Grew the team to 9 and led product until the acquisition in November 2022." },
    ],
    projects: ["qalam"],
  },
  {
    id: "career-break",
    kind: "community",
    from: "Jan 2017",
    to: "Jun 2017",
    title: "Career break",
    org: "Riyadh",
    points: [
      { label: "Note", text: "Family relocation and volunteering." },
      {
        label: "Taught",
        text: "A 12-week web development course for 45 adult learners with Code for Community.",
      },
    ],
  },
  {
    id: "rafeeq",
    kind: "startup",
    from: "Apr 2015",
    to: "Dec 2016",
    title: "Co-founder & CTO, Rafeeq Rides",
    org: "Ride-sharing for students · closed",
    points: [{ label: "Scope", text: "Raised SAR 3.5M in seed funding and led a team of 11." }],
    projects: ["rafeeq"],
  },
  {
    id: "brightwell",
    kind: "role",
    from: "Oct 2012",
    to: "Mar 2015",
    title: "UX Engineer, then Senior UX Engineer",
    org: "Brightwell Studio, London",
    points: [
      {
        label: "Added",
        text: "Led the studio’s first Arabic, right-to-left project, for a Gulf travel client.",
      },
      {
        label: "Scope",
        text: "Responsive sites for 14 clients in retail, banking and the public sector; mentored 3 junior designers and ran the monthly front-end guild.",
      },
    ],
  },
  {
    id: "northbridge",
    kind: "role",
    from: "Jan 2012",
    to: "Sep 2012",
    title: "Research Assistant (part-time)",
    org: "University of Northbridge, Interaction Lab",
    points: [
      {
        label: "Added",
        text: "Ran 30 usability sessions on bilingual navigation menus and co-authored a technical report.",
      },
    ],
  },
  {
    id: "early",
    kind: "role",
    from: "Sep 2008",
    to: "Aug 2011",
    title: "Freelance designer, then Junior Web Developer",
    org: "Self-employed, then Mirqab Digital Agency, Riyadh",
    points: [
      {
        label: "Scope",
        text: "Logos, print and websites for 35 clients while at university, then 20+ websites in HTML, CSS, jQuery and PHP.",
      },
    ],
  },
  {
    id: "lecturer",
    kind: "community",
    from: "Sep 2019",
    to: "Jun 2024",
    title: "Adjunct Lecturer (part-time)",
    org: "College of Computing, Najd Valley University",
    points: [
      {
        label: "Taught",
        text: "HCI, Front-End Development and Design Systems to 1,400+ students over 10 semesters.",
      },
    ],
  },
  {
    id: "advisory",
    kind: "community",
    from: "2018",
    title: "Advisor, mentor and judge",
    org: "Alongside my full-time roles",
    points: [
      { label: "Advisor", text: "2 early-stage health-tech startups, since Feb 2024." },
      {
        label: "Board",
        text: "Saudi Women in Design Network, since Mar 2022: runs a yearly mentorship programme for 60 designers.",
      },
      {
        label: "Mentor",
        text: "25 startups across 6 cohorts at Najd Valley Startup Accelerator, since 2020.",
      },
      { label: "Judge", text: "12 hackathons in Riyadh, Jeddah and Dubai, since 2018." },
    ],
  },
];

export const experienceKinds = [
  { kind: "role", label: "Roles" },
  { kind: "startup", label: "Startups" },
  { kind: "community", label: "Teaching and community" },
] as const;
