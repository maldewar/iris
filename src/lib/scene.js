IRIS.Scene = function(opts){
    this.init = opts.init;
    this.addStates = IRIS._setterUndef(opts.addStates);
    this.updateStates = IRIS._setterUndef(opts.updateStates);
    this.removeStates = IRIS._setterUndef(opts.removeStates);

    this.initializer = IRIS._setterUndef(opts.initializer);
    this.updateSetters = IRIS._setterUndef(opts.updateSetters);
    this.removeSetters = IRIS._setterUndef(opts.removeSetters);

    this.val = opts.val;
    this.obj = {};
    

    this.addAsset = opts.addAsset;
    this.removeAsset = opts.removeAsset;
    this.onFrame = opts.onFrame;

    this.ctrl = {
        asset:{}
    };

    //TODO remove misplaced initializer
    this.line3d = new IRIS.Line3DZone({scale:100});
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
        var v = this.line3d.getStep();
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
