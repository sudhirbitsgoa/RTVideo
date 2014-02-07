/* DELETE /api/videos:id */

var rootPath = process.cwd(),
    VideoModel = require(rootPath + '/models').VideoModel,
    fs = require('fs');

var remove = function (req, res) {
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
};

module.exports = remove;
