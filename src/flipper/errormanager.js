
function ErrorManager()
{
}

ErrorManager.prototype.handle = function( text )
{
    switchState( new ErrorState( text ) );
};

ErrorManager.prototype.handleSevere = function( text )
{
    KEEP_RUNNING = false;
    
    purgeAll();
    
    var txt = "There was a serious error.\n" + "description: " + text + "\n\n" + "We are sorry for this.\nThe application cannot continue.";
    alert( txt );
};
