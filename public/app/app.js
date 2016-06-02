// ===================================================
//CONFIGURATION
// ===================================================
angular.module('squadApp', ['ngRoute', 'mainCtrl', 'groupCtrl', 'userCtrl', 'groupService', 'authService', 'userService'])
    // ===================================================
    //Routing
    // ===================================================
    .config(function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/app/pages/home.html',
                controller: 'mainController',
                controllerAs: 'main'
            })
            .when('/login', {
                templateUrl: '/app/pages/login.html',
                controller: 'mainController',
                controllerAs: 'login'
            })
            .when('/register', {
                templateUrl: '/app/pages/register.html',
                controller: 'userCreateController',
                controllerAs: 'user'
            })
            .when('/groups', {
                templateUrl: '/app/pages/groups.html',
                controller: 'groupController',
                controllerAs: 'group'
            })
            .when('/group/:group_id', {
                templateUrl: '/app/pages/single_group.html',
                controller: 'singleGroupController',
                controllerAs: 'group'
            });



        // use the HTML5 History API
        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('AuthInterceptor');
    });
// ===================================================
//CONTROLLERS
// ===================================================
//Main Controller
angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {
    var vm = this;
    vm.loggedIn = Auth.isLoggedIn();
    $rootScope.$on('$routeChangeStart', function() {
        vm.loggedIn = Auth.isLoggedIn();
        Auth.getUser()
            .then(function(data) {
                vm.user = data.data;
            });
    });

    vm.doLogin = function() {
        vm.processing = true;
        vm.error = '';
        Auth.login(vm.loginData.username, vm.loginData.password)
            .success(function(data) {
                vm.processing = false;
                if (data.success)
                    $location.path('/');
                else
                    vm.error = data.message;
            });
    };
    vm.doLogout = function() {
        Auth.logout();
        vm.user = '';
        $location.path('/login');
    };
    vm.createSample = function() {
        Auth.createSampleUser();
    };

});

//User Controller
angular.module('userCtrl', ['userService'])
.controller('userController', function(User) {
    var vm = this;
    vm.processing = true;
    User.all()
        .success(function(data) {
            vm.processing = false;
            vm.users = data;
        });
})
.controller('userCreateController', function(User) {
    var vm = this;
    vm.type = 'create';
    vm.saveUser = function() {
        vm.processing = true;
        vm.message = '';
        User.create(vm.userData)
            .success(function(data) {
                vm.processing = false;
                vm.userData = {};
                vm.message = data.message;
            });

    };

});
//Group Controller
angular.module('groupCtrl', ['groupService'])
    .controller('singleGroupController', function($routeParams, Group) {
        var vm = this;
        vm.group_id = $routeParams.group_id;
        Group.get(vm.group_id)
            .success(function(data) {
                vm.group = data;
            });
        vm.post = function() {
            Group.post(vm.postData, vm.group_id)
                .success(function(data) {
                    vm.message = data.message;
                    Group.get(vm.group_id)
                        .success(function(data) {
                            vm.group = data;
                        });
                    vm.postData = {};
                });
        };

        vm.deletePost = function(id) {
            Group.deletePost(id);
            Group.get(vm.group_id)
                .success(function(data) {
                    vm.group = data;
                });
        };


    })
    .controller('groupController', function(Group) {
        var vm = this;
        Group.all()
            .success(function(data) {
                vm.groups = data;
            });


        vm.saveGroup = function() {
            vm.message = '';
            vm.error = '';
            vm.processing = true;

            Group.create(vm.groupData)
                .success(function(data) {
                    vm.processing = false;
                    vm.groupData = {};
                    vm.message = data.message;
                    Group.all()
                        .success(function(data) {
                            vm.groups = data;
                        });
                });
        };
    });
// ===================================================
//SERVICES
// ===================================================
//Group Service
angular.module('groupService', [])
    .factory('Group', function($http) {
        var groupFactory = {};
        groupFactory.get = function(id) {
            return $http.get('/api/group/' + id);
        };

        groupFactory.all = function() {
            return $http.get('/api/groups');
        };

        groupFactory.join = function(id) {
            return $http.put('/api/group/' + id);
        };

        groupFactory.create = function(groupData) {
            return $http.post('/api/groups', groupData);
        };
        groupFactory.post = function(postData, id) {
            return $http.post('/api/group/' + id, postData);
        };

        groupFactory.deletePost = function(id) {
            return $http.delete('/api/post/' + id);
        };
        return groupFactory;
    });
//User Service
angular.module('userService', [])

.factory('User', function($http) {

    // create a new object
    var userFactory = {};

    userFactory.get = function(id) {
        return $http.get('/api/user/' + id);
    };

    // get all users
    userFactory.all = function() {
        return $http.get('/api/users/');
    };

    // create a user
    userFactory.create = function(userData) {
        return $http.post('/api/register', userData);
    };

    return userFactory;

});
//Authentication
angular.module('authService', [])
    .factory('Auth', function($http, $q, AuthToken) {
        var authFactory = {};
        authFactory.login = function(username, password) {

            // return the promise object and its data
            return $http.post('/api/login', {
                    username: username,
                    password: password
                })
                .success(function(data) {
                    AuthToken.setToken(data.token);
                    return data;
                });
        };
        authFactory.logout = function() {
            AuthToken.setToken();
        };
        authFactory.isLoggedIn = function() {
            if (AuthToken.getToken())
                return true;
            else
                return false;
        };
        authFactory.getUser = function() {
            if (AuthToken.getToken())
                return $http.get('/api/me', {
                    cache: true
                });
            else
                return $q.reject({
                    message: 'User has no token.'
                });
        };

        authFactory.createSampleUser = function() {
            $http.post('/api/sample');
        };
        return authFactory;

    })
.factory('AuthToken', function($window) {

    var authTokenFactory = {};
    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };
    authTokenFactory.setToken = function(token) {
        if (token)
            $window.localStorage.setItem('token', token);
        else
            $window.localStorage.removeItem('token');
    };

    return authTokenFactory;

})


.factory('AuthInterceptor', function($q, $location, AuthToken) {

    var interceptorFactory = {};
    interceptorFactory.request = function(config) {
        var token = AuthToken.getToken();
        if (token)
            config.headers['rich-token'] = token;
        return config;
    };
    interceptorFactory.responseError = function(response) {
        if (response.status == 403) {
            AuthToken.setToken();
            $location.path('/login');
        }
        return $q.reject(response);
    };
    return interceptorFactory;

});
