IRIS.assetProvider = Class.extend({
    _assetIns: {},
    _entityAsset: {},
    _assetOpts: {},
    init: function(opts) {
        if (IRIS._isObject(opts)) {
            for(var key in opts) {
                opts[key] = this._normalizeOpts(key, opts[key]);
                this._registerEntityAssetRel(key,opts[key].entity);
                this._registerAssetOpts(key, opts[key]);
            }
        }
    },
    getAsset: function(index, data, oEntity) {
        if (typeof this._assetIns[oEntity.id] !== 'undefined' && 
            typeof this._assetIns[oEntity.id][index] !== 'undefined')
            return this._assetIns[oEntity.id][index];
        var assetId = this.getAssetId(index, data, oEntity);
        var assetOpts = this.getAssetOpts(assetId);
        var oAsset = new IRIS.Asset({
                        id: assetId,
                        index: index,
                        object: this.getAssetObject(index, data, oEntity),
                        createModifier: assetOpts.create,
                        updateModifier: assetOpts.update,
                        deletemodifier: assetOpts.delete,
                        data: data});
        return oAsset;
    },
    getAssetId: function(index, data, oEntity) {
        if (!IRIS._isUndef(this._entityAsset[oEntity.id]))
            return this._entityAsset[oEntity.id];
        return false;
    },
    getAssetOpts: function(assetId) {
        if (!IRIS._isUndef(this._assetOpts[assetId]))
            return this._assetOpts[assetId];
        return false;
    },
    _normalizeOpts: function(assetId, opts) {
        if (typeof opts == 'object') {
            if (typeof opts.entity == 'undefined')
                opts.entity = assetId;
        }
        opts.create = IRIS._valueToArray(opts.create);
        opts.update = IRIS._valueToArray(opts.update);
        opts.delete = IRIS._valueToArray(opts.delete);
        return opts;
        //TODO: normalize other options for assets, such as color.
    },
    _registerEntityAssetRel: function(entityId, assetId) {
        if (IRIS._isUndef(this._entityAsset[entityId]))
            this._entityAsset[entityId] = assetId;
        else
            if (IRIS._isArray(this._entityAsset[entityId]))
                this._entityAsset[entityId].push(assetId);
            else
                this._entityAsset[entityId] = [this._entityAsset[entityId], assetId];
    },
    _registerAssetOpts: function(assetId, opts) {
        this._assetOpts[assetId] = opts;
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
