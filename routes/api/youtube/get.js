/* GET /api/youtube */

var rootPath = process.cwd(),
    YoutubeModel = require(rootPath + '/models').YoutubeModel;

var get = function (req, res) {
	var query = req.query.category ;
  return YoutubeModel.find({category:req.query.category},function (err, videos) {
    if (!err) {
      return res.send(200, videos);
    } else {
      return res.send(500, {error: 'Server error'});
    }
  });
};

module.exports = get;
