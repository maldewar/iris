IRIS.Line2DZone = IRIS.Vector2Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this.toX = IRIS._setterUndef(opts.toX,1);
        this.toY = IRIS._setterUndef(opts.toY,1);
        if (this.plane) {
            this._start = this._vector2ToPlane(this.x, this.y, this.plane);
            this._end = this._vector2ToPlane(this.toX, this.toY, this.plane);
        } else {
            this._start = new IRIS.Vector2(this.x, this.y);
            this._end = new IRIS.Vector2(this.toX, this.toY);
        }
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

IRIS.registerZone(IRIS.Line2DZone, IRIS.ZONE_TYPE_LINE_2D);
