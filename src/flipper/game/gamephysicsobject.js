
function GamePhysicsObject( gamephysics )
{
    this.gamephysics = gamephysics;
    this.body = null;
}

GamePhysicsObject.prototype.destruct = function()
{
    if( this.body === null )
    {
        return;
    }
    this.gamephysics.world.DestroyBody( this.body );
    this.body = null;
};

GamePhysicsObject.prototype.setFixedRotation = function( fixedrotation )
{
    if( this.body === null )
    {
        return;
    }
    
    this.body.SetFixedRotation( fixedrotation );
};

GamePhysicsObject.prototype.setup = function( bodytype , positionX , positionY , angle , linearDamping , angularDamping , active , bullet )
{
    // create new body, kill old.
    this.destruct();
    
    var bodyDef = new box2d.BodyDef(); 
    
    switch( bodytype )
    {
        case PHYSICS_STATIC :
            bodyDef.type = box2d.Body.b2_staticBody;
            break;
        case PHYSICS_DYNAMIC :
            bodyDef.type = box2d.Body.b2_dynamicBody;
            break;
        case PHYSICS_CINEMATIC :
            bodyDef.type = box2d.Body.b2_kinematicBody;
            break;
        default:
            break;
    }
    
    bodyDef.active = active;
    bodyDef.bullet = bullet;
    
    bodyDef.angle = angle; // radians
    
    bodyDef.position.x = positionX / this.gamephysics.scaling; 
    bodyDef.position.y = positionY / this.gamephysics.scaling;
    
    bodyDef.linearDamping = linearDamping;
    bodyDef.angularDamping = angularDamping;
    
    this.body = this.gamephysics.world.CreateBody( bodyDef );
};

GamePhysicsObject.prototype.setPositionAndAngle = function( point , radian )
{
    if( this.body === null || point === null || radian === null )
    {
        LOG.error("no body created, no point set or no radian set, cannot set position and angle.");
        return;
    }
    
    var b2pos = new box2d.Vec2( point.x / this.gamephysics.scaling , point.y / this.gamephysics.scaling );
    this.body.SetPositionAndAngle( b2pos , radian );
};

GamePhysicsObject.prototype.setPosition = function( point )
{
    if( this.body === null || point === null )
    {
        LOG.error("no body created or no point set, cannot set position.");
        return;
    }
    
    var b2pos = new box2d.Vec2( point.x / this.gamephysics.scaling , point.y / this.gamephysics.scaling );
    this.body.SetPosition( b2pos );
};

GamePhysicsObject.prototype.getPosition = function()
{
    if( this.body === null )
    {
        LOG.error("no body created, cannot get position.");
        return null;
    }
    
    var b2pos = this.body.GetPosition();
    return new PIXI.Point( b2pos.x * this.gamephysics.scaling , b2pos.y * this.gamephysics.scaling );
};

GamePhysicsObject.prototype.setAngle = function( radian )
{
    if( this.body === null || point === null )
    {
        LOG.error("no body created or no radian set, cannot set angle.");
        return;
    }
    this.body.SetAngle( radian );
};

GamePhysicsObject.prototype.getAngle = function()
{
    if( this.body === null )
    {
        LOG.error("no body created, cannot get angle.");
        return null;
    }
    return this.body.GetAngle();
};

GamePhysicsObject.prototype.setUserData = function( data )
{
    if( this.body === null )
    {
        LOG.error("no body created, cannot set userdata.");
        return;
    }
    this.body.SetUserData( data );
};

GamePhysicsObject.prototype.getUserData = function()
{
    if( this.body === null )
    {
        LOG.error("no body created, cannot get userdata.");
        return null;
    }
    return this.body.GetUserData();
};

GamePhysicsObject.prototype.setBullet = function( bullet )
{
    if( this.body === null )
    {
        return;
    }
    this.body.setBullet( bullet );
};

GamePhysicsObject.prototype.isBullet = function()
{
    if( this.body === null )
    {
        return false;
    }
    return this.body.isBullet();
};

GamePhysicsObject.prototype.setFixedRotation = function( fr )
{
    if( this.body === null )
    {
        return;
    }
    this.body.setFixedRotation( fr );
};

GamePhysicsObject.prototype.isFixedRotation = function()
{
    if( this.body === null )
    {
        return false;
    }
    return this.body.isFixedRotation();
};

GamePhysicsObject.prototype.wakeUp = function()
{
    this.body.SetAwake( true );
};

GamePhysicsObject.prototype.applyImpulse = function( force , point )
{
    var bforce = new box2d.Vec2( force.x , force.y );
    var boxv = new box2d.Vec2( point.x / this.gamephysics.scaling , point.y / this.gamephysics.scaling );
   
    this.body.ApplyImpulse( bforce , boxv );
};

