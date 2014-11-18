angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ui.router',
  'auth0',
  'angular-storage',
  'angular-jwt',
  'ngResource'
])

.config(['$urlRouterProvider', function myAppConfig ( $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/' );
}])

.run( function run () {
})

.controller('AppCtrl', [ '$scope', function AppCtrl ( $scope ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }
  });
}])

;
