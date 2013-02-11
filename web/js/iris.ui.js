$.extend(iris.ui,{
    view:{
        _default: {
            obj:{},
            init:function(){
                iris.ui.view._default.obj['circleZone'] = new SPARKS.SpringZone(0,0,0,100,20,{random:false});
            },
            get:function(type){
                var radius = 13,
                    segments = 12,
                    rings = 12;
                var sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(radius,segments,rings),
                    new THREE.MeshLambertMaterial({color: 0xDD0000}));
                sphere.irisState = new IRIS.State(sphere);
                sphere.position = iris.ui.view._default.obj['circleZone'].getLocation();
                sphere.on('click',function(data){
                    data.target.scale.x *= 2;
                    data.target.scale.y *= 2;
                    data.target.scale.z *= 2;
                });
                sphere.on('mouseover', function(data){
                    data.target.irisState.push('hover');
                });
                iris.ui._scaleAnimation(sphere,{easing: TWEEN.Easing.Back.Out, lapse: 1000});
                return sphere;
            }
        },
        network: {
            obj:{},
            init:function(){},
            get:function(){
                var radius = 12,
                    segments = 12,
                    rings = 12;
                var sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(radius,segments,rings),
                    new THREE.MeshLambertMaterial({color: 0x0000CC}));
                sphere.position = iris.ui.view._default.obj['circleZone'].getLocation();
                iris.ui._scaleAnimation(sphere,{easing: TWEEN.Easing.Back.Out, lapse: 1000});
                return sphere;
            }
        }
    },
    val:{
        width:window.innerWidth, //mandatory
        height:window.innerHeight, //mandatory
        cameraAngle: 45,
        cameraNear: 0.1,
        cameraFar: 10000,
        fontNear: 300,
        fontFar: 700,
        fontSizeNear: 1.1, //In em
        fontSizeFar: 0.3, //In em
        cameraZ: 600
    },
    clazz:{
        labelContainer: 'entity-label'
    },
    obj:{},
    _sceneObj:{},
    init:function(options){
        iris.ui.obj.renderer = new THREE.WebGLRenderer();
        //iris.ui.obj.renderer = new THREE.CanvasRenderer();
        iris.ui.obj.camera = new THREE.PerspectiveCamera(
                                iris.ui.val.cameraAngle,
                                iris.ui.val.width/iris.ui.val.height,
                                iris.ui.cameraNear,
                                iris.ui.cameraFar);
        iris.ui.obj.scene = new THREE.Scene();
        iris.ui.obj.scene.add(iris.ui.obj.camera);
        iris.ui.obj.camera.position.z = iris.ui.val.cameraZ;
        THREE.Object3D._threexDomEvent.camera(iris.ui.obj.camera);
        iris.ui.obj.renderer.setSize(iris.ui.val.width,iris.ui.val.height);
        //Append Scene to main object

        //var pointLight = new THREE.PointLight(0xFFFFFF);
        // set its position
        //pointLight.position.x = 10;
        //pointLight.position.y = 50;
        //pointLight.position.z = 130;
        // add to the scene
        //iris.ui.obj.scene.add(pointLight);

        var ambientLight = new THREE.AmbientLight(0x111111);
        iris.ui.obj.scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1).normalize();
        iris.ui.obj.scene.add(directionalLight);

        for (var key in iris.ui.view)
            iris.ui.view[key].init();

        iris.context.append(iris.ui.obj.renderer.domElement);

        iris.ui.obj.clock = new THREE.Clock();
        iris.ui.obj.controls = new THREE.TrackballControls( iris.ui.obj.camera );
        iris.ui.obj.controls.rotateSpeed = 2.0;//1.0
        iris.ui.obj.controls.zoomSpeed = 2.2;//1.2
        iris.ui.obj.controls.panSpeed = 1.6;//0.8
        iris.ui.obj.controls.noZoom = false;
        iris.ui.obj.controls.noPan = false;
        iris.ui.obj.controls.staticMoving = true;
        iris.ui.obj.controls.dynamicDampingFactor = 0.3;
        iris.ui.obj.controls.keys = [ 65, 83, 68 ];

        iris.ui.obj.projector = new THREE.Projector();
        iris.ui.val.halfCanvasWidth = iris.ui.obj.renderer.domElement.width/2;
        iris.ui.val.halfCanvasHeight = iris.ui.obj.renderer.domElement.height/2;

        iris.ui._updateSceneObjects();
        iris.ui.play();
    },
    play: function(){
        //requestAnimationFrame( iris.ui.play );
        //setTimeout( function() { requestAnimationFrame( iris.ui.play ); }, 100 );
        iris.ui.obj.controls.update(iris.ui.obj.clock.getDelta());
        iris.ui.obj.renderer.render(iris.ui.obj.scene,iris.ui.obj.camera);
        TWEEN.update();
        requestAnimationFrame( iris.ui.play );
        //iris.ui.obj.controls.update(iris.ui.obj.clock.getDelta());
        //iris.ui.obj.controls.update();
    },
    pause: function(){},
    stop: function(){},
    //IN functions (calls from CORE)
    create: function(type,id,value,valueDesc){
        var object;
        if (typeof iris.ui.view[type] != 'undefined')
            object = iris.ui.view[type].get();
        else
            object = iris.ui.view._default.get();
        iris.ui.obj.scene.add(object);
        iris.ui._initLabels(object,type,id,value,valueDesc);

        iris.ui._sceneObj[type+'_'+id] = object;
    },
    update: function(type,id,value){},
    delete: function(type,id){},
    //OUT functions (calls to CORE)
    createEntity: function(type,value){},
    updateEntity: function(type,id,value){},
    deleteEntity: function(type,id){},
    //UI Entity Functions
    minimize: function(type,id){},
    maximize: function(type,id){},
    restore: function(type,id){},
    enable: function(type,id){},
    disable: function(type,id){},
    focus: function(type,id){},
    _scaleAnimation: function(elem, options) {
        var opts = {
            from: 0,
            to: 1,
            lapse: 2000,
            easing: TWEEN.Easing.Linear.None,
            onComplete:undefined
        };
        $.extend(opts,options);
        elem.scale.x = opts.from;
        elem.scale.y = opts.from;
        elem.scale.z = opts.from;
        elem.tweenScale = new TWEEN.Tween({scale:opts.from,elem:elem})
                                    .to({scale:opts.to}, opts.lapse)
        .easing(opts.easing)
        .onUpdate( function () {
            this.elem.scale.x = this.scale;
            this.elem.scale.y = this.scale;
            this.elem.scale.z = this.scale;
        } )
        .start();
    },
    _updateSceneObjects: function(){
        for (var key in iris.ui._sceneObj) {
            iris.ui._updateLabels(iris.ui._sceneObj[key]);
        }
        setTimeout(iris.ui._updateSceneObjects, 100 );
    },
    _initLabels: function(object, type, id, value, valueDesc) {
        object.irisLabel = new IRIS.Overlayer(object, iris.ui.obj.camera, iris.ui.obj.projector);
        object.irisLabel.add(id);
    },
    _updateLabels:function(object) {
        if ( object.irisLabel) {
            object.irisLabel.update();
        }
    },
    utils:{
        _rgbToHex:0
    }
});


