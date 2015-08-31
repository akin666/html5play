
function ItemEditorState( editor )
{
    EditorState.call(this);
    
    this.editor = editor;
    this.mouseActive = false;
    this.mouseStart = new PIXI.Point( 0 , 0 );
    this.originalPosition = new PIXI.Point( 0 , 0 );
    this.itemsArea = new UIArea( 150 , 300 );
    
    this.factory = new ItemFactory();
    this.items = [];
    this.selectedItem = null;
    this.selectOffset = new PIXI.Point( 0 , 0 );
    
    this.itemGroup = new PIXI.DisplayObjectContainer();
    this.editor_select = PIXI.Sprite.fromImage("gfx/editor_selected.png");
    this.editor_select.anchor.x = 0.5;
    this.editor_select.anchor.y = 0.5;
    
    this.group.addChild( this.itemGroup );
    this.group.addChild( this.editor_select );
    
    this.editor_select.alpha = 0;
    
    this.mode = "none";
    
    // Setup buttons
    {
        var that = this;
        var jump = 30;
        var position = 0;
        // navigation
        {
            position = 0;
            
            // additem
            this.additem = UIFACTORY.createButton( 
                "Add item" ,
                0xAAAA66 ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set for back.");
                    }
                    that.switchMode( "add" );
                } 
            );
            this.additem.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( this.additem.getContainer() );
            // removeitem
            this.removeitem = UIFACTORY.createButton( 
                "Remove item" ,
                0xAAAA66 ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set for back.");
                    }
                    that.switchMode( "remove" );
                } 
            );
            this.removeitem.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( this.removeitem.getContainer() );
            // action trigger
            this.removeitem = UIFACTORY.createButton( 
                "trigger" ,
                0xAAAA66 ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set for back.");
                    }
                    that.setupTrigger();
                } 
            );
            this.removeitem.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( this.removeitem.getContainer() );
            
            // Item area with different items..
            {
                this.toolGroup.addChild( this.itemsArea.getContainer() );
                var buttonContainer = this.itemsArea.getChildContainer();
                buttonContainer.position.y += position;

                // newbumper
                var factorylist = this.factory.getList();

                // generate buttons for items..
                var itemButtonPosition = 0;
                for( var i = 0 ; i < factorylist.length ; ++i )
                {
                    var itembutton = itemEditorStateCcreateItemButtonFor( that , factorylist[i] );

                    itembutton.getContainer().position.y = itemButtonPosition;
                    itemButtonPosition += jump;
                    buttonContainer.addChild( itembutton.getContainer() );
                }
            }
        }
    }
    this.switchMode( "add" );
}

function itemEditorStateCcreateItemButtonFor( that , itemname )
{
    var itembutton = UIFACTORY.createButton( 
        itemname ,
        0xAA0066 ,
        0xFFFFFF ,
        function(data){
            if( that === undefined ) {
                LOG.error("that is not set.");
                return;
            }
            var item = that.newItem( itemname );
        } 
    );
    return itembutton;
}

ItemEditorState.prototype = new EditorState();
ItemEditorState.prototype.constructor = ItemEditorState;

ItemEditorState.prototype.switchMode = function( mode )
{
    if( this.mode === mode )
    {
        return;
    }
    
    if( mode === "add" )
    {
        this.mode = "add";
        this.additem.setActive( true );
        this.removeitem.setActive( false );
    }
    else if( mode === "remove" )
    {
        this.mode = "remove";
        this.additem.setActive( false );
        this.removeitem.setActive( true );
    }
};

ItemEditorState.prototype.getName = function()
{
    return "item";
};

ItemEditorState.prototype.save = function()
{
    // Parse data in
    var objectData = [];
    
    for( var i = 0 ; i < this.items.length ; ++i )
    {
        var item = this.items[i].save();
        if( item !== null )
        {
            objectData.push( item );
        }
    }
    
    var object = { 
        type: this.getName(),
        items: objectData
    };
    
    return object;
};

ItemEditorState.prototype.load = function( data )
{
    if( data.items === undefined )
    {
        return false;
    }
    
    // clear old items.
    for( var i = 0 ; i < this.items.length ; ++i )
    {
        this.items[i].destruct();
    }
    this.items = [];
    
    // load new items.
    for( var i = 0 ; i < data.items.length ; ++i )
    {
        var itemdata = data.items[i];
        var newitem = this.factory.create( itemdata.type , null , this , itemdata );
        this.items.push( newitem );
    }
    
    return true;
};

