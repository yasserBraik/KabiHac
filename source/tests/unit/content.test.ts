import { describe, expect, it } from "vitest";
import { experience } from "@/data/experience";
import { headlineFigures, profile } from "@/data/profile";
import { getProject, isProjectId, projects, sharedStack } from "@/data/projects";
import {
  awardForProject,
  awards,
  certifications,
  degrees,
  media,
  patents,
  publications,
  talks,
} from "@/data/research";
import { SKILL_YEARS, skills, weightForYears } from "@/data/skills";
import { PROJECT_IDS } from "@/data/types";

const projectFigureValues = projects.flatMap((p) => p.figures.map((f) => f.value));
const prose = (p: (typeof projects)[number]) => [p.summary, p.problem, p.approach, p.outcome ?? ""].join(" ");

describe("projects", () => {
  it("covers every declared project id exactly once", () => {
    expect(projects.map((p) => p.id).sort()).toEqual([...PROJECT_IDS].sort());
  });

  it("has two or three figures each", () => {
    for (const p of projects) {
      expect(p.figures.length).toBeGreaterThanOrEqual(2);
      expect(p.figures.length).toBeLessThanOrEqual(3);
    }
  });

  it("never repeats a figure in its own prose", () => {
    for (const p of projects) {
      for (const figure of p.figures)
        expect(prose(p), `${p.id}: "${figure.value}"`).not.toContain(figure.value);
    }
  });

  it("uses each figure value only once across the whole site", () => {
    const all = [...projectFigureValues, ...headlineFigures.map((f) => f.value)];
    expect(new Set(all).size).toBe(all.length);
  });

  it("looks projects up by id and rejects unknown ids", () => {
    expect(getProject("hirfa").name).toBe("Hirfa UI");
    expect(isProjectId("hirfa")).toBe(true);
    expect(isProjectId("nope")).toBe(false);
    expect(() => getProject("nope" as never)).toThrow("Unknown project");
  });

  it("offers only technologies used by more than one project as filters", () => {
    for (const tech of sharedStack())
      expect(projects.filter((p) => p.stack.includes(tech)).length).toBeGreaterThan(1);
  });
});

describe("cross-references", () => {
  it("links awards and experience only to projects that exist", () => {
    for (const award of awards) if (award.project) expect(isProjectId(award.project)).toBe(true);
    for (const entry of experience) for (const id of entry.projects ?? []) expect(isProjectId(id)).toBe(true);
  });

  it("gives each project at most one award", () => {
    for (const p of projects) expect(awards.filter((a) => a.project === p.id).length).toBeLessThanOrEqual(1);
    expect(awardForProject("mizan")?.year).toBe(2025);
  });

  it("does not restate any project figure in the experience timeline", () => {
    const text = experience.flatMap((e) => e.points.map((pt) => pt.text)).join(" ");
    for (const value of projectFigureValues) expect(text, value).not.toContain(value);
  });

  it("does not restate the headline totals inside sections", () => {
    const sectionText = [
      ...experience.flatMap((e) => e.points.map((pt) => pt.text)),
      ...projects.map(prose),
    ].join(" ");
    expect(sectionText).not.toMatch(/\b64 people\b/);
    expect(sectionText).not.toMatch(/\b40\+ products\b/);
  });

  it("keeps experience ids unique", () => {
    expect(new Set(experience.map((e) => e.id)).size).toBe(experience.length);
  });
});

describe("research and credentials", () => {
  it("matches the CV's counts", () => {
    expect(awards).toHaveLength(10);
    expect(patents).toHaveLength(2);
    expect(publications).toHaveLength(6);
    expect(talks).toHaveLength(8);
    expect(media).toHaveLength(4);
    expect(degrees).toHaveLength(4);
    expect(certifications).toHaveLength(20);
    expect(certifications.filter((c) => c.status === "in-progress")).toHaveLength(1);
  });

  it("records an expiry year for every expired certification and only those", () => {
    for (const c of certifications) expect(c.expired !== undefined).toBe(c.status === "expired");
  });

  it("lists awards newest first", () => {
    const years = awards.map((a) => a.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });
});

describe("skills", () => {
  it("keeps years within the scale used to set font weight", () => {
    for (const s of skills) {
      expect(s.years).toBeGreaterThanOrEqual(SKILL_YEARS.min);
      expect(s.years).toBeLessThanOrEqual(SKILL_YEARS.max);
    }
  });

  it("maps more years to a heavier weight, within the font's range", () => {
    expect(weightForYears(SKILL_YEARS.min)).toBe(220);
    expect(weightForYears(SKILL_YEARS.max)).toBe(780);
    expect(weightForYears(10)).toBeLessThan(weightForYears(11));
    expect(weightForYears(99)).toBe(780);
  });
});

describe("profile", () => {
  it("uses a relative CV path so the build works from any folder", () => {
    expect(profile.cv.href).not.toMatch(/^\//);
  });
});
