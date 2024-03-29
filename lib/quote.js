/*globals module:false, require:false */
var dateformat = require('dateformat');

var Quote = module.exports = function(saying, author, day, creator, image) {
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
	this.image = image;
	this.createdOn = new Date();
	this.createdBy = creator || 'Anonymous';
};

Quote.prototype.isValid = function () {
	return !!this.saying && !!this.author;
};