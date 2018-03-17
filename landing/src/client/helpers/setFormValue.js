export default (prop) => {
  return function eventHandler(e) {
    this.setState({
      [prop]: e.target.value,
    });
  };
};
