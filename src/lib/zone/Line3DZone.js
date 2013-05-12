IRIS.Line3DZone = IRIS.Vector3Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this._start = new IRIS.Vector3(this.minX, this.minY, this.minZ);
        this._end = new IRIS.Vector3(this.maxX, this.maxY, this.maxZ);
        this._len = this._end.clone().sub(this._start);
    },
    getStep: function() {
        var len = this._len.clone();
        len.mul(Math.random());
        return len.add(this._start).mul(this.scale);
    }
});

IRIS.registerZone(IRIS.Line3DZone, 'line3D');
