var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var passport = require('passport');
var jwt = require('express-jwt');
var User = mongoose.model('User');

var auth = jwt({ secret: 'SECRET', userProperty: 'payload' });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

// Posts
router.get('/posts', function (req, res, next) {
  Post.find(function (err, posts) {
    if (err) {
      next(err);
    }
    res.json(posts);
  });
});

router.post('/posts', auth, function (req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;
  post.save(function (err, p) {
    if (err)
      next(err);

    res.json(p);
  })
});

router.param('post', function (req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post) {
    if (err)
      return next(err);
    if (!post)
      return next(new Error('can\'t find post'));

    req.post = post;
    return next();
  });
});

router.param('comment', function (req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment) {
    if (err)
      return next(err);
    if (!comment)
      return next(new Error('can\'t find comment'));

    req.comment = comment;
    return next();
  });
});


router.get('/posts/:post', function (req, res, next) {
  var npost = {"_id":req.post._id,
  "title": req.post.title,
  "description":req.post.description,
  "link":req.post.link,
  "author":req.post.author,
  "__v":req.post.__v,
  "comments":[],
  "upvotes":req.post.upvotes,
  "createdAt":req.post.createdAt};
    

  
  req.post.populate('comments', function (err, post) {
    if (err) { return next(err); }
    var toFetch = 0;
    var populateNestedComments = function (comment, arr) {
      comment = comment.toObject();
          arr.push(comment);
        
      var comments = comment.comments.slice(0);
      comment.comments = [];
      comments.forEach(function(commentId) {
        toFetch++;
        var protectedComment = comment;
        var query = Comment.findById(commentId);
        query.exec().then(function(c) {
            populateNestedComments(c, comment.comments);
        
          toFetch--;
         
          if (toFetch <= 0) {
            res.json(npost);
          }
        });
      });
    };

    post.comments
    .forEach(function(elem) {populateNestedComments(elem, npost.comments) });
   
  
   });
});

router.put('/posts/:post/upvote', auth, function (req, res, next) {
  var query = User.findById(req.payload._id);
  query.exec(function (err, user) {
    if (err)
      return next(err);
    if (!user)
      return next(new Error('can\'t find comment'));
    user.upvotePost(req.post, function (err, post) {
      if (err) { return next(err); }

      res.json(post);
    });
  });
});

router.post('/posts/:post/comments', auth, function (req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function (err, comment) {
    if (err) { return next(err); }

    req.post.comments.push(comment);
    req.post.save(function (err, post) {
      if (err) { return next(err); }

      res.json(comment);
    });
  });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function (req, res, next) {

  var query = User.findById(req.payload._id);
  query.exec(function (err, user) {
    if (err)
      return next(err);
    if (!user)
      return next(new Error('can\'t find comment'));
    user.upvoteComment(req.comment, function (err, comment) {
      if (err) { return next(err); }

      res.json(comment);
    });
  });
});

router.post('/posts/:post/comments/:comment', auth, function (req, res, next) {
  var comment = new Comment(req.body);
  var target = req.comment;
  comment.author = req.payload.username;

  comment.save(function (err, c) {
    if (err) { return next(err); }
    target.addComment(c, function (err, cc) {
      if (err) { return next(err); }
      res.json(comment);
    });
  });
});

router.get('/userinfo', auth, function(req,res,next) {
  var query = User.findById(req.payload._id);
  query.exec(function (err, user) {
    if (err)
      return next(err);
      res.json(comment);
  });
});

router.post('/register', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill out all fields' });
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err) {
    if (err) { return next(err); }

    return res.json({ token: user.generateJWT() })
  });
});

router.post('/login', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill out all fields' });
  }

  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      return res.json({ token: user.generateJWT() });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
