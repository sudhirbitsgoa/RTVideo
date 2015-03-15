/* Video model */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Youtube = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  modified: {
    type: Date,
    default: Date.now
  },
  path: {
    type: String,
    unique: true,
    required: true
  },
  url: {
    type: String,
    unique: true,
    required: true
  },
  comments: Array,
  category:String,
  id: String
});

module.exports = mongoose.model('Youtube', Youtube);
