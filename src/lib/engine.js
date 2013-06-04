IRIS.Engine = Class.extend({
    init: function(opts) {
        this.isRunning = false;
        //this.scene = opts.scene;
        this.assetProvider = this._getAssetProviderInstance(this.assetProvider,
                                IRIS.ui.asset); //TODO pass opts as second param.
        this.modifierProvider = this._getModifierProviderInstance(this.modifierProvider,
                                IRIS.ui.modifier); //TODO pass opts as second param.
        /*Functions to be defined by each Engine specific implementation*/
        //this.getScene = opts.getScene; //Returns an instance of a scene the engine will work with.
        //this.createAsset = opts.createAsset; //Must return a valid Asset instance.
        //this.populateAsset = opts.populateAsset; //Must return true, false or an Asset.
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
        this.modifierProvider.apply(oAsset,oAsset.createModifier);
        this.populateAsset(oAsset);
        this.scene._addAsset(oAsset);
    },
    _updateAsset: function(index, oldData, newData, oEntity) {
    },
    _deleteAsset: function(index, oEntity) {
    },
    _getAssetProviderInstance: function (id, opts) {
        if (typeof IRIS.ctrl.assetProvider[id] !== 'undefined')
            return new IRIS.ctrl.assetProvider[id](opts);
        else
            return false;
    },
    _getModifierProviderInstance: function(id, opts) {
        if (typeof IRIS.ctrl.modifierProvider[id] !== 'undefined')
            return new IRIS.ctrl.modifierProvider[id](opts);
        else
            return false;
    }
});

IRIS.Engine.TYPE_1D = '1D';
IRIS.Engine.TYPE_2D = '2D';
IRIS.Engine.TYPE_3D = '3D';

IRIS.ctrl.engine = {};
IRIS.registerEngine = function(engineClass, id) {
    IRIS.ctrl.engine[id] = engineClass;
};
