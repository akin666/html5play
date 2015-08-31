
function UICheckBox( text , size , color , checked )
{
    UIComponent.call(this);
    
    this.textObject = null;
    this.graphics = new PIXI.Graphics();
    
    this.isChecked = checked;
    
    this.size = size;
    this.boxsize = size - 2;
    
    this.generateText( text , size , color );
    
    this.setChecked( this.isChecked );
    
    this.group.addChild( this.graphics );
    this.group.addChild( this.textObject );
}

UICheckBox.prototype = new UIComponent();
UICheckBox.prototype.constructor = UICheckBox;

UICheckBox.prototype.setActive = function( state )
{
    this.active = state;
    updateLook();
};

UICheckBox.prototype.setEnable = function( state )
{
    this.isEnable = state;
    updateLook();
};

UICheckBox.prototype.setChecked = function( state )
{
    this.isChecked = state;
    this.updateLook();
};

UICheckBox.prototype.updateLook = function()
{
    var half = this.boxsize / 2.0;
    
    this.graphics.lineStyle( 1.0 , 0xFFFFFF , 1.0 );
    var color = 0x000000;
    if( this.isChecked )
    {
        color = 0xFFFFFF;
    }
    else
    {
        color = 0x000000;
    }
    this.graphics.beginFill( color , 1.0 );
    this.graphics.drawRect( -half , -half , this.boxsize , this.boxsize );
    this.graphics.endFill();
};

UICheckBox.prototype.activate = function()
{
};

UICheckBox.prototype.setText = function( text )
{
    this.textObject.setText( text );
};

UICheckBox.prototype.setTextStyle = function( fontsize , fontcolor )
{
    var fontName = "Calibri";
    var alignment = "middle";
    this.textObject.setStyle( {font: fontsize + "px " + fontName, fill: "#" + fontcolor.toString(16) , align: alignment } );
};

UICheckBox.prototype.generateText = function( text , fontsize , fontcolor )
{
    var fontName = "Calibri";
    var alignment = "middle";
    
    if( this.textObject === undefined || this.textObject === null )
    {
        this.textObject = new PIXI.Text( text , {font: fontsize + "px " + fontName, fill: "#" + fontcolor.toString(16) , align: alignment } );
        
        var bounds = new PIXI.Rectangle( -this.size/2 , -this.textObject.height / 2 , this.textObject.width + this.size + this.size/2 , this.textObject.height );
        this.setBounds( bounds );
    }
    this.textObject.position.x = this.size;
    this.textObject.position.y = 0;

    this.textObject.anchor.x = 0.0;
    this.textObject.anchor.y = 0.5;
};

UICheckBox.prototype.setBounds = function( rectangle )
{
    this.bounds = rectangle;
    this.group.hitArea = rectangle;
};

UICheckBox.prototype.setEnable = function( state )
{
    this.isEnable = state;
    this.updateLook();
};

UICheckBox.prototype.getEnable = function()
{
    return this.isEnable;
};

UICheckBox.prototype.click = function( data )
{
    if( this.isEnable )
    {
        this.setChecked( !this.isChecked );
    }
};
