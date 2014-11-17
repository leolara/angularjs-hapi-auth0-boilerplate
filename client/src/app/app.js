angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ui.router',
  'auth0',
  'angular-storage',
  'angular-jwt',
  'ngResource'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/' );
})

.run( function run (auth) {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, auth ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }
  });
})

;
