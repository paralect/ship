import Head from 'next/head';

import { CTA, FAQ, Features, Footer, Header, Hero, Logos, Pricing, Testimonials } from './components';

const VeilLanding = () => {
  return (
    <>
      <Head>
        <title>Veil | Modern Integration Platform</title>
        <meta
          name="description"
          content="Ship faster. Integrate smarter. Veil is your all-in-one engine for adding seamless integrations to your app."
        />
      </Head>

      <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30 selection:text-foreground">
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

export default VeilLanding;
