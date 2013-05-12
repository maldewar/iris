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
