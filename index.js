module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var messages = step.input( 'messages' ).first();
        var keepnum  = step.input( 'keepnum' ).first();

        this.log( 'keeping ' + keepnum );

        messages.sort( function( a, b ) {
            if ( a.internalDate < b.internalDate ) return -1;
            if ( a.internalDate > b.internalDate ) return 1;
            return 0;
        } );

        this.log( 'after sorting', { 'list': messages } );

        messages = messages.slice( 0, 0 - keepnum );

        this.log( 'after slice', { 'list': messages } );

        return this.complete();
    }
};
