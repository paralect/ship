import React from 'react';

import Layout from '../layouts/main';

export default () => (
  <Layout>
    <div className="page">
      <style jsx>{`
        .page {
          flex: 1;
          display: flex;
          flex-direction: column;

          & .intro {
            padding: 20px 0;
            min-width: 350px;
            flex: 1;

            & .title {
              color: var(--color-white);
              font-size: 42px;
              font-weight: 300;
              margin-top: 0;
            }

            & .description {
              color: var(--color-white);
              font-size: 20px;
              opacity: .85;
            }
          }

          & .logo {
            padding: 20px 0;
            max-width: 400px;
            min-width: 300px;
            min-height: 250px;

            display: flex;
            justify-content: center;

            & div {
              display: block;
              width: 100%;
              flex: 1;
              background: linear-gradient(to right, rgba(90, 97, 241, .9) 0%, #a900ff 100%);
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

        .container {
          align-items: center;
          flex: 1;
          justify-content: space-between;
          width: 100%;
          max-width: var(--max-container-width);
          box-sizing: border-box;
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
