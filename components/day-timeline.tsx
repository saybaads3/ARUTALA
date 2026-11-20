"use client";

import { useState } from "react";
import { rundown, type Day } from "@/lib/content";

const phases = ["Semua", "Pra", "Lapangan", "Pasca"] as const;

export default function DayTimeline() {
  const [phase, setPhase] = useState<(typeof phases)[number]>("Semua");
  const days: Day[] = rundown.filter((d) => (phase === "Semua" ? true : d.phase === phase));

  return (
    <div>
      <div className="phase-tabs" role="group" aria-label="Filter fase kegiatan">
        {phases.map((p) => (
          <button key={p} type="button" className="chip" aria-pressed={phase === p} onClick={() => setPhase(p)}>
            {p === "Semua" ? "Semua fase" : p === "Lapangan" ? "Lapangan 7-21 Jan" : p}
          </button>
        ))}
      </div>

      <div className="days">
        {days.map((d) => (
          <div className="day" key={d.date}>
            <div className="day__date">
              {d.date}
              <small>
                {d.day} · {d.phase}
              </small>
            </div>
            <ul className="day__items">
              {d.items.map((item) => (
                <li key={item.time + item.agenda}>
                  <time>{item.time}</time>
                  <span>
                    {item.agenda}
                    {item.note && <small>{item.note}</small>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
