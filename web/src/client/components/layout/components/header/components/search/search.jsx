import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { FaSearch } from 'react-icons/fa';

import styles from './search.styles.pcss';

class Search extends Component {
  state = {
    active: false,
    open: false,
    search: '',
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick = (e) => {
    const el = e.target;
    if (!(this.wrap && el instanceof Node && this.wrap.contains(el))) {
      this.onCloseSearch();
    }
  }

  onChangeSearchState = () => {
    const { active } = this.state;
    if (!active) {
      this.setState({ active: true }, () => {
        setTimeout(this.openAndFocus, 200);
      });
    } else {
      this.onCloseSearch();
    }
  }

  onInputKeyDown = (e) => {
    const { active } = this.state;

    if (e.keyCode === 13) {
      if (!active) {
        this.onChangeSearchState();
      } else {
        // send request to the server
      }
    } else if (e.keyCode === 27) {
      if (active) {
        this.onChangeSearchState();
      }
    }
  }

  onChangeSearchValue = (e) => {
    this.setState({ search: e.target.value });
  }

  onCloseSearch() {
    this.setState({ open: false }, () => {
      setTimeout(() => {
        const { open } = this.state;
        if (!open) {
          this.setState({ active: false });
        }
      }, 300);
    });
  }

  openAndFocus = () => {
    const { active } = this.state;
    if (active) {
      this.setState({ open: true }, () => {
        setTimeout(() => {
          const { open } = this.state;
          if (open && this.input) {
            this.input.focus();
          }
        }, 500);
      });
    }
  }

  render() {
    const { className } = this.props;
    const { active, open, search } = this.state;

    return (
      <div
        className={classnames(styles.wrap, {
          [styles.active]: active,
          [styles.open]: open,
        }, className)}
        ref={(wrap) => { this.wrap = wrap; }}
      >
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            type="search"
            ref={(input) => { this.input = input; }}
            value={search}
            onChange={this.onChangeSearchValue}
            onKeyDown={this.onInputKeyDown}
          />

          <div className={styles.inputFocus} />
        </div>

        <FaSearch
          size={20}
          className={styles.icon}
          onClick={this.onChangeSearchState}
        />
      </div>
    );
  }
}

Search.propTypes = {
  className: PropTypes.string.isRequired,
};

export default Search;
