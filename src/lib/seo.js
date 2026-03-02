import { siteConfig } from "@/lib/site-config";

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function buildTitle(parts) {
  return normalizeText(parts.filter(Boolean).join(" | "));
}

function buildDescription(parts) {
  return normalizeText(parts.filter(Boolean).join(". "));
}

function metadataFromFormula({ titleParts, descriptionParts, path, index = true }) {
  const title = buildTitle(titleParts);
  const socialTitle = buildTitle([...titleParts, siteConfig.name]);
  const description = buildDescription(descriptionParts);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website"
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true }
  };
}

export function buildBranchMetadata({ branchName, branchSlug, years, patternCount, subjectCount, paperCount }) {
  return metadataFromFormula({
    titleParts: [branchName, "SPPU Previous Year Question Papers"],
    descriptionParts: [
      `${branchName} PYQ catalog for SPPU engineering students`,
      `${paperCount} papers across ${subjectCount} subjects and ${patternCount} patterns`,
      `Available years: ${years.join(", ")}`
    ],
    path: `/${branchSlug}`
  });
}

export function buildYearMetadata({ branchName, branchSlug, academicYear, patternCount, subjectCount, paperCount }) {
  return metadataFromFormula({
    titleParts: [branchName, academicYear, "SPPU PYQ by Pattern"],
    descriptionParts: [
      `${branchName} ${academicYear} PYQ index for SPPU`,
      `${paperCount} papers across ${subjectCount} subjects`,
      `${patternCount} patterns available`
    ],
    path: `/${branchSlug}/${academicYear}`
  });
}

export function buildPatternMetadata({
  branchName,
  branchSlug,
  academicYear,
  pattern,
  subjectCount,
  paperCount
}) {
  return metadataFromFormula({
    titleParts: [branchName, academicYear, `Pattern ${pattern}`, "SPPU Subjects and PYQs"],
    descriptionParts: [
      `${branchName} ${academicYear} Pattern ${pattern} PYQ section`,
      `${subjectCount} subjects`,
      `${paperCount} total papers`
    ],
    path: `/${branchSlug}/${academicYear}/${pattern}`
  });
}

export function buildSubjectMetadata({
  branchName,
  branchSlug,
  academicYear,
  pattern,
  subjectName,
  subjectSlug,
  paperCount,
  latestPaperYear,
  earliestPaperYear
}) {
  return metadataFromFormula({
    titleParts: [subjectName, branchName, academicYear, `Pattern ${pattern}`, "SPPU PYQ"],
    descriptionParts: [
      `${subjectName} previous year question papers for ${branchName} ${academicYear} Pattern ${pattern}`,
      `${paperCount} papers available`,
      earliestPaperYear && latestPaperYear
        ? `Paper years: ${earliestPaperYear} to ${latestPaperYear}`
        : "Paper years will update as new uploads are added"
    ],
    path: `/${branchSlug}/${academicYear}/${pattern}/${subjectSlug}`
  });
}

export function buildSubjectLandingMetadata({ subjectName, subjectSlug, branchCount, totalPaperCount }) {
  return metadataFromFormula({
    titleParts: [subjectName, "SPPU PYQ Catalog by Branch and Year"],
    descriptionParts: [
      `${subjectName} previous year question papers across SPPU branches, years, and patterns`,
      `${totalPaperCount} papers available in ${branchCount} branches`
    ],
    path: `/subject/${subjectSlug}`
  });
}

export function buildPdfMetadata({
  branchName,
  branchSlug,
  academicYear,
  pattern,
  subjectName,
  subjectSlug,
  examType,
  paperMonth,
  paperYear,
  fileId
}) {
  return metadataFromFormula({
    titleParts: [subjectName, `${examType} ${paperMonth} ${paperYear}`, branchName, "SPPU PDF"],
    descriptionParts: [
      `${subjectName} ${examType} ${paperMonth} ${paperYear} question paper`,
      `${branchName} ${academicYear} Pattern ${pattern}`,
      `PDF file reference ${fileId}`
    ],
    path: `/${branchSlug}/${academicYear}/${pattern}/${subjectSlug}/pdf/${fileId}`
  });
}

export function buildNotFoundMetadata(path) {
  return metadataFromFormula({
    titleParts: ["Content Not Available", "SPPU PYQ"],
    descriptionParts: [
      "Requested PYQ content is not available",
      "Check branch, year, pattern, and subject filters"
    ],
    path,
    index: false
  });
}
