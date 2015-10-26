var mongoose = require('mongoose');

var Postschema = new mongoose.Schema({
  title: String,
  link: String,
  upvotes: {type: Number, default: 0},
  description: {type: String, default: ""},
  comments : [{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}]
});

Postschema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

mongoose.model('Post', Postschema);
