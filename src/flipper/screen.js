
function Screen()
{
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer = PIXI.autoDetectRenderer( this.width , this.height );
    this.bound = false;
    
    window.addEventListener( "keydown" , this.keyDownEvent , true );
    window.addEventListener( "keypress" , this.keyPressEvent , true );
    window.addEventListener( "keyup" , this.keyUpEvent , true );
}

Screen.prototype.resize = function( event )
{
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderer.resize( this.width , this.height );
};

Screen.prototype.create = function()
{
    if( !this.bound )
    {
        document.body.appendChild( this.renderer.view );
    }
    this.bound = true;
};

Screen.prototype.detach = function()
{
    if( this.bound )
    {
        document.body.removeChild( this.renderer.view );
    }
    this.bound = false;
}

Screen.prototype.keyDownEvent = function( event )
{
    STATE.keyDownEvent( event );
};

Screen.prototype.keyPressEvent = function( event )
{  
    STATE.keyPressEvent( event );
};

Screen.prototype.keyUpEvent = function( event )
{  
    STATE.keyUpEvent( event );
};
