
function InfoEditorState( editor )
{
    EditorState.call(this);
    
    this.size = new PIXI.Point( DEFAULT_CANVAS_WIDTH , DEFAULT_CANVAS_HEIGHT );
    
    this.editor = editor;
    this.spriteImage = null;
    this.path = "";
    this.offset = new PIXI.Point( 0 , 0 );
    
    this.mouseActive = false;
    this.mouseStart = new PIXI.Point( 0 , 0 );
    this.originalPosition = new PIXI.Point( 0 , 0 );
    
    this.musicPath = "";
    this.balls = 10;
    this.name = "anon";
    
    // Setup buttons
    {
        var that = this;
        var jump = 30;
        var position = 0;
        // navigation
        {
            position = 0;
            
            // Level size
            var levelsize = UIFACTORY.createButton( 
                "Level size" ,
                0xFFFFAA ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set for back.");
                    }
                    
                    var swidth = prompt( "Please enter the width" , that.size.x );
                    if( swidth === null )
                    {
                        return;
                    }
                    var wnum = parseInt( swidth );
                    if( wnum === NaN )
                    {
                        LOG.error( swidth + " is not a number.");
                        return;
                    }
                    
                    var sheight = prompt( "Please enter the height" , that.size.y );
                    if( sheight === null )
                    {
                        return;
                    }
                    var hnum = parseInt( sheight );
                    if( hnum === NaN )
                    {
                        LOG.error( sheight + " is not a number.");
                        return;
                    }
                    
                    that.editor.setLevelSize( wnum , hnum );
                } 
            );
            levelsize.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( levelsize.getContainer() );
            
            // Level size
            var viewpos = UIFACTORY.createButton( 
            "View position" ,
            0xFFFFAA ,
            0xFFFFFF ,
            function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set for back.");
                    }
                    
                    var loc = that.editor.getViewLocation();
                    var swidth = prompt( "Please enter the x" , loc.x );
                    if( swidth === null )
                    {
                        return;
                    }
                    var wnum = parseInt( swidth );
                    if( wnum === NaN )
                    {
                        LOG.error( swidth + " is not a number.");
                        return;
                    }
                    
                    var sheight = prompt( "Please enter the y" , loc.y );
                    if( sheight === null )
                    {
                        return;
                    }
                    var hnum = parseInt( sheight );
                    if( hnum === NaN )
                    {
                        LOG.error( sheight + " is not a number.");
                        return;
                    }
                    
                    that.editor.setViewLocation( wnum , hnum );
                } 
            );
            viewpos.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( viewpos.getContainer() );
            // bgimage
            var bgimage = UIFACTORY.createButton( 
                "BG Image" ,
                0xFFFFAA ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set for back.");
                    }
                    
                    var name = prompt( "Please enter a image url" , that.path );
                    if( name === null )
                    {
                        return;
                    }
                    
                    that.setBackground( name );
                } 
            );
            bgimage.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( bgimage.getContainer() );
            // offsets
            var offsets = UIFACTORY.createButton( 
                "BG offsets" ,
                0xFFFFAA ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) 
                    {
                        LOG.error("that is not set.");
                        return;
                    }
                    
                    var xoff = prompt( "Please enter the X offset" , that.offset.x );
                    if( xoff === null )
                    {
                        return;
                    }
                    var xnum = parseInt( xoff );
                    if( xnum === NaN )
                    {
                        LOG.error( xoff + " is not a number.");
                        return;
                    }
                    
                    var yoff = prompt( "Please enter the Y offset" , that.offset.y );
                    if( yoff === null )
                    {
                        return;
                    }
                    var ynum = parseInt( yoff );
                    if( ynum === NaN )
                    {
                        LOG.error( yoff + " is not a number.");
                        return;
                    }
                    
                    this.setOffset( new PIXI.Point( xnum , ynum ) );
                } 
            );
            offsets.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( offsets.getContainer() );
            
            // level music
            var bgmusic = UIFACTORY.createButton( 
                "Level music" ,
                0xFFFFAA ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set for back.");
                    }
                    
                    var name = prompt( "Please enter a audio url" , that.getMusic() );
                    if( name === null )
                    {
                        return;
                    }
                    
                    that.setMusic( name );
                } 
            );
            bgmusic.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( bgmusic.getContainer() );
            
            // ball count
            var ballc = UIFACTORY.createButton( 
                "Number of balls" ,
                0xFFFFAA ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set for back.");
                    }
                    
                    var bco = prompt( "Please enter the number of balls" , that.getBallCount() );
                    if( bco === null )
                    {
                        return;
                    }
                    var num = parseInt( bco );
                    if( num === NaN )
                    {
                        LOG.error( bco + " is not a number.");
                        return;
                    }
                    
                    that.setBallCount( num );
                } 
            );
            ballc.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( ballc.getContainer() );
            
            // level name
            var levname = UIFACTORY.createButton( 
                "Level name" ,
                0xFFFFAA ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set for back.");
                    }
                    
                    var bco = prompt( "Please enter the name of the level" , that.getLevelName() );
                    if( bco === null || bco === "" )
                    {
                        return;
                    }
                    
                    that.setLevelName( bco );
                } 
            );
            levname.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( levname.getContainer() );
        }
    }
}

InfoEditorState.prototype = new EditorState();
InfoEditorState.prototype.constructor = InfoEditorState;

InfoEditorState.prototype.getName = function()
{
    return "info";
};

InfoEditorState.prototype.getLevelName = function()
{
    return this.name;
};

InfoEditorState.prototype.setLevelName = function( name )
{
    this.name = name;
};

