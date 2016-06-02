var mongoose = require('mongoose');
var PostSchema = {
    body: {
        type: String,
        required: true
    },
    author: [{
        type: String
    }, {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    likes: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
};

module.exports = mongoose.model('Post', PostSchema);
