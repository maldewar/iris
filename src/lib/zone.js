IRIS.ZONE_TYPE_LINE_2D = 'line2D';
IRIS.ZONE_TYPE_CIRCLE = 'circle';
IRIS.ZONE_TYPE_DISC = 'disc';
IRIS.ZONE_TYPE_SIN = 'sin';
IRIS.ZONE_TYPE_COS = 'cos';
IRIS.ZONE_TYPE_TAN = 'tan';
IRIS.ZONE_TYPE_SQUARE = 'square';
IRIS.ZONE_TYPE_RECTANGLE = 'rectangle';
IRIS.ZONE_TYPE_VERTEX = 'vertex';

IRIS.ZONE_TYPE_LINE_3D = 'line3D';
IRIS.ZONE_TYPE_SPHERE = 'sphere';
IRIS.ZONE_TYPE_BALL = 'ball';
IRIS.ZONE_TYPE_BOX = 'box';
IRIS.ZONE_TYPE_CUBE = 'cube';
IRIS.ZONE_TYPE_SPRING = 'spring';

IRIS.ZONE_PATTERN_RANDOM = 0;
IRIS.ZONE_PATTERN_LINEAL = 1;

IRIS.ZONE_PLANE_XY = 'xy';
IRIS.ZONE_PLANE_YX = 'yx';
IRIS.ZONE_PLANE_YZ = 'yz';
IRIS.ZONE_PLANE_ZY = 'zy';
IRIS.ZONE_PLANE_XZ = 'xz';
IRIS.ZONE_PLANE_ZX = 'zx';

IRIS.BaseVectorZone = Class.extend({
    init: function(opts) {
        this.x = IRIS._setterUndef(opts.x,0);
        this.y = IRIS._setterUndef(opts.y,0);
        this.pattern = IRIS._setterUndef(opts.pattern,IRIS.ZONE_PATTERN_RANDOM);
        this.step = IRIS._setterUndef(opts.step, 0.1);
        this.scale = IRIS._setterUndef(opts.scale, 1);
    }
});

IRIS.Vector2Zone = IRIS.BaseVectorZone.extend({
    init: function(opts) {
        this._super(opts);
        this.plane = IRIS._setterUndef(opts.plane, false);
        if (this.plane) {
            this.rotation = IRIS._setterVector3(opts.rotation, new IRIS.Vector3(0,0,0));
            this.position = IRIS._setterVector3(opts.position, new IRIS.Vector3(0,0,0));
        } else {
            this.rotation = IRIS._setterVector2(opts.rotation, new IRIS.Vector2(0,0));
            this.position = IRIS._setterVector2(opts.position, new IRIS.Vector2(0,0));
        }
    },
    _vector2ToPlane: function(x, y, plane) {
        if (x instanceof IRIS.Vector2) {
            plane = y;
            y = x.y;
            x = x.x;
        }
        switch (plane) {
            case IRIS.ZONE_PLANE_YX:
                return new IRIS.Vector3(y, x, 0);
            case IRIS.ZONE_PLANE_YZ:
                return new IRIS.Vector3(0, x, y);
            case IRIS.ZONE_PLANE_ZY:
                return new IRIS.Vector3(0, y, x);
            case IRIS.ZONE_PLANE_XZ:
                return new IRIS.Vector3(x, 0, y);
            case IRIS.ZONE_PLANE_ZX:
                return new IRIS.Vector3(y, 0, x);
            default:
                return new IRIS.Vector3(x, y, 0);
        }
    }
});

IRIS.Vector3Zone = IRIS.BaseVectorZone.extend({
    init: function(opts) {
        this._super(opts);
        this.z = IRIS._setterUndef(opts.z,0);
        this.rotation = IRIS._setterVector3(opts.rotation, new IRIS.Vector3(0,0,0));
        this.position = IRIS._setterVector3(opts.position, new IRIS.Vector3(0,0,0));
    }
});

IRIS.ctrl.zone = {};
IRIS.registerZone = function(zoneClass, id) {
    IRIS.ctrl.zone[id] = zoneClass;
};
IRIS.getZone = function(id, opts) {
    if (IRIS._isUndef(IRIS.ctrl.zone[id]))
        return false;
    return new IRIS.ctrl.zone[id](opts);
};
IRIS.isZone = function(id) {
    if (IRIS._isUndef(IRIS.ctrl.zone[id]))
        return false;
    return true;
};


IRIS.VertexZone = IRIS.Vector2Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        if (!IRIS._isUndef(opts.vertices))
            this.setVertices(opts.vertices);
        this._stepVector = 0;
    },
    setVertices: function(vertices) {
        var defVec = new IRIS.Vector2(0, 0);
        if (IRIS._isArray(vertices)) {
            for(var key in vertices) {
                vertices[key] = IRIS._setterVector2(vertices[key], defVec);
                if (this.plane)
                    vertices[key] = this._vector2ToPlane(vertices[key], this.plane);
            }
            this.vertices = vertices;
            this._lengths = [];
            this._sumLengths = [];
            this._length = 0;
            var nextVertex;
            for(var i = 0; i < this.vertices.length; i++) {
                if (i == this.vertices.length-1)
                    nextVertex = this.vertices[0];
                else
                    nextVertex = this.vertices[i+1];
                var length = this.vertices[i].dist(nextVertex);
                this._lengths.push(length);
                this._sumLengths.push(this._length);
                this._length += length;
            }
        } else {
            this.vertices = false;
        }
    },
    getStep: function() {
        if (this.pattern == IRIS.ZONE_PATTERN_RANDOM) {
            this._stepVector = IRIS._random(0, this._length);
        } else {
            this._stepVector += this.step;
            if (this._stepVector > this._length)
                this._stepVector -= this._length;
        }
        return this._getPointAtLength(this._stepVector);;
    },
    _getPointAtLength: function(length) {
        var index = 0;
        for(var i = 0;i <= this._sumLengths.length; i++)
            if (length > this._sumLengths[i])
                index=i;
            else
                break;
        var startVertex = this.vertices[index];
        if (index == this.vertices.length-1)
            var endVertex = this.vertices[0];
        else
            var endVertex = this.vertices[index+1];
        var blend = (length - this._sumLengths[index])/this._lengths[index];
        return startVertex.pointTo(endVertex, blend).mul(this.scale);
    }
});

IRIS.registerZone(IRIS.VertexZone, IRIS.ZONE_TYPE_VERTEX);
