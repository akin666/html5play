
var MAIN_TIME = new Date();

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

function mainLoop() {
        if( !KEEP_RUNNING )
        {
            return;
        }
        
	setTimeout( 
            function() 
            {
		requestAnimationFrame( mainLoop );
		var time2 = new Date();
                
                var delta =  time2 - MAIN_TIME;
                CURRENT_FPS = Math.round( 1000 / delta );
                
                
                if( DEBUG_MODE )
                {
                    //STATS.begin();
                }
                
                // update logic
                STATE.update( delta );
                
                // pain screen
                STATE.paint();
                
                if( DEBUG_MODE )
                {
                    //STATS.end();
                }
                
		MAIN_TIME = time2;
            }, 
            1000 / TARGET_FPS 
        );
}

mainLoop();