/* IRIS State */
IRIS.STATE_TYPE_HARD = 0;
IRIS.STATE_TYPE_SOFT = 1;
IRIS.STATE_DEFAULT = 'default';

IRIS.State = function( object ) {
    this.object = object;
    this.softStates = new Array();
    this.hardStates = new Array();
    this.appliedStates = {};
    this.hardStates.push(IRIS.STATE_DEFAULT);
    this._apply(IRIS.States[IRIS.STATE_DEFAULT].style);
    this.hardTween = false;
}

IRIS.State.prototype.push = function(state) {
    if (typeof this.appliedStates[state] == 'undefined' && state != IRIS.STATE_DEFAULT) {
        if (IRIS.States && IRIS.States[state]) {
            if (IRIS.States[state].opts.type == IRIS.STATE_TYPE_HARD) {
                this.hardStates.push(state);
                this.topHardStyle = IRIS.States[state].opts.type;
            } else
                this.softStates.push(state);

            //Apply style
            if (IRIS.States[state].opts.easingIn)
                this._transition(true);
            else
                this._apply(IRIS.States[state].style);

            this.appliedStates[state] = IRIS.States[state];

            if (typeof IRIS.States[state].opts.onPush == 'function')
                IRIS.States[state].opts.onPush(state,obj);

            return true;
        }
    }
    return false;
}

IRIS.State.prototype.pop = function(state) {
    if (typeof this.appliedStates[state] != 'undefined') {

        //Remove style
        if (IRIS.States[state].opts.easingOut)
            this._transition(false);
        else
            this._apply(IRIS.States[this.hardStates[this.hardStates.length-1]].style);

        if (this.appliedStates[state].opts.type == IRIS.STATE_TYPE_HARD)
            this.hardStates.splice(this.hardStates.indexOf(state),1);
        else
            this.softStates.splice(this.softStates.indexOf(state),1);

        delete this.appliedStates[state];

        this._apply(IRIS.States[this.hardStates[this.hardStates.length-1].style]);
        if (typeof IRIS.States[state].opts.onPop == 'function')
                IRIS.States[state].opts.onPop(state,obj);
        return true;
    }
    return false;
}

IRIS.State.prototype._apply = function(style) {
    if (style) {
        this.object.material.color.r = style.r;
        this.object.material.color.g = style.g;
        this.object.material.color.b = style.b;
        this.object.material.opacity = style.a;
    }
}

