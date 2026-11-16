import { useMemo, useState } from "react";
import { certifications, certStatusLabel } from "@/data/research";
import { filterCertifications, type CertFilter } from "@/lib/certifications";
import { FilterGroup } from "@/components/ui/FilterGroup";
import styles from "./Research.module.css";

type Filter = CertFilter;
const ORDER: readonly Filter[] = ["all", "active", "lifetime", "in-progress", "expired"];

export function Certifications() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Filter>("all");
  const rows = useMemo(() => filterCertifications(query, status), [query, status]);
  const options = ORDER.map((value) => ({
    value,
    label: value === "all" ? "All" : certStatusLabel[value],
    count: value === "all" ? certifications.length : certifications.filter((c) => c.status === value).length,
  }));

  return (
    <>
      <div className={styles.certTools}>
        <label className="sr-only" htmlFor="cert-search">
          Search certifications
        </label>
        <input
          id="cert-search"
          type="search"
          className={styles.search}
          placeholder="Search by name or issuer"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <FilterGroup
          label="Filter certifications by status"
          options={options}
          value={status}
          onChange={setStatus}
          className={styles.filters}
        />
      </div>
      <p className="sr-only" role="status">
        {rows.length} of {certifications.length} certifications shown
      </p>
      {rows.length > 0 ? (
        <table className={styles.table}>
          <caption className="sr-only">Certifications</caption>
          <thead>
            <tr>
              <th scope="col">Certification</th>
              <th scope="col">Issuer</th>
              <th scope="col">Year</th>
              <th scope="col">Status</th>
              <th scope="col">Credential ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.name}>
                <td>{c.name}</td>
                <td>{c.issuer}</td>
                <td>{c.year}</td>
                <td>
                  <span className={`${styles.status} ${styles[c.status]}`}>
                    {c.expired ? `Expired ${c.expired}` : certStatusLabel[c.status]}
                  </span>
                </td>
                <td className={styles.credential}>{c.credential}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.empty}>Nothing matches. Clear the search or choose another status.</p>
      )}
    </>
  );
}
