IRIS.ThreejsPositionModifier = IRIS.Modifier.extend({
    init: function(opts) {
        this._super(opts);
    },
    apply: function(oAsset, val) {
        oAsset.position = val;
        oAsset.object.position.x = val.x;
        oAsset.object.position.y = val.y;
        oAsset.object.position.z = val.z;
    }
});

IRIS.ThreejsColorModifier = IRIS.Modifier.extend({
    init: function(opts) {
        this._super(opts);
    },
    apply: function(oAsset, val) {
        oAsset.color = val;
        oAsset.object.material.color.r = val.r;
        oAsset.object.material.color.g = val.g;
        oAsset.object.material.color.b = val.b;
        oAsset.object.material.opacity = val.a;
    }
});
