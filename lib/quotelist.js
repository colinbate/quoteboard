
var dateformat = require('dateformat');

var Quote = function(saying, author, day) {
	this.saying = saying;
	this.author = author;
	if (!day) {
		day = new Date();
	}
	if (!(day instanceof Date)) {
		day = new Date(day);
	}
	this.day = day;
	this.displayDate = dateformat(day, 'mediumDate');
}

Quote.prototype.isValid = function () {
	return !!this.saying && !!this.author;
};

var Board = function () {
	this.list = []; // In memory db for now.
};

Board.prototype.add = function (quote) {
	this.list.unshift(quote);
	return this.list.length;
};

Board.prototype.lastId = function () {
	return this.list.length;
};

Board.prototype.asArray = function () {
	return this.list;
};

Board.prototype.getSince = function (lastId, newestQuote) {
	if (typeof (lastId) === 'undefined') {
		return typeof (newestQuote) === 'undefined' ? [] : [newestQuote];
	}
	var diff = this.list.length - lastId;
	var ret = this.list.slice(0, diff);
	if (typeof (newestQuote) !== 'undefined') {
		ret.unshift(newestQuote);
	}
	return ret;
};


module.exports = {
	board: new Board(),
	Quote: Quote
};