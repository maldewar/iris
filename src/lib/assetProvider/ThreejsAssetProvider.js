IRIS.ThreejsAssetProvider = IRIS.assetProvider.extend({
    init: function(opts) {
        this._super(opts);
    },
    getAssetObject: function(index, data, oEntity) {
        var radius = 13,
            segments = 12,
            rings = 12;
        var assetObject = new THREE.Mesh(
            new THREE.SphereGeometry(radius,segments,rings),
            new THREE.MeshLambertMaterial({color: 0xDDCCCC}));
        return assetObject;
    }
});

IRIS.registerAssetProvider(IRIS.ThreejsAssetProvider, 'threejs');
