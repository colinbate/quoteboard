/*globals module:false */
var MemoryStore = module.exports.Store = function () {
	this.list = []; // In memory db for now.
};

MemoryStore.prototype.add = function (quote, lastId) {
	this.list.unshift(quote);
	if (typeof (lastId) === 'undefined') {
		return typeof (quote) === 'undefined' ? [undefined, this.list.length] : [[quote], this.list.length];
	}
	var ret = this.getSince(lastId);
	return [ret, this.list.length];
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

MemoryStore.prototype.getSince = function (lastId) {
	if (typeof (lastId) === 'undefined') {
		return [];
	}
	var diff = this.list.length - lastId;
	var ret = this.list.slice(0, diff);
	return ret;
};