InfoEditorState.prototype.getBallCount = function()
{
    return this.balls;
};

InfoEditorState.prototype.setBallCount = function( num )
{
    this.balls = num;
};

InfoEditorState.prototype.setBackground = function( newpath )
{
    if( newpath === null ) 
    {
        LOG.error("newpath is not set.");
        return;
    }
    
    // fade old image out
    var targetGroup = this.group;
    if( this.spriteImage !== null )
    {
        var oldImage = this.spriteImage;
        // decouple the tween from prompt caused timer hickup...
        // sigh..
        setTimeout( 
            function() 
            {
                tweenRemoveChildFrom( targetGroup , oldImage , BASE_TRANSITION_TIME );
            }, 
            10 
        );
    }
    this.path = newpath;
    
    // create an array of assets to load
    var assetsToLoader = [ this.path ];

    // create a new loader
    var loader = new PIXI.AssetLoader( assetsToLoader );
    var that = this;
    
    loader.onComplete = function() {
        var newSprite = null;
        try 
        {
            newSprite = PIXI.Sprite.fromImage( that.path );
            if( newSprite === null )
            {
                LOG.error( "Failed to load image. " + that.path );
                return;
            }
        }
        catch( e )
        {
            LOG.error("Failed to load GameStaticWorld background graphics, this is commonly caused by security exception.\n" + 
                      "Javascript standard doesnt allow reading pictures from local machine, thus security exception.\n\n" + e.message );
            return;
        }

        that.spriteImage = newSprite;

        that.spriteImage.position.x = that.offset.x;
        that.spriteImage.position.y = that.offset.y;

        var rect = newSprite.texture.frame;

        that.editor.setLevelSize( rect.width , rect.height );

        // decouple the tween from prompt caused timer hickup...
        // sigh..
        setTimeout( 
            function() 
            {
                tweenAddChildTo( targetGroup , newSprite , BASE_TRANSITION_TIME );
            }, 
            10 
        );
    };
    
    loader.load();
};

InfoEditorState.prototype.setMusic = function( newpath )
{
    this.musicPath = newpath;
};

InfoEditorState.prototype.getMusic = function()
{
    return this.musicPath;
};

InfoEditorState.prototype.completeSetBackground = function()
{
};

InfoEditorState.prototype.setOffset = function( newoffset )
{
    if( newoffset === null ) 
    {
        LOG.error("newoffset is not set.");
        return;
    }
    
    this.offset.x = newoffset.x;
    this.offset.y = newoffset.y;

    if( this.spriteImage !== null )
    {
        var sprite = this.spriteImage;
        // decouple the tween from prompt caused timer hickup...
        // sigh..
        var xnum = this.offset.x;
        var ynum = this.offset.y;
        
        setTimeout( 
            function() 
            {
                TweenLite.to( sprite.position , BASE_TRANSITION_TIME, {x:xnum , y:ynum} );
            }, 
            10 
        );
    }
};

InfoEditorState.prototype.save = function()
{
    // Parse data in    
    var object = { 
        type: this.getName(),
        size: this.size,
        offset: this.offset,
        path: this.path,
        music: this.getMusic(),
        balls: this.getBallCount(),
        name: this.getLevelName()
    };
    
    return object;
};

InfoEditorState.prototype.load = function( data )
{
    if( data.offset !== undefined )
    {
        this.setOffset( data.offset );
    }
    if( data.path !== undefined )
    {
        this.setBackground( data.path );
    }
    if( data.size !== undefined )
    {
        this.size = data.size;
    }
    if( data.music !== undefined )
    {
        this.setMusic( data.music );
    }
    if( data.balls !== undefined )
    {
        this.setBallCount( data.balls );
    }
    if( data.name !== undefined )
    {
        this.setLevelName( data.name );
    }
    
    return true;
};

InfoEditorState.prototype.setLevelSize = function( width , height )
{
    this.size.x = width;
    this.size.y = height;
};

InfoEditorState.prototype.getLevelSize = function()
{
    return this.size;
};

InfoEditorState.prototype.mousemove = function( data )
{
    if( this.editor === undefined || this.editor === null )
    {
        return;
    }
    
    var point = data.getLocalPosition( this.editor.getContainer() );
    
    if( this.mouseActive )
    {
        this.editor.setViewLocation( 
                this.originalPosition.x + ( point.x - this.mouseStart.x ),
                this.originalPosition.y + ( point.y - this.mouseStart.y )
            );
    }
};

InfoEditorState.prototype.mousedown = function( data )
{
    this.mouseActive = true;
    var point = data.getLocalPosition( this.editor.getContainer() );
    
    this.mouseStart.x = point.x;
    this.mouseStart.y = point.y;
    
    var cameraPos = this.editor.getViewLocation();
    this.originalPosition.x = cameraPos.x;
    this.originalPosition.y = cameraPos.y;
};

InfoEditorState.prototype.mouseup = function( data )
{
    if( this.mouseActive )
    {
    }
    this.mouseActive = false;
};

InfoEditorState.prototype.mouseupoutside = function( data )
{
    if( this.mouseActive )
    {
        this.editor.setViewLocation( this.originalPosition.x , this.originalPosition.y );
    }
    this.mouseActive = false;
};

InfoEditorState.prototype.keyPressEvent = function( data )
{
    switch( data.keyCode )
    {
        case 42 : // *
            this.editor.resetZoomView();
            break;
        case 45 : // -
            this.editor.zoomView( -0.05 );
            break;
        case 43 : // +
            this.editor.zoomView( 0.05 );
            break;
        default : break;
    }
};