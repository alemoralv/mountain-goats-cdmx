import Link from 'next/link';
import { Mountain, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  explore: [
    { label: 'Próximas Caminatas', href: '/hikes' },
    { label: 'Calendario', href: '/calendar' },
    { label: 'Entrenamiento', href: '/training' },
    { label: 'Paquetes', href: '/packages' },
  ],
  company: [
    { label: 'Los Goats', href: '/about' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contacto', href: '/contact' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Waiver Policy', href: '/waiver' },
    { label: 'Refund Policy', href: '/refunds' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-white/10">
                <Mountain className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold uppercase tracking-wider">
                  Mountain Goats
                </span>
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                  CDMX
                </span>
              </div>
            </Link>
            <p className="text-white/70 leading-relaxed mb-6 max-w-sm">
              Premium hiking experiences in and around Mexico City. 
              Conquer peaks, build community, and discover the mountains 
              that surround CDMX.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/mountaingoatscdmx"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/mountaingoatscdmx"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:hola@mountaingoats.mx"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-6">
              Explorar
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-6">
              Compañía
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
              <a 
                href="tel:+525512345678" 
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                +52 55 1234 5678
              </a>
              <a 
                href="mailto:hola@mountaingoats.mx"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                hola@mountaingoats.mx
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Ciudad de México, México
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-white/50">
            <p>
              © {new Date().getFullYear()} Mountain Goats CDMX. All rights reserved.
            </p>
            <p>
              Built with 🏔️ for the hiking community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

