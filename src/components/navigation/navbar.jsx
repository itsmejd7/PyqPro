import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-sky-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight text-indigo-700">
          PYQPRO
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600" aria-label="Primary navigation">
          <Link href="/" className="rounded-md px-2 py-1 transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-700">
            Home
          </Link>
          <Link href="/#branches" className="rounded-md px-2 py-1 transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-700">
            Branches
          </Link>
        </nav>
      </div>
    </header>
  );
}
