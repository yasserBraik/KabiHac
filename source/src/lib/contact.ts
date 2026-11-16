export interface ContactFields {
  name: string;
  email: string;
  company: string;
  topic: string;
  message: string;
}
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export const CONTACT_TOPICS = [
  "A role I'm hiring for",
  "Design system or accessibility work",
  "Advisory or mentoring",
  "Speaking invitation",
  "Something else",
] as const;

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(f: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  if (f.name.trim().length < 2) errors.name = "Enter your name.";
  const email = f.email.trim();
  if (!email) errors.email = "Enter your email so I can reply.";
  else if (!EMAIL.test(email)) errors.email = "Enter an email address like name@company.com.";
  if (!f.topic) errors.topic = "Choose a topic.";
  const length = f.message.trim().length;
  if (length < MESSAGE_MIN) errors.message = `Write at least ${MESSAGE_MIN} characters (${length} so far).`;
  return errors;
}

export function composeEmail(f: ContactFields, to: string): { subject: string; body: string; href: string } {
  const company = f.company.trim();
  const subject = `${f.topic}: message from ${f.name.trim()}${company ? ` (${company})` : ""}`;
  const body = [f.message.trim(), "", f.name.trim(), f.email.trim(), ...(company ? [company] : [])].join(
    "\n",
  );
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { subject, body, href };
}
