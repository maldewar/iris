IRIS.assetProvider = Class.extend({
    _assetIns: {},
    init: function(opts) {
    },
    getAsset: function(index, data, oEntity) {
        if (typeof this._assetIns[oEntity.id] !== 'undefined' && 
            typeof this._assetIns[oEntity.id][index] !== 'undefined')
            return this._assetIns[oEntity.id][index];
        var oAsset = new IRIS.Asset({
                        id: this.getAssetId(index, data, oEntity),
                        index: index,
                        object: this.getAssetObject(index, data, oEntity),
                        data: data});
        return oAsset;
    },
    getAssetId: function(index, data, oEntity) {
        //TODO Implement Asset-Entity relationship control
        return oEntity.id;
    }
    /**
     * Functions that should be declared by extended class:
     *
     * getAssetObject(index, data, oEntity)
     *
     */
});

IRIS.ctrl.assetProvider = {};
IRIS.registerAssetProvider = function(assetProviderClass, id) {
    IRIS.ctrl.assetProvider[id] = assetProviderClass;
};
