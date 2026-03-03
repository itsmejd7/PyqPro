import Link from "next/link";

const baseClasses =
  "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg";

export function Card({ title, subtitle, href, children, className = "" }) {
  const classes = `${baseClasses} ${className}`.trim();

  if (href) {
    return (
      <Link className={`block ${classes}`} href={href}>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="mt-3 text-base text-slate-600">{subtitle}</p> : null}
        <span className="mt-4 inline-block text-sm font-semibold text-indigo-600 transition-colors duration-200 hover:text-indigo-500">
          Explore
        </span>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
