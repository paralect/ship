import React from 'react';

import Layout from '../layouts/main';

export default () => (
  <Layout>
    <div className="page">
      <style jsx>{`
        .page {
          position: relative;
          height: 100%;
          box-shadow: 0 7px 30px 3px rgba(94,96,186,.35);
          background-color: var(--color-brand);

          & .intro {
            padding: 250px 0;
            lost-column: 2/3;

            & .title {
              color: var(--color-white);
              font-size: 42px;
              font-weight: 300;
            }

            & .description {
              color: var(--color-white);
              font-size: 20px;
              opacity: .85;
            }
          }

          & .logo {
            lost-column: 1/3;

            display: flex;
            justify-content: center;
            align-items: center;

            & div {
              display: block;
              width: 400px;
              height: 300px;
              background-image: linear-gradient(to right, rgba(90, 97, 241, .9) 0%, #a900ff 100%);
              border-radius: 50px;
              transform: skewX(-5deg);
              font-size: 100px;
              font-weight: 600;
              color: rgba(255, 255, 255, .8);
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      `}</style>

      <div className="container">
        <div className="intro">
          <h1 className="title">Your brand new landing website</h1>
          <p className="description">
            That opens the door into the future.<br />
            It is impossible to imagine how the humanity used to live before.
          </p>
        </div>
        <div className="logo">
          <div>Stack.</div>
        </div>
      </div>
    </div>
  </Layout>
);
