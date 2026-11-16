import { describe, expect, it } from "vitest";
import { certifications } from "@/data/research";
import { filterCertifications } from "@/lib/certifications";
import { composeEmail, validateContact, type ContactFields } from "@/lib/contact";
import { summaryAsText } from "@/lib/summary";

const valid: ContactFields = {
  name: "Sam Recruiter",
  email: "sam@company.com",
  company: "Acme & Co",
  topic: "A role I'm hiring for",
  message: "We have a principal design engineer role in Riyadh.",
};

describe("validateContact", () => {
  it("accepts a complete message", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("explains each missing or invalid field", () => {
    const errors = validateContact({ name: " ", email: "", company: "", topic: "", message: "short" });
    expect(errors).toEqual({
      name: "Enter your name.",
      email: "Enter your email so I can reply.",
      topic: "Choose a topic.",
      message: "Write at least 20 characters (5 so far).",
    });
  });

  it("rejects malformed email addresses", () => {
    expect(validateContact({ ...valid, email: "sam@company" }).email).toMatch(/name@company.com/);
  });
});

describe("composeEmail", () => {
  it("builds a subject and an encoded mailto link", () => {
    const email = composeEmail(valid, "yara@example.com");
    expect(email.subject).toBe("A role I'm hiring for: message from Sam Recruiter (Acme & Co)");
    expect(email.body.split("\n").at(-1)).toBe("Acme & Co");
    expect(email.href.startsWith("mailto:yara@example.com?subject=")).toBe(true);
    expect(email.href).toContain("%26"); // "&" in the company name is encoded
    expect(decodeURIComponent(email.href.split("&body=")[1] ?? "")).toBe(email.body);
  });

  it("omits the company when it is blank", () => {
    const email = composeEmail({ ...valid, company: "  " }, "yara@example.com");
    expect(email.subject).not.toContain("(");
    expect(email.body.split("\n").at(-1)).toBe("sam@company.com");
  });
});

describe("filterCertifications", () => {
  it("returns everything by default", () => {
    expect(filterCertifications("", "all")).toHaveLength(certifications.length);
  });
  it("filters by status and by name or issuer, case-insensitively", () => {
    expect(filterCertifications("", "expired")).toHaveLength(3);
    expect(filterCertifications("CLOUD", "all").length).toBeGreaterThan(0);
    expect(filterCertifications("cloud", "expired").map((c) => c.status)).toEqual(["expired"]);
    expect(filterCertifications("no such thing", "all")).toHaveLength(0);
  });
});

describe("summaryAsText", () => {
  it("produces a plain-text block with one line per field", () => {
    const text = summaryAsText();
    expect(text.split("\n")[0]).toBe("Yara Al-Mansouri, PhD: quick summary");
    expect(text).toContain("Contact: yara.almansouri@mail.example");
  });
});
