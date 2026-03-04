import { notFound } from "next/navigation";
import { AdSlot, AD_POSITIONS } from "@/components/ads/AdSlot";
import { PageLayout } from "@/components/layout/page-layout";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { PublicDrivePdfViewer } from "@/components/pdf/public-drive-pdf-viewer";
import { listAccessibleAccessTypes } from "@/lib/access-control";
import { getYearStructure, listPapers } from "@/server/repositories/pyq";
import { getViewerAccess } from "@/server/auth/viewer-access";
import { buildNotFoundMetadata, buildPdfMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { branch, academicYear, pattern, subject, fileId } = await params;
  const viewerAccess = await getViewerAccess();
  const normalizedYear = academicYear.toUpperCase();
  const record = await getYearStructure(branch, normalizedYear);

  if (!record) {
    return buildNotFoundMetadata(`/${branch}/${normalizedYear}/${pattern}/${subject}/pdf/${fileId}`);
  }

  const patternEntry = record.patterns.find((entry) => entry.pattern === pattern);
  if (!patternEntry) {
    return buildNotFoundMetadata(`/${record.branchSlug}/${normalizedYear}/${pattern}/${subject}/pdf/${fileId}`);
  }

  const subjectEntry = patternEntry.subjects.find((entry) => entry.subjectSlug === subject);
  if (!subjectEntry) {
    return buildNotFoundMetadata(`/${record.branchSlug}/${normalizedYear}/${pattern}/${subject}/pdf/${fileId}`);
  }

  const papers = await listPapers({
    branchSlug: record.branchSlug,
    academicYear: normalizedYear,
    pattern,
    subjectSlug: subject,
    allowedAccessTypes: listAccessibleAccessTypes(viewerAccess.plan)
  });

  const paper = papers.find((entry) => entry.fileId === fileId);
  if (!paper) {
    return buildNotFoundMetadata(`/${record.branchSlug}/${normalizedYear}/${pattern}/${subject}/pdf/${fileId}`);
  }

  return buildPdfMetadata({
    branchName: record.branch,
    branchSlug: record.branchSlug,
    academicYear: normalizedYear,
    pattern,
    subjectName: subjectEntry.subject,
    subjectSlug: subjectEntry.subjectSlug,
    examType: paper.examType,
    paperMonth: paper.paperMonth,
    paperYear: paper.paperYear,
    fileId: paper.fileId
  });
}

export default async function SubjectPdfPage({ params }) {
  const { branch, academicYear, pattern, subject, fileId } = await params;
  const viewerAccess = await getViewerAccess();
  const record = await getYearStructure(branch, academicYear.toUpperCase());
  if (!record) notFound();

  const patternEntry = record.patterns.find((entry) => entry.pattern === pattern);
  if (!patternEntry) notFound();

  const subjectEntry = patternEntry.subjects.find((entry) => entry.subjectSlug === subject);
  if (!subjectEntry) notFound();

  const papers = await listPapers({
    branchSlug: record.branchSlug,
    academicYear: academicYear.toUpperCase(),
    pattern,
    subjectSlug: subject,
    allowedAccessTypes: listAccessibleAccessTypes(viewerAccess.plan)
  });

  const paper = papers.find((entry) => entry.fileId === fileId);
  if (!paper) notFound();

  return (
    <PageLayout>
      <section className="space-y-6">
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
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">{subjectEntry.subject}</h1>
          <p className="text-base text-slate-600">
            {paper.examType} {paper.paperMonth} {paper.paperYear}
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <PublicDrivePdfViewer fileId={fileId} />
          <div className="hidden lg:block">
            <AdSlot position={AD_POSITIONS.PDF_DESKTOP_SIDEBAR} />
          </div>
        </div>
        <div className="lg:hidden">
          <AdSlot position={AD_POSITIONS.PDF_MOBILE_BOTTOM_BANNER} />
        </div>
      </section>
    </PageLayout>
  );
}
