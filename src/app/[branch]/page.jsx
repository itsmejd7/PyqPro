import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { getBranchStructure } from "@/server/repositories/pyq";
import { formatSlug } from "@/lib/format";
import { buildBranchMetadata, buildNotFoundMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { branch } = await params;
  const records = await getBranchStructure(branch);

  if (!records.length) {
    return buildNotFoundMetadata(`/${branch}`);
  }

  const years = [...new Set(records.map((record) => record.academicYear))];
  const patternCount = records.reduce((count, record) => count + record.patterns.length, 0);
  const subjectCount = records.reduce(
    (count, record) => count + record.patterns.reduce((total, pattern) => total + pattern.subjects.length, 0),
    0
  );
  const paperCount = records.reduce(
    (count, record) => count + record.patterns.reduce((total, pattern) => total + pattern.paperCount, 0),
    0
  );

  return buildBranchMetadata({
    branchName: records[0].branch || formatSlug(branch),
    branchSlug: records[0].branchSlug || branch,
    years,
    patternCount,
    subjectCount,
    paperCount
  });
}

export default async function BranchPage({ params }) {
  const { branch } = await params;
  const records = await getBranchStructure(branch);
  if (!records.length) notFound();

  const branchLabel = records[0].branch || formatSlug(branch);

  return (
    <PageLayout>
      <section className="space-y-6">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: branchLabel, href: `/${branch}` }
          ]}
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">{branchLabel}</h1>
          <p className="text-base text-slate-600">Select your academic year.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <Card
              key={`${record.branchSlug}-${record.academicYear}`}
              title={record.academicYear}
              subtitle={`${record.patterns.length} patterns`}
              href={`/${record.branchSlug}/${record.academicYear}`}
            />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
