import { summary } from "@/data/profile";
import { copyText } from "@/lib/clipboard";
import { summaryAsText } from "@/lib/summary";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/components/ui/toast-context";
import { CvLink } from "./CvLink";
import styles from "./Layout.module.css";

const TITLE = "summary-title";

export function SummaryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const notify = useToast();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={TITLE} placement="center">
      <div className={styles.summaryHead}>
        <h2 id={TITLE}>Quick summary · 30 seconds</h2>
        <Button size="icon" aria-label="Close summary" onClick={onClose} data-autofocus>
          ✕
        </Button>
      </div>
      <dl className={styles.summaryList}>
        {summary.map((row) => (
          <div key={row.label} style={{ display: "contents" }}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.summaryFoot}>
        <Button
          variant="primary"
          size="small"
          onClick={() =>
            void copyText(summaryAsText()).then((ok) =>
              notify(ok ? "Summary copied" : "Copy is blocked here."),
            )
          }
        >
          Copy as text
        </Button>
        <CvLink size="small" />
      </div>
    </Dialog>
  );
}
