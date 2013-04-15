IRIS = {};
IRIS.ctrl = {
    init: false,
    evCount: 0
};
IRIS.fn = {};

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

IRIS._areEqual = function(a, b) {
    return (JSON.stringify(a) == JSON.stringify(b));
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
