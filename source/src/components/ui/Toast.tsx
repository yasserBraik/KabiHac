import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ToastContext, type Notify } from "./toast-context";
import styles from "./Toast.module.css";

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [message, setMessage] = useState<{ id: number; text: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const notify = useCallback<Notify>((text) => {
    window.clearTimeout(timer.current);
    setMessage({ id: Date.now(), text });
    timer.current = window.setTimeout(() => setMessage(null), 2400);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div role="status" aria-live="polite" className={styles.region}>
        {message && (
          <p key={message.id} className={styles.toast}>
            {message.text}
          </p>
        )}
      </div>
    </ToastContext.Provider>
  );
}
