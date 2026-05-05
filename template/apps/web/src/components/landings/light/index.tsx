

import { CTA, FAQ, Features, Footer, Hero, Logos, Pricing, Testimonials } from './components';

import PublicHeader from '@/components/public-header';

const LightLanding = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-teal-300 selection:text-black">
        <PublicHeader />

        <main className="flex-1">
          <Hero />
          <Logos />
          <Features />
          <Pricing />
          <Testimonials />
          <FAQ />
          <CTA />
        </main>

        <Footer />
      </div>
  );
};

export default LightLanding;
