import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/json-ld/json-ld";

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url
      }}
    />
  );
}
