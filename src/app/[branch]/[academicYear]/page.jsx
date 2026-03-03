import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { getYearStructure } from "@/server/repositories/pyq";
import { buildNotFoundMetadata, buildYearMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { branch, academicYear } = await params;
  const normalizedYear = academicYear.toUpperCase();
  const record = await getYearStructure(branch, normalizedYear);

  if (!record) {
    return buildNotFoundMetadata(`/${branch}/${normalizedYear}`);
  }

  const patternCount = record.patterns.length;
  const subjectCount = record.patterns.reduce((count, entry) => count + entry.subjects.length, 0);
  const paperCount = record.patterns.reduce((count, entry) => count + entry.paperCount, 0);

  return buildYearMetadata({
    branchName: record.branch,
    branchSlug: record.branchSlug,
    academicYear: normalizedYear,
    patternCount,
    subjectCount,
    paperCount
  });
}

export default async function AcademicYearPage({ params }) {
  const { branch, academicYear } = await params;
  const record = await getYearStructure(branch, academicYear.toUpperCase());
  if (!record) notFound();

  return (
    <PageLayout>
      <section className="space-y-6">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: record.branch, href: `/${record.branchSlug}` },
            { label: academicYear.toUpperCase(), href: `/${record.branchSlug}/${academicYear.toUpperCase()}` }
          ]}
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">{record.branch}</h1>
          <p className="text-base text-slate-600">{academicYear.toUpperCase()} patterns.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {record.patterns.map((entry) => (
            <Card
              key={entry.pattern}
              title={`Pattern ${entry.pattern}`}
              subtitle={entry.paperCount === 0 ? "No papers yet" : `${entry.paperCount} papers`}
              href={`/${record.branchSlug}/${record.academicYear}/${entry.pattern}`}
            />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
