/* GET /api/youtube */

var rootPath = process.cwd(),
    YoutubeModel = require(rootPath + '/models').YoutubeModel;

var get = function (req, res) {
	var query = req.query.category ;
	var queryObj = {category:req.query.category};
	if(query == 'all'){
		var queryObj = {}
	}
  return YoutubeModel.find(queryObj,function (err, videos) {
    if (!err) {
      return res.send(200, videos);
    } else {
      return res.send(500, {error: 'Server error'});
    }
  });
};

module.exports = get;
