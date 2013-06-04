IRIS.MODIFIER_TARGET_POSITION = 'position';
IRIS.MODIFIER_TARGET_SCALE = 'scale';
IRIS.MODIFIER_TARGET_COLOR = 'color';
IRIS.MODIFIER_TARGET_SIZE = 'size';
IRIS.MODIFIER_TARGET_ROTATION = 'rotation';

IRIS.ThreejsPositionModifier = IRIS.Modifier.extend({
    init: function(opts) {
        this._super(opts);
    },
    apply: function(oAsset) {
        var v = this.zone.getStep();
        oAsset.position = v;
        oAsset.object.position.x = v.x;
        oAsset.object.position.y = v.y;
        oAsset.object.position.z = v.z;
    }
    //apply (should be implemented by the extending class)
});
