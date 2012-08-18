(function() {
	//var socket = io.connect('http://localhost:3000');
	var postJsonData = function(url, payload, success) {
		jQuery.ajax(url, {
			type: 'post',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(payload), // would need shim for older IE.
			success: success
			// TODO: add error handling
		});
	}

	var quoteBoardModel = {
		quotes: ko.observableArray([]),
		showNewQuote: ko.observable(false),
		newSaying: ko.observable(),
		newAuthor: ko.observable(),
		newDay: ko.observable(),

		openNewQuote: function() {
			this.showNewQuote(true);
		},
		closeNewQuote: function() {
			this.newSaying('');
			this.newAuthor('');
			this.newDay('');
			this.showNewQuote(false);
		},
		saveQuote: function() {
			//socket.emit('saveQuote', { saying: this.newSaying(), author: this.newAuthor(), day: this.newDay() });
			var self = this;
			if (!this.quoteValid()) {
				return;
			}
			var payload = { saying: this.newSaying(), author: this.newAuthor(), day: this.newDay() };
			postJsonData('/quotes', payload, function(data) {
				if (data && data.err) {
					alert(data.err.message);
					return;
				}
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

	jQuery.ajax('/quotes', {
		success: function(data) {
			if(data && data.quotes) {
				quoteBoardModel.quotes(data.quotes);
			}
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
} ());