import type { ReactNode } from "react";
import type { ProjectId, Tint } from "@/data/types";
import styles from "./Illustration.module.css";

/**
 * Original, explanatory illustrations for each project. They describe the idea, never restate
 * the project's figures (those appear once, in the figure row). Colours are fixed because the
 * drawings are printed "cards" that keep their palette in both themes.
 */

const TINT: Record<Tint, string> = { sun: "#FFE58A", blue: "#CBD4FF", mint: "#C4F0DC", coral: "#FFCDBF" };
const INK = "#15171C";
const PAPER = "#F6F6F2";

function Frame({ tint, drawn, children }: { tint: Tint; drawn: boolean; children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 250" className={styles.svg} data-drawn={drawn} aria-hidden="true" focusable="false">
      <rect width="400" height="250" fill={TINT[tint]} />
      {children}
    </svg>
  );
}

const Note = ({ x, y, children }: { x: number; y: number; children: ReactNode }) => (
  <text x={x} y={y} className={styles.note}>
    {children}
  </text>
);
const Label = ({
  x,
  y,
  children,
  anchor,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "middle";
}) => (
  <text x={x} y={y} className={styles.label} textAnchor={anchor}>
    {children}
  </text>
);

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

function Mizan() {
  return (
    <>
      {GREENS.map((colour, i) => (
        <rect
          key={colour}
          x={28 + (i % 4) * 30}
          y={48 + Math.floor(i / 4) * 30}
          width="24"
          height="24"
          fill={colour}
        />
      ))}
      <path className={styles.mark} d="M160 96 H226" />
      <circle cx="260" cy="96" r="24" fill={INK} />
      <rect x="236" y="140" width="128" height="34" rx="17" fill={INK} />
      <text x="300" y="162" textAnchor="middle" fill={PAPER} className={styles.ui}>
        Continue
      </text>
      <Note x={28} y={160}>
        before: every team
      </Note>
      <Note x={28} y={176}>
        picks its own
      </Note>
      <Note x={292} y={100}>
        1 token
      </Note>
      <Note x={236} y={196}>
        after: one component
      </Note>
      <Label x={28} y={226}>
        Illustration: from many variants to one token
      </Label>
    </>
  );
}

function Telemedicine() {
  const bar = (x: number, before: number, after: number) => (
    <>
      <rect x={x} y={200 - before} width="70" height={before} fill="none" stroke={INK} strokeWidth="1.5" />
      <rect x={x} y={200 - after} width="70" height={after} fill={INK} />
      <line className={styles.mark} x1={x + 80} y1={200 - before} x2={x + 80} y2={200 - after} />
    </>
  );
  return (
    <>
      <line x1="40" y1="200" x2="370" y2="200" stroke={INK} />
      {bar(80, 143, 39)}
      {bar(230, 130, 20)}
      <Note x={166} y={110}>
        shorter
      </Note>
      <Note x={316} y={130}>
        fewer
      </Note>
      <Label x={80} y={218}>
        Average wait
      </Label>
      <Label x={230} y={218}>
        Dropped calls
      </Label>
      <Label x={40} y={242}>
        Illustration: outline is before, solid is after
      </Label>
    </>
  );
}

function Hirfa() {
  const card = (x: number, rtl: boolean) => (
    <g>
      <rect x={x} y="40" width="156" height="120" fill={PAPER} stroke={INK} />
      <rect x={rtl ? x + 86 : x + 14} y="56" width="56" height="7" fill="#7D828B" />
      <rect x={rtl ? x + 46 : x + 14} y="74" width="96" height="10" fill={INK} />
      <rect x={x + 14} y="98" width="128" height="6" fill="#E2E4DE" />
      <rect x={rtl ? x + 62 : x + 14} y="98" width="80" height="6" fill={INK} />
      <rect x={rtl ? x + 14 : x + 82} y="124" width="60" height="22" rx="11" fill={INK} />
      <text x={rtl ? x + 44 : x + 112} y="139" textAnchor="middle" fill={PAPER} className={styles.ui}>
        {rtl ? "←" : "→"}
      </text>
      <Label x={x} y={178}>
        {rtl ? "Right to left" : "Left to right"}
      </Label>
    </g>
  );
  return (
    <>
      {card(30, false)}
      {card(214, true)}
      <path className={styles.mark} d="M108 192 C 150 222, 250 222, 292 192" />
      <Note x={148} y={236}>
        same component, mirrored
      </Note>
    </>
  );
}

function Khatt() {
  const lines = (x: number, width: number, gap: number, height: number, count: number) =>
    Array.from({ length: count }, (_, i) => {
      const short = i % 3 === 2;
      return (
        <rect
          key={i}
          x={x + (short ? width * 0.3 : 0)}
          y={48 + i * gap}
          width={short ? width * 0.7 : width}
          height={height}
          fill={INK}
        />
      );
    });
  return (
    <>
      <rect x="24" y="34" width="160" height="150" fill={PAPER} stroke={INK} />
      {lines(36, 136, 11, 4, 12)}
      <rect x="216" y="34" width="160" height="150" fill={PAPER} stroke={INK} />
      {lines(236, 110, 22, 7, 6)}
      <path className={styles.mark} d="M236 196 H346 M236 190 V202 M346 190 V202" />
      <path className={styles.mark} d="M358 48 V70" />
      <Note x={250} y={214}>
        shorter measure
      </Note>
      <Note x={300} y={28}>
        more leading
      </Note>
      <Label x={24} y={200}>
        Dense default
      </Label>
      <Label x={24} y={240}>
        Illustration: dense default versus adapted text
      </Label>
    </>
  );
}

