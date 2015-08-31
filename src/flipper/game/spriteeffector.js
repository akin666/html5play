
// Simple attractor / repulsor

function SpriteEffector( world )
{
    this.world = world;
    
    this.current = new SpriteObjectData();
    
    this.strength = 10;
}

SpriteEffector.prototype.update = function( ms )
{
};

SpriteEffector.prototype.setStrength = function( strength )
{
    this.strength = strength;
};

