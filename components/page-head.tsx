type Props = {
  eyebrow: string;
  title: string;
  lede?: string;
  meta?: string[];
};

export default function PageHead({ eyebrow, title, lede, meta }: Props) {
  return (
    <section className="page-head">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        {lede && <p className="page-lede">{lede}</p>}
        {meta && meta.length > 0 && (
          <div className="page-meta">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
