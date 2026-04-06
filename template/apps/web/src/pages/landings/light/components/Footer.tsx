import { FC } from 'react';
import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

import { LogoImage } from 'public/images';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <footer className="border-y-4 border-foreground bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <LogoImage className="h-6" />
            </Link>
            <div className="h-8 w-1 bg-foreground opacity-10" />
            <p className="font-mono text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Built for speed. Ship 2026.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-mono text-xs font-black uppercase tracking-widest text-foreground hover:text-[var(--color-landing-orange)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-foreground hover:scale-110 transition-transform">
              <Twitter size={18} fill="currentColor" />
            </Link>
            <Link href="#" className="text-foreground hover:scale-110 transition-transform">
              <Github size={18} fill="currentColor" />
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t-2 border-foreground/5 pt-8 text-center md:flex md:items-center md:justify-between">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            © {currentYear} Ship Architecture. All systems operational.
          </p>
          <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:mt-0">
            v2.4.0-production
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
