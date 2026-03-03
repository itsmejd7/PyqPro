export function PageLayout({ children, className = "" }) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
