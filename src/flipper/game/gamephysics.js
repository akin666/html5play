
var PHYSICS_STATIC = 0;
var PHYSICS_DYNAMIC = 1;
var PHYSICS_KINEMATIC = 2;

// Physics filtering categories, feel free to invent more.
var PHYSICS_CATEGORY_NO_COLLISION = 0x0000;
var PHYSICS_CATEGORY_DEFAULT =      0x0001;
var PHYSICS_CATEGORY_WORLD =        0x0002;
var PHYSICS_CATEGORY_ITEMS =        0x0004;
var PHYSICS_CATEGORY_GAME_OBJECT =  0x0008;
var PHYSICS_CATEGORY_PLAYER =       0x0010;
var PHYSICS_CATEGORY_MONSTER =      0x0020;
var PHYSICS_CATEGORY_SCENERY =      0x0040;
var PHYSICS_CATEGORY_ALL = PHYSICS_CATEGORY_DEFAULT | 
                            PHYSICS_CATEGORY_WORLD | 
                            PHYSICS_CATEGORY_ITEMS | 
                            PHYSICS_CATEGORY_GAME_OBJECT | 
                            PHYSICS_CATEGORY_PLAYER | 
                            PHYSICS_CATEGORY_MONSTER | 
                            PHYSICS_CATEGORY_SCENERY;

function GamePhysics( scaling , gravityX , gravityY )
{
    this.scaling = scaling;
    this.fps = PHYSICS_FPS;
    this.stepSeconds = 1.0 / this.fps;
    this.stepTime = this.stepSeconds * 1000;
    this.remainingTime = 0;
    
    this.gravity = new box2d.Vec2( gravityX , gravityY );
    
    var allowSleep = true;
    this.world = new box2d.World( this.gravity , allowSleep );
    
    this.border = [];
    
    this.debugCanvas = null;
    this.debugDraw = null;
    this.materials = [];
    this.addMaterial( "default" , 1.0 , 0.5 , 0.2 );
    
    // Make listener..
    this.listener = new box2d.ContactListener;
    
    var that = this;
    this.listener.BeginContact = function ( contact ) {
        var aUserData = contact.GetFixtureA().GetBody().GetUserData();
        var bUserData = contact.GetFixtureB().GetBody().GetUserData();
        
        // the dead do not speak
        if( (!aUserData.alive) || (!bUserData.alive) )
        {
            return;
        }
        
        var worldManifold = new box2d.WorldManifold();
        contact.GetWorldManifold( worldManifold );

        //now you can use these properties for whatever you need
        var x = worldManifold.m_points[0].x * that.scaling;
        var y = worldManifold.m_points[0].y * that.scaling;
        var nx = worldManifold.m_normal.x;
        var ny = worldManifold.m_normal.y;
        
        if( aUserData !== null )
        {
            aUserData.beginContactWith( bUserData , x , y , nx , ny );
        }
        if( bUserData !== null )
        {
            bUserData.beginContactWith( aUserData , x , y , nx , ny );
        }
    }
    this.listener.EndContact = function ( contact ) {
        var aUserData = contact.GetFixtureA().GetBody().GetUserData();
        var bUserData = contact.GetFixtureB().GetBody().GetUserData();
        
        // the dead do not speak
        if( (!aUserData.alive) || (!bUserData.alive) )
        {
            return;
        }
        
        if( aUserData !== null )
        {
            aUserData.endContactWith( bUserData );
        }
        if( bUserData !== null )
        {
            bUserData.endContactWith( aUserData );
        }
    }
    this.listener.PreSolve = function ( contact , oldManifold ) {
    }
    this.listener.PostSolve = function ( contact , impulse ) {
    }
    
    this.world.SetContactListener( this.listener );
}

GamePhysics.prototype.destruct = function()
{
    this.destroyBorder();
};

GamePhysics.prototype.destroyBorder = function()
{
    for( ; this.border.length < 4 ; )
    {
        this.border.destruct();
    }
};

