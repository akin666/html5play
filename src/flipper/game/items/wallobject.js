
function WallObject( gamephysics , world , data , eventmanager )
{
    GameObject.call( this , gamephysics , world , eventmanager );
    
    var polygons = data.polygons;
    
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
    fixDef.filter.maskBits = PHYSICS_CATEGORY_ALL & (~PHYSICS_CATEGORY_GAME_OBJECT);
    
    for( var i = 0 ; i < polygons.length ; ++i )
    {
        this.physics.addChain( polygons[i] , fixDef );
    }
    this.physics.setUserData( this );
}

WallObject.prototype = new GameObject();
WallObject.prototype.constructor = WallObject;

WallObject.prototype.getName = function()
{
    return "wall";
};

WallObject.prototype.update = function( ms )
{
};

WallObject.prototype.beginContactWith = function( another , x , y , nx , ny )
{
    if( another.getName() === "ball" )
    {
        var gameevent = new GameEvent();
        gameevent.type = WALL_HIT;
        sendGameEvent( gameevent );

        return true;
    }
            
    return true;
};

WallObject.prototype.endContactWith = function( another )
{
    return true;
};
