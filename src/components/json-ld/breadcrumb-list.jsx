import { siteConfig } from "@/lib/site-config";
import { JsonLd } from "./json-ld";

export function BreadcrumbList({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http")
        ? item.href
        : `${siteConfig.url}${item.href}`
    }))
  };

  return <JsonLd data={schema} />;
}
