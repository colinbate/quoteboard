
var dateformat = require('dateformat');
var mongo = require('mongoskin');
var db = mongo.db('localhost:27017/test');
db.quotes = db.collection('quotes');
var Q = require('q');

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

Board.prototype.isOkay = function () {
	return true;
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

var MongoBoard = function (quotedb) {
	this.list = quotedb;
};

MongoBoard.prototype.add = function (quote) {
	var deferred = Q.defer();
	var db = this.list;
	db.insert(quote, {safe:true}, function (err, result) {
		if (err) {
			deferred.reject(err);
			return;
		}
		db.count(function (err, count) {
			if (err) {
				deferred.reject(err);
				return;
			}
			deferred.resolve(count);
		});
	});

	return deferred.promise; //this.list.count();
};

MongoBoard.prototype.lastId = function () {
	var deferred = Q.defer();
	deferred.resolve(0); //this.list.count();
	return deferred.promise;
};

MongoBoard.prototype.asArray = function () {
	var deferred = Q.defer();
	this.list.find().toArray(function(err, result) {
		if (err) {
			deferred.reject(err);
		}
		console.log('asArray: ' + result);
		deferred.resolve(result);
	});
	return deferred.promise;
};

MongoBoard.prototype.getSince = function (lastId, newestQuote) {
	//if (typeof (lastId) === 'undefined') {
		return typeof (newestQuote) === 'undefined' ? [] : [newestQuote];
	//}
};

MongoBoard.prototype.isOkay = function () {
	return typeof (this.list) !== 'undefined';
};

module.exports = {
	board: new MongoBoard(db.quotes),
	Quote: Quote
};

