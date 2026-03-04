"use client";

import { useEffect, useRef } from "react";

export const AD_POSITIONS = {
  HOMEPAGE_HERO_BOTTOM: "hero-bottom",
  HOMEPAGE_BRANCHES_MIDDLE: "branches-middle",
  HOMEPAGE_FOOTER: "footer",
  SUBJECT_TOP: "subject-top",
  SUBJECT_MIDDLE: "subject-middle",
  SUBJECT_BOTTOM: "subject-bottom",
  PDF_MOBILE_BOTTOM_BANNER: "pdf-mobile-bottom-banner",
  PDF_DESKTOP_SIDEBAR: "pdf-desktop-sidebar"
};

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

const POSITION_STYLE_MAP = {
  [AD_POSITIONS.HOMEPAGE_HERO_BOTTOM]: "min-h-[90px]",
  [AD_POSITIONS.HOMEPAGE_BRANCHES_MIDDLE]: "min-h-[90px]",
  [AD_POSITIONS.HOMEPAGE_FOOTER]: "min-h-[90px]",
  [AD_POSITIONS.SUBJECT_TOP]: "min-h-[90px]",
  [AD_POSITIONS.SUBJECT_MIDDLE]: "min-h-[90px]",
  [AD_POSITIONS.SUBJECT_BOTTOM]: "min-h-[90px]",
  [AD_POSITIONS.PDF_MOBILE_BOTTOM_BANNER]: "min-h-[84px]",
  [AD_POSITIONS.PDF_DESKTOP_SIDEBAR]: "min-h-[300px]"
};

export function AdSlot({ position, className = "", enabled = ADS_ENABLED }) {
  const slotRef = useRef(null);
  const minHeightClass = POSITION_STYLE_MAP[position] || "min-h-[90px]";

  useEffect(() => {
    if (!enabled || !slotRef.current) return;

    const script = document.createElement("script");
    script.dataset.zone = "10681551";
    script.src = "https://nap5k.com/tag.min.js";
    script.async = true;

    slotRef.current.innerHTML = "";
    slotRef.current.appendChild(script);

    return () => {
      slotRef.current?.replaceChildren();
    };
  }, [enabled, position]);

  if (!enabled) return null;

  return (
    <aside
      aria-label={`Ad slot: ${position}`}
      className={`mx-auto w-full max-w-full rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-3 sm:p-4 ${className}`.trim()}
    >
      <div
        ref={slotRef}
        data-ad-slot={position}
        className={`flex w-full items-center justify-center rounded-lg bg-white px-3 py-4 text-center text-sm font-medium text-slate-500 ${minHeightClass}`.trim()}
      >
        {/* Ad network tag/script for this position will be inserted here later. */}
        Ad space
      </div>
    </aside>
  );
}
