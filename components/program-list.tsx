import type { Program } from "@/lib/content";

type Props = { programs: Program[]; compact?: boolean };

export default function ProgramList({ programs, compact = false }: Props) {
  return (
    <div className="ledger">
      {programs.map((p) => (
        <details key={p.slug} id={p.slug}>
          <summary>
            <span className="l-no">{p.no}</span>
            <span className="l-title">{p.title}</span>
            <span className="l-meta">{p.faction}</span>
            <span className="l-plus" aria-hidden="true" />
          </summary>
          <div className="l-body">
            <div className="l-copy">
              <div>
                <p style={{ marginBottom: ".75rem" }}>{p.lead}</p>
                {!compact && <p className="small muted">{p.body}</p>}
                <p className="small" style={{ marginTop: ".75rem", color: "var(--ink)" }}>
                  <b>Indikator:</b> {p.output}
                </p>
              </div>
              <ul className="l-items">
                {p.items.map((item) => (
                  <li key={item.name}>
                    <b>{item.name}</b>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
