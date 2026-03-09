import Head from 'next/head';

import { CTA, FAQ, Features, Footer, Hero, Logos, Pricing, Testimonials } from './components';

import PublicHeader from '@/components/PublicHeader';

const Landing = () => {
  return (
    <>
      <Head>
        <title>Ship - The fastest way to build your SaaS</title>
        <meta
          name="description"
          content="Ship is a full-stack SaaS boilerplate with authentication, payments, emails, and more. Build and launch your product in days, not months."
        />
      </Head>

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
    </>
  );
};

export default Landing;
