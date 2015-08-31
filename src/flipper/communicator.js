
function Communicator( url )
{
    this.url = url;
    this.request = null;
}

Communicator.prototype.post = function( data )
{
    // doing something already.
    if( this.request !== null )
    {
        return false;
    }
    
    var realdata = "";
    for( var key in data ) 
    {
        if( realdata !== "" ) realdata += "&";
        
        realdata += key + "=" + data[key];
    }
    
    this.request = new XMLHttpRequest();
    this.request.open( "POST" , this.url , /*async*/true );
    this.request.setRequestHeader( "Content-type" , "application/x-www-form-urlencoded" );
    
    var that = this;
    that.request.onreadystatechange = function ( event ) 
    {
        // readyState equals 4.. WTF does 4 mean?
        if( that.request.readyState === 4 )
        {
            if( that.request.status === 200 )
            {
                if( that.onComplete !== undefined )
                {
                    that.onComplete( that.request.status , that.request.responseText );
                }
            }
            else
            {
                if( that.onError !== undefined )
                {
                    that.onError( that.request.status );
                }
            }
            that.request = null;
        }
    };
    this.request.send( realdata );
    
    //LOG.print("Requesting: " + realdata );
    
    return true;
};

Communicator.prototype.onComplete = function( code , data )
{
};

Communicator.prototype.onError = function( code )
{
};
