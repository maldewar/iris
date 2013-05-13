IRIS = {};
IRIS.ctrl = {
    init: false,
    evCount: 0
};
IRIS.fn = {};

IRIS.start = function(opts) {
    for(var key in IRIS.ctrl.ds) {
        if (IRIS.ctrl.ds[key].firstCall)
            IRIS.ctrl.ds[key].requestData();
        else if (IRIS.ctrl.ds[key].auto)
            IRIS.ctrl.ds.auto[IRIS.ctrl.ds[key].id] = setTimeout(
                'IRIS._requestDatasource("'+IRIS.ctrl.ds[key].id+'", {})',
                IRIS.ctrl.ds[key].rate);
    }
    IRIS.ctrl.init = true;

    var engineId = '';
    if (typeof opts == 'object' && typeof opts.engine == 'string') 
        engineId = opts.engine;
    else if (typeof opts == 'string')
        engineId = opts;
    if (engineId !== '' && typeof IRIS.ctrl.engine[engineId] != 'undefined')
        new IRIS.ctrl.engine[engineId]();
        
};

IRIS._isUndef = function(a) {
    return (typeof a == 'undefined');
};

IRIS._areEqual = function(a, b) {
    return (JSON.stringify(a) == JSON.stringify(b));
};

IRIS._isObject = function(a) {
    return (typeof a == 'object' && !(a instanceof Array));
};

IRIS._isArray = function(a) {
    return (a instanceof Array);
};

IRIS._bindEvent = function(eventName, fn) {
    if (typeof fn == 'function') {
        if (typeof IRIS.fn[eventName] == 'undefined')
            IRIS.fn[eventName] = {};
        IRIS.fn[eventName][IRIS.ctrl.evCount] = fn;
        IRIS.ctrl.evCount++;
        return true;
    }
    return false;
};

IRIS._triggerEvent = function(eventName, param1, param2, param3, param4, param5, param6) {
    if (typeof IRIS.fn[eventName] !== 'undefined')
        for (var key in IRIS.fn[eventName])
            IRIS.fn[eventName][key](param1, param2, param3, param4, param5, param6);
};

IRIS._setterUndef = function(value, def) {
    if (typeof value == 'undefined')
        /*if (typeof dev == 'undefined')
            return false;
        else*/
            return def;
    else
        return value;
};

IRIS._setterVector2 = function(values, def) {
    if (values instanceof IRIS.Vector2)
        return values;
    else if (typeof values == 'object')
        return new IRIS.Vector2(values.x, values.y);
    else
        return def;
};

IRIS._setterVector3 = function(values, def) {
    if (values instanceof IRIS.Vector3)
        return values;
    else if (typeof values == 'object') 
        return new IRIS.Vector3(values.x, values.y, values.z);
    else
        return def;
};

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

/* Asset related control structures */
IRIS.ctrl.asset = {}; //stores asset descriptions.
IRIS.ctrl.assetIns = {}; //stores instances of assets.
IRIS.ctrl.entAssetRel = {}; //stores the relationship entity-asset.

/* Entity related global events */
IRIS.EV_ASSET_REGISTERED = 'assetRegistered';
IRIS.EV_ASSET_UNREGISTERED = 'assetUnregistered';
IRIS.EV_ASSET_CREATED = 'assetCreated';
IRIS.EV_ASSET_UPDATED = 'assetUpdated';
IRIS.EV_ASSET_DELETED = 'assetDeleted';

IRIS.Asset = function(opts){
    // Required
    this.id = opts.id;
    this.index = IRIS._setterUndef(opts.index);
    this.object = IRIS._setterUndef(opts.object);
    this.data = IRIS._setterUndef(opts.data);

    // Not required
    this.position = false;
    this.rotation = false;
    this.size = false;
    this.scale = 1;
    this.parent = false;
    this.style = [];
    this.state = [];
};

