import { useState } from "react";
import { profile, profileLinks } from "@/data/profile";
import { copyText } from "@/lib/clipboard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/toast-context";
import { ContactForm } from "./ContactForm";
import { RoleFit } from "./RoleFit";
import styles from "./Contact.module.css";

type ContactTab = "message" | "fit";

export function ContactSection() {
  const notify = useToast();
  const [tab, setTab] = useState<ContactTab>("message");
  return (
    <section id="contact" className="page section" aria-labelledby="contact-title">
      <SectionHeader
        id="contact-title"
        index={5}
        accent="sun"
        title="Contact"
        lede="Open to principal and leadership roles, design-system and accessibility work, advisory and speaking."
      />
      <p className={styles.big}>
        Building for readers in <em>both</em> directions? Let’s talk.
      </p>
      <div className={styles.grid}>
        <div>
          <dl className={styles.channels}>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
                <button
                  type="button"
                  className={styles.copy}
                  onClick={() =>
                    void copyText(profile.email).then((ok) =>
                      notify(ok ? "Email address copied" : "Copy is blocked here."),
                    )
                  }
                >
                  Copy<span className="sr-only"> email address</span>
                </button>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={profile.phone.href}>{profile.phone.display}</a>
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>{profile.location}</dd>
            </div>
          </dl>
          <ul className={styles.profiles} aria-label="Profiles">
            {profileLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className={styles.offClock}>
            <strong>Off the clock:</strong> {profile.offTheClock}
          </p>
        </div>
        <div>
          <Tabs
            label="Contact options"
            selected={tab}
            onSelect={setTab}
            listClassName={styles.tabs}
            items={[
              { id: "message", label: "Write to me", content: <ContactForm /> },
              { id: "fit", label: "Hiring? Check the fit", content: <RoleFit /> },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
