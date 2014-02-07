/* Local API Key strategy */

var rootPath = process.cwd(),
    LocalAPIKeyStrategy = require('passport-localapikey').Strategy,
    UserModel = require(rootPath + '/models').UserModel;

var LocalAPIKeyStrategyAuth = new LocalAPIKeyStrategy(function (api_key, done) {
  UserModel.findOne({api_key: api_key}, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    return done(null, user);
  });
});

module.exports = LocalAPIKeyStrategyAuth;
