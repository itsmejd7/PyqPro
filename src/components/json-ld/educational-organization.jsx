import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "@/components/json-ld/json-ld";

export function EducationalOrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        areaServed: "IN",
        sameAs: ["https://t.me/pyqpro"],
        knowsAbout: ["Previous Year Question Papers", "Engineering Syllabus", "Engineering Notes"]
      }}
    />
  );
}
