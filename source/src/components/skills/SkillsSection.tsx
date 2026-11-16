import { useId, useState, type CSSProperties } from "react";
import { languages } from "@/data/profile";
import { stackCounts } from "@/data/projects";
import { SKILL_YEARS, skills, weightForYears } from "@/data/skills";
import type { Skill } from "@/data/types";
import { controls } from "@/components/ui/controls";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useInView } from "@/hooks/useInView";
import { scrollToSection, usePortfolio } from "@/state/portfolio-context";
import styles from "./Skills.module.css";

const SWEEPS = ["var(--tint-sun)", "var(--tint-blue)", "var(--tint-mint)", "var(--tint-coral)"] as const;

function SkillRow({ skill, index, revealed }: { skill: Skill; index: number; revealed: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const { setStackFilter } = usePortfolio();
  const usage = stackCounts();
  const showProjectsUsing = (tool: string) => {
    setStackFilter(tool);
    scrollToSection("work");
  };
  const style = { "--sweep": SWEEPS[index % SWEEPS.length] } as CSSProperties;
  return (
    <li className={styles.row} style={style}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={styles.name}
          style={{
            fontWeight: weightForYears(skill.years),
            fontVariationSettings: `"opsz" 48, "wdth" ${78 + skill.years}`,
          }}
        >
          {skill.name}
        </span>
        <span className={styles.level}>
          {skill.level}
          <span className={styles.meter} aria-hidden="true">
            <span
              style={{
                width: revealed ? `${(skill.years / SKILL_YEARS.max) * 100}%` : 0,
                transitionDelay: `${index * 70}ms`,
              }}
            />
          </span>
        </span>
        <span className={styles.years}>
          {skill.years} yrs<span className="sr-only">, {skill.level}</span>
        </span>
        <span className={styles.plus} aria-hidden="true">
          +
        </span>
      </button>
      <div id={panelId} className={styles.panel} data-open={open} inert={!open}>
        <div>
          <ul className={styles.tools} aria-label={`${skill.name} tools`}>
            {skill.tools.map((tool) =>
              (usage.get(tool) ?? 0) > 1 ? (
                <li key={tool}>
                  <button
                    type="button"
                    className={controls.linkChip}
                    onClick={() => showProjectsUsing(tool)}
                    title={`Show projects built with ${tool}`}
                  >
                    {tool}
                  </button>
                </li>
              ) : (
                <li key={tool} className={styles.tool}>
                  {tool}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </li>
  );
}

export function SkillsSection() {
  const [ref, revealed] = useInView<HTMLUListElement>(0.2);
  return (
    <section id="skills" className="page section" aria-labelledby="skills-title">
      <SectionHeader
        id="skills-title"
        index={3}
        accent="mint"
        title="Skills"
        lede="The longer I’ve practised a skill, the heavier its name is set. Open one to see the tools."
      />
      <ul ref={ref} className={styles.list}>
        {skills.map((skill, index) => (
          <SkillRow key={skill.name} skill={skill} index={index} revealed={revealed} />
        ))}
      </ul>
      <dl className={styles.languages}>
        <dt>Languages</dt>
        {languages.map((language) => (
          <dd key={language.name}>
            {language.name}, {language.level}
          </dd>
        ))}
      </dl>
    </section>
  );
}
