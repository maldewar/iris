IRIS.ScaleInitializer = IRIS.SingleValueInitializer.extend({
    init: function(opts) {
        this._super(opts);
    },
    _run: function(oAsset, scale) {
        oAsset.scale = scale;
    }
});
