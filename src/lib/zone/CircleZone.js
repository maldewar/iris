IRIS.CircleZone = IRIS.Vector2Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this.radius = IRIS._setterUndef(opts.radius,1);
        this._stepVector = 0;
    },
    getStep: function() { //TODO: call the parent getStep first by default and the onStepEvent there.
        if (this.pattern == IRIS.ZONE_PATTERN_RANDOM)
            var theta = Math.PI * 2 * Math.random();
        else {
            var theta = this._stepVector;
            this._stepVector += this.step;
        }
        var x = this.radius * Math.cos(theta) * this.scale;
        var y = this.radius * Math.sin(theta) * this.scale;
        if (this.plane)
            var step = this._vector2ToPlane(x, y, this.plane);
        else 
            var step = new IRIS.Vector2(x,y);
        step.x += this.x;
        step.y += this.y;
        step.z += this.z;
        if (IRIS._isFn(this.onStep)) //TODO: move this to parent.
            this.onStep();
        return step;
    }
});

IRIS.registerZone(IRIS.CircleZone, IRIS.ZONE_TYPE_CIRCLE);
