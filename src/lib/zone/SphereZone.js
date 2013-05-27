IRIS.SphereZone = IRIS.Vector3Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this.radius = IRIS._setterUndef(opts.radius,1);
        this._stepVector = 0;
    },
    getStep: function() {
        if (this.pattern == IRIS.ZONE_PATTERN_RANDOM) {
            var theta = Math.PI * 2 * Math.random();
            var phi = theta;
        } else {
            var theta = this._stepVector;
            var phi = this._stepVector;
            this._stepVector += this.step;
        }
        return new IRIS.Vector3(this.radius * Math.cos(phi) * Math.sin(theta) * this.scale + this.x,
                                this.radius * Math.sin(phi) * Math.sin(theta) * this.scale + this.y,
                                this.radius * Math.cos(theta) * this.scale + this.z);
    }
});

IRIS.registerZone(IRIS.SphereZone, IRIS.ZONE_TYPE_SPHERE);
