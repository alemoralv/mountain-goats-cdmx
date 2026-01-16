'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Mountain, User, ChevronDown, LogOut, Settings, Calendar, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types/database';

const NAV_LINKS = [
  { label: 'The Goats', href: '/about' },
  { label: 'Hikes', href: '/hikes' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Packages', href: '/packages' },
];

interface UserSession {
  id: string;
  email: string;
}

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<Partial<Profile> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fetch user session on mount
  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;
    
    // Get initial session with timeout
    const fetchSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' });
          
          // Fetch profile with error handling
          try {
            const { data, error: profileError } = await supabase
              .from('profiles')
              .select('nickname, full_name, avatar_url')
              .eq('id', session.user.id)
              .single();
            
            if (!isMounted) return;
            
            if (!profileError && data) {
              setProfile(data);
            }
          } catch (e) {
            console.error('Profile fetch error:', e);
          }
        }
        
        if (isMounted) setIsLoading(false);
      } catch (e) {
        console.error('Auth error:', e);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSession();

    // Timeout fallback - stop loading after 3 seconds regardless
    const timeout = setTimeout(() => {
      if (isMounted && isLoading) {
        setIsLoading(false);
      }
    }, 3000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        try {
          const { data } = await supabase
            .from('profiles')
            .select('nickname, full_name, avatar_url')
            .eq('id', session.user.id)
            .single();
          if (isMounted && data) setProfile(data);
        } catch (e) {
          console.error('Profile fetch error:', e);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  // Get display name and initials
  const displayName = profile?.nickname || profile?.full_name || user?.email?.split('@')[0] || 'User';
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

            {/* Desktop Auth / User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {isLoading ? (
                <div className="w-24 h-10 bg-white/10 animate-pulse rounded-xl" />
              ) : user ? (
                /* User Menu */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200',
                      isScrolled
                        ? 'bg-white/10 hover:bg-white/20'
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                    )}
                  >
                    {/* Avatar */}
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={displayName}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center text-white text-sm font-bold">
                        {getInitials(displayName)}
                      </div>
                    )}
                    <span className="text-white font-medium text-sm max-w-[100px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className={cn(
                      'w-4 h-4 text-white/70 transition-transform',
                      isUserMenuOpen && 'rotate-180'
                    )} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevation-high overflow-hidden animate-fade-in">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-navy-950 truncate">{displayName}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Mis Hikes</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Award className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Mi Perfil Goat</span>
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Configuración</span>
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login Button */
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
              )}
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
            isMobileMenuOpen ? 'max-h-[500px] bg-navy-950' : 'max-h-0'
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
            
            {/* Mobile User Section */}
            <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={displayName}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-forest-600 flex items-center justify-center text-white font-bold">
                        {getInitials(displayName)}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold">{displayName}</p>
                      <p className="text-white/60 text-sm truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Mobile Menu Links */}
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Mis Hikes</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white/90 hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    <Award className="w-5 h-5" />
                    <span className="font-medium">Mi Perfil Goat</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-navy-950 rounded-xl font-semibold uppercase tracking-wider"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
              )}
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
