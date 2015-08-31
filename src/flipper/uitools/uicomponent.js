
function UIComponent()
{
    this.group = new PIXI.DisplayObjectContainer();
    
    this.group.buttonMode = true;
    this.group.setInteractive(true);
    
    this.isEnable = true;
    this.bounds = null;
    
    var that = this;
    this.group.click = this.group.tap = 
        function(data){
            if( that === undefined ) {
                LOG.error("Oh hell, that is undefined.");
                return;
            }
            that.click( data );
        };
    
    this.group.mousedown = this.group.touchstart = 
        function(data){
            if( that === undefined ) {
                LOG.error("Oh hell, that is undefined.");
                return;
            }
            that.mousedown( data );
        };
    
    this.group.mouseup = this.group.touchend = 
        function(data){
            if( that === undefined ) {
                LOG.error("Oh hell, that is undefined.");
                return;
            }
            that.mouseup( data , false );
        };
    
    this.group.mouseupoutside = this.group.touchendoutside = 
        function(data){
            if( that === undefined ) {
                LOG.error("Oh hell, that is undefined.");
                return;
            }
            that.mouseup( data , true );
        };
        
    this.group.mouseover = 
        function(data){
            if( that === undefined ) {
                LOG.error("Oh hell, that is undefined.");
                return;
            }
            that.mouseover( data );
        };
        
    this.group.mouseout = 
        function(data){
            if( that === undefined ) {
                LOG.error("Oh hell, that is undefined.");
                return;
            }
            that.mouseout( data );
        };
    
    this.group.mousemove = this.group.touchmove = 
        function(data){
            if( that === undefined ) {
                LOG.error("Oh hell, that is undefined.");
                return;
            }
            that.mousemove( data );
        };
}

UIComponent.prototype.getBounds = function()
{
    return this.bounds;
};

UIComponent.prototype.setBounds = function( rectangle )
{
    this.bounds = rectangle;
};

UIComponent.prototype.setEnable = function( state )
{
    this.isEnable = state;
    updateLook();
};

UIComponent.prototype.getEnable = function()
{
    return this.isEnable;
};

UIComponent.prototype.getContainer = function()
{
    return this.group;
};

UIComponent.prototype.getChildContainer = function()
{
    return this.group;
};

UIComponent.prototype.click = function( data )
{
};

UIComponent.prototype.mousedown = function( data )
{
};

UIComponent.prototype.mouseup = function( data , outside )
{
};

UIComponent.prototype.mousemove = function( data )
{
};

UIComponent.prototype.mouseover = function( data )
{
};

UIComponent.prototype.mouseout = function( data )
{
};

UIComponent.prototype.updateLook = function()
{
};
