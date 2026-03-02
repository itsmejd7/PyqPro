import Link from "next/link";

export function Breadcrumbs({ crumbs }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={crumb.href}>
            {isLast ? <span aria-current="page">{crumb.label}</span> : <Link href={crumb.href}>{crumb.label}</Link>}
            {!isLast && <span className="divider">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
