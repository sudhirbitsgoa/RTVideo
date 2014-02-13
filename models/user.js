/* User model */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
  }
});

module.exports = mongoose.model('User', User);
