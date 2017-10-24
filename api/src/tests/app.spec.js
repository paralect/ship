const chai = require('chai');

const server = require('../app');
const request = require('supertest').agent(server.listen());

chai.should();

require('../resources/account/account.test')(request);
