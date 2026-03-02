import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { getYearStructure, listPapers } from "@/server/repositories/pyq";

export const revalidate = 300;

export default async function SubjectPage({ params }) {
  const { branch, academicYear, pattern, subject } = await params;
  const record = await getYearStructure(branch, academicYear.toUpperCase());
  if (!record) notFound();

  const patternEntry = record.patterns.find((entry) => entry.pattern === pattern);
  if (!patternEntry) notFound();

  const subjectEntry = patternEntry.subjects.find((entry) => entry.subjectSlug === subject);
  if (!subjectEntry) notFound();

  const papers = await listPapers({
    branchSlug: branch,
    academicYear: academicYear.toUpperCase(),
    pattern,
    subjectSlug: subject
  });

  return (
    <section className="section page-shell">
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: record.branch, href: `/${record.branchSlug}` },
          { label: record.academicYear, href: `/${record.branchSlug}/${record.academicYear}` },
          { label: `Pattern ${pattern}`, href: `/${record.branchSlug}/${record.academicYear}/${pattern}` },
          { label: subjectEntry.subject, href: `/${record.branchSlug}/${record.academicYear}/${pattern}/${subject}` }
        ]}
      />
      <div className="section-head">
        <h1>{subjectEntry.subject}</h1>
        <p>{record.branch} | {record.academicYear} | Pattern {pattern}</p>
      </div>

      <div className="list">
        {papers.length === 0 ? <div className="list-item">No papers uploaded yet.</div> : null}
        {papers.map((paper) => (
          <div className="list-item" key={paper.fileId}>
            <strong>
              {paper.examType} {paper.paperMonth} {paper.paperYear}
            </strong>
            <p>
              {paper.branch} | {paper.academicYear} | Pattern {paper.pattern}
            </p>
            <Link
              className="btn btn-primary btn-sm"
              href={`/${record.branchSlug}/${record.academicYear}/${pattern}/${subject}/pdf/${paper.fileId}`}
            >
              Open PDF
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
