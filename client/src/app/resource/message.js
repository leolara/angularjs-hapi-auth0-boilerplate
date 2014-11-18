angular.module('ngBoilerplate')

.factory('Message', ['$resource', function($resource) {
    return $resource('/api/messages/:id');
}]);
