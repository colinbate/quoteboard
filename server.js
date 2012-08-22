var express = require('express');
var app = express();
var server = require('http').createServer(app);
var quotes = require('./lib/quotelist');
var Q = require('q');

app.configure(function () {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');
        app.use(express['static'](__dirname + '/public'));
        app.use(express.bodyParser());
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

app.get('/', function (req, res){
  res.render('index', {title: 'Quote Board'});
});

app.get('/quotes', boardOkay, function (req, res) {
	Q.all([quotes.board.asArray(), quotes.board.lastId()]).spread(function (list, lastId) {
		console.log('Fetching quotes: list: ' + list + ' lastId: ' + lastId);
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
	if(req.body) {
		var q = new quotes.Quote(req.body.saying, req.body.author, req.body.day);
		var lastId = req.body.lastId;
		if (q.isValid()) {
			var newQuotes = quotes.board.getSince(lastId, q);
			var lastLastId = quotes.board.add(q);
			Q.all([newQuotes, lastLastId]).spread(function (newq, llId) {
				res.send({ quotes: newq, lastId: llId });
			});
		} else {
			res.send({ err: { message: 'Quote is not valid' } });
		}
	}
});

server.listen(process.env.PORT || 3000);