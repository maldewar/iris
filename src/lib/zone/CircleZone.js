IRIS.CircleZone = IRIS.Vector2Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this.radius = IRIS._setterUndef(opts.radius,1);
        this._stepVector = 0;
    },
    getStep: function() {
        if (this.pattern == IRIS.ZONE_PATTERN_RANDOM)
            var theta = Math.PI * 2 * Math.random();
        else {
            var theta = this._stepVector;
            this._stepVector += this.step;
        }
        return new IRIS.Vector3(this.radius * Math.cos(theta) * this.scale + this.x, this.radius * Math.sin(theta) * this.scale + this.y, 0);
    }
});

IRIS.registerZone(IRIS.CircleZone, IRIS.ZONE_TYPE_LINE_2D);
