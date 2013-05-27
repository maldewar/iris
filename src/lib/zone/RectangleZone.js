IRIS.RectangleZone = IRIS.VertexZone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this.lengthX = IRIS._setterUndef(opts.lengthX, 1);
        this.lengthY = IRIS._setterUndef(opts.lengthY, 1);
        var vertices = [
            {x: this.x + this.lengthX/2, y: this.y + this.lengthY/2},
            {x: this.x - this.lengthX/2, y: this.y + this.lengthY/2},
            {x: this.x - this.lengthX/2, y: this.y - this.lengthY/2},
            {x: this.x + this.lengthX/2, y: this.y - this.lengthY/2},          
        ];
        this.setVertices(vertices);
    },
    getStep: function() {
        return this._super();
    }
});

IRIS.registerZone(IRIS.RectangleZone, IRIS.ZONE_TYPE_RECTANGLE);
