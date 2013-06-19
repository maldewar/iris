IRIS.MODIFIER_TARGET_POSITION = 'position';
IRIS.MODIFIER_TARGET_SCALE = 'scale';
IRIS.MODIFIER_TARGET_COLOR = 'color';
IRIS.MODIFIER_TARGET_SIZE = 'size';
IRIS.MODIFIER_TARGET_ROTATION = 'rotation';

IRIS.MODIFIER_REF_ASSET = 'asset';

IRIS.Modifier = Class.extend({
    _defaultLapse: 500,
    _defaultEasing: 'linear',
    _fromZone: false,
    _toZone: false,
    _fromRef: false,
    _toRef: false,
    init: function(opts) {
        this.id = opts.id;
        this.target = opts.target;
        this.setFrom(opts.from);
        this.setTo(opts.to);
        if (!IRIS._isUndef(opts.zone) && !this._fromZone)
            this._upgradeFrom(opts);
        this.setTween(opts);
    },
    setFrom: function(from) { //TODO: rename function to 'from' and enable chainability.
        if (IRIS._isObject(from)) {
            if (!IRIS._isUndef(from.zone) && IRIS.isZone(from.zone)) {
                this._fromZone = true;
                from = IRIS.getZone(from.zone, from);
            } else
                from = this._normalize(from);
        } else {
            from =  this._normalize(from);
        }
        if (from.ref == IRIS.MODIFIER_REF_ASSET)
            this._fromRef = IRIS.MODIFIER_REF_ASSET;        
        this.from = from;
    },
    setTo: function(to) {
        if (IRIS._isObject(to)) {
            if (!IRIS._isUndef(to.zone) && IRIS.isZone(to.zone)) {
                this._toZone = true;
                to = IRIS.getZone(to.zone, to);
            } else
                to = this._normalize(to);
        } else if(IRIS._isNumber(to)){
            to = this._normalize(to);
        } else {
            to = false;
        }
        if (to.ref == IRIS.MODIFIER_REF_ASSET)
            this._toRef = IRIS.MODIFIER_REF_ASSET;
        this.to = to;
    },
    setTween: function(opts) {
        this.lapse = this._getLapse(opts.lapse);
        this.easing = this._getEasing(opts.easing);
    },
    _apply: function(oAsset) {
        if(this._fromZone)
            var fromValue = this.from.getStep();
        else
            var fromValue = this.from.clone();
        if (this._fromRef)
            fromValue = this._normalizeToRef(fromValue, oAsset);

        if (this.to === false)
            this.apply(oAsset, fromValue);
        else {
            if (this._toZone)
                var toValue = this.to.getStep();
            else
                var toValue = this.to.clone(); //TODO: provide cloning for single value vars?
            if (this._toRef)
                toValue = this._normalizeToRef(toValue, oAsset);
            var tweenModifier = new IRIS.TweenModifier({
                                target: oAsset,
                                from: fromValue,
                                to: toValue,
                                lapse: this.lapse,
                                easing: this.easing,
                                applyFn: this.apply
                                });
            oAsset.addModifier('render', tweenModifier);
        }
    },
    _normalize: function(opts) {
        switch (this.target) {
            case IRIS.MODIFIER_TARGET_POSITION: //TODO how to send default 2d or 3d vector
            case IRIS.MODIFIER_TARGET_SIZE:
            case IRIS.MODIFIER_TARGET_ROTATION:
                return IRIS._normalizeToVector3(opts,{x:0,y:0,z:0});
            case IRIS.MODIFIER_TARGET_SCALE:
                return IRIS._normalizeToNumber(opts,1);
            case IRIS.MODIFIER_TARGET_COLOR:
                return IRIS._normalizeToColor(opts,{r:1,g:1,b:1,a:1});
            default:
                return false;
        };
    },
    _normalizeToRef: function(value, oAsset) {
        switch (this.target) {
            case IRIS.MODIFIER_TARGET_POSITION:
                if (oAsset.position === false)
                    return value;
                return value.add(oAsset.position);
            case IRIS.MODIFIER_TARGET_SIZE:
                if (oAsset.size === false)
                    return value;
                return oAsset.size;
            case IRIS.MODIFIER_TARGET_ROTATION:
                if (oAsset.rotation === false)
                    return value;
                return oAsset.rotation;
            case IRIS.MODIFIER_TARGET_SCALE:
                if (oAsset.scale === false)
                    return value;
                return oAsset.scale;
            case IRIS.MODIFIER_TARGET_COLOR:
                if (oAsset.color === false)
                    return value;
                return oAsset.color;
            default:
                return value;
        };
    },
    _upgradeFrom: function(opts) {
        if (IRIS.isZone(opts.zone) && this.from) {
            var from = IRIS.getZone(opts.zone,opts);
            from.x = this.from.x;
            from.y = this.from.y;
            if (!IRIS._isUndef(from.z))
                from.z = this.from.z;
            this.from = from;
            this._fromZone = true;
        }
    },
    _getEasing: function(easing) {
        if (IRIS._isFn(easing))
            return easing;
        switch(easing) {
            case 'quead':
            case 'quadIn':
                return TWEEN.Easing.Quadratic.In;
            case 'quadOut':
                return TWEEN.Easing.Quadratic.Out;
            case 'quadInOut':
                return TWEEN.Easing.Quadratic.InOut;
            case 'cubic':
            case 'cubicIn':
                return TWEEN.Easing.Cubic.In;
            case 'cubicOut':
                return TWEEN.Easing.Cubic.Out;
            case 'cubicInOut':
                return TWEEN.Easing.Cubic.InOut;
            case 'quart':
            case 'quartIn':
                return TWEEN.Easing.Quartic.In;
            case 'quartOut':
                return TWEEN.Easing.Quartic.Out;
            case 'quartInOut':
                return TWEEN.Easing.Quartic.InOut;
            case 'quint':
            case 'quintIn':
                return TWEEN.Easing.Quintic.In;
            case 'quintOut':
                return TWEEN.Easing.Quintic.Out;
            case 'quintInOut':
                return TWEEN.Easing.Quintic.InOut;
            case 'sin':
            case 'sinIn':
                return TWEEN.Easing.Sinusoidal.In;
            case 'sinOut':
                return TWEEN.Easing.Sinusoidal.Out;
            case 'sinInOut':
                return TWEEN.Easing.Sinusoidal.InOut;
            case 'exp':
            case 'expIn':
                return TWEEN.Easing.Exponential.In;
            case 'expOut':
                return TWEEN.Easing.Exponential.Out;
            case 'expInOut':
                return TWEEN.Easing.Exponential.InOut;
            case 'circ':
            case 'circIn':
                return TWEEN.Easing.Circular.In;
            case 'circOut':
                return TWEEN.Easing.Circular.Out;
            case 'circInOut':
                return TWEEN.Easing.Circular.InOut;
            case 'elastic':
            case 'elasticIn':
                return TWEEN.Easing.Elastic.In;
            case 'elasticOut':
                return TWEEN.Easing.Elastic.Out;
            case 'elasticInOut':
                return TWEEN.Easing.Elastic.InOut;
            case 'back':
            case 'backIn':
                return TWEEN.Easing.Back.In;
            case 'backOut':
                return TWEEN.Easing.Back.Out;
            case 'backInOut':
                return TWEEN.Easing.Back.InOut;
            case 'bounce':
            case 'bounceIn':
                return TWEEN.Easing.Bounce.In;
            case 'bounceOut':
                return TWEEN.Easing.Bounce.Out;
            case 'bounceInOut':
                return TWEEN.Easing.Bounce.InOut;
            case 'linear':
            default:
                return TWEEN.Easing.Linear.None;
        }
    },
    _getLapse: function(lapse) {
        if (IRIS._isUndef(lapse))
            return this._defaultLapse;
        else
            return parseInt(lapse);  
    }
});
