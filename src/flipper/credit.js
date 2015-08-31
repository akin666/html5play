
function Credit()
{
    State.call( this , 0xE45B6F );
    
    // pass this to closures.
    var that = this;
    this.spritegroup = new PIXI.DisplayObjectContainer();
    // back
    var back = UIFACTORY.createButton( 
        "BACK" ,
        0xFFD3D0 ,
        0xFFFFFF ,
        function(data){
            if( that === null || that === undefined ) {
                LOG.error("that is not set for back.");
                return;
            }
            if( that.oldState === null || that === undefined ) {
                LOG.error("oldState is not set for back.");
                return;
            }
            switchState( that.oldState );
        } 
    );
    back.getContainer().position.y = 100;
    this.group.addChild( this.spritegroup );
    this.group.addChild( back.getContainer() );
    
    var text = "Graphics: Henna Tuunainen, Heta Kettunen \nCode: Mikael Korpela \nAudio: Jyri Kuokka";
    
    var fontName = "Calibri";
    var alignment = "center";
    var fontsize = 22;
    var fontcolor = 0xFFFFFF;
    
    this.textObject = new PIXI.Text( text , {font: fontsize + "px " + fontName, fill: "#" + fontcolor.toString(16) , align: alignment } );
    
    this.textObject.position.x = 0;
    this.textObject.position.y = 0;

    this.textObject.anchor.x = 0.5;
    this.textObject.anchor.y = 0.5;
    
    this.group.addChild( this.textObject );
    
    // emitter..
    this.particletexture = PIXI.Texture.fromImage("gfx/omnom.png");
    this.spriteworld = new SpriteWorld( this.spritegroup );
    this.spriteworld.setGravity( new PIXI.Point( 0 , 0 ) );
    
    this.emitter = null;
    
    var position = new PIXI.Point( 0 , 0 );
    
    if( this.emitter === null )
    {
        this.emitter = this.spriteworld.createEmitter();

        this.emitter.setTexture( this.particletexture );
        this.emitter.setPosition( position );
        this.emitter.setSpawnRate( 1 );
        this.emitter.setAlpha( 1.0 );
        this.emitter.setSpawnSpeed( 200 , 300 );
        this.emitter.setSpawnLifetime( 1.8 , 3 );
        this.emitter.setSpawnInTime( 0.5 );
        this.emitter.setSpawnOutTime( 1.0 );
        this.emitter.setSpawnScale( 0.2 , 1.5 );
        
        this.emitter.init();
    }
}

Credit.prototype = new State();
Credit.prototype.constructor=Credit;

Credit.prototype.update = function( ms )
{
    switch( this.state ) 
    {
        case STATE_TRANSITION :
        {
            // Only if the oldstate hasnt disappeared, we break
            if( this.oldState !== undefined && this.oldState !== null && (!this.oldState.disappear()) )
            {
                this.oldState.update( ms );
                break;
            }
            
            this.state = STATE_INIT;
            // Let the state transition through to STATE_INIT
        }
        case STATE_INIT :
        {
            this.duration = 0;
            this.state = STATE_IDLE;
            
            this.group.position.x = SCREEN.width / 2;
            this.group.position.y = SCREEN.height / 2;

            // tween the stuff in
            this.group.alpha = 0;
            var totalFadeTime = 0.5;
            TweenLite.to( this.group, totalFadeTime, {alpha:1} );
            
            break;
        }
        case STATE_IDLE :
        {
            this.spriteworld.update( ms );
            this.duration += ms;
            break;
        }
        case STATE_HIDE : 
        {
            break;
        }
        case STATE_DONE : 
        {
            break;
        }
        default: 
        {
            break;
        }
    }
};
