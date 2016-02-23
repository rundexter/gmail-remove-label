module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var messages = step.input( 'messages' );
        var keepnum  = step.input( 'keepnum' );

        var sorted = [ ];
        messages.each( function( msg ) { sorted.push( msg ) } );
        sorted.sort( function( a, b ) {
            if ( a.internalDate < b.internalDate ) return -1;
            if ( a.internalDate > b.internalDate ) return 1;
            return 0;
        } );

        this.log( 'after sorting', { 'list': sorted } );

        sorted = sorted.slice( 0, -keepnum );

        this.log( 'after slice', { 'list': sorted } );

        return this.complete();
    }
};
