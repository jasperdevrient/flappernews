var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, unique: true },
  hash: String,
  salt: String,
  createdAt: { type: Date, default: Date.now },
  upvotedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  upvotedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

UserSchema.methods.upvotePost = function (post, cb) {
  if (!this.upvotedPosts.some(function (id) { return id.equals(post._id); })) {
    if (this.username == (post.author)) {
      cb(null, false);
      return;
    }
    this.upvotedPosts.push(post);
    this.save();
    post.upvote(cb);

  } else
    cb(null, false);
};

UserSchema.methods.upvoteComment = function (comment, cb) {
  if (!this.upvotedComments.some(function (id) { return id.equals(comment._id); })) {
    if (this.username ==(comment.author)) {
      cb(null, false);
      return;
    }
    this.upvotedComments.push(comment);
    this.save();
    comment.upvote(cb);

  } else
    cb(null, false);
};

mongoose.model('User', UserSchema);
