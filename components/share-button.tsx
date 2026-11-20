"use client";

import { useState } from "react";

export default function ShareButton() {
  const [label, setLabel] = useState("Bagikan halaman ini");

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "ARUTALA 2027", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setLabel("Tautan disalin");
      window.setTimeout(() => setLabel("Bagikan halaman ini"), 2000);
    } catch {
      setLabel("Salin manual dari bilah alamat");
    }
  };

  return (
    <button type="button" className="btn btn--ghost btn--sm" onClick={share} style={{ width: "100%" }}>
      {label}
    </button>
  );
}
