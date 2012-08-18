var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var io = require('socket.io').listen(server);

app.configure(function () {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');
        app.use(express['static'](__dirname + '/public'));
        app.use(express.bodyParser());
});

var Quote = function(saying, author, day) {
	this.saying = saying;
	this.author = author;
	this.day = day || new Date();
}

Quote.prototype.isValid = function () {
	return !!this.saying && !!this.author;
};

var quoteList = [];

app.get('/', function(req, res){
  res.render('index', {title: 'Quote Board'});
});

app.get('/quotes', function(req, res) {
	res.send({ quotes: quoteList });
});

app.post('/quotes', function(req, res) {
	if(req.body) {
		var q = new Quote(req.body.saying, req.body.author, req.body.day);
		if (q.isValid()) {
			quoteList.unshift(q);
			res.send({ quote: q });
		} else {
			res.send({ err: { message: 'Quote is not valid' } });
		}
	}
});

/* Going to leave this here for informational purposes.

io.configure(function() {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
	io.set("log level", 2);
});
io.sockets.on('connection', function(socket) {
    socket.on('saveQuote', function(data) {
        var q = new Quote(data.saying, data.author, data.day);
        quoteList.unshift(q);
        io.sockets.emit('newQuote', { quote: q });
    });
});
*/

server.listen(process.env.PORT || 3000);