"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { adNetworkConfig, adSlotConfig } from "@/lib/ads-config";
import { VIEWER_PLAN, shouldShowAds } from "@/lib/access-control";
import { GoogleAdSenseUnit } from "@/components/ads/networks/google-adsense-unit";

const visibilityListeners = new Set();
let activeViewportSlot = null;

function subscribeViewport(listener) {
  visibilityListeners.add(listener);
  return () => visibilityListeners.delete(listener);
}

function updateActiveViewportSlot(slotKey) {
  if (activeViewportSlot === slotKey) return;
  activeViewportSlot = slotKey;
  visibilityListeners.forEach((listener) => listener(activeViewportSlot));
}

function renderNetworkUnit({ slotId }) {
  if (adNetworkConfig.network === "adsense") {
    return <GoogleAdSenseUnit slotId={slotId} />;
  }
  return null;
}

export function AdSlot({ position, viewerPlan = VIEWER_PLAN.FREE, className = "" }) {
  const config = adSlotConfig[position];
  const wrapperRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSlotKey, setActiveSlotKey] = useState(activeViewportSlot);
  const slotKey = useMemo(() => config?.key || "", [config]);

  useEffect(() => subscribeViewport(setActiveSlotKey), []);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node || !slotKey) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsLoaded(true);
          updateActiveViewportSlot(slotKey);
          return;
        }

        if (activeViewportSlot === slotKey) {
          updateActiveViewportSlot(null);
        }
      },
      { root: null, threshold: 0.5 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (activeViewportSlot === slotKey) {
        updateActiveViewportSlot(null);
      }
    };
  }, [slotKey]);

  if (!config) return null;
  if (!adNetworkConfig.enabled || !shouldShowAds(viewerPlan)) return null;
  if (!config.slotId) return null;

  const canRenderThisViewport = !activeSlotKey || activeSlotKey === slotKey;
  const content = isLoaded && canRenderThisViewport ? renderNetworkUnit({ slotId: config.slotId }) : null;

  return (
    <aside
      ref={wrapperRef}
      aria-label={`Ad: ${config.label}`}
      className={`w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm ${config.minHeightClass} ${className}`.trim()}
    >
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">{config.label}</p>
      {content}
    </aside>
  );
}
