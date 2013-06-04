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
        this.addAsset(oAsset);
    },
    _removeAsset: function() {
        //TODO: unregister asset instance
        // Apply removeSetters
        this.removeAsset();
    }
};
