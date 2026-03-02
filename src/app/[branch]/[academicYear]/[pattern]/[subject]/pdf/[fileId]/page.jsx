import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PublicDrivePdfViewer } from "@/components/pdf/public-drive-pdf-viewer";
import { getYearStructure, listPapers } from "@/server/repositories/pyq";

export const revalidate = 300;

export default async function SubjectPdfPage({ params }) {
  const { branch, academicYear, pattern, subject, fileId } = await params;
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

  const paper = papers.find((entry) => entry.fileId === fileId);
  if (!paper) notFound();

  return (
    <section className="section page-shell">
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: record.branch, href: `/${record.branchSlug}` },
          { label: record.academicYear, href: `/${record.branchSlug}/${record.academicYear}` },
          { label: `Pattern ${pattern}`, href: `/${record.branchSlug}/${record.academicYear}/${pattern}` },
          { label: subjectEntry.subject, href: `/${record.branchSlug}/${record.academicYear}/${pattern}/${subject}` },
          { label: "PDF Viewer", href: `/${record.branchSlug}/${record.academicYear}/${pattern}/${subject}/pdf/${fileId}` }
        ]}
      />
      <div className="section-head">
        <h1>{subjectEntry.subject}</h1>
        <p>
          {paper.examType} {paper.paperMonth} {paper.paperYear}
        </p>
      </div>
      <PublicDrivePdfViewer fileId={fileId} />
    </section>
  );
}
