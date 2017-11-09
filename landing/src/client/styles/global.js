import React from 'react';

export default () => (
  <style jsx global>{`
    @lost flexbox flex;

    * {
     font-size: 100%;
     font-family: 'Open Sans', 'Helvetica Neue', sans-serif;
     color: #777;
    }

    html {
      height: 100%;

      --bgColor: red;
      --color-white: #fff;

      --color-brand: #55299a;
      --color-secondary: #59ca79;
      --color-background: #fafafa;

      --form-padding: 16px;

      --max-container-width: 1160px;
      --container-padding: 0 20px;
    }

    form {
      &.form {
        width: 100%;
        display: flex;
        flex-direction: column;

        & .input {
          border-radius: 8px;
          padding: var(--form-padding) calc(var(--form-padding) * 2);
          margin: var(--form-padding) 0;
          background: white;
          border: 1px solid #e8e8e8;
          transition: box-shadow .5s;

          &:focus {
            outline: none;
            /*box-shadow: 0px 0px 10px color(var(--color-brand) alpha(-10%));*/
            box-shadow: 0px 0px 10px color(#55299a alpha(-50%));
          }
        }

        & button[type="submit"] {
          margin: 16px;
        }
      }
    }

    body {
      margin: 0;
      height: 100%;
      background: #f0f0f0;
    }

    h1 {
      font-size: 40px;
      font-weight: normal;
    }

    h2 {
      font-size: 35px;
      font-weight: normal;
    }

    .container {
      @lost flexbox flex;
      max-width: var(--max-container-width);
      lost-center: var(--max-container-width);
      padding: var(--container-padding);
      margin: 0 auto;
    }

    @keyframes Gradient {
      0% {
        background-position: 0% 50%
      }
      50% {
        background-position: 100% 50%
      }
      100% {
        background-position: 0% 50%
      }
    }

    .auth.page {
      @custom-media --breakpoint-small (width <= 720px);
      @custom-media --navbar-height-reached (height <= 700px);

      height: 100vh;
      width: 100%;
      padding-top: 75px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;

      @media (--navbar-height-reached) {
        padding-top: 100px;
        align-items: flex-start;
      }

      & .panel {
        height: 600px;

        @media (--breakpoint-small) {
          width: 100%;
        }

        & img {
          width: auto;
          height: 100%;
          border-radius: 10px;
          background: var(--color-background);

          @media(--breakpoint-small) {
            display: none;
          }
        }

        & .form-wrap {
          display: flex;
          flex-direction: column;
          padding: 0 30px;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;

          & form {
            & a {
              color: #a1a1a1;
            }
          }
        }
      }
    }

    .panel {
      padding: 5px;
      display: flex;
      background: var(--color-white);
      border-radius: 10px;
      box-shadow: 0 7px 30px 3px rgba(94,96,186,.35);
      margin: 10px;
    }

    button {
      outline: none !important;
      border: none;
    }
  `}</style>
);
