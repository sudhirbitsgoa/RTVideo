/* Comment model */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
});

var CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = {
  schema: CommentSchema,
  model: CommentModel
};
