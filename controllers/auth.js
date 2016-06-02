var jwt = require('jsonwebtoken');
var config = require('../config');
exports.auth = function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['rich-token'];
  if(token){
    jwt.verify(token, config.secret, function(err, decoded){
      if(err){
        return res.json({success: false, message: 'Token could not be authenticated'});
      }else{
        req.decoded = decoded;
        req.payload = decoded._doc;
        next();
      }

    });
  }else{
    return res.status(403).send({success: false, message: 'Could not find token.'});
  }
};

exports.check = function(req, res){
  console.log('hey');
};
