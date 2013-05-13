IRIS.ThreejsAssetProvider = IRIS.assetProvider.extend({
    init: function(opts) {
        this._super(opts);
    },
    getAssetObject: function(index, data, oEntity) {
        var assetId = this.getAssetId(index, data, oEntity);
        var assetOpts = this.getAssetOpts(assetId);
        if (assetId !== false && assetOpts !== false) {
            switch (assetOpts.type) { //TODO: use constants
                case 'sphere':
                    return this.getSphere(assetOpts);
                default:
                    return false; //TODO: return some default geometry
            }
        } else
            return false;
    },
    // radius, segments, thetaStart, thetaLength
    getCircle: function(opts) {
    },
    // width, height, depth, widtSegments, heightSegments, depthSegments
    getCube: function(opts) {
    },
    // radius, segments, rings
    getSphere: function(opts) {
        var assetObject = new THREE.Mesh(
            new THREE.SphereGeometry(opts.radius, 
                                     opts.segments,
                                     opts.rings),
            new THREE.MeshLambertMaterial({color: 0xDDCCCC}));
        return assetObject;
    }
});

IRIS.registerAssetProvider(IRIS.ThreejsAssetProvider, 'threejs');
