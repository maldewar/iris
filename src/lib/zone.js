IRIS.ZONE_TYPE_LINE = 'line';
IRIS.ZONE_TYPE_CIRCLE = 'circle';

IRIS.ZONE_PATTERN_RANDOM = 0;
IRIS.ZONE_PATTERN_LINEAL = 1;
IRIS.ZONE_PATTERN_SPACE = 2;

IRIS.ZONE_DOMAIN_XY = 'xy';
IRIS.ZONE_DOMAIN_YZ = 'yz';
IRIS.ZONE_DOMAIN_XZ = 'xz';

IRIS.BaseVectorZone = Class.extend({
    init: function(opts) {
        this.minX = IRIS._setterUndef(opts.minX,0);
        this.maxX = IRIS._setterUndef(opts.maxX,1);
        this.minY = IRIS._setterUndef(opts.minY,0);
        this.maxY = IRIS._setterUndef(opts.maxY,1);
        this.pattern = IRIS._setterUndef(opts.pattern,IRIS.ZONE_PATTERN_RANDOM);
        this.step = IRIS._setterUndef(opts.step, 0.1);
        this.scale = IRIS._setterUndef(opts.scale, 1);
    }
});

IRIS.Vector2Zone = IRIS.BaseVectorZone.extend({
    init: function(opts) {
        this._super(opts);
        this.rotation = IRIS._setterVector2(opts.rotation, new IRIS.Vector2(0,0));
        this.position = IRIS._setterVector2(opts.position, new IRIS.Vector2(0,0));
        this.domain = IRIS._setterUndef(opts.domain, IRIS.ZONE_DOMAIN_XY);
    }
});

IRIS.Vector3Zone = IRIS.BaseVectorZone.extend({
    init: function(opts) {
        this._super(opts);
        this.minZ = IRIS._setterUndef(opts.minZ,0);
        this.maxZ = IRIS._setterUndef(opts.maxZ,1);
        this.rotation = IRIS._setterVector3(opts.rotation, new IRIS.Vector3(0,0,0));
        this.position = IRIS._setterVector3(opts.position, new IRIS.Vector3(0,0,0));
    }
});


IRIS.ctrl.zone = {};
IRIS.registerZone = function(zoneClass, id) {
    IRIS.ctrl.zone[id] = zoneClass;
};
