var express = require('express');
var app = express();
var quotes = require('./lib/quotelist');
var localize = require('./lib/localize');
var Q = require('q');
var fs = require('fs');

app.configure(function () {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');
        app.use(express['static'](__dirname + '/public'));
        app.use(express.bodyParser());
        app.locals.lang = localize.loadLanguage('en');
});

app.configure('development', function () {
	quotes.useMemoryStore();
	//quotes.useMongoStore('localhost:27017/test');
});

app.configure('production', function () {
	quotes.useMongoStore('localhost:27017/test');
});

var getError = function (errorMsg) {
	return { err: { message: errorMsg } };
};

var boardOkay = function (req, res, next) {
	if (!quotes.board.isOkay()) {
		res.send(getError('The quoteboard is not available.'));
		return;
	}
	next();
};

var hasImage = function (req) {
	return req && req.files && req.files.image && req.files.image.size && req.files.image.name;
}

app.get('/', function (req, res){
  res.render('index', {title: 'Quote Board'});
});

app.get('/quotes', boardOkay, function (req, res) {
	Q.all([quotes.board.asArray(), quotes.board.lastId()]).spread(function (list, lastId) {
		res.send({ quotes: list, lastId: lastId });
	});
});

app.get('/quotes/new', boardOkay, function (req, res) {
	var lastId = req.query.lastId;
	var newQuotes = quotes.board.getSince(lastId);
	var lastLastId = quotes.board.lastId();
	Q.all([newQuotes, lastLastId]).spread(function (newq, llId) {
		res.send({ quotes: newq, lastId: llId });
	});
});

app.post('/quotes', boardOkay, function (req, res) {
	var imageFile;
	if (hasImage(req)) {
		imageFile = quotes.saveImage(req.files.image, 'images/upload');
	}
	Q.when(imageFile, function (filename) {
		console.log('Image file: ' + filename);
		if (req.body) {
			var q = new quotes.Quote(req.body.saying, req.body.author, req.body.day, undefined, filename);
			var lastId = req.body.lastId;
			if (q.isValid()) {
				var newQuotes = quotes.board.add(q, lastId);
				Q.all(newQuotes).spread(function (newq, llId) {
					res.send({ quotes: newq, lastId: llId });
				});
			} else {
				res.send({ err: { message: 'Quote is not valid' } });
			}
		}
	}, function (err) {
		res.send(getError(err));
	}).end();
});

var listenPort = process.env.PORT || 3000;
app.listen(listenPort, function () {
	console.log('Quoteboard started on port ' + listenPort + ' in ' + app.settings.env + ' mode');
});