import Link from "next/link";
import { Card } from "@/components/ui/card";
import { listBranches } from "@/server/repositories/pyq";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const branches = await listBranches();
  const firstBranch = branches[0];
  const totalYears = branches.reduce((sum, branch) => sum + branch.years.length, 0);

  return (
    <>
      <section className="hero hero-premium home-hero">
        <div>
          <span className="hero-badge">PYQPRO</span>
          <h1>One Place for Engineering PYQs</h1>
          <p>
            Browse your branch, year, pattern, and subject in seconds. Open papers inside the platform with fast mobile-friendly viewing.
          </p>
          <div className="hero-actions">
            {firstBranch ? (
              <Link className="btn btn-primary" href={`/${firstBranch.branchSlug}`}>
                Start with {firstBranch.branch}
              </Link>
            ) : null}
            <Link className="btn btn-ghost" href="#branches">
              Explore Branches
            </Link>
          </div>
        </div>
        <div className="hero-side">
          <div className="hero-metrics">
            <div>
              <strong>{branches.length}</strong>
              <span>Branches</span>
            </div>
            <div>
              <strong>{totalYears}</strong>
              <span>Branch-Year Paths</span>
            </div>
            <div>
              <strong>4</strong>
              <span>Patterns (2012/2015/2019/2024)</span>
            </div>
          </div>
        </div>
      </section>

      <section id="branches" className="section page-shell">
        <div className="section-head">
          <h2>Choose Your Branch</h2>
          <p>Branch -&gt; Academic Year -&gt; Pattern -&gt; Subject -&gt; Papers</p>
        </div>
        {branches.length > 0 ? (
          <div className="grid">
            {branches.map((branch) => (
              <Card
                key={branch.branchSlug}
                title={branch.branch}
                subtitle={`Available years: ${branch.years.join(", ")}`}
                href={`/${branch.branchSlug}`}
              />
            ))}
          </div>
        ) : (
          <div className="list">
            <div className="list-item">
              <strong>No papers added yet</strong>
              <p>Add rows in `data/catalog/master-catalog.csv` and run `cmd /c npm run db:seed`.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
