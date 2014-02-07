/* User sign in */

var rootPath = process.cwd(),
    UserModel = require(rootPath + '/models').UserModel;

module.exports = function (req, res) {
  UserModel.findOne({username: req.body.username}, function (err, user) {
    if (err) return res.send(500, {error: 'Server error'});
    if (!user) return res.send(404, {error: 'Not found'});
    if (user.password != req.body.password) return res.send(401, {error: 'Unauthorized'});
    res.send(200, {api_key: user.api_key});
  });
};
