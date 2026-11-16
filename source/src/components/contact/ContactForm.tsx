import { useId, useRef, useState, type SyntheticEvent } from "react";
import { profile } from "@/data/profile";
import { copyText } from "@/lib/clipboard";
import {
  composeEmail,
  CONTACT_TOPICS,
  MESSAGE_MAX,
  validateContact,
  type ContactErrors,
  type ContactFields,
} from "@/lib/contact";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useToast } from "@/components/ui/toast-context";
import styles from "./Contact.module.css";

const EMPTY: ContactFields = { name: "", email: "", company: "", topic: "", message: "" };
type Field = keyof ContactFields;

/**
 * Validates on submit, then re-validates each field as it is corrected. With no backend, a valid
 * message is composed into an email the visitor sends from their own client; nothing is stored.
 */
export function ContactForm() {
  const id = useId();
  const notify = useToast();
  const [fields, setFields] = useState<ContactFields>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [draft, setDraft] = useState<ReturnType<typeof composeEmail> | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const ready = useRef<HTMLDivElement>(null);

  const fieldId = (name: Field) => `${id}-${name}`;
  const errorId = (name: Field) => `${id}-${name}-error`;

  const update = (name: Field, value: string) => {
    const next = { ...fields, [name]: value };
    setFields(next);
    if (errors[name]) setErrors((current) => ({ ...current, [name]: validateContact(next)[name] }));
  };

  const submit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateContact(fields);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(first))}`)?.focus();
      return;
    }
    setDraft(composeEmail(fields, profile.email));
    requestAnimationFrame(() => ready.current?.focus());
  };

  const describe = (name: Field) =>
    errors[name] ? { "aria-invalid": true, "aria-describedby": errorId(name) } : { "aria-invalid": false };
  const error = (name: Field) =>
    errors[name] ? (
      <span className={styles.error} id={errorId(name)}>
        {errors[name]}
      </span>
    ) : null;

  const fullText = draft ? `To: ${profile.email}\nSubject: ${draft.subject}\n\n${draft.body}` : "";

  return (
    <form ref={form} className={styles.form} noValidate onSubmit={submit} aria-describedby={`${id}-hint`}>
      <div className={styles.field}>
        <label htmlFor={fieldId("name")}>Your name</label>
        <input
          id={fieldId("name")}
          className={styles.input}
          autoComplete="name"
          value={fields.name}
          onChange={(e) => update("name", e.target.value)}
          {...describe("name")}
        />
        {error("name")}
      </div>
      <div className={styles.field}>
        <label htmlFor={fieldId("email")}>Email</label>
        <input
          id={fieldId("email")}
          className={styles.input}
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={(e) => update("email", e.target.value)}
          {...describe("email")}
        />
        {error("email")}
      </div>
      <div className={styles.field}>
        <label htmlFor={fieldId("company")}>
          Company <small>optional</small>
        </label>
        <input
          id={fieldId("company")}
          className={styles.input}
          autoComplete="organization"
          value={fields.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={fieldId("topic")}>Topic</label>
        <select
          id={fieldId("topic")}
          className={styles.input}
          value={fields.topic}
          onChange={(e) => update("topic", e.target.value)}
          {...describe("topic")}
        >
          <option value="">Choose a topic</option>
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
        {error("topic")}
      </div>
      <div className={`${styles.field} ${styles.full}`}>
        <label htmlFor={fieldId("message")}>
          Message{" "}
          <small aria-live="polite">
            {fields.message.length} / {MESSAGE_MAX}
          </small>
        </label>
        <textarea
          id={fieldId("message")}
          className={styles.input}
          maxLength={MESSAGE_MAX}
          value={fields.message}
          onChange={(e) => update("message", e.target.value)}
          {...describe("message")}
        />
        {error("message")}
      </div>
      <div className={`${styles.submitRow} ${styles.full}`}>
        <Button type="submit" variant="primary">
          Prepare email
        </Button>
        <p className={styles.hint} id={`${id}-hint`}>
          Opens in your email app, addressed to me. Nothing is stored here.
        </p>
      </div>
      {draft && (
        <div
          ref={ready}
          className={`${styles.ready} ${styles.full}`}
          tabIndex={-1}
          role="region"
          aria-label="Your email is ready"
        >
          <h3>Your email is ready</h3>
          <p>Send it from your email app, or copy it. I read every message.</p>
          <pre>{fullText}</pre>
          <div className={styles.row}>
            <ButtonLink variant="primary" size="small" href={draft.href}>
              Open in email app
            </ButtonLink>
            <Button
              size="small"
              onClick={() =>
                void copyText(fullText).then((ok) =>
                  notify(ok ? "Message copied" : "Copy is blocked here. Select the text and copy it."),
                )
              }
            >
              Copy message
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
