
var WALL_EDIT_DISTANCE = 10;

function WallEditorState( editor )
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
        }
    }
}

WallEditorState.prototype = new EditorState();
WallEditorState.prototype.constructor = WallEditorState;

WallEditorState.prototype.updateGraphics = function()
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

WallEditorState.prototype.click = function( data )
{
    // Current clicked point
    var point = data.getLocalPosition( this.graphics );
    this.polygoneditor.click( point );
    this.updateGraphics();
};

WallEditorState.prototype.mousemove = function( data )
{
    // Current clicked point
    var point = data.getLocalPosition( this.graphics );
    this.polygoneditor.mousemove( point );
};

WallEditorState.prototype.mousedown = function( data )
{
    // Current clicked point
    var point = data.getLocalPosition( this.graphics );
    this.polygoneditor.mousedown( point );
};

WallEditorState.prototype.mouseup = function( data )
{
    // Current clicked point
    var point = data.getLocalPosition( this.graphics );
    this.polygoneditor.mouseup( point );
};

WallEditorState.prototype.mouseupoutside = function( data )
{
    // Current clicked point
    var point = data.getLocalPosition( this.graphics );
    this.polygoneditor.mouseupoutside( point );
};

WallEditorState.prototype.getName = function()
{
    return "wall";
};

WallEditorState.prototype.save = function()
{
    // Basically contains polygons..
    // Parse data in
    var pointArrays = [];
    
    for( var i = 0 ; i < this.polygoneditor.polygons.length ; ++i )
    {
        pointArrays.push( this.polygoneditor.polygons[i].points );
    }
    
    var object = { 
        type: this.getName(),
        polygons: pointArrays
    };
    
    return object;
};

WallEditorState.prototype.load = function( data )
{
    var parray = data.polygons;
    
    // Parse data out
    var current = null;
    for( var i = 0 ; i < parray.length ; ++i )
    {
        current = new PIXI.Polygon();
        current.points = parray[i];
        this.polygoneditor.push( current );
    }
    
    this.updateGraphics();
    
    return true;
};