GamePhysics.prototype.setupBorder = function( x , y , width , height )
{
    for( ; this.border.length < 4 ; )
    {
        this.border.push( new GamePhysicsObject( this ) );
    }
    
    var size = 10;
    
    var hsize = size/2;
    var hwidth = width / 2;
    var hheight = height / 2;
    
    var fixDef = new box2d.FixtureDef();
    fixDef.density = 1.0;           // weight?
    fixDef.friction = 0.5;          // will it stop?
    fixDef.restitution = 0.2;       // bouncyness
    
    // Vars
    var top = this.border[0];
    var bottom = this.border[1];
    var left = this.border[2];
    var right = this.border[3];
    
    top.setup(
            PHYSICS_STATIC , 
            x + hwidth , 
            y + -hsize , 
            0 , 
            0 , 
            0.01 , 
            true , 
            false
        );
    top.addBox( width + 2*size , size , fixDef );
    
    bottom.setup(
            PHYSICS_STATIC , 
            x + hwidth , 
            y + height + hsize, 
            0 , 
            0 , 
            0.01 , 
            true , 
            false
        );
    bottom.addBox( width + 2*size , size , fixDef );
    
    left.setup(
            PHYSICS_STATIC , 
            x + -hsize , 
            y + hheight, 
            0 , 
            0 , 
            0.01 , 
            true , 
            false
        );
    left.addBox( size , height , fixDef );
    
    right.setup(
            PHYSICS_STATIC , 
            x + width + hsize , 
            y + hheight, 
            0 , 
            0 , 
            0.01 , 
            true , 
            false
        );
    right.addBox( size , height , fixDef );
};

GamePhysics.prototype.addMaterial = function( name , density , friction , restitution )
{
    var fixDef = new box2d.FixtureDef; 
    
    fixDef.density = density;           // weight?
    fixDef.friction = friction;         // will it stop?
    fixDef.restitution = restitution;   // bouncyness
    
    this.materials[ name ] = fixDef;
};

GamePhysics.prototype.update = function( ms )
{
    this.remainingTime += ms;
    
    // we do not simulate too much.
    if( this.remainingTime > 500 )
    {
        LOG.error("Physics skipping " + ( this.remainingTime - 500 ) + " milliseconds of simulation." );
        this.remainingTime = 500;
    }
    
    for( ; this.remainingTime >= this.stepTime ; this.remainingTime -= this.stepTime )
    {
        var velocityIterations = 8;
        var positionIterations = 3;
        this.world.Step( this.stepSeconds , velocityIterations , positionIterations );
    }
    
    if( this.debugDraw !== null )
    {
        this.world.DrawDebugData(); 
    }
    this.world.ClearForces();
};

GamePhysics.prototype.setDebugDraw = function( width , height )
{
    if( this.debugDraw !== null )
    {
        return;
    }
    if( this.debugCanvas === null )
    {
        this.debugCanvas = document.createElement('canvas');
        div = document.body; 
        this.debugCanvas.id = "debug_canvas";
        this.debugCanvas.width  = width;
        this.debugCanvas.height = height;
        this.debugCanvas.style.zIndex   = 8;
        this.debugCanvas.style.position = "absolute";
        this.debugCanvas.style.border   = "1px solid";
        this.debugCanvas.style.top = SCREEN.height + 'px';
        div.appendChild( this.debugCanvas );   
    }
    
    this.debugDraw = new box2d.DebugDraw(); 
    this.debugDraw.SetSprite( this.debugCanvas.getContext("2d" ) ); 
    this.debugDraw.SetDrawScale( this.scaling ); 
    this.debugDraw.SetFillAlpha( 0.5 ); 
    this.debugDraw.SetLineThickness( 1.0 ); 
    this.debugDraw.SetFlags( 
            box2d.DebugDraw.e_shapeBit | 
            box2d.DebugDraw.e_jointBit 
        ); 
    this.world.SetDebugDraw( this.debugDraw ); 
};           
