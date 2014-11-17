
angular.module('ngBoilerplate').factory('Message', function($resource) {
    return $resource('/api/messages/:id');
});
