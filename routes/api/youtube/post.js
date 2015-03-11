/* POST /api/youtube */

var rootPath = process.cwd(),
    VideoModel = require(rootPath + '/models').YoutubeModel,
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

    video = new VideoModel({
      title: req.body.title,
      description: req.body.description,
      path: req.body.filePath,
      url: url,
      id: "afa" || req.user.api_key
    });

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
};

module.exports = post;
