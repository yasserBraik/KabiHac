import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";
import { ContactForm } from "@/components/contact/ContactForm";
import { Dialog } from "@/components/ui/Dialog";
import { Tabs } from "@/components/ui/Tabs";
import { ToastProvider } from "@/components/ui/Toast";

function TabsHarness() {
  const [tab, setTab] = useState<"a" | "b" | "c">("a");
  return (
    <Tabs
      label="Demo"
      selected={tab}
      onSelect={setTab}
      items={[
        { id: "a", label: "Alpha", content: <p>Panel A</p> },
        { id: "b", label: "Beta", content: <p>Panel B</p> },
        { id: "c", label: "Gamma", content: <p>Panel C</p> },
      ]}
    />
  );
}

describe("Tabs", () => {
  it("follows the WAI-ARIA tabs pattern with arrow, Home and End keys", async () => {
    const user = userEvent.setup();
    render(<TabsHarness />);
    const [alpha, beta, gamma] = screen.getAllByRole("tab");
    expect(alpha).toHaveAttribute("aria-selected", "true");
    expect(beta).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel A");

    alpha!.focus();
    await user.keyboard("{ArrowRight}");
    expect(beta).toHaveFocus();
    expect(beta).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel B");

    await user.keyboard("{End}");
    expect(gamma).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(alpha).toHaveFocus(); // wraps around
    await user.keyboard("{ArrowLeft}");
    expect(gamma).toHaveFocus();
  });
});

function DialogHarness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} labelledBy="t">
        <h2 id="t">Title</h2>
        <button type="button" data-autofocus>
          First
        </button>
        <button type="button">Last</button>
      </Dialog>
    </>
  );
}

describe("Dialog", () => {
  it("moves focus in, traps Tab, closes on Escape and restores focus", async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);
    const opener = screen.getByRole("button", { name: "Open" });
    await user.click(opener);
    const dialog = screen.getByRole("dialog", { name: "Title" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    await user.tab();
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus(); // wrapped

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });
});

describe("ContactForm", () => {
  it("flags every problem, focuses the first, then composes the email", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ContactForm />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Prepare email" }));
    const name = screen.getByLabelText("Your name");
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Enter your name.");
    expect(screen.getByLabelText("Topic")).toHaveAccessibleDescription("Choose a topic.");

    await user.type(name, "Sam");
    expect(name).toHaveAttribute("aria-invalid", "false");
    await user.type(screen.getByLabelText("Email"), "sam@company.com");
    await user.selectOptions(screen.getByLabelText("Topic"), "Speaking invitation");
    await user.type(screen.getByLabelText(/Message/), "Would you keynote our design conference in May?");
    await user.click(screen.getByRole("button", { name: "Prepare email" }));

    const ready = screen.getByRole("region", { name: "Your email is ready" });
    const link = within(ready).getByRole("link", { name: "Open in email app" });
    expect(link.getAttribute("href")).toMatch(
      /^mailto:yara\.almansouri@mail\.example\?subject=Speaking%20invitation/,
    );
  });
});

describe("App", () => {
  it("opens a project from its card, steps with the arrow keys and closes back to the page", async () => {
    const user = userEvent.setup();
    render(<App />);
    const work = screen.getByRole("region", { name: /selected work/i });
    await user.click(within(work).getByRole("button", { name: "Hirfa UI" }));
    const dialog = screen.getByRole("dialog", { name: "Hirfa UI" });
    expect(window.location.hash).toBe("#hirfa");
    expect(
      within(dialog).getByText("Open Source Impact Award, Arab Open Source Foundation, 2022"),
    ).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("dialog", { name: "Khatt Typography Engine" })).toBeInTheDocument();
    expect(window.location.hash).toBe("#khatt");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.location.hash).toBe("");
  });

  it("checks role fit and links each match to its evidence", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("tab", { name: "Hiring? Check the fit" }));
    await user.click(screen.getByRole("button", { name: "Try a sample role" }));
    expect(screen.getByText(/requirements I recognised are covered/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "See evidence for Accessibility" }));
    expect(screen.getByRole("dialog", { name: "Dalil Accessibility Toolkit" })).toBeInTheDocument();
  });

  it("filters projects by stack and announces the result", async () => {
    const user = userEvent.setup();
    render(<App />);
    const filters = screen.getByRole("group", { name: "Filter projects by stack" });
    await user.click(within(filters).getByRole("button", { name: /React Native/ }));
    expect(screen.getByText("3 projects use React Native")).toBeInTheDocument();
    const dimmed = document.querySelectorAll('article[data-dimmed="true"]');
    expect(dimmed).toHaveLength(5);
  });
});
