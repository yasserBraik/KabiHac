import type { SectionId } from "@/data/types";

export const NAV_SECTIONS: readonly { id: Exclude<SectionId, "top">; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];
