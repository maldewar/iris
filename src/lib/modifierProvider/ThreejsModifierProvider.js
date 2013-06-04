IRIS.ThreejsModifierProvider = IRIS.ModifierProvider.extend({
    init: function(opts) {
        this._super(opts);
    },
    _getModifier: function(id, opt) {
        var oModifier = new IRIS.Modifier({
                            id: id,
                            target: opts.target,
                            zone: opts.zone,
                            zoneOpts: opts.zoneOpts});
        return oModifier;
    }

});

IRIS.registerModifierProvider(IRIS.ThreejsModifierProvider, 'threejs');
