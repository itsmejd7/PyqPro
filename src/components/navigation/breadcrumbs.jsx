import Link from "next/link";

export function Breadcrumbs({ crumbs }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={crumb.href} className="inline-flex items-center gap-2">
            {isLast ? (
              <span aria-current="page" className="font-medium text-slate-600">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="transition-colors duration-200 hover:text-indigo-600">
                {crumb.label}
              </Link>
            )}
            {!isLast && <span>/</span>}
          </span>
        );
      })}
    </nav>
  );
}
