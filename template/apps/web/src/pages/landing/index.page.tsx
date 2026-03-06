import { NextPage } from 'next';
import Head from 'next/head';

import { LayoutType, Page } from 'components';

import CTA from './components/CTA';
import FAQ from './components/FAQ';
import Features from './components/Features';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Logos from './components/Logos';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';

const LandingPage: NextPage = () => {
  return (
    <Page layout={LayoutType.PUBLIC_PAGE}>
      <Head>
        <title>Ship | Modern SaaS Boilerplate</title>
        <meta
          name="description"
          content="Ship your SaaS in days, not months. The high-performance toolkit for developers."
        />
      </Head>

      <div className="flex min-h-screen flex-col">
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
    </Page>
  );
};

export default LandingPage;
