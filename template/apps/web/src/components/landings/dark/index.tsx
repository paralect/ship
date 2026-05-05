

import { CTA, FAQ, Features, Footer, Hero, Logos, Pricing, Testimonials } from './components';

import PublicHeader from '@/components/public-header';

const Landing = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <PublicHeader />

        <main className="flex-1">
          <Hero />
          <div className="h-px bg-border" />
          <Logos />
          <div className="h-px bg-border" />
          <Features />
          <div className="h-px bg-border" />
          <Pricing />
          <div className="h-px bg-border" />
          <Testimonials />
          <div className="h-px bg-border" />
          <FAQ />
          <div className="h-px bg-border" />
          <CTA />
        </main>
        <Footer />
      </div>
  );
};

export default Landing;
