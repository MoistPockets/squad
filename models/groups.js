var mongoose = require('mongoose');
var PostSchema = require('./posts');
var GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
      type: String,
      required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }],
    created_at: {
        type: Date,
        default: Date.now()
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]

});

module.exports = mongoose.model('Group', GroupSchema);


//TODO:Add created_by w/ ref to User
