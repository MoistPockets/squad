var User = require('../models/users');
var Group = require('../models/groups');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config');
var jwt = require('jsonwebtoken');


exports.register = function(req, res){
  if(!req.body.username || !req.body.password || !req.body.name){
    res.json({
      success: false,
      message: 'Missing user information.'
    });
  }else{
    var user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    });

    user.save(function(err){
      if(err){
        return res.json({
          success: false,
          message: 'Username already exists.'
        });
      }
      res.json({success: true, message: 'User '+ user.username + ' successfully created!'});
    });
  }


};


exports.login = function(req, res){
  User.findOne({username: req.body.username}, function(err, user){
    if(err)
      res.json(err);
    if(!user)
      res.json({success: false, message: 'Error. User not found.'});
    else {
      user.comparePassword(req.body.password, function(err, isMatch){
        if(isMatch && !err){
          var token = jwt.sign(user, config.secret, {
            expiresIn: '24h' // expires in 24 hours
          });
          res.json({success: true, token: token, message: 'User '+ user.username + ' logged in successfully!'});
        }else{
          res.json({success: false, message: 'Login failed. Incorrect password.'});
        }
      });
    }
  });
};

exports.getUsers = function(req, res){
  User.find({}, function(err, data) {
    if (err)
      res.json(err);
      console.log(err);
    res.json(data);
    console.log(data);
  });
};

exports.findUser =  function(req, res){
  User.findById(req.params.user_id, function(err, user){
      if(err)
        res.json(err);
      res.json(user);
      console.log(user);
  });
};

exports.joinGroup = function(req, res){
  User.findByIdAndUpdate(
    req.payload._id,
    {$push: {groups: req.payload._id}},
    function(err, user){
    if(err)
      res.json(err);
    console.log(user);
  });

  Group.findByIdAndUpdate(
    req.params.group_id,
    {$push: {members: req.payload._id}},
    function(err, group){
      if(err)
        res.json(err);
      console.log(group);
      res.json(group);
  });
};

exports.me = function(req, res){
  User.findById(req.payload._id, function(err, user){
    if(err)
      res.json({success:false, message: 'Error.' + err});
    res.json(user);
    console.log(user);
  });
};