IRIS.Asset.prototype = {
    set: function(param, value) {
    },
    pushState: function(state) {
    },
    pullState: function(state) {
    }
};

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
        var oAsset = new IRIS.Asset({
                        id: this.getAssetId(index, data, oEntity),
                        index: index,
                        object: this.getAssetObject(index, data, oEntity),
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

IRIS.ctrl.ds = {}; //Register of all datasources
IRIS.ctrl.ds.auto = {}; //Register of datasources waiting to request
IRIS.createDatasource= function(pDS, pOpts) {
    var id  = false;
    if (typeof pDS == 'string' &&
        typeof pOpts == 'object' &&
        typeof pOpts.uri == 'string') {
        id = pDS;
    } else if (typeof pDS == 'object' &&
               typeof pDS.id == 'string') {
        pOpts = pDS;
        id    = pDS.id;
    }
    if (pDS instanceof Array) {
        var arrDS = [];
        for(var i=0; i<pDS.length; i++) {
            if (!(pDS[i] instanceof Array) &&
                typeof pDS[i].id == 'string' && 
                typeof pDS[i].uri == 'string') {
                arrDS.push(IRIS.createDatasource(pDS[i]));
            } else {
                arrDS.push(false);
            }
        }
        return arrDS;
    } else if (id !== false && typeof pOpts.uri == 'string') {
        pOpts.id = id;
        return IRIS._createDatasource(pOpts);
    }
    return false;
};

IRIS.DS_MODE_AJAX = 1;
IRIS.DS_MODE_FILE = 2;
IRIS.DS_MODE_OBJECT = 3;

IRIS._defaultDatasource = {
    mode: IRIS.DS_MODE_AJAX,
    modeOptions: { method: 'GET', data: {}},
    auto: false,
    rate: 5000,
    timeout: 0,
    firstCall: true,
    jsonp: '',
    beforeSend: null,
    success: null,
    error: null,
    complete: null
};

IRIS._createDatasource = function(pOpts) {
    pOpts = $.extend(true, {}, IRIS._defaultDatasource, pOpts);
    var oDS = new IRIS.Datasource(pOpts);
    if (typeof IRIS.ctrl.ds[oDS.id] == 'undefined') {
        IRIS.ctrl.ds[oDS.id] = oDS;
        if (IRIS.ctrl.init) {
            if (oDS.firstCall)
                oDS.requestData();
            else if (oDS.auto)
                IRIS.ctrl.ds.auto[oDS.id] = setTimeout(
                    'IRIS._requestDatasource("'+oDS.id+'", {})', oDS.rate);
        }
        return oDS;
    } else {
        //LOG datasource already registered with this ID
        return false;
    }
};

IRIS._requestDatasource = function(pId, pData) {
    if (IRIS.ctrl.ds[pId] instanceof IRIS.Datasource &&
        ! IRIS.ctrl.ds[pId]._request) {
        var oDS = IRIS.ctrl.ds[pId];
        if (typeof oDS.beforeSend == 'function')
            oDS.beforeSend(oDS);
        oDS._request = true;
        switch (oDS.mode) {
            case IRIS.DS_MODE_AJAX:
                IRIS._requestDatasourceAjax(oDS);
            break;
            case IRIS.DS_MODE_FILE:
                //TODO
            break;
            case IRIS.DS_MODE_OBJECT:
                //TODO
            break;
        }
    }
    return false;
};

IRIS._requestDatasourceAjax = function(pDS, pData) {
    var method = 'GET';
    var data = {};
    if (typeof pDS.modeOptions == 'object' &&
        typeof pDS.modeOptions.method == 'string')
        method = pDS.modeOptions.method;
    if (typeof pDS.modeOptions.data == 'object')
        data = pDS.modeOptions.data;
    data = $(true, pData, data);
    var ajaxOpts = {
        url: pDS.uri,
        type: method,
        dataType: 'json',
        data: data,
        success: IRIS._requestDatasourceAjaxSuccess,
        error: IRIS._requestDatasourceAjaxError,
        complete: IRIS._requestDatasourceAjaxComplete,
        context: pDS
    };
    if (typeof pDS.jsonp == 'string' &&
        pDS.jsonp !== '') {
        ajaxOpts.dataType = 'jsonp';
        ajaxOpts.jsonp = pDS.jsonp;
    }
    if (pDS.timeout > 0)
        ajaxOpts.timeout = pDS.timeout;
    $.ajax(ajaxOpts);
};

IRIS._requestDatasourceAjaxSuccess = function(data) {
    if (typeof this.success == 'function')
        this.success(data, this);
    //Process entities.
    if (typeof IRIS.ctrl.dsEntRel[this.id] != 'undefined')
        for(var key in IRIS.ctrl.dsEntRel[this.id])
            if (typeof IRIS.ctrl.ent[key] != 'undefined')
                IRIS.createInstances(data, IRIS.ctrl.ent[key], IRIS.ctrl.dsEntRel[this.id][key]);
};

IRIS._requestDatasourceAjaxError = function() {
    if (typeof this.error == 'function')
        this.error(this);
    //TODO log error
};

IRIS._requestDatasourceAjaxComplete = function() {
    this._request = false;
    if (this.auto)
        IRIS.ctrl.ds.auto[this.id] = setTimeout('IRIS._requestDatasource("'+this.id+'", {})', this.rate);
    if (typeof this.complete == 'function')
        this.complete(this);
};


IRIS.Datasource = function(opts){
    this.id = opts.id;
    this.uri = opts.uri;
    this.mode = opts.mode;
    this.modeOptions = opts.modeOptions;
    this.auto = opts.auto;
    this.rate = opts.rate;
    this.timeout = opts.timeout;
    this.firstCall = opts.firstCall;
    this.jsonp = opts.jsonp;
    this.beforeSend = opts.beforeSend;
    this.success = opts.success;
    this.error = opts.error;
    this.complete = opts.complete;
    this._request = false;
};

IRIS.Datasource.prototype = {
    _readOnlyFields : ['id','uri','mode'],
    requestData: function(data) {
        IRIS._requestDatasource(this.id, data);
    },
    get: function(param) {
        return this[param];
    },
    set: function(param, value) {
        if (this._readOnlyFields.indexOf(param) > -1)
            return false;
        this[param] = value;
        return true;
    }
};

IRIS.Engine = Class.extend({
    init: function(opts) {
        this.isRunning = false;
        //this.scene = opts.scene;
        this.assetProvider = this._getAssetProviderInstance(this.assetProvider, IRIS.ui.asset);

        /*Functions to be defined by each Engine specific implementation*/
        //this.getScene = opts.getScene; //Returns an instance of a scene the engine will work with.
        //this.createAsset = opts.createAsset; //Must return a valid Asset instance.
        //this.populateAsset = opts.populateAsset; //Must return true, false or an Asset.
        this.scene = this.getScene();
        this.scene.init();
        IRIS.onEntityCreated(this._createAsset.bind(this));
        IRIS.onEntityUpdated(this._updateAsset.bind(this));
        IRIS.onEntityDeleted(this._deleteAsset.bind(this));
    },
    start: function() {
        this.isRunning = true;
    },
    pause: function() {
        this.isRunning = false;
    },
    _createAsset: function(index, data, oEntity) {
        var oAsset = this.assetProvider.getAsset(index, data, oEntity);
        this.populateAsset(oAsset);
        this.scene._addAsset(oAsset);
    },
    _updateAsset: function(index, oldData, newData, oEntity) {
    },
    _deleteAsset: function(index, oEntity) {
    },
    _getAssetProviderInstance: function (id, opts) {
        if (typeof IRIS.ctrl.assetProvider[id] !== 'undefined')
            return new IRIS.ctrl.assetProvider[id](opts);
        else
            return false;
    }
});

IRIS.Engine.TYPE_1D = '1D';
IRIS.Engine.TYPE_2D = '2D';
IRIS.Engine.TYPE_3D = '3D';

IRIS.ctrl.engine = {};
IRIS.registerEngine = function(engineClass, id) {
    IRIS.ctrl.engine[id] = engineClass;
};

/* Entity related control structures */
IRIS.ctrl.ent = {}; //stores all entity descriptions.
IRIS.ctrl.entIns = {}; //stores all the instances of entities.
IRIS.ctrl.entObj = {}; //stores the objects used to create instances.
IRIS.ctrl.dsEntRel = {}; //stores the relationship datasource-entity.

/* Entity related global events */
IRIS.EV_ENTITY_REGISTERED = 'entityRegistered';
IRIS.EV_ENTITY_UNREGISTERED = 'entityUnregistered';
IRIS.EV_ENTITY_CREATED = 'entityCreated';
IRIS.EV_ENTITY_UPDATED = 'entityUpdated';
IRIS.EV_ENTITY_DELETED = 'entityDeleted';

IRIS.createEntity= function(pEntity, pOpts) {
    var id  = false;
    if (typeof pEntity == 'string') {
        id = pEntity;
        if (typeof pOpts == 'undefined')
            pOpts = {};
    } else if (typeof pEntity == 'object' &&
               typeof pEntity.id == 'string') {
        pOpts = pEntity;
        id    = pEntity.id;
    }
    if (pEntity instanceof Array) {
        var arrEntities = [];
        for(var i=0; i<pEntity.length; i++) {
            if (!(pEntity[i] instanceof Array)) {
                arrEntities.push(IRIS.createEntity(pEntity[i]));
            } else {
                arrEntities.push(false);
            }
        }
        return arrEntities;
    } else if (id !== false) {
        pOpts.id = id;
        if (typeof pOpts.ds == 'undefined')
            pOpts.ds = id;
        return IRIS._createEntity(pOpts);
    }
    return false;
};

IRIS.setEntityPath = function(pEntityId, pDatasourceId, pPath) {
    if (typeof IRIS.ctrl.dsEntRel[pDatasourceId] == 'undefined')
        IRIS.ctrl.dsEntRel[pDatasourceId] = {};
    if (typeof IRIS.ctrl.dsEntRel[pDatasourceId][pEntityId] == 'string')
        delete IRIS.ctrl.dsEntRel[pDatasourceId][pEntityId];
    else
        IRIS.ctrl.dsEntRel[pDatasourceId][pEntityId] = pPath;
};

IRIS.getEntityPath = function(pEntityId, pDatasourceId) {
    if (typeof IRIS.ctrl.dsEntRel[pDatasourceId] != 'undefined' &&
        typeof IRIS.ctrl.dsEntRel[pDatasourceId][pEntityId] != 'undefined') {
        return IRIS.ctrl.dsEntRel[pDatasourceId][pEntityId];
    }
    return false;
};

IRIS.deleteEntity = function(pEntityId, pIndex) {
    if (typeof IRIS.ctrl.entIns[pEntityId] !== 'undefined' && 
        typeof IRIS.ctrl.entIns[pEntityId][pIndex] !== 'undefined') {
        delete IRIS.ctrl.entIns[pEntityId][pIndex];
        delete IRIS.ctrl.entObj[pEntityId][pIndex];
        IRIS._triggerEvent(IRIS.EV_ENTITY_DELETED, pIndex, IRIS.ctrl.ent[pEntityId]);
        return true;
    }
    return false;
};

IRIS._defaultEntity = {
    index: '',
    exclude: '',
    lifespan: -1,
    beforeCreate: null,
    create: null,
    beforeDelete: null
};

IRIS._createEntity = function(pOpts) {
    var oEntity = false;
    pOpts = $.extend(true, {}, IRIS._defaultEntity, pOpts);
    oEntity = new IRIS.Entity(pOpts);
    if (typeof IRIS.ctrl.ent[oEntity.id] == 'undefined') {
        IRIS.ctrl.ent[oEntity.id] = oEntity;
        if (oEntity.ds instanceof Array)
            for (var dsId in oEntity.ds) {
                if (IRIS.getEntityPath(oEntity.id, oEntity.ds) === false)
                    IRIS.setEntityPath(oEntity.id, oEntity.ds[dsId], '');
            }
        else if (IRIS.getEntityPath(oEntity.id,oEntity.ds) === false)
            IRIS.setEntityPath(oEntity.id, oEntity.ds, '');
        IRIS.ctrl.entIns[oEntity.id] = {};
        IRIS.ctrl.entObj[oEntity.id] = {};
    } else {
        //LOG entities already registered with this ID
        oEntity = false;
    }
    IRIS._triggerEvent(IRIS.EV_ENTITY_REGISTERED, oEntity);
    return oEntity;
};

// Process data and creates entity's instances from it.
IRIS.createInstances = function(data, oEntity, strPath) {
    if (strPath !== '' && typeof eval('data.'+strPath) == 'undefined')
        return false; //TODO: log not path found
    var dataContainer = data;
    if (strPath !== '')
        dataContainer = eval('data.'+strPath);
    for (var key in dataContainer) {
        IRIS.createInstance(dataContainer[key], oEntity, key);
    }
};

// Instanciates an entity, index is optional
IRIS.createInstance = function(data, oEntity, index) {
    if ($.trim(oEntity.index) !== '' && typeof data[oEntity.index] !== 'undefined')
        index = data[oEntity.index];
    // TODO: define valid index for instance
    if (typeof oEntity.beforeCreate == 'function')
        oEntity.beforeCreate(index, data, oEntity);
    //Remove excluded properties before comparing objects
    if (typeof oEntity.exclude == 'string' && $.trim(oEntity.exclude) !== '')
        delete data[oEntity.exclude];
    else if (oEntity.exclude instanceof Array)
        for (var key in oEntity.exclude)
            delete data[oEntity.exclude[key]];
    var isNew = typeof IRIS.ctrl.entIns[oEntity.id][index] == 'undefined';
    if (isNew || ! IRIS._areEqual(IRIS.ctrl.entObj[oEntity.id][index], data) ) {
        if (isNew)
            IRIS._triggerEvent(IRIS.EV_ENTITY_CREATED, index, data, oEntity);
        else
            IRIS._triggerEvent(IRIS.EV_ENTITY_UPDATED, index, IRIS.ctrl.entObj[oEntity.id][index], data, oEntity);
        IRIS.ctrl.entObj[oEntity.id][index] = data;
        //TODO: set spanlife if applies.
        IRIS.ctrl.entIns[oEntity.id][index] = data;
        if (typeof oEntity.create == 'function')
            oEntity.create(index, data, oEntity);
    }
    return false;
};

IRIS.Entity = function(opts){
    this.id = opts.id;
    this.ds = opts.ds;
    this.index = opts.index;
    this.exclude = opts.exclude;
    this.lifespan = opts.lifespan;
    this.beforeCreate = opts.beforeCreate;
    this.create = opts.create;
    this.beforeDelete = opts.beforeDelete;
};

IRIS.Entity.prototype = {
    _readOnlyFields : ['id','index'],
    requestData: function(data) {
        IRIS._requestDatasource(this.id, data);
    },
    get: function(param) {
        return this[param];
    },
    set: function(param, value) {
        if (this._readOnlyFields.indexOf(param) > -1)
            return false;
        this[param] = value;
        return true;
    }
};

/* Global events binding */
IRIS.onEntityRegistered = function(fn) {
    return IRIS._bindEvent(IRIS.EV_ENTITY_REGISTERED, fn);
};

IRIS.onEntityUnregistered = function(fn) {
    return IRIS._bindEvent(IRIS.EV_ENTITY_UNREGISTERED, fn);
};

IRIS.onEntityCreated = function(fn) {
    return IRIS._bindEvent(IRIS.EV_ENTITY_CREATED, fn);
};

IRIS.onEntityUpdated = function(fn) {
    return IRIS._bindEvent(IRIS.EV_ENTITY_UPDATED, fn);
};

IRIS.onEntityDeleted = function(fn) {
    return IRIS._bindEvent(IRIS.EV_ENTITY_DELETED, fn);
};

/*
 * Setter.
 * @class SingleValueInitializer
 */
IRIS.SingleValueInitializer = Class.extend({
    min: 0,
    max: 1,
    type: 'random', // TODO define constants for getValue function
    init: function(opts){
        opts = IRIS._setterUndef(opts,{});
        this.min = IRIS._setterUndef(opts.min, this.min);
        this.max = IRIS._setterUndef(opts.max, this.max);
        // TODO set function type to getValue
    },
    getValue: function() {
        if(this.min == this.max) {
            return this.max;
        } else {
            return Math.random() * (this.max - this.min) + this.min;
        }
    },
    run: function(oAsset) {
        this._run(oAsset, this.getValue());
    }
});

IRIS.DoubleValueInitializer = Class.extend({
    minA: 0,
    maxA: 1,
    minB: 0,
    minB: 1,
    type: 'random', // TODO define constants for getValue function
    init: function(opts){
        this.minA = IRIS._setterUndef(opts.minA, this.minA);
        this.maxA = IRIS._setterUndef(opts.maxA, this.maxA);
        this.minB = IRIS._setterUndef(opts.minB, this.minB);
        this.maxB = IRIS._setterUndef(opts.maxB, this.maxB);
    },
    getValue: function() {
        return {a:0, b:0, c:0};
    },
    run: function(oAsset) {
        this._run(oAsset,
                this.getValue(this.minA, this.maxA),
                this.getValue(this.minB, this.maxB));
    }
});

IRIS.TripleValueInitializer = IRIS.DoubleValueInitializer.extend({
    minC: 0,
    maxC: 1,
    type: 'random', // TODO define constants for getValue function
    init: function(opts){
        this._super(opts);
        this.minC = IRIS._setterUndef(opts.minC, this.minC);
        this.maxC = IRIS._setterUndef(opts.maxC, this.maxC);
        // TODO set function type to getValue
    },
    run: function(oAsset) {
        this._run(oAsset,
                this.getValue(this.minA, this.maxA),
                this.getValue(this.minB, this.maxB),
                this.getValue(this.minC, this.maxC));
    }
});

IRIS.Scene = function(opts){
    this.init = opts.init;
    this.addStates = IRIS._setterUndef(opts.addStates);
    this.updateStates = IRIS._setterUndef(opts.updateStates);
    this.removeStates = IRIS._setterUndef(opts.removeStates);

    this.initializer = IRIS._setterUndef(opts.initializer);
    this.updateSetters = IRIS._setterUndef(opts.updateSetters);
    this.removeSetters = IRIS._setterUndef(opts.removeSetters);

    this.val = opts.val;
    this.obj = {};
    

    this.addAsset = opts.addAsset;
    this.removeAsset = opts.removeAsset;
    this.onFrame = opts.onFrame;

    this.ctrl = {
        asset:{}
    };

    //TODO remove misplaced initializer
    this.line3d = new IRIS.Line3DZone({scale:100});
};

IRIS.Scene.prototype = {
    getAsset: function(index, entityId) {
        if (typeof this.ctrl.asset[entityId] !== 'undefined' &&
            typeof this.ctrl.asset[entityId][index] !== 'undefined')
            return this.ctrl.asset[entityId][index];
        else
            return false;
    },
    _addAsset: function(oAsset) {
        // Apply initializer
        //TODO Handle nicely initializers TODO
        var v = this.line3d.getStep();
        oAsset.object.position.x = v.x;
        oAsset.object.position.y = v.y;
        oAsset.object.position.z = v.z;
        this.addAsset(oAsset);
    },
    _removeAsset: function() {
        //TODO: unregister asset instance
        // Apply removeSetters
        this.removeAsset();
    }
};

IRIS.ZONE_TYPE_LINE = 'line';
IRIS.ZONE_TYPE_CIRCLE = 'circle';

IRIS.ZONE_PATTERN_RANDOM = 0;
IRIS.ZONE_PATTERN_LINEAL = 1;
IRIS.ZONE_PATTERN_SPACE = 2;

IRIS.ZONE_DOMAIN_XY = 'xy';
IRIS.ZONE_DOMAIN_YZ = 'yz';
IRIS.ZONE_DOMAIN_XZ = 'xz';

IRIS.BaseVectorZone = Class.extend({
    init: function(opts) {
        this.minX = IRIS._setterUndef(opts.minX,0);
        this.maxX = IRIS._setterUndef(opts.maxX,1);
        this.minY = IRIS._setterUndef(opts.minY,0);
        this.maxY = IRIS._setterUndef(opts.maxY,1);
        this.pattern = IRIS._setterUndef(opts.pattern,IRIS.ZONE_PATTERN_RANDOM);
        this.step = IRIS._setterUndef(opts.step, 0.1);
        this.scale = IRIS._setterUndef(opts.scale, 1);
    }
});

IRIS.Vector2Zone = IRIS.BaseVectorZone.extend({
    init: function(opts) {
        this._super(opts);
        this.rotation = IRIS._setterVector2(opts.rotation, new IRIS.Vector2(0,0));
        this.position = IRIS._setterVector2(opts.position, new IRIS.Vector2(0,0));
        this.domain = IRIS._setterUndef(opts.domain, IRIS.ZONE_DOMAIN_XY);
    }
});

IRIS.Vector3Zone = IRIS.BaseVectorZone.extend({
    init: function(opts) {
        this._super(opts);
        this.minZ = IRIS._setterUndef(opts.minZ,0);
        this.maxZ = IRIS._setterUndef(opts.maxZ,1);
        this.rotation = IRIS._setterVector3(opts.rotation, new IRIS.Vector3(0,0,0));
        this.position = IRIS._setterVector3(opts.position, new IRIS.Vector3(0,0,0));
    }
});


IRIS.ctrl.zone = {};
IRIS.registerZone = function(zoneClass, id) {
    IRIS.ctrl.zone[id] = zoneClass;
};

IRIS.ScaleInitializer = IRIS.SingleValueInitializer.extend({
    init: function(opts) {
        this._super(opts);
    },
    _run: function(oAsset, scale) {
        oAsset.scale = scale;
    }
});

IRIS.Line3DZone = IRIS.Vector3Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this._start = new IRIS.Vector3(this.minX, this.minY, this.minZ);
        this._end = new IRIS.Vector3(this.maxX, this.maxY, this.maxZ);
        this._len = this._end.clone().sub(this._start);
    },
    getStep: function() {
        var len = this._len.clone();
        len.mul(Math.random());
        return len.add(this._start).mul(this.scale);
    }
});

