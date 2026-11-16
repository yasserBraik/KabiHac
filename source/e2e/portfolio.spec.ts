import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const errors: string[] = [];
/**
 * Collects script errors and failed requests to our own origin. Third-party hosts (web fonts) are
 * excluded so the suite also runs offline; the page falls back to system fonts when they fail.
 */
function trackErrors(page: Page) {
  errors.length = 0;
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("requestfailed", (r) => {
    if (new URL(r.url()).hostname === "localhost") errors.push(`${r.url()}: ${r.failure()?.errorText ?? ""}`);
  });
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errors.push(m.text());
  });
}

test.beforeEach(async ({ page }) => {
  // Keep the suite hermetic: answer web-font requests locally so results never depend on the network.
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/css",
      headers: { "access-control-allow-origin": "*" },
      body: "",
    }),
  );
  trackErrors(page);
});

test.afterEach(() => {
  expect(errors, "console or page errors").toEqual([]);
});

test("renders every section without horizontal overflow", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Yara");
  for (const name of [
    /selected work/i,
    /experience/i,
    /skills/i,
    /recognition|research/i,
    /contact|work together/i,
  ]) {
    await expect(page.getByRole("region", { name }).first()).toBeAttached();
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("has no detectable accessibility violations in day or night theme", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  const day = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(day.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual(
    [],
  );

  await page
    .getByRole("button", { name: /night|dark|theme/i })
    .first()
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  const night = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    night.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
  ).toEqual([]);
});

test("opens a project from a deep link, steps through with the keyboard and passes axe", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./#savings");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const first = await dialog.getByRole("heading", { level: 2 }).textContent();
  const scan = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();
  expect(scan.violations.map((v) => v.id)).toEqual([]);

  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading", { level: 2 })).not.toHaveText(first ?? "");
  await expect(page).not.toHaveURL(/#savings$/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  expect(new URL(page.url()).hash).toBe("");
});

test("filters projects by stack", async ({ page }) => {
  await page.goto("./");
  const filters = page.getByRole("group", { name: "Filter projects by stack" });
  await filters.getByRole("button", { name: /React Native/ }).click();
  await expect(page.getByText("3 projects use React Native")).toBeAttached();
  await expect(page.locator('article[data-dimmed="true"]')).toHaveCount(5);
});

test("validates the contact form and prepares an email", async ({ page }) => {
  await page.goto("./#contact");
  await page.getByRole("button", { name: "Prepare email" }).click();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await page.getByLabel("Your name").fill("Sam");
  await page.getByLabel("Email").fill("sam@company.com");
  await page.getByLabel("Topic").selectOption("Speaking invitation");
  await page.getByLabel(/Message/).fill("Would you keynote our design conference in May?");
  await page.getByRole("button", { name: "Prepare email" }).click();
  await expect(page.getByRole("link", { name: "Open in email app" })).toHaveAttribute("href", /^mailto:/);
});

test("serves the CV next to the page", async ({ page, request }) => {
  await page.goto("./");
  const res = await request.get("./cv.pdf");
  expect(res.ok()).toBe(true);
  expect(res.headers()["content-type"]).toContain("pdf");
});
