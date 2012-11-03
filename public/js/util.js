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

	var unshiftArray = function (original, newRange) {
		// apply the KO version of unshift.
		original.unshift.apply(original, newRange);
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

		getAjaxData: function (url, payload, success) {
			if (typeof (payload) === 'function') {
				if (typeof (success) === 'undefined') {
					success = payload;
					payload = undefined;
				} else {
					payload = payload();
				}
			}
			jQuery.ajax(url, {
				dataType: 'json',
				data: payload,
				success: function (data) {
					handleAjaxSuccess(data, success);
				}
			});
		},

		postFile: function (url, field, success) {
			if (typeof (field) === 'string') {
				var $field = jQuery(field);
				if ($field.length === 0) {
					return;
				}
				field = $field[0];
			} else {
				field = field.jquery ? field[0] : field;
			}
			if (field.files.length < 1) {
				return;
			}
			var fd = new FormData();
			fd.append(field.name || 'image', field.files[0]);
			jQuery.ajax(url, {
				type: "POST",
				data: fd,
				processData: false,  // tell jQuery not to process the data
				contentType: false   // tell jQuery not to set contentType
			}).done(function (data) {
				handleAjaxSuccess(data, success);
			});
		},

		postForm: function (form, extra, success) {
			if (typeof (form) === 'string') {
				var $form = jQuery(form);
				if ($form.length === 0) {
					return;
				}
				form = $form[0];
			} else {
				form = form.jquery ? form[0] : form;
			}
			if (!form.action) {
				return;
			}
			var url = form.action;
			var fd = new FormData(form);
			if (typeof (extra) === 'function') {
				success = extra;
			} else if (extra) {
				for (var key in extra) {
					fd.append(key, extra[key]);
				}
			}
			jQuery.ajax(url, {
				type: "POST",
				data: fd,
				processData: false,  // tell jQuery not to process the data
				contentType: false   // tell jQuery not to set contentType
			}).done(function (data) {
				handleAjaxSuccess(data, success);
			})
		},

		resetFileField: function (wrapper) {
			var $wrap = jQuery(wrapper);
			$wrap.html($wrap.innerHTML);
		},

		hasImage: function (field) {
			jQuery(field).val() != '';
		},

		showError: showError,

		showMessage: function (txt, afterClose) {
			notification(txt, 'alert', afterClose);
		},

		unshiftArray: unshiftArray,

		highlight: function (elem) {
			jQuery(elem).effect('highlight', {}, 2000);
		},

		showAndHighlight: function (elem) {
			var self = this;
			jQuery(elem).hide().slideDown(function () {
				self.highlight(elem);
			})
		},

		spinner: function (target, start) {
			var action = start ? 'spin' : 'stop';
			var existing = domDatum(target, 'spinner');
			if (existing) {
				existing[action]();
				return existing;
			} else {
				var spinner = new Spinner().spin(target);
				domDatum(target, 'spinner', spinner);
				return spinner;
			}
		}
	};
}());