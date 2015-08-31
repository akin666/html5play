
LOG = new Log();
UIFACTORY = new UIFactory();
ERRORMANAGER = new ErrorManager();
DATAMANAGER = new DataManager();

SCREEN = new Screen();
STATE = new SplashState();
AUDIOMANAGER = new AudioManager();

KEEP_RUNNING = true;

window.onresize = function( event ) 
{
    if( STATE !== null )
    {
        STATE.resize( event );
    }
    if( SCREEN !== null )
    {
        SCREEN.resize( event );
    }
}

function purgeAll()
{
    if( SCREEN !== null) 
    {
        SCREEN.detach();
    }
    SCREEN = null;
    STATE = null;
}

function createStats() 
{
    STATS = new Stats();
    STATS.setMode(2);
    STATS.domElement.style.position = 'absolute';
    STATS.domElement.style.left = '0px';
    STATS.domElement.style.top = '0px';
    
    var debugbox = document.getElementById("debug_box");
    debugbox.appendChild( STATS.domElement );
}

if( DEBUG_MODE )
{
    //createStats();
}