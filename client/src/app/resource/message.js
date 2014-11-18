
console.log('message start');

angular.module('ngBoilerplate').factory('Message', ['$resource', function($resource) {
    console.log('crating resource');
    return $resource('/api/messages/:id');
}]);

console.log('message end');