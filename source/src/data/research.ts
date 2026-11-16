import type { Award, Certification, Citation, Degree } from "./types";

export const awards: readonly Award[] = [
  {
    year: 2025,
    title: "Design Technology Leader of the Year",
    by: "Gulf Design Week Awards",
    project: "mizan",
  },
  { year: 2024, title: "Best Fintech Experience", by: "Arab Fintech Excellence Awards", project: "savings" },
  { year: 2023, title: "Top 40 Under 40 in Saudi Tech", by: "Riyadh Tech Review, for career achievement" },
  {
    year: 2022,
    title: "Best Doctoral Thesis in HCI",
    by: "Eastmoor Institute of Technology",
    project: "khatt",
  },
  { year: 2022, title: "Open Source Impact Award", by: "Arab Open Source Foundation", project: "hirfa" },
  {
    year: 2021,
    title: "Digital Health Innovation Award",
    by: "Middle East Health Informatics Board",
    project: "telemedicine",
  },
  {
    year: 2020,
    title: "Women in Tech Leadership Award",
    by: "Saudi Women in Design Network, for leadership at Zayna",
  },
  {
    year: 2014,
    title: "Silver, Responsive Design",
    by: "London Web Craft Awards, for a retail client site at Brightwell",
  },
  {
    year: 2013,
    title: "Rising Star in UX",
    by: "UK Interaction Design Guild, for a public-sector site at Brightwell",
  },
  {
    year: 2010,
    title: "Best Graduation Project",
    by: "Najd Valley University, for an Arabic speech-to-text note-taking app",
  },
];

export const patents: readonly Citation[] = [
  {
    title: "Method for adaptive Arabic text rendering based on reading context",
    detail: "Patent No. SA 11223, granted June 2024",
  },
  {
    title: "System for bilingual component theming in design systems",
    detail: "Application No. SA 2025-0417, filed March 2025, pending",
  },
];

export const publications: readonly Citation[] = [
  {
    title: "Adaptive typography for Arabic interfaces: A study with 312 readers",
    detail: "Al-Mansouri & Marsh, 2022. Journal of Human-Centred Computing, 14(3), 211–238",
  },
  {
    title: "Trust signals in Arabic health apps",
    detail: "Al-Mansouri, 2021. Proceedings of ICAI 2021, 45–56",
  },
  {
    title: "Right-to-left design systems at scale",
    detail: "Al-Mansouri, Rahman & Okafor, 2020. DesignOps Summit Asia 2020, 12–19",
  },
  {
    title: "Measuring reading comfort on small screens",
    detail: "Al-Mansouri & Marsh, 2020. ICAI 2020 Workshop on Arabic Typography, 8–13",
  },
  {
    title: "Teaching front-end development in Arabic: Lessons from 50,000 learners",
    detail: "Al-Mansouri, 2019. Gulf Journal of Computing Education, 7(1), 33–49",
  },
  {
    title: "Bilingual navigation menus on small screens",
    detail: "Hart & Al-Mansouri, 2012. Northbridge Interaction Lab Technical Report NIL-TR-2012-07",
  },
];
export const PUBLICATIONS_TOTAL = 9;
export const scholarUrl = "https://scholar.example/yaram";

export const talks: readonly Citation[] = [
  { title: "Keynote: Design systems that speak two languages", detail: "Najd Developer Days, Riyadh, 2025" },
  { title: "Accessibility is a product decision", detail: "Gulf Design Week, Dubai, 2025" },
  { title: "Panel: Building trust in fintech UX", detail: "Gulf Fintech Builders Forum, Riyadh, 2024" },
  { title: "Scaling a team from 6 to 64", detail: "Engineering Leadership Week, Cairo, 2023" },
  { title: "What my PhD taught me about Arabic type", detail: "Typography Majlis, Jeddah, 2022" },
  {
    title: "Keynote: Telemedicine at national scale",
    detail: "Digital Health Middle East Summit, online, 2021",
  },
  { title: "Why our startup failed", detail: "Founders Night Riyadh, 2016" },
  { title: "Responsive design for right-to-left", detail: "Frontend Horizons, London, 2014" },
];
export const TALKS_TOTAL = 31;

export const media: readonly Citation[] = [
  {
    title: "Cover story: “The engineer who designs in two directions”",
    detail: "Riyadh Tech Review, March 2023",
  },
  { title: "Article: “Accessibility debt in fintech”", detail: "Medium, November 2023. Read 120,000 times" },
  {
    title: "Podcast: “From startup failure to Principal Engineer”",
    detail: "Build in Arabic, Episode 42, June 2024",
  },
  {
    title: "YouTube: Yara Builds",
    detail: "86 tutorials on design systems and right-to-left front-end. 48,000 subscribers",
  },
];

