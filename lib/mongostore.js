/*globals module:false, require:false */
var mongo = require('mongoskin');
var Q = require('q');
var dateformat = require('dateformat');

var getLastId = function (created) {
	return dateformat(created, 'UTC:yyyy-mm-dd\'T\'HH:MM:ss.l\'Z\'');
};

var MongoStore = module.exports.Store = function (dbpath) {
	var db = mongo.db(dbpath);
	this.list = db.collection('quotes');
};

MongoStore.prototype.add = function (quote, lastId) {
	var deferred = Q.defer();
	var self = this;
	this.list.insert(quote, {safe:true}, function (err, result) {
		if (err) {
			deferred.reject(err);
			return;
		}
		var newLastId = getLastId(quote.createdOn);
		if (typeof (lastId) === 'undefined') {
			var ret = typeof (quote) === 'undefined' ? [undefined, newLastId] : [[quote], newLastId];
			deferred.resolve(ret);
		}
		deferred.resolve([self.getSince(lastId), newLastId]);
	});

	return deferred.promise;
};

MongoStore.prototype.lastId = function () {
	var deferred = Q.defer();
	this.list.find().sort({createdOn: -1}).limit(1).toArray(function (err, result) {
		if (err) {
			deferred.reject(err);
		} else if (result.length < 1) {
			deferred.resolve(getLastId(new Date(0)));
		} else {
			deferred.resolve(getLastId(result[0].createdOn));
		}
	});
	return deferred.promise;
};

MongoStore.prototype.asArray = function () {
	var deferred = Q.defer();
	this.list.find().sort({createdOn: -1}).toArray(function(err, result) {
		if (err) {
			deferred.reject(err);
			return;
		}
		deferred.resolve(result);
	});
	return deferred.promise;
};

MongoStore.prototype.getSince = function (lastId) {
	var deferred = Q.defer();
	if (typeof (lastId) === 'undefined') {
		deferred.resolve([]);
		return deferred.promise;
	}

	var lastDate = new Date(lastId);
	this.list.find({createdOn: {$gt: lastDate}}).sort({createdOn: -1}).toArray(function (err, result) {
		if (err) {
			deferred.reject(err);
			return;
		}
		deferred.resolve(result);
	});
	return deferred.promise;
};

MongoStore.prototype.isOkay = function () {
	return typeof (this.list) !== 'undefined';
};