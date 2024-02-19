import React from 'react';
import { Column, Img, Row, Section } from '@react-email/components';

const logoURL = 'https://ship-demo.fra1.cdn.digitaloceanspaces.com/assets/logo.png';

const Header = () => (
  <>
    <Row className="p-6">
      <Column align="center">
        <Img
          src={logoURL}
          width="88"
          height="44"
          alt="Ship"
        />
      </Column>
    </Row>

    <Section className="flex w-full">
      <Row>
        <Column className="border-b-0 border-solid border-gray-100 w-60" />
        <Column className="border-b-0 border-solid border-black w-32" />
        <Column className="border-b-0 border-solid border-gray-100 w-60" />
      </Row>
    </Section>
  </>
);

export default Header;
