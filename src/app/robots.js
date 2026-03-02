import { siteConfig } from "@/lib/site-config";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"]
      }
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
