import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

import { LogoImage } from 'public/images';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Docs', href: '' },
];

const social = [
  { icon: Twitter, href: '', label: 'Twitter' },
  { icon: Github, href: '', label: 'GitHub' },
  { icon: Linkedin, href: '', label: 'LinkedIn' },
];

export const Footer = () => {
  return (
    <footer className="bg-background @container border-t py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2">
            <LogoImage className="h-5" />
          </Link>

          <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex gap-4">
            {social.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground size-8 rounded-full transition-colors"
                aria-label={item.label}
              >
                <item.icon className="size-4" />
              </Link>
            ))}
          </div>

          <p className="text-muted-foreground mt-8 text-sm">
            &copy; {new Date().getFullYear()} Ship. Built by Paralect.
          </p>
        </div>
      </div>
    </footer>
  );
};
