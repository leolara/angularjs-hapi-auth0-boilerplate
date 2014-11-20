angular.module('ngBoilerplate')

    .factory('User', ['$resource', function($resource) {
        return $resource('/api/users/:id');
    }])

;
