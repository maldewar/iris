IRIS.ModifierProvider = Class.extend({
    _modifierIns: {},
    //_entityAsset: {},
    _modifierOpts: {},
    init: function(opts) {
        if (IRIS._isObject(opts)) {
            for(var key in opts) {
                opts[key] = this._normalizeOpts(key, opts[key]);
                //this._registerEntityAssetRel(key,opts[key].entity);
                this._registerModifierOpts(key, opts[key]);
            }
        }
    },
    getModifier: function(id) {
        if (typeof this._modifierIns[id] !== 'undefined')
            return this._modifierIns[id];
        var opts = this.getModifierOpts(id);
        if (opts) {
            switch (opts.target) {
                default:
                    var oModifier = this._getModifier('id', opts);
            }
            /*var oModifier = new IRIS.Modifier({
                            id: id,
                            target: opts.target,
                            zone: opts.zone,
                            zoneOpts: opts.zoneOpts});*/
            this._modifierIns[id] = oModifier;
            return oModifier;
        }
        return false;
    },
    apply: function(oAsset, modifierIds) {
        for(var key in modifierIds) {
            if (!IRIS._isUndef(this._modifierOpts[modifierIds[key]])) {
                //TODO: implement concept of shared and private modifiers
                //IF shared we create an instance of a modifier bound to this provider
                var modifierIns = this._modifierIns[modifierIds[key]];
                if (IRIS._isUndef(modifierIns)) {
                    modifierIns = this._getModifierInstance(this._modifierOpts[modifierIds[key]]);
                    this._modifierIns[modifierIds[key]] = modifierIns;
                }
                if (modifierIns)
                    modifierIns.apply(oAsset);
            }
        }
    },
    getModifierOpts: function(id) {
        if (!IRIS._isUndef(this._modifierOpts[id]))
            return this._modifierOpts[id];
        return false;
    },
    _getModifierInstance: function(opts) {
        switch(opts.target) {
            case IRIS.MODIFIER_TARGET_POSITION:
                return new IRIS.ThreejsPositionModifier(opts);
            default:
                return false;
        }
    },
    _normalizeOpts: function(modifierId, opts) {
        if (typeof opts == 'object') {
            if (typeof opts.id == 'undefined')
                opts.id = modifierId;
        }
        return opts;
    },
    _registerModifierOpts: function(modifierId, opts) {
        this._modifierOpts[modifierId] = opts;
    }
});

IRIS.ctrl.modifierProvider = {};
IRIS.registerModifierProvider = function(modifierProviderClass, id) {
    IRIS.ctrl.modifierProvider[id] = modifierProviderClass;
};
