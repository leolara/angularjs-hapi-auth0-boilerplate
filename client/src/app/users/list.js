angular.module( 'ngBoilerplate')

    .config(['$stateProvider', function config( $stateProvider ) {
        $stateProvider.state( 'users_list', {
            url: '/users/list',
            views: {
                'main': {
                    controller: 'UsersListCtrl',
                    templateUrl: 'users/list.tpl.html'
                }
            },
            data:{ pageTitle: 'List users' }
        });
    }])

    .controller('UsersListCtrl', ['$scope', 'User', function ( $scope, User ) {
        $scope.users = User.query();
    }])

;
