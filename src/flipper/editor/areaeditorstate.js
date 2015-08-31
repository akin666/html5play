
function AreaEditorState( editor )
{
    EditorState.call(this);
    
    this.polygoneditor = new PolygonEditor( this.temporaryGraphics );
    
    // Setup buttons
    {
        var that = this;
        var jump = 30;
        var position = 0;
        // navigation
        {
            position = 0;
            // newpoly
            this.newpolygon = UIFACTORY.createButton( 
                "New polygon" ,
                0xAAAA66 ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set.");
                    }
                    
                    that.polygoneditor.newPolygon();
                } 
            );
            this.newpolygon.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( this.newpolygon.getContainer() );
            // editpoly
            this.editpolygon = UIFACTORY.createButton( 
                "Edit polygon" ,
                0xAAAA66 ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set.");
                    }
                    that.polygoneditor.changeMode( "draw" );
                } 
            );
            this.editpolygon.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( this.editpolygon.getContainer() );
            // selectpoly
            this.selectpolygon = UIFACTORY.createButton( 
                "Select polygon" ,
                0xAAAA66 ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set.");
                    }
                    that.polygoneditor.cleanUp();
                    that.polygoneditor.changeMode( "select" );
                } 
            );
            this.selectpolygon.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( this.selectpolygon.getContainer() );
            // remove point
            this.rmpoint = UIFACTORY.createButton( 
                "Remove point" ,
                0xAAAA66 ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set.");
                    }
                    that.polygoneditor.changeMode( "delete" );
                } 
            );
            this.rmpoint.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( this.rmpoint.getContainer() );
            // Name
            var newo = UIFACTORY.createButton( 
                "Name the area" ,
                0xAAAA66 ,
                0xFFFFFF ,
                function(data){
                    if( that === null || that === undefined ) {
                        LOG.error("that is not set for back.");
                    }
                    
                    var data = prompt( "Please enter the name" , that.getAreaName() );
                    if( data === undefined || data === null )
                    {
                        return;
                    }
                    
                    that.setAreaName( data );
                } 
            );
            newo.getContainer().position.y = position;
            position += jump;
            this.toolGroup.addChild( newo.getContainer() );
        }
    }
}

AreaEditorState.prototype = new EditorState();
AreaEditorState.prototype.constructor = AreaEditorState;

AreaEditorState.prototype.setAreaName = function( name )
{
    var current = this.polygoneditor.current;
    if( current === undefined || current === null )
    {
        LOG.error("Polygon has not been selected.");
        return;
    }
    
    // add name...
    current.name = name;
};

AreaEditorState.prototype.getAreaName = function()
{
    var current = this.polygoneditor.current;
    if( current === null || current === undefined )
    {
        LOG.error("Polygon has not been selected.");
        return "";
    }
    if( current.name === undefined || current.name === null )
    {
        return "";
    }
    
    return current.name;
};

AreaEditorState.prototype.getName = function()
{
    return "area";
};

AreaEditorState.prototype.save = function()
{
    // Basically contains polygons..
    // and namedata.
    // Parse data in
    var pointArrays = [];
    for( var i = 0 ; i < this.polygoneditor.polygons.length ; ++i )
    {
        var strname = ( this.polygoneditor.polygons[i].name === undefined || this.polygoneditor.polygons[i].name === null) ? "" : this.polygoneditor.polygons[i].name;
        var iobject = { 
            name: strname,
            points: this.polygoneditor.polygons[i].points
        };
        pointArrays.push( iobject );
    }
    
    var object = { 
        type: this.getName(),
        data: pointArrays
    };
    
    return object;
};

AreaEditorState.prototype.load = function( data )
{
    var parray = data.data;
    
    // Parse data out
    var current = null;
    for( var i = 0 ; i < parray.length ; ++i )
    {
        current = new PIXI.Polygon();
        current.points = parray[i].points;
        current.name = parray[i].name;
        this.polygoneditor.push( current );
    }
    
    this.updateGraphics();
    
    return true;
};

AreaEditorState.prototype.updateGraphics = function()
{
    // Clear drawings..
    this.graphics.clear();
    
    // Draw the polygons in array
    for( var i = 0 ; i < this.polygoneditor.polygons.length ; ++i )
    {
        drawPolygon( 0xFFFFFF , 0.5 , 1.0 , this.polygoneditor.polygons[i] , this.graphics );
    }
    
    // Draw the current polygon
    if( this.polygoneditor.current !== null )
    {
        drawPolygon( 0xFFFFFF , 1.0 , 1.0 , this.polygoneditor.current , this.graphics );
        
        // Draw vertex points for polygon
        drawVertexes( 0xAAAAFF , 1.0 , 1 , this.polygoneditor.pointRadius , this.polygoneditor.current , this.graphics );
    }
};

AreaEditorState.prototype.click = function( data )
{
    // Current clicked point
    var point = data.getLocalPosition( this.graphics );
    this.polygoneditor.click( point );
    this.updateGraphics();
};

AreaEditorState.prototype.mousemove = function( data )
{
    // Current clicked point
    var point = data.getLocalPosition( this.graphics );
    this.polygoneditor.mousemove( point );
};

AreaEditorState.prototype.mousedown = function( data )
{
    // Current clicked point
    var point = data.getLocalPosition( this.graphics );
    this.polygoneditor.mousedown( point );
};

AreaEditorState.prototype.mouseup = function( data )
{
    // Current clicked point
    var point = data.getLocalPosition( this.graphics );
    this.polygoneditor.mouseup( point );
};

AreaEditorState.prototype.mouseupoutside = function( data )
{
    // Current clicked point
    var point = data.getLocalPosition( this.graphics );
    this.polygoneditor.mouseupoutside( point );
};
