import { useEffect, useId, useState, type ReactNode } from "react";
import type { ProjectId } from "@/data/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./Demo.module.css";

/* -------------------------------------------------------------------------- */
/* Shared parts                                                                */
/* -------------------------------------------------------------------------- */

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className={styles.segmented}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Frame({
  caption,
  control,
  children,
}: {
  caption: string;
  control?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={styles.demo} aria-label={`Demo: ${caption}`}>
      <p className={styles.caption}>
        <span>Try it · {caption}</span>
        {control}
      </p>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Demos                                                                       */
/* -------------------------------------------------------------------------- */

const GREENS = [
  "#2E8B57",
  "#3CB371",
  "#1F6F4A",
  "#5FD38D",
  "#228B22",
  "#4CAF50",
  "#2F9E6E",
  "#66BB6A",
  "#1B5E20",
  "#43A047",
  "#00A86B",
];

function MizanDemo() {
  const [after, setAfter] = useState(false);
  return (
    <Frame
      caption="the audit finding, before and after"
      control={
        <Segmented
          label="Compare"
          value={after ? "after" : "before"}
          onChange={(v) => setAfter(v === "after")}
          options={[
            { value: "before", label: "Before" },
            { value: "after", label: "With Mizan" },
          ]}
        />
      }
    >
      <ul className={styles.swatches} aria-hidden="true">
        {GREENS.map((colour) => (
          <li
            key={colour}
            style={{ background: after ? "var(--ink)" : colour, borderRadius: after ? "50%" : 0 }}
          />
        ))}
      </ul>
      <p className={styles.status} aria-live="polite">
        {after ? "One shared colour token, used by every team" : "Eleven greens across nine teams"}
      </p>
    </Frame>
  );
}

function TelemedicineDemo() {
  const [after, setAfter] = useState(true);
  const rows = [
    { label: "Average wait", before: 22, after: 6, unit: " min" },
    { label: "Dropped calls", before: 20, after: 3, unit: "%" },
  ];
  return (
    <Frame
      caption="the redesign, before and after"
      control={
        <Segmented
          label="Compare"
          value={after ? "after" : "before"}
          onChange={(v) => setAfter(v === "after")}
          options={[
            { value: "before", label: "Before" },
            { value: "after", label: "After" },
          ]}
        />
      }
    >
      {rows.map((row) => {
        const value = after ? row.after : row.before;
        return (
          <div key={row.label} className={styles.meter}>
            <div className={styles.meterHead}>
              <span>{row.label}</span>
              <strong>
                {value}
                {row.unit}
              </strong>
            </div>
            <div className={styles.track} aria-hidden="true">
              <span
                style={{
                  width: `${(value / row.before) * 100}%`,
                  background: after ? "var(--ink)" : "var(--red)",
                }}
              />
            </div>
          </div>
        );
      })}
    </Frame>
  );
}

const HIRFA_COPY = {
  ltr: { crumbs: "Home › Accounts › Savings", step: "Step 3 of 5", cta: "Continue →" },
  rtl: { crumbs: "الرئيسية ‹ الحسابات ‹ الادخار", step: "الخطوة ٣ من ٥", cta: "متابعة ←" },
} as const;

function HirfaDemo() {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const copy = HIRFA_COPY[dir];
  return (
    <Frame
      caption="one component, two directions"
      control={
        <Segmented
          label="Direction"
          value={dir}
          onChange={setDir}
          options={[
            { value: "ltr", label: "English, LTR" },
            { value: "rtl", label: "Arabic, RTL" },
          ]}
        />
      }
    >
      <div
        dir={dir}
        lang={dir === "rtl" ? "ar" : "en"}
        className={`${styles.mock} ${dir === "rtl" ? styles.mockRtl : ""}`}
      >
        <div className={styles.crumbs}>{copy.crumbs}</div>
        <div>{copy.step}</div>
        <div className={styles.progress} aria-hidden="true">
          <span />
        </div>
        <div className={styles.cta}>
          <span>{copy.cta}</span>
        </div>
      </div>
    </Frame>
  );
}

function KhattDemo() {
  const id = useId();
  const [width, setWidth] = useState(380);
  const [room, setRoom] = useState(3);
  const size = Math.round((15 + ((width - 260) / 380) * 4 + room * 0.7) * 10) / 10;
  const leading = (1.7 + room * 0.05).toFixed(2);
  const spacing = (room * 0.6).toFixed(1);
  return (
    <Frame caption="a simplified version of the idea, not the patented model">
      <label className={styles.slider} htmlFor={`${id}-w`}>
        Screen width: {width}px
      </label>
      <input
        id={`${id}-w`}
        type="range"
        min={260}
        max={640}
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        className={styles.slider}
      />
      <label className={styles.slider} htmlFor={`${id}-r`}>
        Reader needs more room: {room} of 10
      </label>
      <input
        id={`${id}-r`}
        type="range"
        min={0}
        max={10}
        value={room}
        onChange={(e) => setRoom(Number(e.target.value))}
        className={styles.slider}
      />
      <div className={styles.screen} style={{ width }}>
        <p lang="ar" dir="rtl" style={{ fontSize: size, lineHeight: leading, wordSpacing: `${spacing}px` }}>
          النص العربي على الشاشة يحتاج إلى مساحة كي يُقرأ بسهولة.
        </p>
      </div>
      <p className={styles.status} aria-live="polite">
        font size {size}px · line height {leading} · word spacing {spacing}px
      </p>
    </Frame>
  );
}

function SavingsDemo() {
  const steps = [
    { phase: "Listen", value: "48", text: "interviews in 5 cities" },
    { phase: "Test", value: "3", text: "prototypes compared" },
    { phase: "Ship", value: "1", text: "final goal-setting flow" },
  ];
  return (
    <Frame caption="how the flow was found">
      <ol className={styles.steps}>
        {steps.map((s) => (
          <li key={s.phase}>
            <small>{s.phase}</small>
            <strong>{s.value}</strong>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

function QalamDemo() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  return (
    <Frame
      caption="an illustrative Arabic explanation"
      control={
        <Segmented
          label="Error language"
          value={lang}
          onChange={setLang}
          options={[
            { value: "en", label: "Standard error" },
            { value: "ar", label: "Qalam’s explanation" },
          ]}
        />
      }
    >
      <pre className={styles.code}>
        {'let name = "Yara";\nconsole.log('}
        <mark>nmae</mark>
        {");"}
      </pre>
      <p
        className={styles.explain}
        lang={lang}
        dir={lang === "ar" ? "rtl" : "ltr"}
        aria-live="polite"
        style={lang === "ar" ? { fontSize: 18 } : { fontFamily: "var(--font-mono)", fontSize: 14 }}
      >
        {lang === "ar" ? "لم يتم تعريف المتغير nmae. هل تقصد name؟" : "ReferenceError: nmae is not defined"}
      </p>
    </Frame>
  );
}

const CHECKS = 42;

function DalilDemo() {
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(reduce ? CHECKS : 0);
  useEffect(() => {
    if (reduce) {
      setDone(CHECKS);
      return;
    }
    setDone(0);
    const timer = window.setInterval(() => {
      setDone((n) => {
        if (n + 1 >= CHECKS) window.clearInterval(timer);
        return Math.min(CHECKS, n + 1);
      });
    }, 40);
    return () => window.clearInterval(timer);
  }, [run, reduce]);
  return (
    <Frame
      caption="each square is one Arabic-specific check"
      control={
        <button type="button" className={styles.segmented} onClick={() => setRun((r) => r + 1)}>
          <span style={{ padding: "6px 12px" }}>Run again</span>
        </button>
      }
    >
      <ul className={styles.grid} aria-hidden="true">
        {Array.from({ length: CHECKS }, (_, i) => (
          <li key={i} data-on={i < done} />
        ))}
      </ul>
      <p className={styles.status} aria-live="polite">
        {done} of {CHECKS} checks run
      </p>
    </Frame>
  );
}

const DEMOS: Partial<Record<ProjectId, () => ReactNode>> = {
  mizan: MizanDemo,
  telemedicine: TelemedicineDemo,
  hirfa: HirfaDemo,
  khatt: KhattDemo,
  savings: SavingsDemo,
  qalam: QalamDemo,
  dalil: DalilDemo,
};

export function ProjectDemo({ project }: { project: ProjectId }) {
  const Demo = DEMOS[project];
  return Demo ? <Demo /> : null;
}