GamePhysicsObject.prototype.applyForce = function( force , point )
{
    var bforce = new box2d.Vec2( force.x , force.y );
    var boxv = new box2d.Vec2( point.x / this.gamephysics.scaling , point.y / this.gamephysics.scaling );
   
    this.body.ApplyForce( bforce , boxv );
};

GamePhysicsObject.prototype.setLinearVelocity = function( force )
{
    var bforce = new box2d.Vec2( force.x , force.y );
    
    // body does not awaken automatically, so we set it.
    this.body.SetAwake( true );
    this.body.SetLinearVelocity( bforce );
};

GamePhysicsObject.prototype.addCircle = function( radius , fixDef )
{
    if( fixDef === null )
    {
        LOG.error("Fixture is null, cannot create.");
        return;
    }
    fixDef.shape = new box2d.CircleShape( radius / this.gamephysics.scaling );
    this.body.CreateFixture( fixDef );
    fixDef.shape = null;
};

GamePhysicsObject.prototype.addBox = function( width , height , fixDef )
{
    if( fixDef === null )
    {
        LOG.error("Fixture is null, cannot create.");
        return;
    }
    fixDef.shape = new box2d.PolygonShape();
    fixDef.shape.SetAsBox( width / 2 / this.gamephysics.scaling , height / 2 / this.gamephysics.scaling );
    this.body.CreateFixture( fixDef );
    fixDef.shape = null;
};

GamePhysicsObject.prototype.addPolygon = function( polygon , fixDef )
{
    if( fixDef === null )
    {
        LOG.error("Fixture is null, cannot create.");
        return;
    }
    
    // scaling conversion..
    // at the same time, reverse CCW to CW 
    var newarray = [];
    if( polygonWindingOrderCW( polygon ) )
    {
        for( var i = 0 ; i < polygon.length ; ++i )
        {
            var point = polygon[i];
            newarray.push( new box2d.Vec2( point.x / this.gamephysics.scaling , point.y / this.gamephysics.scaling ) );
        }
    }
    else // reverse the array
    {
        for( var i = polygon.length-1 ; i >= 0 ; --i )
        {
            var point = polygon[i];
            newarray.push( new box2d.Vec2( point.x / this.gamephysics.scaling , point.y / this.gamephysics.scaling ) );
        }
    }
    
    // Must be CW .. or something, documentation talks about CCW but.. 
    fixDef.shape = new box2d.PolygonShape();
    fixDef.shape.SetAsArray( newarray , newarray.length );
    this.body.CreateFixture( fixDef );
    fixDef.shape = null;
};

GamePhysicsObject.prototype.addEdge = function( pointa , pointb , fixDef )
{
    if( fixDef === null )
    {
        LOG.error("Fixture is null, cannot create.");
        return;
    }
    
    var v1 = new box2d.Vec2( pointa.x / this.gamephysics.scaling , pointa.y / this.gamephysics.scaling );
    var v2 = new box2d.Vec2( pointb.x / this.gamephysics.scaling , pointb.y / this.gamephysics.scaling );
    
    fixDef.shape = new box2d.PolygonShape();
    fixDef.shape.SetAsEdge( v1 , v2 );
    this.body.CreateFixture( fixDef );
    fixDef.shape = null;
};

GamePhysicsObject.prototype.addChain = function( polygon , fixDef )
{
    // JS not supporting chains.. :(
    // also edge shapes are buggy.. https://code.google.com/p/box2dweb/issues/detail?id=31 over a year open issue..
    // <3 I am not gonna say anything about performance of this thing.
    // lets make the chain from 1 width blocks..
    if( fixDef === null )
    {
        LOG.error("Fixture is null, cannot create.");
        return;
    }
    
    if( polygon.length < 2 )
    {
        return;
    }
    
    var v1 = new box2d.Vec2( polygon[0].x / this.gamephysics.scaling , polygon[0].y / this.gamephysics.scaling );
    var v2 = new box2d.Vec2( polygon[0].x / this.gamephysics.scaling , polygon[0].y / this.gamephysics.scaling );
    
    fixDef.shape = new box2d.PolygonShape();
    for( var i = 1 ; i < polygon.length ; ++i )
    {
        v1.x = polygon[i].x / this.gamephysics.scaling;
        v1.y = polygon[i].y / this.gamephysics.scaling;
        
        fixDef.shape.SetAsEdge( v1 , v2 );
        this.body.CreateFixture( fixDef );
        
        v2.x = v1.x;
        v2.y = v1.y;
    }
    v1.x = polygon[0].x / this.gamephysics.scaling;
    v1.y = polygon[0].y / this.gamephysics.scaling;
    
    fixDef.shape.SetAsEdge( v1 , v2 );
    this.body.CreateFixture( fixDef );
    
    fixDef.shape = null;
};
