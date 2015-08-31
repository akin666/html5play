
function UIToolButton( text , fontsize , fontcolor , bgcolor , action )
{
    UIButton.call(this);
    
    this.action = action;
    this.textObject = null;
    this.graphics = new PIXI.Graphics();
    
    this.disabledAlpha = 0.4;
    this.inactiveAlpha = 0.6;
    this.activeAlpha = 1.0;
    this.hoverAlpha = 0.9;
    
    this.generateText( text , fontsize , fontcolor );
    this.generateBackground( bgcolor );
    
    this.group.addChild( this.graphics );
    this.group.addChild( this.textObject );
    
    this.updateLook();
}

UIToolButton.prototype = new UIButton();
UIToolButton.prototype.constructor = UIButton;

UIToolButton.prototype.setText = function( text )
{
    this.textObject.setText( text );
};

UIToolButton.prototype.setTextStyle = function( fontsize , fontcolor )
{
    var fontName = "Calibri";
    var alignment = "middle";
    this.textObject.setStyle( {font: fontsize + "px " + fontName, fill: "#" + fontcolor.toString(16) , align: alignment } );
};

UIToolButton.prototype.generateText = function( text , fontsize , fontcolor )
{
    var fontName = "Calibri";
    var alignment = "middle";
    
    if( this.textObject === undefined || this.textObject === null )
    {
        this.textObject = new PIXI.Text( text , {font: fontsize + "px " + fontName, fill: "#" + fontcolor.toString(16) , align: alignment } );
    }
    this.textObject.position.x = 0;
    this.textObject.position.y = 0;

    this.textObject.anchor.x = 0.5;
    this.textObject.anchor.y = 0.5;
};

UIToolButton.prototype.generateBackground = function( color )
{
    if( this.bounds === null )
    {
        var minWidth = 100;
        var minHeight = 24;
        var padding = 4;
        var width = this.textObject.width + padding;
        if( width < minWidth )
        {
            width = minWidth;
        }
        var height = this.textObject.height + padding;
        if( height < minHeight )
        {
            height = minHeight;
        }

        var rectangle = new PIXI.Rectangle( -width/2 , -height/2 , width , height );
        this.setBounds( rectangle );
    }
    
    this.graphics.beginFill(  color , 1.0 );
    this.graphics.drawRect( this.bounds.x , this.bounds.y , this.bounds.width , this.bounds.height );
    this.graphics.endFill();
};

UIToolButton.prototype.updateLook = function()
{
    var alphaTo = this.inactiveAlpha;
    if( !this.isEnable )
    {
        alphaTo = this.disabledAlpha;
    }
    else
    {
        if( this.isActive )
        {
            alphaTo = this.activeAlpha;
        }
        else if( this.isDown )
        {
            alphaTo = this.activeAlpha;
        }
        else if( this.isOver )
        {
            alphaTo = this.hoverAlpha;
        }
    }

    if( alphaTo !== this.graphics.alpha )
    {
        TweenLite.to( this.graphics , FAST_TRANSITION_TIME , {alpha: alphaTo } );
    }
};