IRIS.registerZone(IRIS.Line3DZone, 'line3D');

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

IRIS.ui = {};
IRIS.ui.asset = {};

/*
 * 2D Vector.
 * @class Vector2
 */
IRIS.Vector2 = function(x, y) {
    this.x = (x?x:0);
    this.y = (y?y:0);
};

IRIS.Vector2.prototype = {
    /**
     * Returns a copy of the vector.
     * @returns {@link Vector2}
     */
    clone: function() {
        return new IRIS.Vector2(this.x, this.y);   
    },
    /**
     * Gets the euclidean length.
     * @returns {integer}
     */
    length: function() {
        return Math.sqrt(this.length2());
    },
    /**
     * Gets the squared euclidean length.
     * @returns {integer}
     */
    length2: function() {
        return x * x + y * y;
    },
    /**
     * Substracts the given vector to this vector.
     * @param {@link Vector2} Vector to substact.
     * @returns {@link Vector2} This vector for chaining.
     */
    sub: function(v2) {
        this.x -= v2.x;
        this.y -= v2.y;
        return this;
    },
    /**
     * Adds the given vector to this vector.
     * @param {@link Vector2} Vector to add.
     * @returns {@link Vector2} This vector for chaining.
     */
    add: function(v2) {
        this.x += v2.x;
        this.y += v2.y;
        return this;
    },
    /**
     * Normalizes the vector.
     * @returns {@link Vector2} This vector for chaining.
     */
    nor: function() {
        var lenght = this.length();
        if( length !== 0 )
        {
            this.x /= length;
            this.y /= length;
        }
        return this;
    },
    /**
     * Gets the dot product between this and other vector.
     * @param {@link Vector2}
     * @returns {float|integer} Dot product.
     */
    dot: function(v2) {
        return this.x * v2.x + this.y * v2.y;
    },
    /**
     * Gets the cross product between this and other vector.
     * @param {@link Vector2}
     * @returns {float|integer} Cross product.
     */
    cross: function(v2) {
        return this.x * v2.y + this.y * v2.x;
    },
    /**
     * Multiplies this vector to a scalar.
     * @param {float|integer}
     * @returns {@link Vector2} This vector for chaining.
     */
    mul: function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    },
    /**
     * Gets the eucledian distance betweent this an other vector.
     * @param {@link Vector2} Vector to get the distance to.
     * @returns {@link Vector2} This vector for chaining.
     */
    dist: function(v2) {
        var x_d = v2.x - this.x;
        var y_d = v2.y - this.y;
        return Math.sqrt( x_d * x_d + y_d * y_d );
    },
    /**
     * Gets the eucledian squared distance betweent this an other vector.
     * @param {@link Vector2} Vector to get the distance to.
     * @returns {@link Vector2} This vector for chaining.
     */
    dist2: function(v2) {
        var x_d = v2.x - this.x;
        var y_d = v2.y - this.y;
        return x_d * x_d + y_d * y_d;
    }
};

