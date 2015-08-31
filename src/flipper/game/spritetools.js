
var SPRITE_STATE_DEAD = 0;
var SPRITE_STATE_ALIVE = 1;
var SPRITE_STATE_DYING = 2;

function SpriteObjectData()
{
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.rotation = 0;
    this.alpha = 1;
};

SpriteObjectData.prototype.copyFrom = function( other )
{
    this.x = other.x;
    this.y = other.y;
    this.scale = other.scale;
    this.rotation = other.rotation;
    this.alpha = other.alpha;
};

function SpriteObject()
{
    this.state = SPRITE_STATE_ALIVE;
    this.life = 0;
    this.current = new SpriteObjectData();
    this.speed = new SpriteObjectData();
    this.scaleMultiplier = 1.0;
    
    this.graphics = null;
}

function Span( a , b )
{
    this.a = a;
    this.b = b;
};

Span.prototype.random = function()
{
    return (Math.random() * (this.b - this.a) ) + this.a;
};

function Duration( a , b , time )
{
    this.a = a;
    this.b = b;
    this.time = time;
};

