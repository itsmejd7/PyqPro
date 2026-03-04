import Link from "next/link";
import { AdSlot, AD_POSITIONS } from "@/components/ads/AdSlot";
import { PageLayout } from "@/components/layout/page-layout";
import { Card } from "@/components/ui/card";
import { buttonClassName } from "@/components/ui/button";
import { listBranches } from "@/server/repositories/pyq";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const branches = await listBranches();
  const firstYearBranch = branches.find((branch) => branch.branchSlug === "first-year");
  const splitIndex = Math.ceil(branches.length / 2);
  const firstGrid = branches.slice(0, splitIndex);
  const secondGrid = branches.slice(splitIndex);

  return (
    <PageLayout>
      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-20 lg:grid-cols-2 lg:items-start">
          <div>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">SPPU PYQ Solutions - All Branches, All Patterns</h1>
            <p className="mt-4 text-lg text-slate-600">
              Access previous year question papers and solved papers for all SPPU engineering branches in one organized platform.
            </p>
            <p className="mt-3 text-base text-slate-500">Covers 2012, 2015, 2019, and 2024 patterns.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className={buttonClassName("bg-indigo-600 text-white")} href="#branches">
                Explore Branches
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
                href={firstYearBranch ? `/${firstYearBranch.branchSlug}` : "#branches"}
              >
                Browse First Year
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <svg viewBox="0 0 640 420" className="block w-full" role="img" aria-label="Academic illustration">
              <defs>
                <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#eef2ff" />
                  <stop offset="100%" stopColor="#e0f2fe" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="640" height="420" rx="24" fill="url(#heroBg)" />
              <rect x="86" y="84" width="468" height="250" rx="16" fill="#ffffff" stroke="#e2e8f0" />
              <rect x="118" y="122" width="190" height="18" rx="9" fill="#4f46e5" />
              <rect x="118" y="154" width="404" height="12" rx="6" fill="#cbd5e1" />
              <rect x="118" y="176" width="354" height="12" rx="6" fill="#cbd5e1" />
              <rect x="118" y="210" width="124" height="28" rx="14" fill="#6366f1" />
              <rect x="118" y="254" width="130" height="12" rx="6" fill="#94a3b8" />
              <rect x="118" y="276" width="194" height="12" rx="6" fill="#94a3b8" />
              <circle cx="472" cy="252" r="56" fill="#e0e7ff" />
              <path d="M448 252h48M472 228v48" stroke="#4338ca" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>
      <AdSlot position={AD_POSITIONS.HOMEPAGE_HERO_BOTTOM} />

      <section id="branches" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">Choose Your Branch</h2>
          <p className="text-base text-slate-600">Branch -&gt; Academic Year -&gt; Pattern -&gt; Subject -&gt; Papers</p>
        </div>
        {branches.length > 0 ? (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {firstGrid.map((branch) => (
                <Card
                  key={branch.branchSlug}
                  title={branch.branch}
                  subtitle={`Available years: ${branch.years.join(", ")}`}
                  href={`/${branch.branchSlug}`}
                />
              ))}
            </div>
            {secondGrid.length > 0 ? <AdSlot position={AD_POSITIONS.HOMEPAGE_BRANCHES_MIDDLE} /> : null}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {secondGrid.map((branch) => (
                <Card
                  key={branch.branchSlug}
                  title={branch.branch}
                  subtitle={`Available years: ${branch.years.join(", ")}`}
                  href={`/${branch.branchSlug}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-base font-medium text-slate-900">No papers added yet</p>
            <p className="mt-2 text-base text-slate-600">Add rows in `tools/database/master-catalog.csv` and run `npm.cmd run db:seed -- tools/database/master-catalog.csv`.</p>
          </div>
        )}
      </section>
      <AdSlot position={AD_POSITIONS.HOMEPAGE_FOOTER} />
    </PageLayout>
  );
}