ItemEditorState.prototype.newItem = function( name )
{
    if( this.mode === "remove" )
    {
        return;
    }
    
    var myNewItem = this.factory.create( name , null , this );
    if( myNewItem === null )
    {
        return null;
    }
    this.items.push( myNewItem );
    
    // 0,0 is alway bad spot..
    var position = new PIXI.Point( 100 , 100 );
    myNewItem.setPosition( position );
    
    return myNewItem;
};

ItemEditorState.prototype.setupTrigger = function()
{
    if( this.mode === "remove" || this.selectedItem === null )
    {
        return;
    }
    if( this.selectedItem.getTrigger === undefined )
    {
        alert("Trigger is not defined for " + this.selectedItem.getName() );
        return;
    }
    
    var triggertype = prompt( "Please enter trigger event string (" + eventTypesString() + ")" , this.selectedItem.getTrigger() );
    
    if( triggertype === undefined || triggertype === null )
    {
        return;
    }
    
    // sanitize.
    // remove whitespaces from beginning & end.
    // and lowercase it.
    triggertype = triggertype.replace(/(^\s+|\s+$)/g,' ').toLowerCase();
    
    this.selectedItem.setTrigger( triggertype );
    LOG.print("Selected " + this.selectedItem.getTrigger() + " as the trigger." );
};

ItemEditorState.prototype.getContainerFor = function( type )
{
    return this.itemGroup;
};

ItemEditorState.prototype.click = function( data )
{
    // if add mode
    if( this.mode !== "remove" )
    {
        return;
    }
    
    var point = data.getLocalPosition( this.itemGroup );
    
    this.mouseStart.x = point.x;
    this.mouseStart.y = point.y;
    
    for( var i = this.items.length - 1 ; i >= 0; --i )
    {
        
        var item = this.items[i];
        if( item.hitTest( point ) )
        {
            item.destruct();
            this.items.splice( i, 1 );
            return; // lets take just 1 item
        }
    }
};

ItemEditorState.prototype.mousemove = function( data )
{
    if( this.editor === undefined || this.editor === null || this.mode === "remove" )
    {
        return;
    }
    
    if( this.selectedItem === null || !this.mouseActive )
    {
        return;
    }
    
    var point = data.getLocalPosition( this.itemGroup );
    
    point.x += this.selectOffset.x;
    point.y += this.selectOffset.y;
    
    // move item.
    this.selectedItem.setPosition( point );
};

ItemEditorState.prototype.mousedown = function( data )
{
    this.mouseActive = true;
    var point = data.getLocalPosition( this.itemGroup );
    
    this.mouseStart.x = point.x;
    this.mouseStart.y = point.y;
    
    // if already selected, do no unselect
    if( this.mode === "remove" )
    {
        return;
    }
    
    // reset selection.
    if( this.selectedItem !== null )
    {
        // fade out selecto gfx
        
    }
    
    var prevSelected = this.selectedItem;
    this.selectedItem = null;
    for( var i = 0 ; i < this.items.length ; ++i )
    {
        var item = this.items[i];
        if( item.hitTest( point ) )
        {
            var pos = item.getPosition();
            this.selectOffset.x = pos.x - point.x;
            this.selectOffset.y = pos.y - point.y;
            
            this.selectedItem = item;
            break;
        }
    }
    
    // what to do with selection graphics logic:
    if( prevSelected !== null )
    {
        // something was selected previously...
        if( this.selectedItem === null )
        {
            // nothing new was selected..
            // fade out
            TweenLite.to( this.editor_select , FAST_TRANSITION_TIME , {alpha: 0} );
            return;
        }
        else
        {
            // something new was selected.
            this.editor_select.position = this.selectedItem.getPosition();
        }
    }
    else
    {
        if( this.selectedItem === null )
        {
            // nothing was selected, and will not be selected.
            return;
        }
        else
        {
            // something new was selected.
            this.editor_select.position = this.selectedItem.getPosition();
            TweenLite.to( this.editor_select , FAST_TRANSITION_TIME , {alpha: 1} );
        }
    }
};

ItemEditorState.prototype.mouseup = function( data )
{
    if( this.mode === "remove" )
    {
        return;
    }
    this.mouseActive = false;
};

ItemEditorState.prototype.mouseupoutside = function( data )
{
    if( this.mode === "remove" )
    {
        return;
    }
    this.mouseActive = false;
};