/* GET /api/videos */

var rootPath = process.cwd(),
    VideoModel = require(rootPath + '/models').VideoModel;

var get = function (req, res) {
  return VideoModel.find(function (err, videos) {
    if (!err) {
      return res.send(200, videos);
    } else {
      return res.send(500, {error: 'Server error'});
    }
  });
};

module.exports = get;
