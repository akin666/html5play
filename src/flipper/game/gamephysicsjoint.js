
function GamePhysicsJoint( gamephysics )
{
    this.gamephysics = gamephysics;
    this.joint = null;
}

GamePhysicsJoint.prototype.destruct = function()
{
    if( this.joint === null )
    {
        return;
    }
    this.gamephysics.world.DestroyJoint( this.joint );
    this.joint = null;
};

GamePhysicsJoint.prototype.getAngle = function()
{
    if( this.joint === null || this.joint.GetJointAngle === undefined )
    {
        return 0;
    }
    return this.joint.GetJointAngle();
};


GamePhysicsJoint.prototype.setupJoint = function( jointdef )
{
    this.destruct();
    this.joint = this.gamephysics.world.CreateJoint( jointdef );
};

GamePhysicsJoint.prototype.setupRevolute = function( bodyA , bodyB , anchorA , anchorB )
{
    var jointDef = new box2d.RevoluteJointDef();
    
    var va = new box2d.Vec2( anchorA.x / this.gamephysics.scaling , anchorA.y / this.gamephysics.scaling );
    var vb = new box2d.Vec2( anchorB.x / this.gamephysics.scaling , anchorB.y / this.gamephysics.scaling );
    
    jointDef.bodyA = bodyA.body;
    jointDef.bodyB = bodyB.body;
    
    jointDef.collideConnected = false;
    jointDef.localAnchorA.Set( va.x , va.y );
    jointDef.localAnchorB.Set( vb.x , vb.y );
    
    this.setupJoint( jointDef );
};

GamePhysicsJoint.prototype.setupRevoluteRanged = function( bodyA , bodyB , anchorA , anchorB , lower , upper )
{
    var jointDef = new box2d.RevoluteJointDef();
    
    var va = new box2d.Vec2( anchorA.x / this.gamephysics.scaling , anchorA.y / this.gamephysics.scaling );
    var vb = new box2d.Vec2( anchorB.x / this.gamephysics.scaling , anchorB.y / this.gamephysics.scaling );
    
    jointDef.bodyA = bodyA.body;
    jointDef.bodyB = bodyB.body;
    
    jointDef.collideConnected = false;
    jointDef.localAnchorA.Set( va.x , va.y );
    jointDef.localAnchorB.Set( vb.x , vb.y );
    
    jointDef.lowerAngle = lower;
    jointDef.upperAngle = upper;
    jointDef.enableLimit = true;
    jointDef.referenceAngle = Math.PI * 0.25;
    
    this.setupJoint( jointDef );
};

GamePhysicsJoint.prototype.setupDistance = function( bodyA , bodyB , anchorA , anchorB , distance , collideConnected , freq , ratio )
{
    var jointDef = new box2d.DistanceJointDef();
    
    var va = new box2d.Vec2( anchorA.x / this.gamephysics.scaling , anchorA.y / this.gamephysics.scaling );
    var vb = new box2d.Vec2( anchorB.x / this.gamephysics.scaling , anchorB.y / this.gamephysics.scaling );
    
    jointDef.bodyA = bodyA.body;
    jointDef.bodyB = bodyB.body;
    //connect the centers - center in local coordinate - relative to body is 0,0
    jointDef.localAnchorA = va;
    jointDef.localAnchorB = vb;
    //length of joint
    jointDef.length = distance / this.gamephysics.scaling;
    //jointDef.Initialize( bodyA.body , bodyB.body , va , vb );
    
    if( collideConnected !== undefined )
    {
        jointDef.collideConnected = collideConnected;
    }
    if( freq !== undefined )
    {
        jointDef.frequencyHz = freq; // 4.0
    }
    if( ratio !== undefined )
    {
        jointDef.dampingRatio = ratio; // 0.5
    }
    
    this.setupJoint( jointDef );
};

// 20? shrug..
GamePhysicsJoint.prototype.setMotorTorgue = function( torgue )
{
    if( this.joint === undefined || this.joint === null )
    {
        return;
    }
    this.joint.SetMaxMotorTorque( torgue );
};

GamePhysicsJoint.prototype.getMotorTorgue = function()
{
    if( this.joint === undefined || this.joint === null )
    {
        return 0;
    }
    return this.joint.GetMotorTorque();
};

// 360 * DEGTORAD; // 1 round / second. 
GamePhysicsJoint.prototype.setMotorSpeed = function( speed )
{
    if( this.joint === undefined || this.joint === null )
    {
        return;
    }
    this.joint.SetMotorSpeed( speed );
};

GamePhysicsJoint.prototype.getMotorSpeed = function()
{
    if( this.joint === undefined || this.joint === null )
    {
        return 0;
    }
    return this.joint.GetMotorSpeed();
};

GamePhysicsJoint.prototype.setMotorActive = function( state )
{
    if( this.joint === undefined || this.joint === null )
    {
        return;
    }
    this.joint.EnableMotor( state );
};

GamePhysicsJoint.prototype.getMotorActive = function()
{
    if( this.joint === undefined || this.joint === null )
    {
        return false;
    }
    return this.joint.IsMotorEnabled();
};

GamePhysicsJoint.prototype.getReactionTorque = function( inv_dt )
{
    if( this.joint === undefined || this.joint === null )
    {
        return 0;
    }
    return this.joint.GetReactionTorque( inv_dt );
};

GamePhysicsJoint.prototype.getReactionForce = function( inv_dt )
{
    if( this.joint === undefined || this.joint === null )
    {
        return 0;
    }
    return this.joint.GetReactionForce( inv_dt );
};

