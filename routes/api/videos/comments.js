var rootPath = process.cwd(),
    VideoModel = require(rootPath + '/models').VideoModel;

var add = function (comment, callback) {
  VideoModel.findById(comment.id, function (err, video) {
    if (err) return callback({message: 'Server error'}, null);
    if (!video) return callback({message: 'Not found'}, null);

    video.update({$push: {comments: comment}}, function (err) {
      if (err) return callback({message: 'Server error'}, null);

      VideoModel.findById(comment.id, function (err, video) {
        if (err) return callback({message: 'Server error'}, null);
        if (!video) return callback({message: 'Not found'}, null);

        var comments = {};
        comments[video._id] = video.comments;
        callback(null, comments);
      });
    });
  });
};

var get = function (callback) {
  VideoModel.find(function (err, videos) {
    if (err) return callback({message: 'Server error'}, null);
    if (!videos.length) return callback({message: 'Not found'}, null);

    var comments = {};
    for (var i = 0, ln = videos.length; i < ln; i++) {
      var video = videos[i];
      comments[video._id] = video.comments;
    }
    callback(null, comments);
  });
};

module.exports = {
  add: add,
  get: get
};
