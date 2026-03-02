import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <h1>Page not found</h1>
      <p>The requested page does not exist.</p>
      <Link href="/">Go back to home</Link>
    </section>
  );
}
