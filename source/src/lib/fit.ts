import type { ProjectId, ResearchTab, SectionId } from "@/data/types";

/** Where the evidence for a requirement lives on the page. */
export type EvidenceTarget =
  | { readonly kind: "project"; readonly id: ProjectId }
  | { readonly kind: "section"; readonly id: SectionId; readonly tab?: ResearchTab };

export interface FitRule {
  readonly label: string;
  readonly pattern: RegExp;
  /** A fact from the CV, written as the reason this requirement is covered. */
  readonly evidence: string;
  readonly target: EvidenceTarget;
}

const project = (id: ProjectId): EvidenceTarget => ({ kind: "project", id });
const section = (id: SectionId, tab?: ResearchTab): EvidenceTarget =>
  tab ? { kind: "section", id, tab } : { kind: "section", id };

export const fitRules: readonly FitRule[] = [
  {
    label: "React",
    pattern: /\breact(\.js|js)?\b(?!\s*native)/,
    evidence: "Hirfa UI, Mizan and the telemedicine platform; 16 years of front-end",
    target: project("hirfa"),
  },
  {
    label: "Next.js",
    pattern: /\bnext\.?js\b/,
    evidence: "Led the Faseela web rebuild in Next.js and TypeScript",
    target: section("experience"),
  },
  {
    label: "TypeScript",
    pattern: /\btypescript\b/,
    evidence: "Mizan, Hirfa UI, Khatt and the Qalam editor are all TypeScript",
    target: project("mizan"),
  },
  {
    label: "JavaScript",
    pattern: /\bjavascript\b|\bes6\b/,
    evidence: "16 years of front-end; Dalil is a JavaScript extension",
    target: project("dalil"),
  },
  {
    label: "Vue",
    pattern: /\bvue(\.js|js)?\b/,
    evidence: "Built the Qalam Learn code editor in Vue",
    target: project("qalam"),
  },
  {
    label: "Tailwind CSS",
    pattern: /\btailwind\b/,
    evidence: "Mizan is built with Tailwind CSS",
    target: project("mizan"),
  },
  {
    label: "CSS and HTML",
    pattern: /\bcss\b|\bhtml\b|\bsass\b/,
    evidence: "CSS logical properties throughout Hirfa UI",
    target: project("hirfa"),
  },
  {
    label: "React Native",
    pattern: /\breact[\s-]?native\b/,
    evidence: "Telemedicine apps, Savings Goals and Rafeeq Rides",
    target: project("telemedicine"),
  },
  {
    label: "Mobile",
    pattern: /\bmobile\b|\bios\b|\bandroid\b|\bflutter\b|\bswift\b/,
    evidence: "React Native and Flutter, advanced, 8 years",
    target: section("skills"),
  },
  {
    label: "Node.js",
    pattern: /\bnode(\.js|js)?\b|\bnestjs\b/,
    evidence: "Node.js and NestJS, advanced, 10 years",
    target: project("telemedicine"),
  },
  {
    label: "GraphQL and APIs",
    pattern: /\bgraphql\b|\brest(ful)?\b|\bapis?\b/,
    evidence: "GraphQL at Faseela and in Savings Goals",
    target: project("savings"),
  },
  {
    label: "Databases",
    pattern: /\bpostgres(ql)?\b|\bsql\b|\bredis\b|\bmongo(db)?\b/,
    evidence: "PostgreSQL, Redis, MongoDB and SQL",
    target: section("skills"),
  },
  {
    label: "Cloud",
    pattern: /\baws\b|\bgcp\b|\bgoogle cloud\b|\bcloud\b/,
    evidence: "AWS and Google Cloud, plus a Cloud Solutions Architect certification",
    target: section("research", "certifications"),
  },
  {
    label: "Containers and IaC",
    pattern: /\bdocker\b|\bkubernetes\b|\bk8s\b|\bterraform\b/,
    evidence: "Docker, Kubernetes and Terraform",
    target: section("skills"),
  },
  {
    label: "CI/CD",
    pattern: /\bci\s*\/\s*cd\b|\bcontinuous (integration|delivery|deployment)\b|\bgithub actions\b/,
    evidence: "Cut the release cycle from 6 weeks to 1 with CI/CD",
    target: section("experience"),
  },
  {
    label: "Web performance",
    pattern: /\bperformance\b|\bcore web vitals\b|\blcp\b/,
    evidence: "Largest Contentful Paint 4.8 s → 1.6 s at Faseela",
    target: section("experience"),
  },
  {
    label: "Design systems",
    pattern: /\bdesign systems?\b|\bcomponent librar(y|ies)\b|\bdesign tokens?\b|\bstorybook\b/,
    evidence: "Built Mizan and Hirfa UI; a bilingual theming patent pending",
    target: project("mizan"),
  },
  {
    label: "Figma and prototyping",
    pattern: /\bfigma\b|\bprototyp\w*\b|\bwireframe\w*\b/,
    evidence: "Product design, expert, 18 years",
    target: project("savings"),
  },
  {
    label: "Product and UX design",
    pattern: /\bux\b|\bui\b|\bproduct design\w*\b|\binteraction design\b|\buser experience\b/,
    evidence: "MSc in Interaction Design; 18 years of product design",
    target: section("research", "education"),
  },
  {
    label: "User research",
    pattern: /\buser research\b|\busability\b|\binterviews?\b|\ba\/b test\w*\b|\bresearch\b/,
    evidence: "Field research for Savings Goals and a controlled PhD study",
    target: project("savings"),
  },
  {
    label: "Accessibility",
    pattern: /\baccessib\w*\b|\ba11y\b|\bwcag\b|\baria\b|\bscreen[\s-]?readers?\b/,
    evidence: "Raised WCAG 2.2 AA coverage at Faseela; built Dalil",
    target: project("dalil"),
  },
  {
    label: "Arabic, RTL and bilingual",
    pattern:
      /\barabic\b|\brtl\b|\bright[\s-]to[\s-]left\b|\bbilingual\b|\bi18n\b|\blocali[sz]ation\b|\binternationali[sz]ation\b|\bmena\b|\bgcc\b|\bsaudi\b|\bgulf\b/,
    evidence: "PhD on Arabic interfaces; Hirfa UI, Khatt and Dalil",
    target: project("khatt"),
  },
  {
    label: "People leadership",
    pattern:
      /\bleadership\b|\blead\b|\bmanag(e|er|ing|ement)\b|\bhir(e|ing)\b|\bmentor\w*\b|\bprincipal\b|\bstaff\b/,
    evidence: "Directed 7 squads; grew a team from 6 to 22",
    target: section("experience"),
  },
  {
    label: "Strategy and stakeholders",
    pattern: /\bstrateg\w*\b|\bstakeholders?\b|\bokrs?\b|\broadmap\w*\b|\bbudget\w*\b/,
    evidence: "OKRs, budgeting and stakeholder management",
    target: section("experience"),
  },
  {
    label: "Agile delivery",
    pattern: /\bagile\b|\bscrum\b|\bkanban\b/,
    evidence: "Professional Scrum Facilitator certification",
    target: section("research", "certifications"),
  },
  {
    label: "Fintech and payments",
    pattern: /\bfintech\b|\bpayments?\b|\bbanking\b|\bfinancial\b|\bpci\b/,
    evidence: "Principal engineer at a fintech super-app; PCI DSS",
    target: project("savings"),
  },
  {
    label: "Health tech",
    pattern: /\bhealth\w*\b|\bmedical\b|\btelemedicine\b|\bpatients?\b/,
    evidence: "National telemedicine platform",
    target: project("telemedicine"),
  },
  {
    label: "Education",
    pattern: /\bed[\s-]?tech\b|\beducation\w*\b|\bteach\w*\b/,
    evidence: "Co-founded Qalam Learn; university lecturer",
    target: project("qalam"),
  },
  {
    label: "Security and privacy",
    pattern: /\bsecurity\b|\bthreat model\w*\b|\bprivacy\b|\bcompliance\b/,
    evidence: "Secure SDLC, threat modelling and health-data privacy",
    target: section("skills"),
  },
  {
    label: "Data and AI",
    pattern: /\bpython\b|\bai\b|\bmachine learning\b|\bml\b|\brecommendation\w*\b|\banalytics\b|\bllms?\b/,
    evidence: "Python, SQL, recommendation systems and AI product features",
    target: section("skills"),
  },
  {
    label: "Startups",
    pattern: /\bstart[\s-]?ups?\b|\bfounder\b|\bzero to one\b|\bgreenfield\b/,
    evidence: "Co-founded Qalam Learn (acquired) and Rafeeq Rides",
    target: section("experience"),
  },
  {
    label: "Open source",
    pattern: /\bopen[\s-]source\b|\bgithub\b/,
    evidence: "Founder and lead maintainer of Hirfa UI",
    target: project("hirfa"),
  },
  {
    label: "Communication",
    pattern: /\bcommunicat\w*\b|\bpublic speaking\b|\bwriting\b/,
    evidence: "31 talks and 9 publications",
    target: section("research", "talks"),
  },
  {
    label: "Advanced degree",
    pattern: /\bph\.?d\b|\bmaster'?s\b|\bmsc\b|\bhci\b/,
    evidence: "PhD in HCI and an MSc in Interaction Design",
    target: section("research", "education"),
  },
];

