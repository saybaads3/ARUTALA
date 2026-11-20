type Props = {
  variant?: "light" | "dark";
  tall?: boolean;
  className?: string;
};

// Motif tenun: dua baris chevron bersilang, dipakai sebagai pemisah seksi.
// Alasan: mengangkat pola anyaman Iban sebagai identitas visual, bukan hiasan acak.
export default function TenunBand({ variant = "light", tall = false, className = "" }: Props) {
  const id = variant === "dark" ? "tenun-dark" : "tenun-light";
  return (
    <svg
      className={`tenun ${variant === "dark" ? "tenun--on-dark" : ""} ${tall ? "tenun--tall" : ""} ${className}`}
      viewBox="0 0 320 26"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={id} width="24" height="26" patternUnits="userSpaceOnUse">
          <path d="M0 9 6 3 12 9 18 3 24 9" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0 17 6 11 12 17 18 11 24 17" fill="none" stroke="currentColor" strokeWidth="1" opacity=".55" />
          <path d="M0 25 6 19 12 25 18 19 24 25" fill="none" stroke="currentColor" strokeWidth="1" opacity=".28" />
          <path d="M12 9v8" stroke="currentColor" strokeWidth=".75" opacity=".35" />
        </pattern>
      </defs>
      <rect width="320" height="26" fill={`url(#${id})`} />
    </svg>
  );
}
