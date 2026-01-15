'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Mountain, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'The Goats', href: '/about' },
  { label: 'Hikes', href: '/hikes' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Packages', href: '/packages' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-navy-950 shadow-lg'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
            >
              <div className={cn(
                'p-2 rounded-xl transition-colors duration-300',
                isScrolled 
                  ? 'bg-white/10' 
                  : 'bg-white/10 group-hover:bg-white/20'
              )}>
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold uppercase tracking-wider text-white">
                  Mountain Goats
                </span>
                <span className={cn(
                  'text-xs uppercase tracking-[0.3em] transition-colors',
                  isScrolled ? 'text-white/70' : 'text-white/60'
                )}>
                  CDMX
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium uppercase tracking-wider transition-all duration-200',
                    'text-white/90 hover:text-white',
                    'relative after:absolute after:bottom-0 after:left-4 after:right-4',
                    'after:h-0.5 after:bg-forest-500 after:scale-x-0 after:transition-transform',
                    'hover:after:scale-x-100'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl',
                  'text-sm font-semibold uppercase tracking-wider transition-all duration-200',
                  isScrolled
                    ? 'bg-white text-navy-950 hover:bg-white/90'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                )}
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            isMobileMenuOpen ? 'max-h-96 bg-navy-950' : 'max-h-0'
          )}
        >
          <div className="px-4 py-4 space-y-1 border-t border-white/10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg font-medium uppercase tracking-wider transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 mt-4">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-navy-950 rounded-xl font-semibold uppercase tracking-wider"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar - only when content needs it */}
      {/* Remove this if your pages have full-bleed hero sections */}
    </>
  );
}

export default Navbar;

