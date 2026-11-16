import { summary } from "@/data/profile";

export function summaryAsText(): string {
  return [
    "Yara Al-Mansouri, PhD: quick summary",
    "",
    ...summary.map((row) => `${row.label}: ${row.value}`),
  ].join("\n");
}
