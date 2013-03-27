IRIS = {};
IRIS.ctrl = {
    init: false
};

IRIS.start = function() {
    for(var key in IRIS.ctrl.ds) {
        if (IRIS.ctrl.ds[key].firstCall)
            IRIS.ctrl.ds[key].requestData();
        else if (IRIS.ctrl.ds[key].auto)
            IRIS.ctrl.ds.auto[IRIS.ctrl.ds[key].id] = setTimeout(
                'IRIS._requestDatasource("'+IRIS.ctrl.ds[key].id+'", {})',
                IRIS.ctrl.ds[key].rate);
    }
    IRIS.ctrl.init = true;
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
