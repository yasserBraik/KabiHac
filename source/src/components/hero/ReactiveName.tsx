import { useCallback, useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./Hero.module.css";

const AXES = {
  weight: { min: 200, max: 800, initial: 560 },
  width: { min: 75, max: 100, initial: 88 },
  tracking: { min: -60, max: 40, initial: -35 },
} as const;
type Axis = keyof typeof AXES;
type Settings = Record<Axis, number>;
const INITIAL: Settings = {
  weight: AXES.weight.initial,
  width: AXES.width.initial,
  tracking: AXES.tracking.initial,
};

/** Splits text into user-perceived characters so accents and combined glyphs stay whole. */
function graphemes(text: string): string[] {
  return Array.from(new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text), (s) => s.segment);
}

/** Radius (px) within which letters respond to the pointer. */
const REACH = 260;
const IDLE_DELAY_MS = 2500;

interface Props {
  readonly lines: readonly string[];
  readonly label: string;
}

/**
 * The hero name, set in a variable font. Letters near the pointer grow heavier and narrower;
 * at rest a slow wave of weight runs through them. Optional controls expose the font's axes,
 * with live typographic guides (cap height, x-height, baseline, measure).
 */
export function ReactiveName({ lines, label }: Props) {
  const controlsId = useId();
  const stage = useRef<HTMLDivElement>(null);
  const letters = useRef<HTMLSpanElement[]>([]);
  const guides = useRef<{
    cap?: HTMLDivElement | null;
    x?: HTMLDivElement | null;
    base?: HTMLDivElement | null;
    measure?: HTMLDivElement | null;
    readout?: HTMLSpanElement | null;
  }>({});
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const idle = useRef(false);
  const settings = useRef<Settings>({ ...INITIAL });
  const [values, setValues] = useState<Settings>(INITIAL);
  const [showControls, setShowControls] = useState(false);
  const measuring = useRef(false);
  measuring.current = showControls;

  const measure = useCallback(() => {
    const host = stage.current;
    const lastLine = host?.querySelector<HTMLElement>(`.${styles.line}:last-child`);
    const g = guides.current;
    if (!host || !lastLine || !g.cap || !g.x || !g.base || !g.measure || !g.readout) return;
    const hostBox = host.getBoundingClientRect();
    const lineBox = lastLine.getBoundingClientRect();
    const font = getComputedStyle(lastLine);
    const size = parseFloat(font.fontSize);
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return;
    ctx.font = `${settings.current.weight} ${size}px ${font.fontFamily}`;
    const cap = ctx.measureText("H").actualBoundingBoxAscent || size * 0.7;
    const xHeight = ctx.measureText("x").actualBoundingBoxAscent || size * 0.5;
    const metrics = ctx.measureText("Hg");
    const ascent = metrics.fontBoundingBoxAscent || size * 0.9;
    const descent = metrics.fontBoundingBoxDescent || size * 0.25;
    const baseline = lineBox.top - hostBox.top + (lineBox.height + ascent - descent) / 2;
    g.base.style.top = `${baseline}px`;
    g.x.style.top = `${baseline - xHeight}px`;
    g.cap.style.top = `${baseline - cap}px`;
    g.measure.style.left = `${lineBox.left - hostBox.left}px`;
    g.measure.style.width = `${lineBox.width}px`;
    g.readout.textContent = `${Math.round(lineBox.width)} px · ${settings.current.weight} wght · ${settings.current.width} wdth`;
  }, []);

  const paint = useCallback(
    (time: number) => {
      const { weight, width, tracking } = settings.current;
      if (stage.current) stage.current.style.letterSpacing = `${tracking / 1000}em`;
      const near = pointer.current;
      const boxes = near ? letters.current.map((l) => l.getBoundingClientRect()) : [];
      letters.current.forEach((letter, i) => {
        let pull = 0;
        if (near) {
          const box = boxes[i];
          if (box) {
            const distance = Math.hypot(
              box.left + box.width / 2 - near.x,
              (box.top + box.height / 2 - near.y) * 1.4,
            );
            pull = Math.max(0, 1 - distance / REACH);
          }
        } else if (idle.current) {
          pull = Math.max(0, Math.sin(time / 650 - i * 0.55)) ** 3 * 0.7;
        }
        const thin = near ? (weight - AXES.weight.min) * 0.35 * (1 - pull) : 0;
        letter.style.fontWeight = String(Math.round(weight + (AXES.weight.max - weight) * pull - thin));
        letter.style.fontVariationSettings = `"opsz" 96, "wdth" ${Math.round(width - (width - AXES.width.min) * pull * 0.9)}`;
        letter.dataset.hot = String(near !== null && pull > 0.55);
      });
      if (measuring.current) measure();
    },
    [measure],
  );

  // Animation loop: runs only while the name is on screen and something is moving.
  useEffect(() => {
    const reduce = prefersReducedMotion();
    let frame = 0;
    let visible = true;
    let introIdle = 0;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
    });
    if (stage.current) observer.observe(stage.current);
    const loop = (time: number) => {
      if (visible && (pointer.current || idle.current)) paint(time);
      frame = requestAnimationFrame(loop);
    };
    const start = performance.now();
    const intro = (time: number) => {
      // The page's one orchestrated moment: the weight sweeps from hairline to its resting value.
      const t = Math.min(1, (time - start) / 1500);
      settings.current.weight = Math.round(
        AXES.weight.min + (INITIAL.weight - AXES.weight.min) * (1 - (1 - t) ** 3),
      );
      paint(time);
      if (t < 1) frame = requestAnimationFrame(intro);
      else {
        introIdle = window.setTimeout(() => (idle.current = true), 1500);
        frame = requestAnimationFrame(loop);
      }
    };
    const fontsReady = "fonts" in document ? document.fonts.ready : Promise.resolve();
    void fontsReady.then(() => {
      if (reduce) paint(0);
      else frame = requestAnimationFrame(intro);
    });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(introIdle);
      observer.disconnect();
    };
  }, [paint]);

  const idleTimer = useRef(0);
  const scheduleIdle = (delay: number) => {
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => (idle.current = !prefersReducedMotion()), delay);
  };
  const onPointerMove = (event: PointerEvent) => {
    pointer.current = { x: event.clientX, y: event.clientY };
    idle.current = false;
    window.clearTimeout(idleTimer.current);
  };
  const onPointerLeave = () => {
    pointer.current = null;
    paint(performance.now());
    scheduleIdle(IDLE_DELAY_MS);
  };
  /** A tap or click makes the touched letter bounce. Decorative only. */
  const onPointerDown = (event: PointerEvent) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.classList.contains(styles.letter ?? ""))
      target.dataset.pop = "true";
  };
  const setAxis = (axis: Axis, value: number) => {
    settings.current[axis] = value;
    setValues({ ...settings.current });
    idle.current = false;
    paint(performance.now());
    scheduleIdle(4000);
  };
  const reset = () => {
    settings.current = { ...INITIAL };
    setValues(INITIAL);
    paint(performance.now());
  };

  useEffect(() => {
    if (!showControls) return;
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [showControls, measure]);

  let index = 0;
  return (
    <>
      {/* Pointer tracking is decorative; the name is fully readable without it. */}
      <div
        ref={stage}
        className={styles.stage}
        data-measuring={showControls}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
      >
        <h1 className={styles.name} aria-label={label}>
          {lines.map((line) => (
            <span key={line} className={styles.line} aria-hidden="true">
              {graphemes(line).map((char) => {
                const i = index++;
                return (
                  <span
                    key={i}
                    className={styles.letter}
                    ref={(node) => {
                      if (node) letters.current[i] = node;
                    }}
                    onAnimationEnd={(e) => (e.currentTarget.dataset.pop = "false")}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>
        <div
          className={styles.guide}
          ref={(n) => {
            guides.current.cap = n;
          }}
          aria-hidden="true"
        >
          <span>cap height</span>
        </div>
        <div
          className={styles.guide}
          ref={(n) => {
            guides.current.x = n;
          }}
          aria-hidden="true"
        >
          <span>x-height</span>
        </div>
        <div
          className={styles.guide}
          ref={(n) => {
            guides.current.base = n;
          }}
          aria-hidden="true"
        >
          <span>baseline</span>
        </div>
        <div
          className={styles.measure}
          ref={(n) => {
            guides.current.measure = n;
          }}
          aria-hidden="true"
        >
          <span
            ref={(n) => {
              guides.current.readout = n;
            }}
          />
        </div>
      </div>
      <div className={styles.bar}>
        <span>Move over my name. It reacts.</span>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={showControls}
          aria-controls={controlsId}
          onClick={() => setShowControls((v) => !v)}
        >
          {showControls ? "Close the type controls" : "Open the type controls"}
        </button>
      </div>
      <div
        id={controlsId}
        className={styles.controls}
        role="group"
        aria-label="Type controls"
        hidden={!showControls}
      >
        {(Object.keys(AXES) as Axis[]).map((axis) => (
          <label key={axis}>
            {axis[0]?.toUpperCase()}
            {axis.slice(1)}: {values[axis]}
            <input
              type="range"
              min={AXES[axis].min}
              max={AXES[axis].max}
              value={values[axis]}
              onChange={(e) => setAxis(axis, Number(e.target.value))}
            />
          </label>
        ))}
        <button type="button" className={styles.toggle} onClick={reset}>
          Reset
        </button>
      </div>
    </>
  );
}