/*
 * 3D Vector.
 * @class Vector3
 */
IRIS.Vector3 = function(x, y, z) {
    this.x = (x?x:0);
    this.y = (y?y:0);
    this.z = (z?z:0);
};

IRIS.Vector3.prototype = {
    /**
     * Returns a copy of the vector.
     * @returns {@link Vector3}
     */
    clone: function() {
        return new IRIS.Vector3(this.x, this.y, this.z);
    },
    /**
     * Gets the euclidean length.
     * @returns {integer}
     */
    length: function() {
        return Math.sqrt(this.length2());
    },
    /**
     * Gets the squared euclidean length.
     * @returns {integer}
     */
    length2: function() {
        return x * x + y * y + z * z;
    },
    /**
     * Substracts the given vector to this vector.
     * @param {@link Vector3} Vector to substact.
     * @returns {@link Vector3} This vector for chaining.
     */
    sub: function(v3) {
        this.x -= v3.x;
        this.y -= v3.y;
        this.z -= v3.z;
        return this;
    },
    /**
     * Adds the given vector to this vector.
     * @param {@link Vector3} Vector to add.
     * @returns {@link Vector3} This vector for chaining.
     */
    add: function(v3) {
        this.x += v3.x;
        this.y += v3.y;
        this.z += v3.z;
        return this;
    },
    /**
     * Normalizes the vector.
     * @returns {@link Vector3} This vector for chaining.
     */
    nor: function() {
        var lenght = this.length();
        if( length !== 0 )
        {
            this.x /= length;
            this.y /= length;
            this.z /= length;
        }
        return this;
    },
    /**
     * Gets the dot product between this and other vector.
     * @param {@link Vector3}
     * @returns {float|integer} Dot product.
     */
    dot: function(v3) {
        return this.x * v3.x + this.y * v3.y + this.z * v3.z;
    },
    /**
     * Multiplies this vector to a scalar.
     * @param {float|integer}
     * @returns {@link Vector3} This vector for chaining.
     */
    mul: function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    },
    /**
     * Gets the eucledian distance betweent this an other vector.
     * @param {@link Vector3} Vector to get the distance to.
     * @returns {@link Vector3} This vector for chaining.
     */
    dist: function(v3) {
        return Math.sqrt(this.dist2(v3));
    },
    /**
     * Gets the eucledian squared distance betweent this an other vector.
     * @param {@link Vector3} Vector to get the distance to.
     * @returns {@link Vector3} This vector for chaining.
     */
    dist2: function(v3) {
        var x_d = v3.x - this.x;
        var y_d = v3.y - this.y;
        var z_d = v2.z - this.z;
        return x_d * x_d + y_d * y_d + z_d * z_d;
    }
};

