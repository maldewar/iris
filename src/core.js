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

IRIS._isNumber = function(a) {
    return (typeof a == 'number');
};

IRIS._isString = function(a) {
    return (typeof a == 'string');
};

IRIS._valueToArray = function(a) {
    if (a instanceof Array)
        return a;
    if (typeof a !== 'undefined')
        return [a];
    return [];
};

IRIS._random = function(start, end) {
    return ((end - start) * Math.random()) + start;
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
