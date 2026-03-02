import Link from "next/link";

export function Card({ title, subtitle, href }) {
  return (
    <Link className="card" href={href}>
      <h3>{title}</h3>
      {subtitle ? <p>{subtitle}</p> : null}
      <span>Explore</span>
    </Link>
  );
}
