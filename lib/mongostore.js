
var mongo = require('mongoskin');
var Q = require('q');

var MongoStore = module.exports.Store = function (dbpath) {
	var db = mongo.db(dbpath);
	this.list = db.collection('quotes');
};

MongoStore.prototype.add = function (quote) {
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

MongoStore.prototype.lastId = function () {
	var deferred = Q.defer();
	deferred.resolve(0); //this.list.count();
	return deferred.promise;
};

MongoStore.prototype.asArray = function () {
	var deferred = Q.defer();
	this.list.find().sort({createdOn: -1}).toArray(function(err, result) {
		if (err) {
			deferred.reject(err);
		}
		deferred.resolve(result);
	});
	return deferred.promise;
};

MongoStore.prototype.getSince = function (lastId, newestQuote) {
	//if (typeof (lastId) === 'undefined') {
		return typeof (newestQuote) === 'undefined' ? [] : [newestQuote];
	//}
};

MongoStore.prototype.isOkay = function () {
	return typeof (this.list) !== 'undefined';
};