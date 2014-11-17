
angular.module( 'ngBoilerplate')

.config(function config( $stateProvider ) {
    $stateProvider.state( 'messages_create', {
        url: '/messages/new',
        views: {
            "main": {
                controller: 'MessagesCreateCtrl',
                templateUrl: 'messages/create.tpl.html'
            }
        },
        data:{ pageTitle: 'Create Message' }
    });
})

.controller('MessagesCreateCtrl', function HomeController( $scope, Message ) {
    $scope.content = '';
    $scope.save = function () {
        console.log('saving message');
        var message = new Message({content: $scope.content });
        console.log(message);
        message.$save();
    };
})

;
