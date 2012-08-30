/*globals module:false, require:false */
var Q = require('q');
var fs = require('fs');
var path = require('path');

var webImagePattern = /^image\/(png|jpeg|gif)$/;

var isWebImage = function (mime) {
	return webImagePattern.test(mime);
};

var saveImage = function (image, where) {
	var deferred = Q.defer();
	if (!image || !image.path) {
		deferred.reject(new Error('Not a valid file.'));
		return deferred.promise;
	}
	if (!isWebImage(image.type)) {
		deferred.reject(new Error('Not a valid image type.'));
		return deferred.promise;
	}
	var stamp = (new Date()).getTime();
	var filename = stamp + '-' + image.name;
	var folder = path.join(__dirname, '..', 'public', where);
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder, 0755);
	}
	var target = path.join(folder, filename);

	fs.rename(image.path, target, function (err) {
		if (err) {
			deferred.reject(err);
			return;
		}
		deferred.resolve(filename);
	})
	return deferred.promise;
}

module.exports = {
	board: undefined,
	useMemoryStore: function () {
		var memory = require('./memorystore');
		this.board = new memory.Store();
	},
	useMongoStore: function (path) {
		var mongo = require('./mongostore');
		this.board = new mongo.Store(path);
	},
	Quote: require('./quote'),
	saveImage: saveImage
};

