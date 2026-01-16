import Link from 'next/link';
import { Mountain, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  explore: [
    { label: 'Próximas Caminatas', href: '/hikes', external: false },
    { label: 'Calendario', href: '/calendar', external: false },
    { label: 'Entrenamiento', href: '/training', external: false },
    { label: 'Paquetes', href: '/packages', external: false },
  ],
  company: [
    { label: 'The Goats', href: '/about', external: false },
    { label: 'FAQ', href: '/docs/MG_faq.pdf', external: true },
    { label: 'Contacto', href: '/contact', external: false },
  ],
  legal: [
    { label: 'Términos de Servicio', href: '/docs/MG_tds.pdf', external: true },
    { label: 'Política de Privacidad', href: '/docs/MG_pdp.pdf', external: true },
    { label: 'Política de Exención', href: '/docs/MG_pde.pdf', external: true },
    { label: 'Política de Reembolso', href: '/docs/MG_pdr.pdf', external: true },
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
              Experiencias premium de senderismo en la Ciudad de México y alrededores. 
              Conquista cumbres, construye comunidad y descubre las montañas 
              que rodean CDMX.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/mountaingoatscdmx?igsh=MXRvMHZsbGlvZXhiMw%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:mountaingoatscdmx@gmail.com"
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
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
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
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
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
                href="tel:+525544535014" 
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                +52 55 4453 5014
              </a>
              <a 
                href="mailto:mountaingoatscdmx@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                mountaingoatscdmx@gmail.com
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
              © {new Date().getFullYear()} Mountain Goats CDMX. Todos los derechos reservados.
            </p>
            <p>
              Hecho con 🏔️ para la comunidad de senderismo
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

