IRIS.Line3DZone = IRIS.Vector3Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this.toX = IRIS._setterUndef(opts.toX,1);
        this.toY = IRIS._setterUndef(opts.toY,1);
        this.toZ = IRIS._setterUndef(opts.toZ,1);
        this._start = new IRIS.Vector3(this.x, this.y, this.z);
        this._end = new IRIS.Vector3(this.toX, this.toY, this.toZ);
        this._len = this._end.clone().sub(this._start);
        this._stepVector = 0;
    },
    getStep: function() {
        var len = this._len.clone();
        if (this.pattern == IRIS.ZONE_PATTERN_RANDOM)
            len.mul(Math.random());
        else {
            len.mul(this._stepVector)
            this._stepVector += this.step;
        }
        return len.add(this._start).mul(this.scale);
    }
});

IRIS.registerZone(IRIS.Line3DZone, IRIS.ZONE_TYPE_LINE_3D);
