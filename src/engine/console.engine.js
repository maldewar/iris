/*var oConsoleEngine = new IRIS.Engine({
        id : 'console',
        type: IRIS.Engine.TYPE_1D,
        getScene: function() {
            return new IRIS.Scene({
                init: function(){
                    this.object = document.body;
                },
                addAsset: function(oAsset) {
                    $(this.object).append(oAsset.object);
                }
            });
        },
        createAsset: function(index, data, oEntity) {
            var assetObject = document.createElement('div');
            assetObject.id = index;
            return new IRIS.Asset({id:index, object:assetObject, entity: oEntity});
        },
        populateAsset: function(oAsset,data,oEntity) {
            oAsset.object.innerHTML = oAsset.id;
        }
    });

IRIS.registerEngine(oConsoleEngine);*/
