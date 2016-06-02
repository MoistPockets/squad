var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    created_at: {
      type: Date,
      default: Date.now()
    },
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err)
                return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err)
                    return next(err);

                user.password = hash;
                next();
            });
        });
    } else
        return next();
});

UserSchema.methods.comparePassword = function (pass, cb) {
    bcrypt.compare(pass, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};



module.exports  = mongoose.model('User', UserSchema);
