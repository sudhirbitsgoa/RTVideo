/* User model */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Video = require('./video');

var User = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  api_key: {
    type: String,
    unique: true,
    required: true
  },
  videos: [Video]
});

module.exports = mongoose.model('User', User);
