angular.module( 'ngBoilerplate')

.config(['authProvider', '$httpProvider', 'jwtInterceptorProvider', 'CONFIG', function configAuth0 ( authProvider, $httpProvider, jwtInterceptorProvider, CONFIG ) {
    console.log(CONFIG);
    authProvider.init({
      domain: CONFIG.auth0.domain,
      clientID: CONFIG.auth0.clientId
    });
    jwtInterceptorProvider.tokenGetter = function(store) {
      return store.get('token');
    };

    $httpProvider.interceptors.push('jwtInterceptor');
}])

.run(['$rootScope', 'auth', 'store', 'jwtHelper', '$location', function runAuth0 ( $rootScope, auth, store, jwtHelper, $location ) {

  auth.hookEvents();

  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          // Either show Login page or use the refresh token to get a new idToken
          $location.path('/');
        }
      }
    }
  });



  $rootScope.login = function() {
    auth.signin({}, function(profile, token) {
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

  $rootScope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
  };

  $rootScope.auth = auth;
}])

;
