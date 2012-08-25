var MemoryStore = module.exports.Store = function () {
	this.list = []; // In memory db for now.
};

MemoryStore.prototype.add = function (quote) {
	this.list.unshift(quote);
	return this.list.length;
};

MemoryStore.prototype.lastId = function () {
	return this.list.length;
};

MemoryStore.prototype.asArray = function () {
	return this.list;
};

MemoryStore.prototype.isOkay = function () {
	return true;
};

MemoryStore.prototype.getSince = function (lastId, newestQuote) {
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