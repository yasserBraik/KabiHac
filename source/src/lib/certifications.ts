import { certifications } from "@/data/research";
import type { CertStatus, Certification } from "@/data/types";

export type CertFilter = CertStatus | "all";

export function filterCertifications(query: string, status: CertFilter): readonly Certification[] {
  const q = query.trim().toLowerCase();
  return certifications.filter(
    (c) =>
      (status === "all" || c.status === status) && (!q || `${c.name} ${c.issuer}`.toLowerCase().includes(q)),
  );
}
