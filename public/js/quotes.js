/*globals ko: false, quoteboard: false */
/*jslint vars: true, browser: true */
(function () {
	"use strict";
	var qb = window.quoteboard;

	var quoteBoardModel = {
		quotes: ko.observableArray([]),
		lastId: undefined,
		formdataSupport: window.FormData !== undefined,
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
			qb.util.resetFileField('#imageWrap');
			this.showNewQuote(false);
		},
		saveQuote: function () {
			var self = this;
			if (!this.quoteValid()) {
				return;
			}
			var handleResult = function (data) {
				if (data && data.quotes) {
					qb.util.unshiftArray(self.quotes, data.quotes);
				}
				if (data) {
					self.lastId = data.lastId;
				}
			};
			if (this.formdataSupport && qb.util.hasImage('#upImage')) {
				qb.util.postForm('#new-quote-form', {lastId: this.lastId}, handleResult);
			} else {
				var payload = { saying: this.newSaying(), author: this.newAuthor(), day: this.newDay(), lastId: this.lastId };
				qb.util.postJsonData('/quotes', payload, handleResult);
			}
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

	var refreshQuoteList = function () {
		var payload = { lastId: quoteBoardModel.lastId };
		qb.util.getAjaxData('/quotes/new', payload, function (data) {
			if (data && data.quotes) {
				qb.util.unshiftArray(quoteBoardModel.quotes, data.quotes);
			}
			if (data) {
				quoteBoardModel.lastId = data.lastId;
			}
		});
	};

	qb.util.getAjaxData('/quotes', function (data) {
		if (data && data.quotes) {
			quoteBoardModel.quotes(data.quotes);
			quoteBoardModel.initialData(true);
		}
		if (data) {
			quoteBoardModel.lastId = data.lastId;
		}
	});

	// Refresh every couple minutes
	setInterval(refreshQuoteList, 120000);

	ko.applyBindings(quoteBoardModel);
	quoteBoardModel.loaded(true);
} ());