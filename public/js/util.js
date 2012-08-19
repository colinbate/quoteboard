/*globals jQuery: false, noty: false, Spinner: false */
/*jslint vars: true, browser: true */
(function () {
	"use strict";
	window.quoteboard = window.quoteboard || {};

	var notification = function (txt, type, afterClose) {
		if (typeof (afterClose) !== 'function') {
			afterClose = jQuery.noty.defaults.callback.afterClose;
		}
		noty({
			text: txt,
			type: type,
			callback: {
				afterClose: afterClose
			}
		});
	};

	var showError = function (txt, afterClose) {
		notification(txt, 'error', afterClose);
	};

	var errorMessages = {
		'timeout' : 'We\'ve timed out while trying to talk to the server.',
		'error' : 'There was a problem trying to reach the server. Try your action again.',
		'abort' : 'The attempt to reach the server was stopped.',
		'parsererror' : 'We had a problem trying to understand what the server sent us.'
	};

	// Handles errors which occur when trying to talk to the server.
	var handleAjaxError = function (jqxhr, status) {
		if (!!status) {
			showError(errorMessages[status] || 'An unknown error occurred.');	
		}
	};

	// Handles errors which come back from the server.
	var handleAppError = function (data) {
		if (data && data.err) {
			showError(data.err.message);
			return true;
		}
		return false;
	};

	var handleAjaxSuccess = function (data, success) {
		if (!handleAppError(data) && typeof (success) === 'function') {
			success.apply(window.quoteboard, [data]);
			// Might as well be the quoteboard object. Might pass in a binding later...
		}
	};

	var domDatum = function (element, key, data) {
		var $el = element.jquery ? element : jQuery(element);
		if (typeof (data) === 'undefined') {
			return $el.data(key);
		} else {
			$el.data(key, data);
		}
	};

	window.quoteboard.util = {

		postJsonData: function (url, payload, success) {
			jQuery.ajax(url, {
				type: 'post',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(payload), // would need shim for older IE.
				success: function (data) {
					handleAjaxSuccess(data, success);
				},
				error: handleAjaxError
			});
		},

		getAjaxData: function (url, success) {
			jQuery.ajax(url, {
				dataType: 'json',
				success: function (data) {
					handleAjaxSuccess(data, success);
				}
			});
		},

		showError: showError,

		showMessage: function (txt, afterClose) {
			notification(txt, 'alert', afterClose);
		}
	};
}());