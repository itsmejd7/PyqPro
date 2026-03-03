import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Button } from "@/components/ui/button";
import { formatSlug } from "@/lib/format";
import { buildNotFoundMetadata, buildSubjectLandingMetadata } from "@/lib/seo";
import { getSubjectLandingBySlug } from "@/server/repositories/pyq";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const rows = await getSubjectLandingBySlug(slug);

  if (!rows.length) {
    return buildNotFoundMetadata(`/subject/${slug}`);
  }

  const branchCount = new Set(rows.map((row) => row.branchSlug)).size;
  const totalPaperCount = rows.reduce((total, row) => total + (row.paperCount || 0), 0);

  return buildSubjectLandingMetadata({
    subjectName: rows[0].subject || formatSlug(slug),
    subjectSlug: rows[0].subjectSlug || slug,
    branchCount,
    totalPaperCount
  });
}

export default async function SubjectLandingPage({ params }) {
  const { slug } = await params;
  const rows = await getSubjectLandingBySlug(slug);
  if (!rows.length) notFound();

  const subjectName = rows[0].subject || formatSlug(slug);

  return (
    <PageLayout>
      <section className="space-y-6">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: subjectName, href: `/subject/${slug}` }
          ]}
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">{subjectName}</h1>
          <p className="text-base text-slate-600">Select branch, year, and pattern.</p>
        </div>
        <div className="space-y-6">
          {rows.map((row) => (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              key={`${row.branchSlug}-${row.academicYear}-${row.pattern}`}
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {row.branch} | {row.academicYear} | Pattern {row.pattern}
              </h2>
              <p className="mt-3 text-base text-slate-600">{row.paperCount} papers</p>
              <div className="mt-4">
                <Button href={`/${row.branchSlug}/${row.academicYear}/${row.pattern}/${row.subjectSlug}`}>View papers</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
