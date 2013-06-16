IRIS.MODIFIER_TARGET_POSITION = 'position';
IRIS.MODIFIER_TARGET_SCALE = 'scale';
IRIS.MODIFIER_TARGET_COLOR = 'color';
IRIS.MODIFIER_TARGET_SIZE = 'size';
IRIS.MODIFIER_TARGET_ROTATION = 'rotation';

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
