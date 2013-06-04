/* Asset related control structures */
IRIS.ctrl.asset = {}; //stores asset descriptions.
IRIS.ctrl.assetIns = {}; //stores instances of assets.
IRIS.ctrl.entAssetRel = {}; //stores the relationship entity-asset.

/* Entity related global events */
IRIS.EV_ASSET_REGISTERED = 'registered';
IRIS.EV_ASSET_UNREGISTERED = 'unregistered';
IRIS.EV_ASSET_CREATED = 'created';
IRIS.EV_ASSET_UPDATED = 'updated';
IRIS.EV_ASSET_DELETED = 'deleted';

IRIS.Asset = function(opts){
    // Required
    this.id = opts.id;
    this.index = IRIS._setterUndef(opts.index);
    this.object = IRIS._setterUndef(opts.object);
    this.data = IRIS._setterUndef(opts.data);

    // Not required
    this.position = false;
    this.rotation = false;
    this.size = false;
    this.scale = 1;
    this.parent = false;
    this.style = [];
    this.state = [];
    this.createModifier = IRIS._setterUndef(opts.createModifier, false);
    this.updateModifier = IRIS._setterUndef(opts.updateModifier, false);
    this.deleteModifier = IRIS._setterUndef(opts.deleteModifier, false);
};

IRIS.Asset.prototype = {
    set: function(param, value) {
    },
    pushState: function(state) {
    },
    pullState: function(state) {
    }
};
