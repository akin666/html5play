
var AUDIOPLAYER_NONE = 0;
var AUDIOPLAYER_LOADING = 1;
var AUDIOPLAYER_COMPLETE = 2;
var AUDIOPLAYER_PLAYING = 3;
var AUDIOPLAYER_ERROR = 4;

function AudioPlayer()
{
    this.path = "";
    this.audio = null;
    this.state = AUDIOPLAYER_NONE;
    this.volume = 1.0;
}

AudioPlayer.prototype.load = function( path )
{
    var that = this;
    
    this.state = AUDIOPLAYER_LOADING;
    this.path = path;
    
    this.audio = new Audio();
    
    // Audio loaded & audio errors..
    this.audio.addEventListener( 
        'canplaythrough' , 
        function() { 
            if( that === undefined )
            {
                LOG.error("that is undefined!");
                return;
            }
            that.state = AUDIOPLAYER_COMPLETE;
            if( that.onLoadComplete !== undefined )
            {
                that.onLoadComplete();
            }
        } , 
        false );
    this.audio.onerror = function() { 
            if( that === undefined )
            {
                LOG.error("that is undefined!");
                return;
            }
            that.state = AUDIOPLAYER_ERROR;
            if( that.onLoadError !== undefined )
            {
                that.onLoadError();
            }
        };
    this.audio.addEventListener(
        "ended", 
        function() {
            if( that === undefined )
            {
                LOG.error("that is undefined!");
                return;
            }
            that.state = AUDIOPLAYER_COMPLETE;
            if( that.onPlayComplete !== undefined )
            {
                that.onPlayComplete();
            }
            that.audio.currentTime = 0;
            if( !that.audio.loop )
            {
                that.audio.pause();
            }
           }
       );
    this.audio.src = this.path;
};

AudioPlayer.prototype.onLoadComplete = function()
{
};

AudioPlayer.prototype.onLoadError = function()
{
};

AudioPlayer.prototype.onPlayComplete = function()
{
};

AudioPlayer.prototype.setVolume = function( vol , s )
{
    this.volume = vol;
    if( this.audio !== null )
    {
        if( s === undefined || s === 0 )
        {
            this.audio.volume = this.volume;
        }
        else
        {
            TweenLite.to( this.audio , s , {volume: this.volume} );
        }
    }
};

AudioPlayer.prototype.getPath = function()
{
    return this.path;
};

AudioPlayer.prototype.play = function( s )
{
    if( NO_AUDIO )
    {
        return;
    }
    
    //if( !this.audio.ended ) How could they fckup even this simple feature.. jeez..
    if( this.state === AUDIOPLAYER_PLAYING )
    {
        return;
    }
    this.state = AUDIOPLAYER_PLAYING;
    
    if( s === undefined || s === 0 )
    {
        this.audio.volume = this.volume;
    }
    else
    {
        this.audio.volume = 0.0;
        TweenLite.to( this.audio , s , {volume: this.volume} );
    }
    this.audio.play();
};

AudioPlayer.prototype.playAt = function( at , s )
{
    if( NO_AUDIO )
    {
        return;
    }
    
    this.state = AUDIOPLAYER_PLAYING;
    if( s === undefined || s === 0 )
    {
        this.audio.volume = this.volume;
    }
    else
    {
        this.audio.volume = 0.0;
        TweenLite.to( this.audio , s , {volume: this.volume} );
    }
    this.audio.currentTime = at;
    this.audio.play();
};

AudioPlayer.prototype.pause = function()
{
    if( s === undefined || s === 0 )
    {
        this.audio.pause();
        this.state = AUDIOPLAYER_COMPLETE;
        return;
    }
    
    var that = this;
    TweenLite.to( 
            this.audio , 
            s , 
            {
                volume: 0.0,
                onComplete: 
                    function() 
                    {
                        if( that === undefined )
                        {
                            return;
                        }
                        that.pause();
                    } 
            } 
        );
};

AudioPlayer.prototype.stop = function( s )
{
    if( s === undefined || s === 0 )
    {
        this.audio.pause();
        this.state = AUDIOPLAYER_COMPLETE;
        this.audio.currentTime = 0;
        return;
    }
    
    var that = this;
    TweenLite.to( 
            this.audio , 
            s , 
            {
                volume: 0.0,
                onComplete: 
                    function() 
                    {
                        if( that === undefined )
                        {
                            return;
                        }
                        that.stop();
                    } 
            } 
        );
};

AudioPlayer.prototype.rewind = function( s )
{
    this.audio.currentTime = s;
};

AudioPlayer.prototype.setLoop = function( state )
{
    this.audio.loop = state;
};
