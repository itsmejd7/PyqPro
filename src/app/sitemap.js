import { siteConfig } from "@/lib/site-config";
import { listBranches, listSubjectPaths } from "@/server/repositories/pyq";

export default async function sitemap() {
  const base = siteConfig.url;
  const branches = await listBranches();
  const subjects = await listSubjectPaths();

  const branchUrls = branches.map((branch) => ({
    url: `${base}/${branch.branchSlug}`,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const subjectUrls = subjects.map((item) => ({
    url: `${base}/${item.branchSlug}/${item.academicYear}/${item.pattern}/${item.subjectSlug}`,
    changeFrequency: "weekly",
    priority: 0.7
  }));

  const subjectLandingUrls = [...new Set(subjects.map((item) => item.subjectSlug))].map((subjectSlug) => ({
    url: `${base}/subject/${subjectSlug}`,
    changeFrequency: "weekly",
    priority: 0.75
  }));

  return [
    {
      url: base,
      changeFrequency: "daily",
      priority: 1
    },
    ...branchUrls,
    ...subjectLandingUrls,
    ...subjectUrls
  ];
}
