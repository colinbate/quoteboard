var express = require('express');
var app = express();
var server = require('http').createServer(app);
var quotes = require('./lib/quotelist');

app.configure(function () {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');
        app.use(express['static'](__dirname + '/public'));
        app.use(express.bodyParser());
});

app.get('/', function (req, res){
  res.render('index', {title: 'Quote Board'});
});

app.get('/quotes', function (req, res) {
	res.send({ quotes: quotes.board.asArray(), lastId: quotes.board.lastId() });
});

app.get('/quotes/new', function (req, res) {
	var lastId = req.query.lastId;
	var newQuotes = quotes.board.getSince(lastId);
	var lastLastId = quotes.board.lastId();
	res.send({ quotes: newQuotes, lastId: lastLastId });
});

app.post('/quotes', function (req, res) {
	if(req.body) {
		var q = new quotes.Quote(req.body.saying, req.body.author, req.body.day);
		var lastId = req.body.lastId;
		if (q.isValid()) {
			var newQuotes = quotes.board.getSince(lastId, q);
			var lastLastId = quotes.board.add(q);
			res.send({ quotes: newQuotes, lastId: lastLastId });
		} else {
			res.send({ err: { message: 'Quote is not valid' } });
		}
	}
});

server.listen(process.env.PORT || 3000);