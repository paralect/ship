import React, { FC, ReactNode } from 'react';
import { Body, Container, Html, Preview, Section, Tailwind } from '@react-email/components';

import Head from './components/head';
import Header from './components/header';
import BodyFooter from './components/body-footer';
import MainFooter from './components/main-footer';

import config from '../tailwind.config';

interface LayoutProps {
  children: ReactNode;
  previewText?: string;
}

const Layout:FC<LayoutProps> = ({ children, previewText }) => (
  <Html>
    <Head />

    {previewText && <Preview>{previewText}</Preview>}

    <Tailwind config={config}>
      <Body className="bg-background py-8">
        <Container className="mx-auto rounded-md bg-white">
          <Header />

          <Section className="pt-2 pr-8 pb-3 pl-8">
            {children}

            <MainFooter />
          </Section>
        </Container>

        <BodyFooter />
      </Body>
    </Tailwind>
  </Html>
);

export default Layout;
