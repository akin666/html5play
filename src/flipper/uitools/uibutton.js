
function UIButton()
{
    UIComponent.call(this);
    
    this.isDown = false;
    this.isOver = false;
    this.isActive = false;
    this.action = null;
}

UIButton.prototype = new UIComponent();
UIButton.prototype.constructor = UIButton;

UIButton.prototype.setActive = function( state )
{
    this.isActive = state;
    this.updateLook();
};

UIButton.prototype.setText = function( text )
{
};

UIButton.prototype.updateLook = function()
{
};

UIButton.prototype.setBounds = function( rectangle )
{
    this.bounds = rectangle;
    this.group.hitArea = rectangle;
};

UIButton.prototype.setEnable = function( state )
{
    this.isEnable = state;
    this.updateLook();
};

UIButton.prototype.getEnable = function()
{
    return this.isEnable;
};

UIButton.prototype.click = function( data )
{
    if( this.select !== undefined )
    {
        this.select();
    }
    
    if( this.isEnable && this.action !== undefined && this.action !== null )
    {
        this.action();
    }
};

UIButton.prototype.mousedown = function( data )
{
    this.isdown = true;
    this.updateLook();
};

UIButton.prototype.mouseup = function( data , outside )
{
    // if( !outside ) 
    this.isdown = false;
    //that.activate();   // causes double call to activate()
    this.updateLook();
};

UIButton.prototype.mousemove = function( data )
{
};

UIButton.prototype.mouseover = function( data )
{
    if( this.hover !== undefined )
    {
        this.hover();
    }
    
    this.isOver = true;
    this.updateLook();
};

UIButton.prototype.mouseout = function( data )
{
    this.isOver = false;
    this.updateLook();
};