import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

import { LogoImage } from 'public/images';

const footerLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
];

export const Footer = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <LogoImage className="h-5" />
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            <Twitter className="size-4" />
          </a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            <Github className="size-4" />
          </a>
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Ship</span>
        </div>
      </div>
    </footer>
  );
};
