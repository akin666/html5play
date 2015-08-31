
function DataManager()
{
}

DataManager.prototype.setToClipboard = function( text )
{
    window.prompt ("Copy to clipboard: Ctrl+C or Cmd+C, Enter. WARNING! Does not work on all systems properly.", text);
    // chrome seems to add BULLSHIT inside the text.. 
    // knowing apple, apple might do the same thing (even crash if containing arabic letters) ((talk about pathetic))
    LOG.print("Copy to clipboard: " + text );
};

DataManager.prototype.getFromClipboard = function()
{
    var text = window.prompt ("Paste from clipboard: Ctrl+V or Cmd+V, Enter" , "" );
    return text;
};

DataManager.prototype.save = function( name , data )
{
    // TODO real server interaction
    this.setToClipboard( data );
};

DataManager.prototype.load = function( name )
{
    // TODO real server interaction
    return this.getFromClipboard();
};