export const degrees: readonly Degree[] = [
  {
    period: "2018 – 2022",
    title: "PhD in Human-Computer Interaction",
    institution: "Eastmoor Institute of Technology, part-time and remote",
    notes: ["Thesis: “Adaptive Typography for Arabic Interfaces: Readability, Density and Trust”"],
  },
  {
    period: "2011 – 2012",
    title: "MSc in Interaction Design, with Distinction",
    institution: "University of Northbridge, United Kingdom",
    notes: ["Dissertation: “Bilingual Navigation Menus on Small Screens”", "Full scholarship"],
  },
  {
    period: "2006 – 2010",
    title: "BSc in Computer Science, First Class Honours",
    institution: "Najd Valley University, Riyadh",
    notes: ["GPA 4.81 / 5.00", "Exchange semester at Lindenhall University, Germany, 2009"],
  },
  {
    period: "2021",
    title: "Executive Certificate in Technology Leadership",
    institution: "Eastmoor Business School, online",
    notes: ["Six-month programme, completed while working full-time"],
  },
];

export const certifications: readonly Certification[] = [
  {
    name: "Certified Security Architecture Professional (CSAP)",
    issuer: "Global Cyber Assurance Council",
    year: 2026,
    status: "in-progress",
    credential: "Exam booked for Dec 2026",
  },
  {
    name: "Certified Cloud Solutions Architect – Professional",
    issuer: "Cloud Architecture Guild",
    year: 2025,
    status: "active",
    credential: "CAG-CSA-25-0912",
  },
  {
    name: "Certified Design Leader",
    issuer: "Arabian Design Council",
    year: 2025,
    status: "active",
    credential: "ADC-CDL-25-0044",
  },
  {
    name: "Multi-Cloud Platform Architect",
    issuer: "Halcyon Cloud Institute",
    year: 2024,
    status: "active",
    credential: "HLC-MPA-24-3307",
  },
  {
    name: "Certified Container Application Developer",
    issuer: "Open Container Academy",
    year: 2024,
    status: "active",
    credential: "OCA-CAD-24-1185",
  },
  {
    name: "Open Banking Product Specialist",
    issuer: "Gulf FinTech Academy",
    year: 2024,
    status: "active",
    credential: "GFA-OBP-24-0219",
  },
  {
    name: "Certified Project Leadership Professional",
    issuer: "International Project Leadership Society",
    year: 2023,
    status: "active",
    credential: "IPLS-CPL-23-5560",
  },
  {
    name: "Certified Accessibility Specialist",
    issuer: "Inclusive Interfaces Council",
    year: 2023,
    status: "active",
    credential: "IIC-CAS-23-0471",
  },
  {
    name: "Applied Data Visualization Certificate",
    issuer: "Riyadh Data Institute",
    year: 2023,
    status: "lifetime",
    credential: "RDI-ADV-23-0118",
  },
  {
    name: "UX Research and Interaction Design Certificate",
    issuer: "Meridian UX Institute",
    year: 2022,
    status: "lifetime",
    credential: "MUI-UXR-22-8842",
  },
  {
    name: "Enterprise Architecture Practitioner",
    issuer: "Global Enterprise Architecture Forum",
    year: 2022,
    status: "active",
    credential: "GEAF-EAP-22-0193",
  },
  {
    name: "Certified Agile Product Owner",
    issuer: "Agile Practice Council",
    year: 2022,
    status: "expired",
    credential: "APC-APO-22-6620",
    expired: 2024,
  },
  {
    name: "Professional Scrum Facilitator, Level 1",
    issuer: "Agile Delivery Institute",
    year: 2021,
    status: "lifetime",
    credential: "ADI-PSF-21-4410",
  },
  {
    name: "Cloud Application Developer – Associate",
    issuer: "Skyline Developer Program",
    year: 2021,
    status: "expired",
    credential: "SDP-CAD-21-2075",
    expired: 2023,
  },
  {
    name: "IT Service Management Foundation",
    issuer: "Service Excellence Board",
    year: 2020,
    status: "lifetime",
    credential: "SEB-ITSM-20-9931",
  },
  {
    name: "Health Data Privacy Practitioner",
    issuer: "Middle East Health Informatics Board",
    year: 2020,
    status: "active",
    credential: "MEHIB-HDP-20-0306",
  },
  {
    name: "Lean Six Sigma Green Belt",
    issuer: "Institute for Process Excellence",
    year: 2019,
    status: "lifetime",
    credential: "IPE-LSS-19-1402",
  },
  {
    name: "Security Fundamentals Professional",
    issuer: "Cyber Readiness Academy",
    year: 2019,
    status: "expired",
    credential: "CRA-SFP-19-7718",
    expired: 2022,
  },
  {
    name: "Usability Analysis Professional",
    issuer: "Usability Practice Institute",
    year: 2016,
    status: "lifetime",
    credential: "UPI-UAP-16-0268",
  },
  {
    name: "Advanced Motion Design for Interfaces",
    issuer: "London School of Interface Craft",
    year: 2014,
    status: "lifetime",
    credential: "LSIC-MD-14-0052",
  },
];

export const certStatusLabel = {
  active: "Active",
  lifetime: "Lifetime",
  expired: "Expired",
  "in-progress": "In progress",
} as const satisfies Record<Certification["status"], string>;

export function awardForProject(id: string): Award | undefined {
  return awards.find((a) => a.project === id);
}
