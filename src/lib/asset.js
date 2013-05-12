/* Asset related control structures */
IRIS.ctrl.asset = {}; //stores asset descriptions.
IRIS.ctrl.assetIns = {}; //stores instances of assets.
IRIS.ctrl.entAssetRel = {}; //stores the relationship entity-asset.

/* Entity related global events */
IRIS.EV_ASSET_REGISTERED = 'assetRegistered';
IRIS.EV_ASSET_UNREGISTERED = 'assetUnregistered';
IRIS.EV_ASSET_CREATED = 'assetCreated';
IRIS.EV_ASSET_UPDATED = 'assetUpdated';
IRIS.EV_ASSET_DELETED = 'assetDeleted';

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
};

IRIS.Asset.prototype = {
    set: function(param, value) {
    },
    pushState: function(state) {
    },
    pullState: function(state) {
    }
};
