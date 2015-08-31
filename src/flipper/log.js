
function Log()
{
}

Log.prototype.print = function( msg )
{
    console.log( msg );
};

Log.prototype.error = function( msg )
{
    console.log( "error: " + msg );
};

Log.prototype.warning = function( msg )
{
    console.log( "warning: " + msg );
};
