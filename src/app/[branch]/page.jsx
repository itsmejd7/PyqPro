import { notFound } from "next/navigation";
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
    <section className="section page-shell">
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: branchLabel, href: `/${branch}` }
        ]}
      />
      <div className="section-head">
        <h1>{branchLabel}</h1>
        <p>Select your academic year.</p>
      </div>
      <div className="grid">
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
  );
}