function Savings() {
  const circumference = 2 * Math.PI * 46;
  return (
    <>
      <rect x="40" y="28" width="110" height="196" rx="16" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <circle cx="95" cy="98" r="46" fill="none" stroke="#E2E4DE" strokeWidth="10" />
      <circle
        cx="95"
        cy="98"
        r="46"
        fill="none"
        stroke={INK}
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.38}
        transform="rotate(-90 95 98)"
      />
      <rect x="58" y="162" width="74" height="8" fill="#7D828B" />
      <rect x="58" y="178" width="50" height="8" fill="#7D828B" />
      <rect x="58" y="196" width="74" height="16" rx="8" fill={INK} />
      <path className={styles.mark} d="M152 98 H200 M152 170 H200" />
      <Note x={206} y={94}>
        progress
      </Note>
      <Note x={206} y={110}>
        towards a goal
      </Note>
      <Note x={206} y={166}>
        goal-setting
      </Note>
      <Note x={206} y={182}>
        flow
      </Note>
      <Label x={206} y={232}>
        Illustration
      </Label>
    </>
  );
}

function Qalam() {
  return (
    <>
      <rect x="28" y="30" width="344" height="164" fill={INK} />
      {[42, 54, 66].map((cx) => (
        <circle key={cx} cx={cx} cy="42" r="3.5" fill="#7D828B" />
      ))}
      <text x="44" y="78" className={styles.code} fill="#C9A0FF">
        let
      </text>
      <text x="74" y="78" className={styles.code} fill={PAPER}>
        name = <tspan fill="#9FD8A6">&quot;Yara&quot;</tspan>;
      </text>
      <text x="44" y="102" className={styles.code} fill={PAPER}>
        console.log(nmae);
      </text>
      <path className={styles.mark} d="M140 108 q4 4 8 0 t8 0 t8 0 t8 0 t8 0" />
      <rect x="44" y="124" width="312" height="52" fill="#2B2F38" />
      <rect x="44" y="124" width="3" height="52" fill="#E0412A" />
      <rect x="58" y="138" width="200" height="6" fill={PAPER} opacity="0.75" />
      <rect x="58" y="154" width="140" height="6" fill={PAPER} opacity="0.5" />
      <Note x={28} y={214}>
        the explanation panel
      </Note>
      <Label x={28} y={236}>
        Illustration
      </Label>
    </>
  );
}

function Dalil() {
  return (
    <>
      <rect x="24" y="28" width="230" height="180" fill={PAPER} stroke={INK} />
      <rect x="24" y="28" width="230" height="18" fill="#E2E4DE" stroke={INK} />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x="40" y={62 + i * 22} width={120 + ((i * 37) % 70)} height="8" fill="#7D828B" />
      ))}
      <rect x="270" y="28" width="108" height="180" fill={INK} />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x="282" y={44 + i * 22} width="10" height="10" fill={i < 5 ? PAPER : "#E0412A"} />
          <rect x="298" y={46 + i * 22} width={40 + ((i * 13) % 30)} height="6" fill={PAPER} opacity="0.6" />
        </g>
      ))}
      <path className={styles.mark} d="M160 140 C 200 140, 220 168, 278 166" />
      <Note x={120} y={226}>
        issues found, each with its fix
      </Note>
      <Label x={24} y={244}>
        Illustration
      </Label>
    </>
  );
}

function Rafeeq() {
  const routes = [
    "M40 50 C150 50 180 125 290 125",
    "M40 125 C150 125 200 125 290 125",
    "M40 200 C150 200 180 125 290 125",
  ];
  return (
    <>
      {routes.map((d, i) => (
        <g key={d}>
          <circle cx="40" cy={[50, 125, 200][i]} r="6" fill={INK} />
          <path d={d} fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="4 4" />
        </g>
      ))}
      <path d="M290 125 H350" stroke={INK} strokeWidth="3" />
      <rect x="350" y="105" width="34" height="40" fill={INK} />
      <Label x={50} y={40}>
        campus
      </Label>
      <Label x={50} y={116}>
        timetable
      </Label>
      <Label x={50} y={222}>
        route
      </Label>
      <circle className={styles.mark} cx="290" cy="125" r="14" />
      <Note x={240} y={96}>
        matched ride
      </Note>
      <Label x={200} y={238}>
        Illustration
      </Label>
    </>
  );
}

const DRAWINGS: Record<ProjectId, () => ReactNode> = {
  mizan: Mizan,
  telemedicine: Telemedicine,
  hirfa: Hirfa,
  khatt: Khatt,
  savings: Savings,
  qalam: Qalam,
  dalil: Dalil,
  rafeeq: Rafeeq,
};

export function Illustration({
  project,
  tint,
  drawn = true,
}: {
  project: ProjectId;
  tint: Tint;
  drawn?: boolean;
}) {
  const Drawing = DRAWINGS[project];
  return (
    <Frame tint={tint} drawn={drawn}>
      <Drawing />
    </Frame>
  );
}
