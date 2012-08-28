/*globals module:false, require:false, __dirname:false, JSON:false, console:false */
var fs = require('fs');
var path = require('path');
module.exports = {
	loadLanguage: function (code) {
		var filename = path.join(__dirname, '..', 'lang', code + '.json');
		try {
			var content = fs.readFileSync(filename, 'utf8');
			var lang = JSON.parse(content);
			return lang;
		} catch (err) {
			console.log('Attempted to read file: ' + filename + ' Error: ' + err.message);
			return;
		}

	}
};