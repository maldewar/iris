SPARKS.UNIT_LINEAL = 0;
SPARKS.UNIT_RADIAN = 1;
SPARKS.UNIT_DEGREE = 2;

SPARKS.CircleZone = function(x, y, z, radius, options) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = radius;
    var opts = {
        random: true,
        startAt: 0,
        finishAt: (2*Math.PI),
        step: (2*Math.PI)/10,
        stepUnit: SPARKS.UNIT_RADIAN,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0
    };
    this.options = $.extend(opts,options);
    this.step = this.options.step;
};
SPARKS.CircleZone.prototype.getLocation = function() {
    if (this.options.random) {
        var theta = Math.PI *2  * SPARKS.Utils.random();
    } else {
        this.step += this.options.step;
        var theta = this.step;
    }
    var v =  SPARKS.VectorPool.get().set(this.r * Math.cos(theta) + this.x, this.r * Math.sin(theta) + this.y, this.z);
    v.__markedForReleased = true;
    return v;
};

SPARKS.SpringZone = function(x, y, z, radius, torqueStep, options) {
    var CircleZone = new SPARKS.CircleZone(x, y, z, radius, options);
    //$.extend(this,CircleZone);
    this.CircleZone = CircleZone;
    this.torqueStep = torqueStep;
    this.height = 0;
}
SPARKS.SpringZone.prototype.getLocation = function() {
    var position = this.CircleZone.getLocation();
    position.z = this.height;
    this.height += this.torqueStep;
    return position;
}
