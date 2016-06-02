var mongoose = require('mongoose');
var Post = require('../models/posts');
var Group = require('../models/groups');
var User = require('../models/users');

exports.savePost = function(req, res) {
    var post = new Post({
        body: req.body.body,
        author: [req.payload.username, req.payload._id]
    });
    post.save(function(err) {
        if (err)
            res.json(err);
        Group.findByIdAndUpdate(
            req.params.group_id, {
                $push: {
                    posts: post._id
                }
            },
            function(err, data) {
                if (err)
                    res.json(err);
                console.log(post);
                res.json(post);
            });


    });



};

exports.getPosts = function(req, res) {
    Post.find({}, function(err, posts) {
        if (err)
            res.send(err);

        res.json(posts);
    });
};

exports.getPost = function(req, res) {
    Post.find({
        _id: req.params.post_id
    }, function(err, post) {
        if (err)
            res.send(err);

        res.json(post);
    });
};

exports.deletePost = function(req, res) {
    Post.remove({
        _id: req.params.post_id
    }, function(err) {
        if (err)
            res.send(err);
        res.json('Post deleted from database');
    });
};

exports.likePost = function(req, res) {
    Post.update({
        _id: req.params.post_id
    }, {
        $inc: {
            likes: 1
        }
    }, function(err) {
        if (err)
            res.send(err);
        res.json({
            message: 'Post has been liked'
        });
    });
};

exports.updatePost = function(req, res) {
    var post = {};
    if (req.body.body) {
        Post.update({
            _id: req.params.post_id
        }, {
            body: req.body.body
        }, function(err) {
            if (err)
                res.send(err);
            res.json({
                message: req.body.title + ' updated.'
            });
        });
    }
};
