"use client";

import { useEffect, useMemo, useRef } from "react";
import { adTagConfig, AD_POSITIONS } from "@/components/ads/ad-config";

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

export { AD_POSITIONS };

export function AdSlot({ position, className = "", enabled = adTagConfig.enabled }) {
  const injectedScriptsRef = useRef([]);
  const minHeightClass = POSITION_STYLE_MAP[position] || "min-h-[90px]";
  const configuredTags = useMemo(() => (adTagConfig.tags || []).filter((tag) => tag?.scriptSrc), []);
  const isConfigured = configuredTags.length > 0;

  useEffect(() => {
    if (!enabled || !isConfigured) return;

    const target = [document.documentElement, document.body].filter(Boolean).pop();
    if (!target) return;

    const injectedScripts = [];

    configuredTags.forEach((tag) => {
      const script = document.createElement("script");
      script.src = tag.scriptSrc;
      script.async = true;
      Object.entries(tag.attributes || {}).forEach(([key, value]) => {
        if (value) {
          script.setAttribute(key, value);
        }
      });

      target.appendChild(script);
      injectedScripts.push(script);
    });
    injectedScriptsRef.current = injectedScripts;

    return () => {
      injectedScriptsRef.current.forEach((script) => script.remove());
      injectedScriptsRef.current = [];
    };
  }, [enabled, isConfigured, position, configuredTags]);

  if (!enabled || !isConfigured) return null;

  return (
    <aside aria-label={`Ad slot: ${position}`} className={`mx-auto w-full max-w-full ${className}`.trim()}>
      <div
        data-ad-slot={position}
        className={`w-full ${minHeightClass}`.trim()}
      />
    </aside>
  );
}
