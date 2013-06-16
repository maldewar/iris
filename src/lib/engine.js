IRIS.Engine = Class.extend({
    _renderableAssets: [], //TODO: change to object with index to unregister assets
    init: function(opts) {
        this.isRunning = false;
        //this.scene = opts.scene;
        this.assetProvider = this._getAssetProviderInstance(this.assetProvider,
                                IRIS.ui.asset); //TODO pass opts as second param.
        this.modifierProvider = this._getModifierProviderInstance(this.modifierProvider,
                                IRIS.ui.modifier); //TODO pass opts as second param.
        /*Functions to be defined by each Engine specific implementation*/
        this.scene = this.getScene();
        this.scene.engine = this;
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
    render: function() {
        for(var key in this._renderableAssets)
            this._renderAsset(this._renderableAssets[key]);
    },
    registerRendereable: function(oAsset) {
        this._renderableAssets.push(oAsset);
    },
    _createAsset: function(index, data, oEntity) {
        var oAsset = this.assetProvider.getAsset(index, data, oEntity);
        oAsset.engine = this;
        this.modifierProvider.apply(oAsset,oAsset.createModifier);
        this.populateAsset(oAsset);
        this.scene._addAsset(oAsset);
    },
    _updateAsset: function(index, oldData, newData, oEntity) {
    },
    _deleteAsset: function(index, oEntity) {
    },
    _renderAsset: function(oAsset) {
        this.modifierProvider.apply(oAsset,oAsset._renderModifier);
    },
    _stateAsset: function(index, oAsset) {
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
