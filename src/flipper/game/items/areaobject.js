
function AreaObject( gamephysics , world , data , eventmanager )
{
    GameObject.call( this , gamephysics , world , eventmanager );
    
    // object.name
    // object.points
    
    // save the world, we need it to destroy balls
    this.world = world;
    
    var polygons = data.points;
    this.name = data.name;
    
    this.physics = new GamePhysicsObject( this.gamephysics );
    this.physics.setup(
            PHYSICS_STATIC , 
            0 , 
            0 , 
            0 , 
            0 , 
            0.01 , 
            true , 
            false
        );
    
    var fixDef = new box2d.FixtureDef();
    fixDef.density = WALL_DENSITY;           // weight?
    fixDef.friction = WALL_FRICTION;          // will it stop?
    fixDef.restitution = WALL_RESTITUTION;       // bouncyness
    fixDef.filter.categoryBits = PHYSICS_CATEGORY_WORLD;
    fixDef.filter.maskBits = PHYSICS_CATEGORY_PLAYER;
    // make the physics to be just sensor.
    fixDef.isSensor = true; 
    
    this.physics.addPolygon( polygons , fixDef );
    this.physics.setUserData( this );
}

AreaObject.prototype = new GameObject();
AreaObject.prototype.constructor = AreaObject;

AreaObject.prototype.getName = function()
{
    return "area";
};

AreaObject.prototype.update = function( ms )
{
};

AreaObject.prototype.beginContactWith = function( another , x , y , nx , ny )
{
    // fail area logic.
    if( this.name === "fail" )
    {
        if( another.getName() === "ball" )
        {
            this.world.destroyBall( another );
            
            var gameevent = new GameEvent();
            gameevent.type = LOOSE_BALL;
            sendGameEvent( gameevent );
            
            return;
        }
    }
    // retry area logic.
    if( this.name === "retry" )
    {
        if( another.getName() === "ball" )
        {
            this.world.destroyBall( another );
            
            var gameevent = new GameEvent();
            gameevent.type = RETRY_BALL;
            sendGameEvent( gameevent );
            
            return;
        }
    }
    // extra points area logic.
    if( this.name === "extra" )
    {
        if( another.getName() === "ball" )
        {
            var gameevent = new GameEvent();
            gameevent.type = EXTRA_POINTS_AREA_START;
            sendGameEvent( gameevent );
            
            return;
        }
    }
};

AreaObject.prototype.endContactWith = function( another )
{
    // extra points area logic.
    if( this.name === "extra" )
    {
        if( another.getName() === "ball" )
        {
            var gameevent = new GameEvent();
            gameevent.type = EXTRA_POINTS_AREA_END;
            sendGameEvent( gameevent );
            
            return true;
        }
    }
    
    return true;
};
