import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageLayout>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-base text-slate-600">The requested page does not exist.</p>
        <div className="mt-6">
          <Button href="/">Go back to home</Button>
        </div>
      </section>
    </PageLayout>
  );
}
