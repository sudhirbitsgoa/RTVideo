/* POST /api/videos */

var rootPath = process.cwd(),
    VideoModel = require(rootPath + '/models').VideoModel,
    multiparty = require('multiparty'),
    crypto = require('crypto'),
    fs = require('fs'),
    spawn = require('child_process').spawn;

var post = function (req, res) {
    var form = new multiparty.Form(),
        fileName = crypto.createHash('sha1'),
        avconv, args, output, filePath, video, url;
    fileName.update(Date() + Math.random().toString(36));
    url = '/files/' + fileName.digest('hex') + '.webm';
    filePath = rootPath + '/public' + url;

    args = ['-i', 'pipe:0', '-f', 'webm', '-s', 'hd480',
            '-ab', '96k', '-vb', '600k', 'pipe:1'];

    avconv = spawn('ffmpeg', args); // If no avconc, use ffmpeg instead
    output = fs.createWriteStream(filePath);

    form.on('part', function (part) {
      if (part.filename) {
        part.pipe(avconv.stdin);

        part.on('end', function() {
          console.log('===== Video has been uploaded! =====');
        });
      }
    });

    avconv.stdout.pipe(output);

    avconv.on('exit', function() {
      console.log('===== Conversion done! =====');
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
        url: url,
        id: req.user.api_key
      });
    });
};

module.exports = post;
