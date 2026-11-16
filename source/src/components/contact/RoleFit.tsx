import { useId, useState } from "react";
import { matchRole, sampleRole, type FitResult } from "@/lib/fit";
import { Button } from "@/components/ui/Button";
import { usePortfolio } from "@/state/portfolio-context";
import styles from "./Contact.module.css";

/** Matches a pasted job description against CV evidence. Runs entirely in the browser. */
export function RoleFit() {
  const id = useId();
  const { goTo } = usePortfolio();
  const [text, setText] = useState("");
  const [result, setResult] = useState<FitResult | null>(null);
  const check = (value: string) => setResult(matchRole(value));

  return (
    <div>
      <label htmlFor={`${id}-job`} className="sr-only">
        Job description
      </label>
      <textarea
        id={`${id}-job`}
        className={styles.jobText}
        placeholder="Paste a job description, or its list of requirements"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            check(text);
          }
        }}
      />
      <div className={styles.row} style={{ margin: "12px 0" }}>
        <Button variant="primary" size="small" onClick={() => check(text)}>
          Check fit
        </Button>
        <Button
          size="small"
          onClick={() => {
            setText(sampleRole);
            check(sampleRole);
          }}
        >
          Try a sample role
        </Button>
        <span className={styles.hint}>Runs in your browser. Nothing is sent or stored.</span>
      </div>
      <div className={styles.result} aria-live="polite">
        {result?.status === "too-short" && (
          <p className={styles.message}>
            That’s too short to compare. Paste a few lines of the job description, or try the sample role.
          </p>
        )}
        {result?.status === "unrecognised" && (
          <p className={styles.message}>
            I didn’t recognise specific skills in that text. Try pasting the requirements section.
          </p>
        )}
        {result?.status === "ok" && (
          <>
            <p className={styles.summary}>
              <span className={styles.percent}>{result.percent}%</span>
              <span>
                <strong>
                  {result.matches.length} of {result.matches.length + result.gaps.length} requirements I
                  recognised are covered
                </strong>
                A keyword match with evidence for each. A starting point for a conversation, not a score.
              </span>
            </p>
            <dl className={styles.matches}>
              {result.matches.map((rule) => (
                <div key={rule.label}>
                  <dt>{rule.label}</dt>
                  <dd>
                    {rule.evidence}.{" "}
                    <button type="button" className={styles.evidence} onClick={() => goTo(rule.target)}>
                      See evidence<span className="sr-only"> for {rule.label}</span>
                    </button>
                  </dd>
                </div>
              ))}
            </dl>
            {result.gaps.length > 0 && (
              <div className={styles.gaps}>
                <h4>Not on my CV yet</h4>
                <p>The role asks for these. Happy to talk about them.</p>
                <ul>
                  {result.gaps.map((gap) => (
                    <li key={gap}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
