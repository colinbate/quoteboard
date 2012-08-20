/*globals ko: false, quoteboard: false */
/*jslint vars: true, browser: true */
(function () {
	"use strict";
	var qb = window.quoteboard;
	//var socket = io.connect('http://localhost:3000');

	var quoteBoardModel = {
		quotes: ko.observableArray([]),
		showNewQuote: ko.observable(false),
		loaded: ko.observable(false),
		initialData: ko.observable(false),
		newSaying: ko.observable(),
		newAuthor: ko.observable(),
		newDay: ko.observable(),

		openNewQuote: function () {
			this.showNewQuote(true);
		},
		closeNewQuote: function () {
			this.newSaying('');
			this.newAuthor('');
			this.newDay('');
			this.showNewQuote(false);
		},
		saveQuote: function () {
			//socket.emit('saveQuote', { saying: this.newSaying(), author: this.newAuthor(), day: this.newDay() });
			var self = this;
			if (!this.quoteValid()) {
				return;
			}
			var payload = { saying: this.newSaying(), author: this.newAuthor(), day: this.newDay() };
			qb.util.postJsonData('/quotes', payload, function (data) {
				if(data && data.quote) {
					self.quotes.unshift(data.quote);
				}
			});
			this.closeNewQuote();
		}
	};
	quoteBoardModel.quoteValid = ko.computed(function () {
		return !!this.newSaying() && this.newSaying().length > 2 && !!this.newAuthor();
	}, quoteBoardModel);
	quoteBoardModel.addQuote = function (elem) {
		if (elem.nodeType === 1 && quoteBoardModel.initialData()) {
			qb.util.showAndHighlight(elem);
		}
	};

	qb.util.getAjaxData('/quotes', function (data) {
		if(data && data.quotes) {
			quoteBoardModel.quotes(data.quotes);
			quoteBoardModel.initialData(true);
		}
	});

	/* for interest's sake, I'm leaving this in for now.
	socket.on('newQuote', function(data) {
	if(data && data.quote) {
	quoteBoardModel.quotes.unshift(data.quote);
	}
	});
	*/

	ko.applyBindings(quoteBoardModel);
	quoteBoardModel.loaded(true);
} ());