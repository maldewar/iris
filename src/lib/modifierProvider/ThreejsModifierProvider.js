IRIS.ThreejsModifierProvider = IRIS.ModifierProvider.extend({
    init: function(opts) {
        this._super(opts);
    },
    getModifier: function(opts) {
        switch(opts.target) {
            case IRIS.MODIFIER_TARGET_POSITION:
                return new IRIS.ThreejsPositionModifier(opts);
            case IRIS.MODIFIER_TARGET_COLOR:
                return new IRIS.ThreejsColorModifier(opts);
            default:
                return false;
        }
    }

});

IRIS.registerModifierProvider(IRIS.ThreejsModifierProvider, 'threejs');
