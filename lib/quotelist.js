

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
	Quote: require('./quote')
};

