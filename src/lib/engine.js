IRIS.ctrl.engine = {};
/*
 * UI Engine.
 * @class Engine
 */
IRIS.Engine = function(opts) {
    this.id = opts.id;
    this.isRunning = false;
    this.type = opts.type;
    this.scene = opts.scene;
    this.assetProvider = this._getAssetProviderInstance(opts.assetProvider, opts.assetProviderOpts);

    /*Functions to be defined by each Engine specific implementation*/
    this.getScene = opts.getScene; //Returns an instance of a scene the engine will work with.
    this.createAsset = opts.createAsset; //Must return a valid Asset instance.
    this.populateAsset = opts.populateAsset; //Must return true, false or an Asset.
};

IRIS.Engine.TYPE_1D = '1D';
IRIS.Engine.TYPE_2D = '2D';
IRIS.Engine.TYPE_3D = '3D';

IRIS.Engine.prototype = {
    init: function() {
        this.scene = this.getScene();
        this.scene.init();
        IRIS.onEntityCreated(this._createAsset.bind(this));
        IRIS.onEntityUpdated(this._updateAsset.bind(this));
        IRIS.onEntityDeleted(this._deleteAsset.bind(this));
    },
    start: function() {
        this.isRunning = true;
    },
    pause: function() {
        this.isRunning = false;
    },
    _createAsset: function(index, data, oEntity) {
        var oAsset = this.assetProvider.getAsset(index, data, oEntity);
        this.populateAsset(oAsset);
        this.scene._addAsset(oAsset);
    },
    _updateAsset: function(index, oldData, newData, oEntity) {
    },
    _deleteAsset: function(index, oEntity) {
    },
    _getAssetProviderInstance: function (assetProviderId) {
        if (typeof IRIS.ctrl.assetProvider[assetProviderId] !== 'undefined')
            return new IRIS.ctrl.assetProvider[assetProviderId]();
        else
            return false;
    }
};

IRIS.registerEngine = function(oEngine) {
    IRIS.ctrl.engine[oEngine.id] = oEngine;
};
