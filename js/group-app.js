console.log('app.js');

var _ = require('lodash');
var $ = require('jquery');
var Promise = require('bluebird');

console.log("Should be true: ", _.isString('this is a string'));

$(document.body).append($('<div>jQuery working!</div>'))