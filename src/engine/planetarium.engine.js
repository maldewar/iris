IRIS.PlanetariumEngine = IRIS.Engine.extend({
        assetProvider: 'threejs',
        modifierProvider: 'threejs',
        modifierProviderOpts: {},
        type: IRIS.Engine.TYPE_3D,
        init: function(opts) {
            this._super(opts);
        },
        getScene: function() {
            return new IRIS.Scene({
                val:{
                    width: window.innerWidth, //mandatory
                    height: window.innerHeight, //mandatory
                    cameraAngle: 45,
                    cameraNear: 0.1,
                    cameraFar: 10000,
                    fontNear: 300,
                    fontFar: 700,
                    fontSizeNear: 1.1, //In em
                    fontSizeFar: 0.3, //In em
                    cameraZ: 600
                },
                init: function(opts){
                    this.obj.renderer = new THREE.WebGLRenderer();
                    //this.obj.renderer = new THREE.CanvasRenderer();
                    this.obj.camera = new THREE.PerspectiveCamera(
                        this.val.cameraAngle,
                        this.val.width/this.val.height,
                        this.val.cameraNear,
                        this.val.cameraFar);

                    this.object = new THREE.Scene();
                    this.object.add(this.obj.camera);
                    this.obj.camera.position.z = this.val.cameraZ;
                    THREE.Object3D._threexDomEvent.camera(this.obj.camera);
                    this.obj.renderer.setSize(this.val.width, this.val.height);

                    // Lights
                    var ambientLight = new THREE.AmbientLight(0x111111);
                    this.object.add(ambientLight);

                    var directionalLight = new THREE.DirectionalLight(0xffffff);
                    directionalLight.position.set(1, 1, 1).normalize();
                    this.object.add(directionalLight);

                    document.body.appendChild(this.obj.renderer.domElement); // TODO: option to select scene area.
                    this.obj.clock = new THREE.Clock();
                    this.obj.controls = new THREE.TrackballControls( this.obj.camera, this.obj.renderer.domElement );
                    this.obj.controls.rotateSpeed = 2.0;//1.0
                    this.obj.controls.zoomSpeed = 2.2;//1.2
                    this.obj.controls.panSpeed = 1.6;//0.8
                    this.obj.controls.noZoom = false;
                    this.obj.controls.noPan = false;
                    this.obj.controls.staticMoving = true;
                    this.obj.controls.dynamicDampingFactor = 0.3;
                    this.obj.controls.keys = [ 65, 83, 68 ];

                    this.obj.projector = new THREE.Projector();
                    this.val.halfCanvasWidth = this.obj.renderer.domElement.width/2;
                    this.val.halfCanvasHeight = this.obj.renderer.domElement.height/2;

                    //this._updateSceneObjects();
                    this.onFrame();
                },
                addAsset: function(oAsset) {
                    this.object.add(oAsset.object);
                },
                onFrame: function() {
                    requestAnimationFrame(this.onFrame.bind(this));
                    this.obj.controls.update(this.obj.clock.getDelta());
                    this.obj.renderer.render(this.object, this.obj.camera);
                    this.engine.render();
                }
            });
        },
        populateAsset: function(oAsset,data,oEntity) {
            //oAsset.object.innerHTML = oAsset.id;
        }
    });

IRIS.registerEngine(IRIS.PlanetariumEngine, 'planetarium');
