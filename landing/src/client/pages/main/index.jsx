import React from 'react';

import Rocket from '~/static/rocket.svg';

import Ansible from '~/static/ansible.svg';
import CI from '~/static/ci.svg';
import DigitalOcean from '~/static/digital-ocean.svg';
import Github from '~/static/github.svg';
import Docker from '~/static/docker.svg';
import Grafana from '~/static/grafana.svg';
import ReactSVG from '~/static/react.svg';
import Slack from '~/static/slack.svg';
import SourceCode from '~/static/source-code.svg';

import Layout from '~/layouts/main';
import ButtonLink from '~/components/button-link';
import { sizes as buttonSizes } from '~/components/button';
import { states } from '~/constants';

import styles from './styles.pcss';

export default () => (
  <Layout className={styles.layout}>
    <Layout.HeaderContent state={states.purple}>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.intro}>
            <h1 className={styles.title}>The new standard in starters for landing websites</h1>

            <p className={styles.description}>
              Ship is a tool which help you setup your new product in matter of
              minutes. Ship is based on Stack. Stack is an number of open-source
              components, resulted from years of hard work on a number of awesome
              products.
            </p>

            <ButtonLink
              state={states.green}
              size={buttonSizes.small}
              className={styles.link}
              href="/signup"
              prefetch
            >
              Create Account
            </ButtonLink>
          </div>

          <div className={styles.logo}>
            <Rocket />
          </div>
        </div>
      </div>
    </Layout.HeaderContent>

    <Layout.Content className={styles.content}>
      <div className={styles.shipDescription}>
        <h2>THE COMPLETE SET OF TOOLS TO START YOUR PROJECT</h2>

        <p>
          Shipping is crucial part of any new product. The quicker you ship, the
          more time you have to validate your hypotheses. The quicker you validate
          your idea, the sooner you know if you&apos;re building what people want.
        </p>
      </div>

      <div className={styles.icons}>
        <div>
          <span><Ansible /></span>
          <span><CI /></span>
          <span><DigitalOcean /></span>
        </div>
        <div>
          <span><Github /></span>
          <span><Docker /></span>
          <span><Grafana /></span>
        </div>
        <div>
          <span><ReactSVG /></span>
          <span><Slack /></span>
          <span><SourceCode /></span>
        </div>
      </div>
    </Layout.Content>

  </Layout>
);