/** Requirements the CV does not show. Reported openly. */
export const knownGaps: readonly { readonly label: string; readonly pattern: RegExp }[] = [
  { label: "Angular", pattern: /\bangular\b/ },
  { label: "Svelte", pattern: /\bsvelte\b/ },
  { label: "Java", pattern: /\bjava\b/ },
  { label: "Kotlin", pattern: /\bkotlin\b/ },
  { label: "C# and .NET", pattern: /c#|\.net\b/ },
  { label: "Go", pattern: /\bgolang\b/ },
  { label: "Rust", pattern: /\brust\b/ },
  { label: "Ruby on Rails", pattern: /\bruby\b|\brails\b/ },
  { label: "Django", pattern: /\bdjango\b/ },
  { label: "Azure", pattern: /\bazure\b/ },
  { label: "Blockchain", pattern: /\bblockchain\b|\bweb3\b/ },
  { label: "Salesforce", pattern: /\bsalesforce\b/ },
  { label: "HIPAA", pattern: /\bhipaa\b/ },
  { label: "GDPR", pattern: /\bgdpr\b/ },
  { label: "C++ or embedded", pattern: /c\+\+|\bembedded\b/ },
  { label: "Deep learning frameworks", pattern: /\bpytorch\b|\btensorflow\b/ },
];

export type FitResult =
  | { readonly status: "too-short" }
  | { readonly status: "unrecognised" }
  | {
      readonly status: "ok";
      readonly matches: readonly FitRule[];
      readonly gaps: readonly string[];
      readonly percent: number;
    };

export const MIN_JOB_TEXT = 20;

export function matchRole(text: string): FitResult {
  const normalised = ` ${text.toLowerCase().replace(/\s+/g, " ")} `;
  if (normalised.trim().length < MIN_JOB_TEXT) return { status: "too-short" };
  const matches = fitRules.filter((rule) => rule.pattern.test(normalised));
  const gaps = knownGaps.filter((gap) => gap.pattern.test(normalised)).map((gap) => gap.label);
  const total = matches.length + gaps.length;
  if (total === 0) return { status: "unrecognised" };
  return { status: "ok", matches, gaps, percent: Math.round((matches.length / total) * 100) };
}

export const sampleRole = `Senior Staff Frontend Engineer, Design Systems (sample role)

We're a Gulf fintech building payments and savings products for millions of customers in Arabic and English.

You will:
- Lead the architecture of our React and TypeScript design system and component library
- Partner with product design in Figma and run usability research with customers
- Raise accessibility to WCAG 2.2 AA across web and React Native apps
- Improve Core Web Vitals performance on our Next.js web app
- Mentor engineers, set technical strategy and work with stakeholders

Nice to have: GraphQL, AWS, CI/CD, RTL and localization experience, Kotlin, Angular.`;
