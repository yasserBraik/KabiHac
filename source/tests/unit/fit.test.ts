import { describe, expect, it } from "vitest";
import { isProjectId } from "@/data/projects";
import { SECTION_IDS } from "@/data/types";
import { fitRules, matchRole, sampleRole } from "@/lib/fit";

describe("matchRole", () => {
  it("asks for more text when the input is too short", () => {
    expect(matchRole("react")).toEqual({ status: "too-short" });
  });

  it("reports when nothing is recognised", () => {
    expect(matchRole("We value punctuality and a positive attitude above all")).toEqual({
      status: "unrecognised",
    });
  });

  it("matches the sample role and lists the gaps openly", () => {
    const result = matchRole(sampleRole);
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.gaps).toEqual(["Angular", "Kotlin"]);
    expect(result.matches.map((m) => m.label)).toEqual(
      expect.arrayContaining(["React", "TypeScript", "Accessibility", "Design systems"]),
    );
    expect(result.percent).toBe(Math.round((result.matches.length / (result.matches.length + 2)) * 100));
  });

  it("does not count React Native as React", () => {
    const result = matchRole("Mobile engineer with strong React Native experience");
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    const labels = result.matches.map((m) => m.label);
    expect(labels).toContain("React Native");
    expect(labels).not.toContain("React");
  });

  it("is case and whitespace insensitive", () => {
    const result = matchRole("   EXPERIENCE   with\n\nTYPESCRIPT and    GraphQL   ");
    expect(result.status === "ok" && result.matches.map((m) => m.label)).toEqual(
      expect.arrayContaining(["TypeScript", "GraphQL and APIs"]),
    );
  });
});

describe("fit rules", () => {
  it("point only at projects and sections that exist", () => {
    for (const rule of fitRules) {
      if (rule.target.kind === "project") expect(isProjectId(rule.target.id), rule.label).toBe(true);
      else expect(SECTION_IDS, rule.label).toContain(rule.target.id);
    }
  });

  it("have unique labels", () => {
    expect(new Set(fitRules.map((r) => r.label)).size).toBe(fitRules.length);
  });
});