IRIS.State.prototype._transition = function(upwards) {
    if (this.hardTween === false) {
        var _bottomState = IRIS.States[this.hardStates[this.hardStates.length - 2]];
        var _topState = IRIS.States[this.hardStates[this.hardStates.length - 1]];
        var _bottom = {
            r: _bottomState.style.r,
            g: _bottomState.style.g,
            b: _bottomState.style.b,
            a: _bottomState.style.a
        };
        var _top = {
            r: _topState.style.r,
            g: _topState.style.g,
            b: _topState.style.b,
            a: _topState.style.a
        };

        if (upwards) {
            _bottom['elem'] = this;
            _bottom['upwards'] = upwards;
            this.hardTween = new TWEEN.Tween(_bottom)
                                    .to(_top,_topState.opts.lapseIn)
                                    .easing(_topState.opts.easingIn);
        } else {
            _top['elem'] = this;
            _top['upwards'] = upwards;
            this.hardTween = new TWEEN.Tween(_top)
                                    .to(_bottom,_topState.opts.lapseOut)
                                    .easing(_topState.opts.easingOut);
        }
        this.hardTween.onUpdate(function(){
            this.elem._apply({r: this.r, g: this.g, b: this.b, a: this.a});
        })
        .onComplete(function(){
            this.elem.hardTween = false;
            if(this.upwards)
                this.elem._timeout();
        }).start();
    }
}

IRIS.State.prototype._timeout = function() {
    var _top = IRIS.States[this.hardStates[this.hardStates.length - 1]];
    if (_top.opts.duration > 0) {
        var fn = function(state){
            state.pop(state.hardStates[state.hardStates.length - 1])
        };
        this.timeout = setTimeout(fn, _top.opts.duration,this);
    }
}




/* IRIS Label */
IRIS._overlayer = undefined;

IRIS.Overlayer = function( object, camera, projector ) {
    if (IRIS._overlayer == undefined) {
        IRIS._overlayer = $(document.createElement('div'));
        IRIS._overlayer.css('position','absolute');
        $('body').append(IRIS._overlayer);
        $(window).resize(function(){
            IRIS.Overlayer.prototype.__position();
        });
        this.__position();
    }
    this.__position();
    this.container = $(document.createElement('div'));
    this.container.css({position:'absolute'});
    IRIS._overlayer.append(this.container);
    this.object = object;
    this.camera = camera;
    this.projector = projector;
    this.objectPos = new THREE.Vector3(0,0,0);
    this.cameraPos = new THREE.Vector3(0,0,0);
    //this.cameraRot = new THREE.Vector3(1,0,0);
}

IRIS.Overlayer.fontNear = 300;
IRIS.Overlayer.fontFar = 700;
IRIS.Overlayer.fontSizeNear = 1.1;
IRIS.Overlayer.fontSizeFar = 0.3;

IRIS.Overlayer.prototype.add = function(param) {
    var labelVal = param;
    if ( typeof param == 'object') {
        labelVal = param.value;
    }
    var label = $(document.createElement('span'));
    label.text(labelVal);
    this.container.append(label);
    this.update();
}

IRIS.Overlayer.prototype.update = function() {
    if (this.__needsUpdate()) {
        var vector = this.__getXYPosition();
        var font = this.__getFontSize();
        this.container.css({
            left: vector.x+'px',
            bottom: vector.y+'px',
            'font-size': font+'em'
        });
        this.objectPos = this.object.position.clone();
        this.cameraPos = this.camera.position.clone();
    }
}

IRIS.Overlayer.prototype.__position = function() {
    this.width = $(window).width();
    this.height = $(window).height();
    this.halfWidth = this.width/2;
    this.halfHeight = this.height/2;
    IRIS._overlayer.css({'left':this.halfWidth,'top':this.halfHeight});
}

IRIS.Overlayer.prototype.__getXYPosition = function() {
    var vector = this.projector.projectVector(this.object.position.clone(), this.camera);
    return {
        x: vector.x * this.halfWidth,
        y: vector.y * this.halfHeight
    };
}

IRIS.Overlayer.prototype.__getFontSize = function() {
    var distance = this.object.position.distanceTo(this.camera.position);
    if (distance > IRIS.Overlayer.fontFar) {
        return IRIS.Overlayer.fontSizeFar;
    } else {
        if (distance < IRIS.Overlayer.fontNear)
            return IRIS.Overlayer.fontSizeNear;
        else 
            return IRIS.Overlayer.fontNear*IRIS.Overlayer.fontSizeNear/distance;
    }
}

IRIS.Overlayer.prototype.__needsUpdate = function() {
    return this.object.position.x != this.objectPos.x ||
            this.object.position.y != this.objectPos.y ||
            this.object.position.z != this.objectPos.z ||
            this.camera.position.x != this.cameraPos.x ||
            this.camera.position.y != this.cameraPos.y ||
            this.camera.position.z != this.cameraPos.z;
}
