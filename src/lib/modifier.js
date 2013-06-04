IRIS.MODIFIER_TARGET_POSITION = 'position';
IRIS.MODIFIER_TARGET_SCALE = 'scale';
IRIS.MODIFIER_TARGET_COLOR = 'color';
IRIS.MODIFIER_TARGET_SIZE = 'size';
IRIS.MODIFIER_TARGET_ROTATION = 'rotation';

IRIS.Modifier = Class.extend({
    init: function(opts) {
        this.id = opts.id;
        this.target = opts.target;
        this.zone = IRIS.getZone(opts.zone, opts.zoneOpts);
        //this.tween = this.getTween(opts.tween, opts.tweenOpts);
    }
});
