
function ItemFactory()
{
}

ItemFactory.prototype.getList = function()
{
    var list = [];
    
    list.push( "bumper" );
    list.push( "right-pedal" );
    list.push( "left-pedal" );
    list.push( "launcher" );
    list.push( "coin" );
    list.push( "bonus" );
    
    return list;
};

ItemFactory.prototype.preload = function()
{
    var assets = [];
    assets.push( "gfx/right-pedal.png" );
    assets.push( "gfx/left-pedal.png" );
    assets.push( "gfx/launcher.png" );
    assets.push( "gfx/ball.png" );
    assets.push( "gfx/ball_shade.png" );
    assets.push( "gfx/coin.png" );
    assets.push( "gfx/particles/money.png" );
    assets.push( "gfx/bumper.png" );
    assets.push( "gfx/particles/sparky.png" );
    assets.push( "gfx/bonus.png" );
    assets.push( "gfx/particles/star.png" );
    
    
    var loader = new PIXI.AssetLoader( assets );
    var that = this;
    loader.onComplete = function() {
        if( that.loadComplete === undefined || that.loadComplete === null ) {
            return;
        }
        that.loadComplete();
    };
    
    loader.load();
};

ItemFactory.prototype.loadComplete = function()
{
};

ItemFactory.prototype.create = function( name , gamephysics , world , data , eventmanager )
{
    if( name == "bumper" )
    {
        return new BumperObject( gamephysics , world , data );
    }
    if( name == "right-pedal" )
    {
        return new RightPedalObject( gamephysics , world , data , eventmanager );
    }
    if( name == "left-pedal" )
    {
        return new LeftPedalObject( gamephysics , world , data , eventmanager );
    }
    if( name == "launcher" )
    {
        return new LauncherObject( gamephysics , world , data , eventmanager );
    }
    if( name == "ball" )
    {
        return new GameBall( gamephysics , world , data );
    }
    if( name == "coin" )
    {
        return new CoinObject( gamephysics , world , data );
    }
    if( name == "bonus" )
    {
        return new BonusObject( gamephysics , world , data );
    }
    
    return null;
};
