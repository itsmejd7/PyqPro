import Script from "next/script";
import { adNetworkConfig } from "@/lib/ads-config";

export function AdNetworkScript() {
  if (!adNetworkConfig.enabled) return null;
  if (adNetworkConfig.network !== "adsense") return null;
  if (!adNetworkConfig.adsenseClientId) return null;

  return (
    <Script
      id="adsense-script"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adNetworkConfig.adsenseClientId}`}
      crossOrigin="anonymous"
    />
  );
}

