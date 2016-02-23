var _ = require('lodash'),
    Q = require('q'),
    google = require('googleapis'),
    service = google.gmail('v1');

var unlabel_msg = function( app, service, user, msg_id, label ) {
    app.log( 'constructing promise for msg id ' + msg_id );
    var deferred = Q.defer();
    service.users.messages.modify( { 'id': msg_id, 'userId': user, removeLabelIds: [ label ] }, function( err, message ) {
        if ( err ) { return deferred.reject( err );      }
        else       { return deferred.resolve( message ); }
    } );

    return deferred.promise;
};


module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var OAuth2 = google.auth.OAuth2,
            oauth2Client = new OAuth2(),
            credentials = dexter.provider('google').credentials();
        var inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        // set credential
        oauth2Client.setCredentials({
            access_token: _.get(credentials, 'access_token')
        });
        google.options({ auth: oauth2Client });

        var messages = step.input( 'messages' ).first();
        var keepnum  = step.input( 'keepnum' ).first();
        var user     = step.input( 'userId' ).first();
        var label    = step.input( 'label' ).first();

        messages.sort( function( a, b ) {
            if ( a.internalDate < b.internalDate ) return -1;
            if ( a.internalDate > b.internalDate ) return 1;
            return 0;
        } );

        messages = messages.slice( 0, 0 - keepnum );

        var removes = [ ];
        var app = this;
        messages.forEach( function( item ) {
            removes.push( unlabel_msg( app, service, user, item.id, label ) );
        })

        Q.all( removes )
          .then( function( results ) { app.complete( { 'messages': results } ) } )
          .fail( function( err ) { app.fail( err ) } );
    }
};
