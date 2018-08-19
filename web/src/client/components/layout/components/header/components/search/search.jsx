// @flow

import React, { Component } from 'react';
import classnames from 'classnames';

import { FaSearch } from 'react-icons/fa';

import styles from './search.styles.pcss';

type PropsType = {
  className: string,
};

type StateType = {
  open: boolean,
  active: boolean,
  search: string,
};

class Search extends Component<PropsType, StateType> {
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

  onDocumentClick = (e: MouseEvent) => {
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

  onInputKeyDown = (e: SyntheticKeyboardEvent<*>) => {
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

  onChangeSearchValue = (e: SyntheticInputEvent<HTMLInputElement>) => {
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

  wrap: ?HTMLDivElement;

  input: ?HTMLInputElement;

  render(): React$Node {
    const { className } = this.props;
    const { active, open, search } = this.state;

    return (
      <div
        className={classnames(styles.wrap, {
          [styles.active]: active,
          [styles.open]: open,
        }, className)}
        ref={(wrap: ?HTMLDivElement) => { this.wrap = wrap; }}
      >
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            type="search"
            ref={(input: ?HTMLInputElement) => { this.input = input; }}
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

export default Search;
