var express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalAPIKeyStrategyAuth = require('./strategies').LocalAPIKeyStrategyAuth,
    routes = require('./routes');

/* Connect to db */
mongoose.connect('mongodb://localhost/rt-video');

/* Setup Express application */
var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

passport.use(LocalAPIKeyStrategyAuth);

app.set('env', process.env.NODE_ENV || 'development');
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

/* Render pages */
app.get('/', routes.home);

/* Users managment */
app.post('/users', routes.users);
app.post('/signin', routes.signin);

/* API endpoints */
app.get('/api/videos', routes.api.videos.get);
app.post('/api/videos',
  passport.authenticate('localapikey', {session: false}), routes.api.videos.post);
app.delete('/api/videos/:id',
  passport.authenticate('localapikey', {session: false}), routes.api.videos.remove);

/* WebSockets API */
io.sockets.on('connection', function (socket) {

});

/* Start Express server */
server.listen(app.get('port'), function() {
  console.log('Server is listening on port %d', app.get('port'));
});
