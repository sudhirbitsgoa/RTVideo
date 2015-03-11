/* GET /api/youtube */

var rootPath = process.cwd(),
    YoutubeModel = require(rootPath + '/models').YoutubeModel;

var get = function (req, res) {
  return YoutubeModel.find(function (err, videos) {
    if (!err) {
      return res.send(200, videos);
    } else {
      return res.send(500, {error: 'Server error'});
    }
  });
};

module.exports = get;
