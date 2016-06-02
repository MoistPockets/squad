var User = require('../models/users');
var Post = require('../models/posts');
var Group = require('../models/groups');
var mongoose = require('mongoose');

exports.save = function(req,res){
  var group = new Group({
    name: req.body.name,
    description: req.body.description,
    created_by: req.payload._id,
    members: [req.payload._id]
  });

  group.save(function(err){
    var msg = (err) ? ({success: false, message: 'There was an error saving the user ' + group.name + '\n' + err}) : ({success:true, message: 'Group ' + group.name + ' saved successfully!', group: group});
    console.log(msg);
    res.json(msg);
  });
};

exports.getGroups = function(req,res){
  Group.find({}, function(err, data) {
    if (err)
      res.json(err);
    res.json(data);
    console.log(data);
  });
};

exports.findGroup = function(req, res){
  Group.findById(req.params.group_id)
    .populate('posts')
    .exec(function(err, group){
      if(err)
        res.json(err);
      res.json(group);
      console.log(group);
    });
};


//TODO: Add pre to prevent duplicate object id's