/*
 * CSS Class abstraction.
 * @class Style
 */
IRIS.Color = function(r, g, b, a) {
    this.r = (r?r:0);
    this.g = (g?g:0);
    this.b = (b?b:0);
    this.a = (a?a:1);
};

IRIS.Color.prototype = {
};

/*
 * State implementation.
 * @class State
 */
IRIS.State = function(opts) {
    this.id = opts.id;
    this.style = opts.style;
    this.easingIn = false;
    this.easingOut = false;
    this.lapseIn = 0;
    this.lapseOut = 0;
    this.durarion = 300;
};

IRIS.State.prototype = {
};

IRIS.Easing = {
    Linear: {
        None: function ( k ) {
            return k;
        }
    },
    Quadratic: {
        In: function ( k ) {
            return k * k;
        },
        Out: function ( k ) {
            return k * ( 2 - k );
        },
        InOut: function ( k ) {
            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
            return - 0.5 * ( --k * ( k - 2 ) - 1 );
        }
    },
    Cubic: {
        In: function ( k ) {
            return k * k * k;
        },
        Out: function ( k ) {
            return --k * k * k + 1;
        },
        InOut: function ( k ) {
            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
            return 0.5 * ( ( k -= 2 ) * k * k + 2 );
        }
    },
    Quartic: {
        In: function ( k ) {
            return k * k * k * k;
        },
        Out: function ( k ) {
            return 1 - ( --k * k * k * k );
        },
        InOut: function ( k ) {
            if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
            return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
        }
    },
    Quintic: {
        In: function ( k ) {
            return k * k * k * k * k;
        },
        Out: function ( k ) {
            return --k * k * k * k * k + 1;
        },
        InOut: function ( k ) {
            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
            return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
        }
    },
    Sinusoidal: {
        In: function ( k ) {
            return 1 - Math.cos( k * Math.PI / 2 );
        },
        Out: function ( k ) {
            return Math.sin( k * Math.PI / 2 );
        },
        InOut: function ( k ) {
            return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
        }

    },
    Exponential: {
        In: function ( k ) {
            return k === 0 ? 0 : Math.pow( 1024, k - 1 );
        },
        Out: function ( k ) {
            return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
        },
        InOut: function ( k ) {
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
            return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
        }
    },
    Circular: {
        In: function ( k ) {
            return 1 - Math.sqrt( 1 - k * k );
        },
        Out: function ( k ) {
            return Math.sqrt( 1 - ( --k * k ) );
        },
        InOut: function ( k ) {
            if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
            return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
        }
    },
    Elastic: {
        In: function ( k ) {
            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
        },
        Out: function ( k ) {
            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
        },
        InOut: function ( k ) {
            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
            return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
        }
    },
    Back: {
        In: function ( k ) {
            var s = 1.70158;
            return k * k * ( ( s + 1 ) * k - s );
        },
        Out: function ( k ) {
            var s = 1.70158;
            return --k * k * ( ( s + 1 ) * k + s ) + 1;
        },
        InOut: function ( k ) {
            var s = 1.70158 * 1.525;
            if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
            return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
        }
    },
    Bounce: {
        In: function ( k ) {
            return 1 - TWEEN.Easing.Bounce.Out( 1 - k );
        },
        Out: function ( k ) {
            if ( k < ( 1 / 2.75 ) ) {
                return 7.5625 * k * k;
            } else if ( k < ( 2 / 2.75 ) ) {
                return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
            } else if ( k < ( 2.5 / 2.75 ) ) {
                return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
            } else {
                return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
            }
        },
        InOut: function ( k ) {
            if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
            return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;
        }
    }
};

