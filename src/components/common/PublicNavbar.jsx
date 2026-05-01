import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, TreePine } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Contact', href: '#contact' },
];

function scrollTo(href) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setScrollProgress(0);
        return;
      }

      const nextProgress = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
      setScrollProgress(nextProgress);
    };

    // Sync initial state when the page renders or reloads mid-scroll.
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    scrollTo(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/92 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white/20 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <a
            href="#hero"
            onClick={(e) => handleAnchorClick(e, '#hero')}
            className={`flex items-center gap-2 font-bold text-lg transition-colors shrink-0 ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <TreePine className={`w-5 h-5 ${scrolled ? 'text-blue-600' : 'text-amber-400'}`} />
            Ahman Patigi Family Tree
          </a>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  scrolled
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth CTAs (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                scrolled
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'border-white/40 text-white hover:bg-white/10'
              }`}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/97 backdrop-blur-md border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="block px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-gray-100 flex gap-3">
              <Link
                to="/login"
                className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className={`h-0.5 bg-black/5 ${scrollProgress > 0 ? 'opacity-100' : 'opacity-70'} transition-opacity`}>
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-blue-500 to-purple-500 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
}
