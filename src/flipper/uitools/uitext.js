
function UIText( text , size , color )
{
    UIComponent.call(this);
    this.textObject = null;
    
    this.generateText( text , size , color );
    
    this.group.addChild( this.textObject );
}

UIText.prototype = new UIComponent();
UIText.prototype.constructor = UIText;

UIText.prototype.setActive = function( state )
{
    this.active = state;
    updateLook();
};

UIText.prototype.setEnable = function( state )
{
    this.isEnable = state;
    updateLook();
};

UIText.prototype.activate = function()
{
};

UIText.prototype.setText = function( text )
{
    this.textObject.setText( text );
};

UIText.prototype.setTextStyle = function( fontsize , fontcolor )
{
    var fontName = "Calibri";
    var alignment = "middle";
    this.textObject.setStyle( {font: fontsize + "px " + fontName, fill: "#" + fontcolor.toString(16) , align: alignment } );
};

UIText.prototype.generateText = function( text , fontsize , fontcolor )
{
    var fontName = "Calibri";
    var alignment = "middle";
    
    if( this.textObject === undefined || this.textObject === null )
    {
        this.textObject = new PIXI.Text( text , {font: fontsize + "px " + fontName, fill: "#" + fontcolor.toString(16) , align: alignment } );
    }
    this.textObject.position.x = 0;
    this.textObject.position.y = 0;

    this.textObject.anchor.x = 0.0;
    this.textObject.anchor.y = 0.5;
};