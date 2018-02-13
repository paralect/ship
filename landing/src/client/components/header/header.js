import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';

import ArrowSvg from './arrow';

const Header = ({ secondary }) => (
  <nav className="nav">
    <style jsx>{`
      .nav {
        width: 100%;
        margin-top: 25px;
        height: 50px;
        color: var(--color-white);

        & .menu {
          max-width: var(--max-container-width);
          display: flex;
          justify-content: space-between;
          width: 100%;
          z-index: 1;
          flex-flow: row wrap;
          
          & > .item {
            & a {
              color: white;
              text-decoration: none;
            }
              
            &.logo {
              & img {
                width: 132px;
              }
            }
              
            & > .links {
              display: flex;
              margin: 0;
              padding: 0;
              
              & > .link {
                color: var(--color-white);
                list-style: none;
                font-size: 18px;
                padding: 0 27px;
                line-height: 50px;
                transition: color .1s ease;

                &.login {
                  background: linear-gradient(to right, rgba(90,97,241,0.9) 0%, #7a00ff 100%);
                  border-radius: 5px;
                  cursor: pointer;

                  &.secondary {
                    background: linear-gradient(to right, #18c76d 0%, #08af81 100%);
                  }

                  & a {
                    display: flex;
                  }

                  & .text {
                    color: var(--color-white);
                    flex-shrink: 0;
                  }

                  & .arrow {
                    stroke: white;
                    transition: transform .5s ease;
                    margin-left: 5px;
                    transform: translateX(0px);
                  }

                  &:hover .arrow {
                    transform: translateX(5px);
                  }
                }
              }
            }
          }
        }
      }
   `}</style>

    <div className="container">
      <div className="menu">
        <div className="item logo">
          <Link href="/">
            <a href="/"> <img src="static/logo.png" alt="logo" /> </a>
          </Link>
        </div>
        <div className="item">
          <ul className="links">
            <li className="link">
             About
            </li>
            <li className="link">
              Blog
            </li>
            <li className={classnames('link', 'login', { secondary })}>
              <Link prefetch href="/signin">
                <a href="/signin">
                  <span className="text">Log In</span>
                  <div className="arrow"><ArrowSvg /></div>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
);

Header.propTypes = {
  secondary: PropTypes.bool,
};

Header.defaultProps = {
  secondary: false,
};

export default Header;
