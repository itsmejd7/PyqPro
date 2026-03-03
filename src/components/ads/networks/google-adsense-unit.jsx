"use client";

import { useEffect, useRef } from "react";
import { adNetworkConfig } from "@/lib/ads-config";

export function GoogleAdSenseUnit({ slotId, format = "auto", fullWidthResponsive = true }) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!slotId || initializedRef.current) return;
    initializedRef.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      initializedRef.current = false;
    }
  }, [slotId]);

  if (!slotId || !adNetworkConfig.adsenseClientId) return null;

  return (
    <ins
      className="adsbygoogle block w-full overflow-hidden"
      style={{ display: "block" }}
      data-ad-client={adNetworkConfig.adsenseClientId}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}

