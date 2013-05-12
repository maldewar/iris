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
