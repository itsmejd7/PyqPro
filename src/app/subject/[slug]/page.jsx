import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
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
    <section className="section page-shell">
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: subjectName, href: `/subject/${slug}` }
        ]}
      />
      <div className="section-head">
        <h1>{subjectName}</h1>
        <p>Select branch, year, and pattern.</p>
      </div>
      <div className="list">
        {rows.map((row) => (
          <div className="list-item" key={`${row.branchSlug}-${row.academicYear}-${row.pattern}`}>
            <strong>
              {row.branch} | {row.academicYear} | Pattern {row.pattern}
            </strong>
            <p>{row.paperCount} papers</p>
            <Link className="btn btn-primary btn-sm" href={`/${row.branchSlug}/${row.academicYear}/${row.pattern}/${row.subjectSlug}`}>
              View papers
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
