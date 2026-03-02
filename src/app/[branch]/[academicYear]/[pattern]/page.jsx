import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { getYearStructure } from "@/server/repositories/pyq";

export const revalidate = 300;

export default async function PatternPage({ params }) {
  const { branch, academicYear, pattern } = await params;
  const record = await getYearStructure(branch, academicYear.toUpperCase());
  if (!record) notFound();

  const patternEntry = record.patterns.find((entry) => entry.pattern === pattern);
  if (!patternEntry) notFound();

  return (
    <section className="section page-shell">
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: record.branch, href: `/${record.branchSlug}` },
          { label: record.academicYear, href: `/${record.branchSlug}/${record.academicYear}` },
          { label: `Pattern ${pattern}`, href: `/${record.branchSlug}/${record.academicYear}/${pattern}` }
        ]}
      />
      <div className="section-head">
        <h1>{record.branch}</h1>
        <p>{record.academicYear} Pattern {pattern}</p>
      </div>
      <div className="grid">
        {patternEntry.subjects.map((subject) => (
          <Card
            key={subject.subjectSlug}
            title={subject.subject}
            subtitle={`${subject.paperCount} papers`}
            href={`/${record.branchSlug}/${record.academicYear}/${pattern}/${subject.subjectSlug}`}
          />
        ))}
      </div>
      {patternEntry.subjects.length === 0 ? <p className="empty-copy">No subjects uploaded yet for this pattern.</p> : null}
    </section>
  );
}
