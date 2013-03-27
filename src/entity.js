IRIS.ctrl.ent = {};
IRIS.ctrl.dsEntRel = {};
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
    } else {
        //LOG entities already registered with this ID
        oEntity = false;
    }
    return oEntity;
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
