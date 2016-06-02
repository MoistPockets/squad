var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var config = require('./config');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var path = require('path');
var userController = require('./controllers/user');
var authController= require('./controllers/auth');
var groupController = require('./controllers/group');
var postController = require('./controllers/post')
//Module Initialization and Configuration
var app = express();
var router = express.Router();
var port = config.port;


mongoose.connect(config.mongoose_uri);
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(passport.initialize());

router.route('/register')
  .post(userController.register);
router.route('/login')
  .post(userController.login);
//Authentication Middleware
router.use(authController.auth);
//Authenticated Routes
router.route('/me')
  .get(userController.me);
router.route('/user/:user_id')
  .get(userController.findUser);
router.route('/users')
  .get(userController.getUsers);
router.route('/groups')
  .get(groupController.getGroups)
  .post(groupController.save);
router.route('/group/:group_id')
  .put(userController.joinGroup)
  .post(postController.savePost)
  .get(groupController.findGroup);
router.route('/post/:post_id')
  .delete(postController.deletePost);
//Catch Errors
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({
            message: err.name + ": " + err.message
        });
    }
});



app.use('/api', router);
app.use(express.static(__dirname + '/public'));
app.get('*', function(req, res) {
 res.sendFile(path.join(__dirname + '/public/app/index.html'));
 });
app.listen(port, function() {
    console.log('Sever is currently running on port ' + port + '!');
});
