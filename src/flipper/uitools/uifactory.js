
function UIFactory()
{
}

UIFactory.prototype.createButton = function( name , color , fontcolor , action )
{
    var button = new UIToolButton( name , 18 , fontcolor , color , action );
    return button;
};

UIFactory.prototype.createText = function( name , color )
{
    var text = new UIText( name , 18 , color );
    return text;
};

UIFactory.prototype.createCheckBox = function( name , color , checked )
{
    var cbox = new UICheckBox( name , 18 , color , checked );
    return cbox;
};

