
angular.module( 'ngBoilerplate')

.constant('CONFIG', {
        auth0: {
            <% Object.keys(config.auth0).forEach( function ( key ) { var value = config.auth0[key]; %>
                "<%= key %>": "<%= value %>" ,
            <% }); %>
        }

})

;

