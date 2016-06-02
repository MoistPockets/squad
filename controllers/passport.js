// var Strategy = require('passport-jwt').Strategy;
// var User = require('../models/users');
// var config = require('../config');
//
// module.exports = function(passport) {
//   var opts = {};
//   opts.secretOrKey = config.secret;
//   passport.use(new Strategy(opts, function(payload, done) {
//     User.findOne({_id: payload._id}, function(err, user) {
//           if (err)
//               return done(err, false);
//           if (user)
//               done(null, user);
//           else
//               done(null, false);
//       });
//   }));
// };
