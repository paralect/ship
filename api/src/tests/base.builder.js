class BaseBuilder {
  constructor(service) {
    this._service = service;

    this._id = service.generateId();
    this.data = {
      _id: this._id,
    };
  }

  /**
   * @desc Save object to the database
   * @return {Promise}
   */
  build() {
    return this._service.create(this.data);
  }
}

module.exports = BaseBuilder;
