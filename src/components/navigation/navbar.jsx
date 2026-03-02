import Link from "next/link";

export function Navbar() {
  return (
    <header className="navbar">
      <Link href="/" className="brand">PYQPRO</Link>
      <nav className="links" aria-label="Primary navigation">
        <Link href="/">Home</Link>
        <Link href="/">Branches</Link>
      </nav>
    </header>
  );
}
