
function Editor()
{
    State.call(this);
    
    this.modeGroup = new PIXI.DisplayObjectContainer();
    this.toolGroup = new PIXI.DisplayObjectContainer();
    this.navigationGroup = new PIXI.DisplayObjectContainer();
    
    this.background = new EditorBackground();
    this.grid = new EditorGrid();
    
    this.editorGroup = new PIXI.DisplayObjectContainer();
    
    // active editorstate
    this.editorState = null;
    
    this.music = "sfx/ogg/Boobjam_03_SpaceStationRomancin.ogg";
    
    // different editors:
    this.wallEditor = new WallEditorState( this );
    this.infoEditor = new InfoEditorState( this );
    this.itemEditor = new ItemEditorState( this );
    this.areaEditor = new AreaEditorState( this );
    
    // setup EditorGroup
    this.editorGroup.addChild( this.background.getContainer() );
    
    this.editorGroup.addChild( this.infoEditor.getContainer() );
    this.editorGroup.addChild( this.wallEditor.getContainer() );
    this.editorGroup.addChild( this.areaEditor.getContainer() );
    this.editorGroup.addChild( this.itemEditor.getContainer() );
    
    this.editorGroup.addChild( this.grid.getContainer() );
    
    // Some data for putting the button containers into correct places
    this.modeGroupHeight = 0;
    this.navigationGroupHeight = 0;
    
    // pass this to closures.
    var that = this;
    
    // Functions to pass the data to editor object, editor is responsible of handling it.
    {
        // Setup editor canvas
        this.background.graphics.setInteractive(true);
        this.background.graphics.click = this.background.graphics.tap = 
            function(data){
                if( that === undefined ) {
                    LOG.error("Oh hell, that is undefined.");
                    return;
                }
                if( that.editorState === null )
                {
                    return;
                }
                that.editorState.click( data );
            };

        this.background.graphics.mousedown = this.background.graphics.touchstart = 
            function(data){
                if( that === undefined ) {
                    LOG.error("Oh hell, that is undefined.");
                    return;
                }
                if( that.editorState === null )
                {
                    return;
                }
                that.editorState.mousedown( data );
            };

        this.background.graphics.mouseup = this.background.graphics.touchend = 
            function(data){
                if( that === undefined ) {
                    LOG.error("Oh hell, that is undefined.");
                    return;
                }
                if( that.editorState === null )
                {
                    return;
                }
                that.editorState.mouseup( data );
            };

        this.background.graphics.mouseupoutside = this.background.graphics.touchendoutside = 
            function(data){
                if( that === undefined ) {
                    LOG.error("Oh hell, that is undefined.");
                    return;
                }
                if( that.editorState === null )
                {
                    return;
                }
                that.editorState.mouseupoutside( data );
            };

        this.background.graphics.mouseover = 
            function(data){
                if( that === undefined ) {
                    LOG.error("Oh hell, that is undefined.");
                    return;
                }
                if( that.editorState === null )
                {
                    return;
                }
                that.editorState.mouseover( data );
            };

        this.background.graphics.mouseout = 
            function(data){
                if( that === undefined ) {
                    LOG.error("Oh hell, that is undefined.");
                    return;
                }
                if( that.editorState === null )
                {
                    return;
                }
                that.editorState.mouseout( data );
            };
        
        this.background.graphics.mousemove = this.background.graphics.touchmove = 
            function(data){
                if( that === undefined ) {
                    LOG.error("Oh hell, that is undefined.");
                    return;
                }
                if( that.editorState === null )
                {
                    return;
                }
                that.editorState.mousemove( data );
            };
    }
    
    // Setup buttons
    {
        var buttonJump = 30;
        var position = 0;
        // navigation
        {
            position = 0;
            
            // copy clipboard
            var cpclip = UIFACTORY.createButton( 
                "Copy to clipboard" ,
                0xFFAAAA ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set.");
                        return;
                    }
                    
                    var str = that.toString();
                    if( str === null || str === "" )
                    {
                        alert("No data to save.");
                        return;
                    }
                    
                    DATAMANAGER.setToClipboard( str );
                } 
            );
            cpclip.getContainer().position.y = position;
            position += buttonJump;
            this.navigationGroup.addChild( cpclip.getContainer() );
            // load from clipboard
            var ldclip = UIFACTORY.createButton( 
                "Load from clipboard" ,
                0xFFAAAA ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set.");
                        return;
                    }
                    
                    var str = DATAMANAGER.getFromClipboard();
                    if( str === null || str === "" )
                    {
                        alert("No data to load.");
                        return;
                    }
                    
                    if( !that.loadFromString( str ) )
                    {
                        alert("Failed to load the data.");
                    }
                } 
            );
            ldclip.getContainer().position.y = position;
            position += buttonJump;
            this.navigationGroup.addChild( ldclip.getContainer() );
            // save
            var save = UIFACTORY.createButton( 
                "Save" ,
                0xFFAAAA ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set.");
                    }
                    
                    var str = that.toString();
                    if( str === null || str === "" )
                    {
                        alert("No data to save.");
                        return;
                    }
                    
                    var saveName = prompt( "Please enter a name for the map" , "MyMap" );
                    if( saveName === null || saveName === "" )
                    {
                        return;
                    }
                    
                    if( !DATAMANAGER.save( saveName , str ) )
                    {
                        alert("Failed to save the data " + saveName + ".");
                        return;
                    }
                } 
            );
            save.getContainer().position.y = position;
            position += buttonJump;
            this.navigationGroup.addChild( save.getContainer() );
            // load
            var save = UIFACTORY.createButton( 
                "Load" ,
                0xFFAAAA ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set.");
                    }
                    
                    var loadName = prompt( "Please enter a name to load" , "MyMap" );
                    if( loadName === null || loadName === "" )
                    {
                        return;
                    }
                    
                    var str = DATAMANAGER.load( loadName );
                    if( str === null || str === "" )
                    {
                        alert("No data to load for " + loadName + "." );
                        return;
                    }
                    
                    if( !that.loadFromString( str ) )
                    {
                        alert("Failed to load the data " + loadName + ".");
                    }
                } 
            );
            save.getContainer().position.y = position;
            position += buttonJump;
            this.navigationGroup.addChild( save.getContainer() );
            // back
            var back = UIFACTORY.createButton( 
                "Back" ,
                0xFFAAAA ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set.");
                    }
                    if( that.oldState === null || that === undefined ) {
                        LOG.error("oldState is not set.");
                    }
                    switchState( that.oldState );
                } 
            );
            back.getContainer().position.y = position;
            position += buttonJump;
            this.navigationGroup.addChild( back.getContainer() );
            
            this.navigationGroupHeight = position;
        }
        
        // Mode
        {
            position = 0;
            
            // items
            var items = UIFACTORY.createButton( 
                "Items" ,
                0xAAAAFF ,
                0xFFFFFF ,
                function(data){
                    that.switchMode( that.itemEditor );
                } 
            );
            this.itemEditor.parentControlButton = items;
            items.getContainer().position.y = position;
            position += buttonJump;
            this.modeGroup.addChild( items.getContainer() );
            // walls
            var walls = UIFACTORY.createButton( 
                "Walls" ,
                0xAAAAFF ,
                0xFFFFFF ,
                function(data){
                    that.switchMode( that.wallEditor );
                } 
            );
            this.wallEditor.parentControlButton = walls;
            walls.getContainer().position.y = position;
            position += buttonJump;
            this.modeGroup.addChild( walls.getContainer() );
            // areas
            var areas = UIFACTORY.createButton( 
                "Areas" ,
                0xAAAAFF ,
                0xFFFFFF ,
                function(data){
                    that.switchMode( that.areaEditor );
                } 
            );
            this.areaEditor.parentControlButton = areas;
            areas.getContainer().position.y = position;
            position += buttonJump;
            this.modeGroup.addChild( areas.getContainer() );
            // BackgroundImage
            var bgimage = UIFACTORY.createButton( 
                "Background" ,
                0xAAAAFF ,
                0xFFFFFF ,
                function(data){
                    that.switchMode( that.infoEditor );
                } 
            );
            this.infoEditor.parentControlButton = bgimage;
            bgimage.getContainer().position.y = position;
            position += buttonJump;
            this.modeGroup.addChild( bgimage.getContainer() );
            
            this.modeGroupHeight = position;
        }
    }
    
    // Setup group
    this.group.addChild( this.editorGroup );
    
    this.group.addChild( this.modeGroup );
    this.group.addChild( this.toolGroup );
    this.group.addChild( this.navigationGroup );
}

