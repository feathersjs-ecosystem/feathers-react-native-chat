"use strict";

import chai from 'chai';
import chaiEnzyme from 'chai-enzyme'
import sinonChai from 'sinon-chai';

import jsdom from 'jsdom';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;
global.expect = chai.expect;

chai.use(chaiEnzyme());
chai.use(sinonChai);





