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

  // Pattern pages: /branch/academicYear/pattern
  const patternUrls = subjects.reduce((urls, item) => {
    const patternUrl = `${base}/${item.branchSlug}/${item.academicYear}/${item.pattern}`;
    if (!urls.find((u) => u.url === patternUrl)) {
      urls.push({ url: patternUrl, changeFrequency: "weekly", priority: 0.75 });
    }
    return urls;
  }, []);

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
    { url: base, changeFrequency: "daily", priority: 1 },
    ...branchUrls,
    ...patternUrls,
    ...subjectLandingUrls,
    ...subjectUrls
  ];
}
