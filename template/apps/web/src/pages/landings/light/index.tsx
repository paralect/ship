import Head from 'next/head';

import { CTA, FAQ, Features, Footer, Header, Hero, Logos, Pricing, Testimonials } from './components';

const LightLanding = () => {
  return (
    <>
      <Head>
        <title>Ship | Modern SaaS Boilerplate</title>
        <meta
          name="description"
          content="Ship your SaaS in days, not months. The high-performance toolkit for developers."
        />
      </Head>

      <div className="flex min-h-screen flex-col bg-background selection:bg-teal-300 selection:text-black">
        <Header />
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
    </>
  );
};

export default LightLanding;
