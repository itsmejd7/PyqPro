import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Card } from "@/components/ui/card";
import { getBranchStructure } from "@/server/repositories/pyq";
import { formatSlug } from "@/lib/format";

export const revalidate = 300;

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