/*
 * Setter.
 * @class Vector3
 */
IRIS.VectorInitializer = Class.extend({
    init: function(opts){ }
});
 
IRIS.PositionInitializer = IRIS.VectorInitializer.extend({
    init: function(){ }
});

IRIS.ScaleInitializar = IRIS.VectorInitializer.extend({
    init: function(){ }
});

IRIS.RotationInitializar = IRIS.VectorInitializer.extend({
    init: function(){ }
});

IRIS.VelocityInitializer = IRIS.VectorInitializer.extend({
    init: function(){ }
});

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

IRIS.PlanetariumEngine = IRIS.Engine.extend({
        assetProvider: 'threejs',
        assetProviderOpts: {}, //TODO: how to pass this and other configurations easily??
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
                    this.obj.controls = new THREE.TrackballControls( this.obj.camera );
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
                    this.obj.controls.update(this.obj.clock.getDelta());
                    this.obj.renderer.render(this.object, this.obj.camera);
                    requestAnimationFrame(this.onFrame.bind(this));
                }
            });
        },
        populateAsset: function(oAsset,data,oEntity) {
            //oAsset.object.innerHTML = oAsset.id;
        }
    });

IRIS.registerEngine(IRIS.PlanetariumEngine, 'planetarium');

/*var oWindowsEngine = new IRIS.Engine({
        id : 'windows',
        type: IRIS.Engine.TYPE_2D,
        getScene: function() {
            return new IRIS.Scene({object: document.body});
        }
    });

IRIS.registerEngine(oWindowsEngine);*/
