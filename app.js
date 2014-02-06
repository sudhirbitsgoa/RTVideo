var express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalAPIKeyStrategy = require('passport-localapikey').Strategy,
    uuid = require('node-uuid'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    multiparty = require('multiparty'),
    crypto = require('crypto');

/* Data storage stuff */
mongoose.connect('mongodb://localhost/rt-video');

var db = mongoose.connection,
    Schema = mongoose.Schema;

var Video = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  modified: {
    type: Date,
    default: Date.now
  },
  path: {
    type: String,
    unique: true,
    required: true
  },
  url: {
    type: String,
    unique: true,
    required: true
  }
});

var VideoModel = mongoose.model('Video', Video);

var User = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  api_key: {
    type: String,
    unique: true,
    required: true
  },
  videos: [Video]
});

var UserModel = mongoose.model('User', User);

passport.use(new LocalAPIKeyStrategy(function (api_key, done) {
  UserModel.findOne({api_key: api_key}, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    return done(null, user);
  });
}));

/* Setup Express application */
var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

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

/* Serve pages */

// index
app.get('/', function (req, res) {
  res.render('index');
});

/* Register user */
app.post('/users', function (req, res) {
  var api_key = uuid.v1(),
      data = req.body,
      user = null;

  data.api_key = api_key;
  user = new UserModel(data);

  user.save(function (err, user) {
    if (err) {
      if (err.code == 11000)
        return res.send(409, {error: 'User exists'});
      else
        return res.send(500, {error: 'Server error'});
    }

    res.send(200, {api_key: api_key});
  });
});

/* Sign in user */
app.post('/signin', function (req, res) {
  UserModel.findOne({username: req.body.username}, function (err, user) {
    if (err) return res.send(500, {error: 'Server error'});
    if (!user) return res.send(404, {error: 'Not found'});
    if (user.password != req.body.password) return res.send(401, {error: 'Unauthorized'});
    res.send(200, {api_key: user.api_key});
  });
});

/* WebSockets API */
io.sockets.on('connection', function (socket) {

});

/* API endpoints */
app.get('/api/videos', function (req, res) {
  return VideoModel.find(function (err, videos) {
    if (!err) {
      return res.send(200, videos);
    } else {
      return res.send(500, {error: 'Server error'});
    }
  });
});

app.post('/api/videos',
  passport.authenticate('localapikey', {session: false}),
  function (req, res) {
    var form = new multiparty.Form(),
        fileName = crypto.createHash('sha1'),
        avconv, args, output, filePath, video, url;

    fileName.update(Date() + Math.random().toString(36));
    url = '/files/' + fileName.digest('hex') + '.webm';
    filePath = path.join(__dirname, 'public' + url);

    args = ['-i', 'pipe:0', '-f', 'webm', '-threads', '2', '-s', 'hd480',
            '-ab', '96k', '-vb', '600k', 'pipe:1'];

    avconv = spawn('avconv', args);
    output = fs.createWriteStream(filePath);

    form.on('part', function (part) {
      if (part.filename) {
        part.pipe(avconv.stdin);

        part.on('end', function() {
          console.log('===== Video has been uploaded! =====');
          avconv.stdin.end();
        });
      }
    });

    avconv.stdout.pipe(output);

    avconv.on('exit', function() {
      console.log('===== Conversion done! =====');
      output.end();
    });

    avconv.stderr.on('data', function (data) {
      console.log('avconv: ' + data);
    });

    output.on('finish', function() {
      console.log('===== File has been written to file system =====');

      video.save(function (err) {
        if (!err) {
          return VideoModel.find(function (err, videos) {
            if (!err) {
              return res.send(200, videos);
            } else {
              return res.send(500, {error: 'Server error'});
            }
          });
        } else {
          if (err.name == 'ValidationError') {
            res.send(400, {error: 'Validation error'});
          } else {
            res.send(500, {error: 'Server error'});
          }
        }
      });
    });

    form.parse(req, function (err, fields) {
      if (err) return console.log(err);

      video = new VideoModel({
        title: fields.title[0],
        description: fields.description[0],
        path: filePath,
        url: url
      });
    });
});

app.delete('/api/videos/:id',
  passport.authenticate('localapikey', {session: false}),
  function (req, res) {
    return VideoModel.findById(req.params.id, function (err, video) {
      if (!video) return res.send(404, {error: 'Not found'});

      fs.unlink(video.path, function (err) {
        if (err) return res.send(500, {error: 'Server error'});

        return video.remove(function (err) {
          if (!err) {
            return VideoModel.find(function (err, videos) {
              if (!err) {
                return res.send(200, videos);
              } else {
                return res.send(500, {error: 'Server error'});
              }
            });
          } else {
            return res.send(500, {error: 'Server error'});
          }
        });
      });
    });
});

/* Start Express server */
server.listen(app.get('port'), function() {
  console.log('Server is listening on port %d', app.get('port'));
});
