var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  createdAt: {type: Date, default: Date.now},
  upvotes: {type: Number, default: 0},
  post : {type: mongoose.Schema.Types.ObjectId, ref:'Post'},
  comments: [{type: mongoose.Schema.Types.Object}]
});

CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

CommentSchema.methods.addComment = function(comment, cb) {
  this.comments.push(comment);
  this.save(cb);
}

mongoose.model('Comment', CommentSchema);
