angular.module( 'ngBoilerplate')

.config(['$stateProvider', function config( $stateProvider ) {
    $stateProvider.state( 'messages_create', {
        url: '/messages/new',
        views: {
            'main': {
                controller: 'MessagesCreateCtrl',
                templateUrl: 'messages/create.tpl.html'
            }
        },
        data:{ pageTitle: 'Create Message' }
    });
}])

.controller('MessagesCreateCtrl', ['$scope', 'Message', '$location', function ( $scope, Message, $location ) {
    $scope.content = '';
    $scope.save = function () {
        var message = new Message({content: $scope.content });
        message.$save();
        $location.path('/');
    };
}])

;
