import { notFound } from "next/navigation";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { PageLayout } from "@/components/layout/page-layout";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Button } from "@/components/ui/button";
import { AD_POSITIONS } from "@/lib/ads-config";
import { listAccessibleAccessTypes } from "@/lib/access-control";
import { formatResourceTypeBadge, formatResourceTypeLabel, normalizeResourceType, sortResourceTypes } from "@/lib/resource-types";
import { getYearStructure, listPapers, listResourceTypesForSubject } from "@/server/repositories/pyq";
import { getViewerAccess } from "@/server/auth/viewer-access";
import { buildNotFoundMetadata, buildSubjectMetadata } from "@/lib/seo";

export const revalidate = 300;

function SubjectTypeTab({ href, isActive, label }) {
  const baseClassName =
    "inline-flex cursor-pointer items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";
  const activeClassName = "bg-indigo-600 text-white shadow-sm";
  const inactiveClassName = "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800";

  return (
    <Link href={href} className={`${baseClassName} ${isActive ? activeClassName : inactiveClassName}`}>
      {label}
    </Link>
  );
}

export async function generateMetadata({ params }) {
  const { branch, academicYear, pattern, subject } = await params;
  const viewerAccess = await getViewerAccess();
  const normalizedYear = academicYear.toUpperCase();
  const record = await getYearStructure(branch, normalizedYear);

  if (!record) {
    return buildNotFoundMetadata(`/${branch}/${normalizedYear}/${pattern}/${subject}`);
  }

  const patternEntry = record.patterns.find((entry) => entry.pattern === pattern);
  if (!patternEntry) {
    return buildNotFoundMetadata(`/${record.branchSlug}/${normalizedYear}/${pattern}/${subject}`);
  }

  const subjectEntry = patternEntry.subjects.find((entry) => entry.subjectSlug === subject);
  if (!subjectEntry) {
    return buildNotFoundMetadata(`/${record.branchSlug}/${normalizedYear}/${pattern}/${subject}`);
  }

  const papers = await listPapers({
    branchSlug: record.branchSlug,
    academicYear: normalizedYear,
    pattern,
    subjectSlug: subject,
    allowedAccessTypes: listAccessibleAccessTypes(viewerAccess.plan)
  });
  const paperYears = papers.map((paper) => paper.paperYear).filter(Boolean);
  const latestPaperYear = paperYears.length ? Math.max(...paperYears) : undefined;
  const earliestPaperYear = paperYears.length ? Math.min(...paperYears) : undefined;

  return buildSubjectMetadata({
    branchName: record.branch,
    branchSlug: record.branchSlug,
    academicYear: normalizedYear,
    pattern,
    subjectName: subjectEntry.subject,
    subjectSlug: subjectEntry.subjectSlug,
    paperCount: papers.length,
    latestPaperYear,
    earliestPaperYear
  });
}

export default async function SubjectPage({ params, searchParams }) {
  const { branch, academicYear, pattern, subject } = await params;
  const query = await searchParams;
  const viewerAccess = await getViewerAccess();
  const record = await getYearStructure(branch, academicYear.toUpperCase());
  if (!record) notFound();

  const patternEntry = record.patterns.find((entry) => entry.pattern === pattern);
  if (!patternEntry) notFound();

  const subjectEntry = patternEntry.subjects.find((entry) => entry.subjectSlug === subject);
  if (!subjectEntry) notFound();

  const availableResourceTypes = await listResourceTypesForSubject({
    branchSlug: branch,
    academicYear: academicYear.toUpperCase(),
    pattern,
    subjectSlug: subject,
    allowedAccessTypes: listAccessibleAccessTypes(viewerAccess.plan)
  });
  const sortedResourceTypes = sortResourceTypes([...availableResourceTypes, "PYQ", "SOLVED"]);
  const requestedResourceType = normalizeResourceType(query?.type);
  const activeResourceType = sortedResourceTypes.includes(requestedResourceType) ? requestedResourceType : sortedResourceTypes[0];

  const papers = await listPapers({
    branchSlug: record.branchSlug,
    academicYear: academicYear.toUpperCase(),
    pattern,
    subjectSlug: subject,
    resourceType: activeResourceType,
    allowedAccessTypes: listAccessibleAccessTypes(viewerAccess.plan)
  });

  function badgeClassName(resourceType) {
    if (resourceType === "PYQ") return "border-blue-200 bg-blue-50 text-blue-800";
    if (resourceType === "SOLVED") return "border-emerald-200 bg-emerald-50 text-emerald-800";
    if (resourceType === "NOTES") return "border-amber-200 bg-amber-50 text-amber-800";
    return "border-slate-200 bg-slate-50 text-slate-700";
  }

  return (
    <PageLayout>
      <section className="space-y-6">
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: record.branch, href: `/${record.branchSlug}` },
            { label: record.academicYear, href: `/${record.branchSlug}/${record.academicYear}` },
            { label: `Pattern ${pattern}`, href: `/${record.branchSlug}/${record.academicYear}/${pattern}` },
            { label: subjectEntry.subject, href: `/${record.branchSlug}/${record.academicYear}/${pattern}/${subject}` }
          ]}
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">{subjectEntry.subject}</h1>
          <p className="text-base text-slate-600">{record.branch} | {record.academicYear} | Pattern {pattern}</p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {sortedResourceTypes.map((resourceType) => {
            const isActive = resourceType === activeResourceType;
            const href = `/${record.branchSlug}/${record.academicYear}/${pattern}/${subject}?type=${resourceType}`;

            return (
              <SubjectTypeTab
                key={resourceType}
                href={href}
                isActive={isActive}
                label={formatResourceTypeLabel(resourceType)}
              />
            );
          })}
        </div>
        <AdSlot position={AD_POSITIONS.SUBJECT_BELOW_TITLE} viewerPlan={viewerAccess.plan} />

        <div className="space-y-6">
          {papers.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-base text-slate-600 shadow-sm">No papers uploaded yet.</div>
          ) : null}
          {papers.map((paper, index) => (
            <div key={paper.fileId} className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClassName(paper.resourceType)}`}>
                  {formatResourceTypeBadge(paper.resourceType)}
                </span>
                <h2 className="text-xl font-semibold text-slate-900">
                  {paper.examType} {paper.paperMonth} {paper.paperYear}
                </h2>
                <p className="mt-3 text-base text-slate-600">
                  {paper.branch} | {paper.academicYear} | Pattern {paper.pattern}
                </p>
                <div className="mt-4">
                  <Button href={`/${record.branchSlug}/${record.academicYear}/${pattern}/${subject}/pdf/${paper.fileId}`}>Open PDF</Button>
                </div>
              </div>
              {index === 5 ? <AdSlot position={AD_POSITIONS.SUBJECT_AFTER_LIST_6} viewerPlan={viewerAccess.plan} /> : null}
            </div>
          ))}
          <AdSlot position={AD_POSITIONS.SUBJECT_BEFORE_FOOTER} viewerPlan={viewerAccess.plan} />
        </div>
      </section>
    </PageLayout>
  );
}
