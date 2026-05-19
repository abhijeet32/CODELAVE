import Link from 'next/link';

export const metadata = {
  title: 'Codelave - Managed Code Execution',
  description: 'The ultimate platform for secure, scalable, and instant code execution environments.',
};

export default function LandingPage() {
  return (
    <div className="container">
      <nav className="navbar">
        <Link href="/" className="nav-brand">Codelave</Link>
        <div className="nav-links">
          <Link href="/login" className="btn-ghost">Sign In</Link>
          <Link href="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-badge">🚀 The next generation of code execution</div>
        <h1 className="hero-title">
          Build faster with <br />
          <span>secure sandboxes</span>
        </h1>
        <p className="hero-subtitle">
          Codelave provides instant, scalable, and secure code execution environments. 
          Run any code, anywhere, with our powerful infrastructure.
        </p>
        <div className="hero-cta">
          <Link href="/signup" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
            Start for free
          </Link>
          <Link href="/docs" className="btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
            Read the docs
          </Link>
        </div>
      </main>
    </div>
  );
}
