import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { getYearStructure } from "@/server/repositories/pyq";
import { buildNotFoundMetadata, buildPatternMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { branch, academicYear, pattern } = await params;
  const normalizedYear = academicYear.toUpperCase();
  const record = await getYearStructure(branch, normalizedYear);

  if (!record) {
    return buildNotFoundMetadata(`/${branch}/${normalizedYear}/${pattern}`);
  }

  const patternEntry = record.patterns.find((entry) => entry.pattern === pattern);
  if (!patternEntry) {
    return buildNotFoundMetadata(`/${record.branchSlug}/${normalizedYear}/${pattern}`);
  }

  return buildPatternMetadata({
    branchName: record.branch,
    branchSlug: record.branchSlug,
    academicYear: normalizedYear,
    pattern,
    subjectCount: patternEntry.subjects.length,
    paperCount: patternEntry.paperCount
  });
}

export default async function PatternPage({ params }) {
  const { branch, academicYear, pattern } = await params;
  const record = await getYearStructure(branch, academicYear.toUpperCase());
  if (!record) notFound();

  const patternEntry = record.patterns.find((entry) => entry.pattern === pattern);
  if (!patternEntry) notFound();

  return (
    <PageLayout>
      <section className="space-y-6">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: record.branch, href: `/${record.branchSlug}` },
            { label: record.academicYear, href: `/${record.branchSlug}/${record.academicYear}` },
            { label: `Pattern ${pattern}`, href: `/${record.branchSlug}/${record.academicYear}/${pattern}` }
          ]}
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">{record.branch}</h1>
          <p className="text-base text-slate-600">{record.academicYear} Pattern {pattern}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {patternEntry.subjects.map((subject) => (
            <Card
              key={subject.subjectSlug}
              title={subject.subject}
              subtitle={`${subject.paperCount} papers`}
              href={`/${record.branchSlug}/${record.academicYear}/${pattern}/${subject.subjectSlug}`}
            />
          ))}
        </div>
        {patternEntry.subjects.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-base text-slate-600 shadow-sm">
            No subjects uploaded yet for this pattern.
          </div>
        ) : null}
      </section>
    </PageLayout>
  );
}