Editor.prototype = new State();
Editor.prototype.constructor=Editor;

Editor.prototype.switchMode = function( mode )
{
    if( this.editorState !== null )
    {
        tweenRemoveChildFrom( this.toolGroup , this.editorState.toolGroup , BUTTON_TRANSITION_TIME );
        TweenLite.to( this.editorState.getContainer(), BASE_TRANSITION_TIME, {alpha:DEFAULT_ALPHA} );
        
        this.editorState.parentControlButton.setActive( false );
    }
    
    this.editorState = mode;
    tweenAddChildTo( this.toolGroup , this.editorState.toolGroup , BUTTON_TRANSITION_TIME );
    TweenLite.to( this.editorState.getContainer(), BASE_TRANSITION_TIME, {alpha:FOCUS_ALPHA} );
    this.editorState.parentControlButton.setActive( true );
};

Editor.prototype.toString = function()
{
    var fullObject = [];
    
    var itemobject = this.itemEditor.save();
    if( itemobject !== null )
    {
        fullObject.push( itemobject );
    }
    var areaobject = this.areaEditor.save();
    if( areaobject !== null )
    {
        fullObject.push( areaobject );
    }
    var wallobject = this.wallEditor.save();
    if( wallobject !== null )
    {
        fullObject.push( wallobject );
    }
    var bgobject = this.infoEditor.save();
    if( bgobject !== null )
    {
        fullObject.push( bgobject );
    }
    
    var str = JSON.stringify( fullObject );
    return str;
};

