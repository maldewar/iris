IRIS.Scene = function(opts){
    this.init = opts.init;
    this.val = opts.val;
    this.obj = {};

    this.addAsset = opts.addAsset;
    this.removeAsset = opts.removeAsset;
    this.onFrame = opts.onFrame;

    this.ctrl = {
        asset:{}
    };

    //TODO remove misplaced initializer
    //this.zone = new IRIS.Line3DZone({scale:100, pattern: IRIS.ZONE_PATTERN_LINEAL, step: 0.5});
    //this.zone = new IRIS.RectangleZone({scale:100, pattern: IRIS.ZONE_PATTERN_LINEAL, step: 0.5, plane:'xz'});
    this.zone = new IRIS.RectangleZone({scale:100, step: 0.5, plane:'xz'});
};

IRIS.Scene.prototype = {
    getAsset: function(index, entityId) {
        if (typeof this.ctrl.asset[entityId] !== 'undefined' &&
            typeof this.ctrl.asset[entityId][index] !== 'undefined')
            return this.ctrl.asset[entityId][index];
        else
            return false;
    },
    _addAsset: function(oAsset) {
        // Apply initializer
        //TODO Handle nicely initializers TODO
        var v = this.zone.getStep();
        oAsset.object.position.x = v.x;
        oAsset.object.position.y = v.y;
        oAsset.object.position.z = v.z;
        this.addAsset(oAsset);
    },
    _removeAsset: function() {
        //TODO: unregister asset instance
        // Apply removeSetters
        this.removeAsset();
    }
};
