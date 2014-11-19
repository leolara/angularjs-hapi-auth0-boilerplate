angular.module('ngBoilerplate', [
    'templates-app',
    'templates-common',
    'ui.router',
    'auth0',
    'angular-storage',
    'angular-jwt',
    'ngResource'
])

    .config(['$urlRouterProvider', function myAppConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    }])

    .controller('AppCtrl', ['$scope', 'auth', 'store', '$location', '$http', function AppCtrl($scope, auth, store, $location, $http) {
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate';
            }
        });

        $scope.login = function() {
            auth.signin({}, function(profile, token) {
                $http.get('/api/auth0/userroles').success(function (roles) {
                    store.set('roles', roles);
                    store.get('roles');
                });

                // Success callback
                store.set('profile', profile);
                store.set('token', token);

                // It seems in some browsers you need to do this in order to store it
                store.get('profile');
                store.get('token');
                $location.path('/');
            }, function() {
                // Error callback
            });
        };

        $scope.logout = function() {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            store.remove('roles');
        };

        $scope.isAdmin = function() {
            var roles = store.get('roles');
            if (roles) {
                return _.contains(roles, 'admin');
            }
            return false;
        };

        $scope.auth = auth;
    }])

;