Editor.prototype.loadFromString = function( jsondata )
{
    var data = JSON.parse( jsondata );
    
    for( var i = 0 ; i < data.length ; ++i )
    {
        var current = data[i];
        if( current.type === this.itemEditor.getName() )
        {
            if( !this.itemEditor.load( current ) )
            {
                return false;
            }
        }
        else if( current.type === this.wallEditor.getName() )
        {
            if( !this.wallEditor.load( current ) )
            {
                return false;
            }
        }
        else if( current.type === this.infoEditor.getName() || current.type === "background" ) // background is legacy name for info.
        {
            if( !this.infoEditor.load( current ) )
            {
                return false;
            }
        }
        else if( current.type === this.areaEditor.getName() )
        {
            if( !this.areaEditor.load( current ) )
            {
                return false;
            }
        }
    }
    
    return true;
};

Editor.prototype.update = function( ms )
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
            
            if( this.music !== "" )
            {
                AUDIOMANAGER.setMusic( this.music );
                AUDIOMANAGER.playMusic();
            }
            
            this.state = STATE_INIT;
            // Let the state transition through to STATE_INIT
        }
        case STATE_INIT :
        {
            this.duration = 0;
            this.state = STATE_IDLE;
            
            /// make sure that "whole area is hitboxed"
            this.background.setup( 0x112233 , this.getLevelWidth() , this.getLevelHeight() );
            this.grid.setup( 0x9999FF , 25 , 25 , this.getLevelWidth() , this.getLevelHeight() );
            
            // tween the stuff in
            this.group.alpha = 0;
            var totalFadeTime = 0.5;
            TweenLite.to( this.group, totalFadeTime, {alpha:1} );
            
            // position groups
            this.modeGroup.position.x = 75;
            this.modeGroup.position.y = 50;
            
            this.toolGroup.position.x = 75;
            this.toolGroup.position.y = this.modeGroup.position.y + this.modeGroupHeight;
            
            this.navigationGroup.position.x = 75;
            this.navigationGroup.position.y = SCREEN.height - 150;
            
            // position "editor groups"
            this.editorGroup.position.x = 150;
            
            break;
        }
        case STATE_IDLE :
        {
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

Editor.prototype.setLevelSize = function( width , height )
{
    this.infoEditor.setLevelSize( width , height );
    
    this.background.setup( 0x112233 , width , height );
    this.grid.setup( 0x9999FF , 25 , 25 , width , height );
};

Editor.prototype.getLevelSize = function()
{
    return this.infoEditor.getLevelSize();
};

Editor.prototype.getLevelWidth = function()
{
    return this.infoEditor.getLevelSize().x;
};

Editor.prototype.getLevelHeight = function()
{
    return this.infoEditor.getLevelSize().y;
};

Editor.prototype.moveView = function( dx , dy )
{
    this.editorGroup.position.x += dx;
    this.editorGroup.position.y += dy;
};

Editor.prototype.setViewLocation = function( dx , dy )
{
    this.editorGroup.position.x = dx;
    this.editorGroup.position.y = dy;
};

Editor.prototype.getViewLocation = function()
{
    return this.editorGroup.position;
};

Editor.prototype.resetView = function()
{
    this.editorGroup.position.x = 0;
    this.editorGroup.position.y = 0;
};

Editor.prototype.resetZoomView = function()
{
    this.editorGroup.scale.x = 1;
    this.editorGroup.scale.y = 1;
};

Editor.prototype.zoomView = function( addition )
{
    this.editorGroup.scale.x += addition;
    this.editorGroup.scale.y += addition;
};

Editor.prototype.keyDownEvent = function( event )
{
    if( this.editorState === null )
    {
        return;
    }
    this.editorState.keyDownEvent( event );
};

Editor.prototype.keyPressEvent = function( event )
{
    if( this.editorState === null )
    {
        return;
    }
    this.editorState.keyPressEvent( event );
};

Editor.prototype.keyUpEvent = function( event )
{
    if( this.editorState === null )
    {
        return;
    }
    this.editorState.keyUpEvent( event );
};