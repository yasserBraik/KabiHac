import {
  awards,
  degrees,
  media,
  patents,
  publications,
  PUBLICATIONS_TOTAL,
  scholarUrl,
  talks,
  TALKS_TOTAL,
} from "@/data/research";
import { getProject } from "@/data/projects";
import type { Citation, ResearchTab } from "@/data/types";
import { controls } from "@/components/ui/controls";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { usePortfolio } from "@/state/portfolio-context";
import { Certifications } from "./Certifications";
import styles from "./Research.module.css";
import { certifications } from "@/data/research";

function References({ items }: { items: readonly Citation[] }) {
  return (
    <ul className={styles.refs}>
      {items.map((item) => (
        <li key={item.title}>
          <cite>{item.title}</cite>
          <span>{item.detail}</span>
        </li>
      ))}
    </ul>
  );
}

function Awards() {
  const { showProject } = usePortfolio();
  return (
    <ol className={styles.awards}>
      {awards.map((award) => (
        <li key={award.title}>
          <span className={styles.year}>{award.year}</span>
          <span className={styles.what}>
            {award.title}
            <span>{award.by}</span>
          </span>
          {award.project ? (
            <button
              type="button"
              className={controls.linkChip}
              onClick={() => award.project && showProject(award.project)}
            >
              {getProject(award.project).name}
            </button>
          ) : (
            <span />
          )}
        </li>
      ))}
    </ol>
  );
}

export function ResearchSection() {
  const { researchTab, setResearchTab } = usePortfolio();
  const items: readonly TabItem<ResearchTab>[] = [
    { id: "awards", label: "Recognition", count: awards.length, content: <Awards /> },
    {
      id: "writing",
      label: "Patents & papers",
      count: patents.length + publications.length,
      content: (
        <div className={styles.columns}>
          <div>
            <h3>Patents</h3>
            <References items={patents} />
          </div>
          <div>
            <h3>Publications</h3>
            <p className={styles.note}>
              {publications.length} of {PUBLICATIONS_TOTAL} shown.{" "}
              <a href={scholarUrl} target="_blank" rel="noopener noreferrer">
                See all on Google Scholar
              </a>
            </p>
            <References items={publications} />
          </div>
        </div>
      ),
    },
    {
      id: "talks",
      label: "Talks & media",
      count: talks.length + media.length,
      content: (
        <div className={styles.columns}>
          <div>
            <h3>Talks and keynotes</h3>
            <p className={styles.note}>
              {talks.length} of {TALKS_TOTAL} shown
            </p>
            <References items={talks} />
          </div>
          <div>
            <h3>Media</h3>
            <References items={media} />
          </div>
        </div>
      ),
    },
    {
      id: "education",
      label: "Education",
      count: degrees.length,
      content: (
        <div className={styles.degrees}>
          {degrees.map((degree) => (
            <article key={degree.title}>
              <span className={styles.period}>{degree.period}</span>
              <h3>{degree.title}</h3>
              <p className={styles.institution}>{degree.institution}</p>
              <ul>
                {degree.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      ),
    },
    {
      id: "certifications",
      label: "Certifications",
      count: certifications.length,
      content: <Certifications />,
    },
  ];

  return (
    <section id="research" className="page section" aria-labelledby="research-title">
      <SectionHeader
        id="research-title"
        index={4}
        accent="blue"
        title="Research & credentials"
        lede="Awards, writing, talks, degrees and certifications, one tab at a time."
      />
      <Tabs
        label="Research and credentials"
        items={items}
        selected={researchTab}
        onSelect={setResearchTab}
        listClassName={styles.tabs}
        panelClassName={styles.panel}
      />
    </section>
  );
}
