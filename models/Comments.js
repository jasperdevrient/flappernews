var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  createdAt: {type: Date, default: Date.now},
  upvotes: {type: Number, default: 0},
  post : {type: mongoose.Schema.Types.ObjectId, ref:'Post'}
});

CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Comment', CommentSchema);
