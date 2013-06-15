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

IRIS._isFn = function(a) {
    return (typeof a == 'function');
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

IRIS._parseNamespace = function(value) {
    var elems = {namespace:'',entity:''};
    if (IRIS._isString(value)) {
        var pos = value.lastIndexOf('.');
        if (pos == -1)
            elems.entity = value;
        else {
            elems.entity = value.substring(pos+1);
            elems.namespace = value.substring(0,pos);
        }
    }
    return elems;
};

/**
 * @author sole / http://soledadpenades.com
 * @author mrdoob / http://mrdoob.com
 * @author Robert Eisele / http://www.xarg.org
 * @author Philippe / http://philippe.elsass.me
 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 * @author Paul Lewis / http://www.aerotwist.com/
 * @author lechecacharro
 * @author Josh Faul / http://jocafa.com/
 * @author egraether / http://egraether.com/
 * @author endel / http://endel.me
 */

var TWEEN = TWEEN || ( function () {

	var _tweens = [];

	return {

		REVISION: '10',

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function ( tween ) {

			_tweens.push( tween );

		},

		remove: function ( tween ) {

			var i = _tweens.indexOf( tween );

			if ( i !== -1 ) {

				_tweens.splice( i, 1 );

			}

		},

		update: function ( time ) {

			if ( _tweens.length === 0 ) return false;

			var i = 0, numTweens = _tweens.length;

			time = time !== undefined ? time : ( window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );

			while ( i < numTweens ) {

				if ( _tweens[ i ].update( time ) ) {

					i ++;

				} else {

					_tweens.splice( i, 1 );

					numTweens --;

				}

			}

			return true;

		}
	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;

	// Set all starting values present on the target object
	for ( var field in object ) {

		_valuesStart[ field ] = parseFloat(object[field], 10);

	}

	this.to = function ( properties, duration ) {

		if ( duration !== undefined ) {

			_duration = duration;

		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function ( time ) {

		TWEEN.add( this );

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : (window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
		_startTime += _delayTime;

		for ( var property in _valuesEnd ) {

			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {

				if ( _valuesEnd[ property ].length === 0 ) {

					continue;

				}

				// create a local copy of the Array with the start value at the front
				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

			}

			_valuesStart[ property ] = _object[ property ];

			if( ( _valuesStart[ property ] instanceof Array ) === false ) {
				_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;

		}

		return this;

	};

	this.stop = function () {

		TWEEN.remove( this );
		return this;

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function ( times ) {

		_repeat = times;
		return this;

	};

	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function ( interpolation ) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function ( callback ) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function ( callback ) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function ( callback ) {

		_onCompleteCallback = callback;
		return this;

	};

	this.update = function ( time ) {

		if ( time < _startTime ) {

			return true;

		}

		if ( _onStartCallbackFired === false ) {

			if ( _onStartCallback !== null ) {

				_onStartCallback.call( _object );

			}

			_onStartCallbackFired = true;

		}

		var elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		var value = _easingFunction( elapsed );

		for ( var property in _valuesEnd ) {

			var start = _valuesStart[ property ] || 0;
			var end = _valuesEnd[ property ];

			if ( end instanceof Array ) {

				_object[ property ] = _interpolationFunction( end, value );

			} else {

				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}

				_object[ property ] = start + ( end - start ) * value;

			}

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _repeat > 0 ) {

				if( isFinite( _repeat ) ) {
					_repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for( var property in _valuesStartRepeat ) {

					if ( typeof( _valuesEnd[ property ] ) === "string" ) {
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
					}

					_valuesStart[ property ] = _valuesStartRepeat[ property ];

				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if ( _onCompleteCallback !== null ) {

					_onCompleteCallback.call( _object );

				}

				for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i ++ ) {

					_chainedTweens[ i ].start( time );

				}

				return false;

			}

		}

		return true;

	};

};

TWEEN.Easing = {

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

TWEEN.Interpolation = {

	Linear: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

		if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
		if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

		return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

	},

	Bezier: function ( v, k ) {

		var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

		for ( i = 0; i <= n; i++ ) {
			b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
		}

		return b;

	},

	CatmullRom: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

		if ( v[ 0 ] === v[ m ] ) {

			if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

			return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

		} else {

			if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
			if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

			return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

		}

	},

	Utils: {

		Linear: function ( p0, p1, t ) {

			return ( p1 - p0 ) * t + p0;

		},

		Bernstein: function ( n , i ) {

			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc( n ) / fc( i ) / fc( n - i );

		},

		Factorial: ( function () {

			var a = [ 1 ];

			return function ( n ) {

				var s = 1, i;
				if ( a[ n ] ) return a[ n ];
				for ( i = n; i > 1; i-- ) s *= i;
				return a[ n ] = s;

			};

		} )(),

		CatmullRom: function ( p0, p1, p2, p3, t ) {

			var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		}

	}

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
IRIS.EV_ASSET_REGISTERED = 'registered';
IRIS.EV_ASSET_UNREGISTERED = 'unregistered';
IRIS.EV_ASSET_CREATED = 'created';
IRIS.EV_ASSET_UPDATED = 'updated';
IRIS.EV_ASSET_DELETED = 'deleted';
IRIS.EV_ASSET_RENDER = 'render';

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
    this.createModifier = IRIS._setterUndef(opts.createModifier, false);
    this.updateModifier = IRIS._setterUndef(opts.updateModifier, false);
    this.deleteModifier = IRIS._setterUndef(opts.deleteModifier, false);
    this.stateModifier  = IRIS._setterUndef(opts.stateModifier, false);

    this._renderModifier = [];
};

IRIS.Asset.prototype = {
    set: function(param, value) {
    },
    pushState: function(state) {
    },
    pullState: function(state) {
    },
    addModifier: function(type, modifier) {
        if (type == IRIS.EV_ASSET_RENDER) {
            this._renderModifier.push(modifier);
            this.engine.registerRendereable(this);
        }
    },
    removeModifier: function(type) {
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
        var assetId = this.getAssetId(index, data, oEntity);
        var assetOpts = this.getAssetOpts(assetId);
        var oAsset = new IRIS.Asset({
                        id: assetId,
                        index: index,
                        object: this.getAssetObject(index, data, oEntity),
                        createModifier: assetOpts.create,
                        updateModifier: assetOpts.update,
                        deletemodifier: assetOpts.delete,
                        stateModifier: assetOpts.state,
                        data: data});
        if (IRIS._isUndef(this._assetIns[oEntity.id]))
            this._assetIns[oEntity.id] = {};
        this._assetIns[oEntity.id][index] = oAsset;
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
        opts.create = IRIS._valueToArray(opts.create);
        opts.update = IRIS._valueToArray(opts.update);
        opts.delete = IRIS._valueToArray(opts.delete);
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
IRIS.DS_MODE_OBJECT = 2;

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
    if (IRIS._isUndef(pOpts.uri))
            pOpts.mode = IRIS.DS_MODE_OBJECT;
    var oDS = new IRIS.Datasource(pOpts);
    if (typeof IRIS.ctrl.ds[oDS.id] == 'undefined') {
        IRIS.ctrl.ds[oDS.id] = oDS;
        if (IRIS.ctrl.init) {
            if (oDS.firstCall)
                oDS.requestData();
            else if (oDS.auto && oDS.mode == IRIS.DS_MODE_AJAX)
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
        IRIS._requestDatasourceAjax(oDS);
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
    IRIS._processDatasourceData(data, this);
};

IRIS._processDatasourceData = function(data, DS) {
    if (typeof IRIS.ctrl.dsEntRel[DS.id] != 'undefined')
        for(var key in IRIS.ctrl.dsEntRel[DS.id])
            if (typeof IRIS.ctrl.ent[key] != 'undefined')
                IRIS.createInstances(data, IRIS.ctrl.ent[key], IRIS.ctrl.dsEntRel[DS.id][key]);
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
    processData: function(data) {
        IRIS._processDatasourceData(data, this);
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
    _renderableAssets: [], //TODO: change to object with index to unregister assets
    init: function(opts) {
        this.isRunning = false;
        //this.scene = opts.scene;
        this.assetProvider = this._getAssetProviderInstance(this.assetProvider,
                                IRIS.ui.asset); //TODO pass opts as second param.
        this.modifierProvider = this._getModifierProviderInstance(this.modifierProvider,
                                IRIS.ui.modifier); //TODO pass opts as second param.
        /*Functions to be defined by each Engine specific implementation*/
        this.scene = this.getScene();
        this.scene.engine = this;
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
    render: function() {
        for(var key in this._renderableAssets)
            this._renderAsset(this._renderableAssets[key]);
    },
    registerRendereable: function(oAsset) {
        this._renderableAssets.push(oAsset);
    },
    _createAsset: function(index, data, oEntity) {
        var oAsset = this.assetProvider.getAsset(index, data, oEntity);
        oAsset.engine = this;
        this.modifierProvider.apply(oAsset,oAsset.createModifier);
        this.populateAsset(oAsset);
        this.scene._addAsset(oAsset);
    },
    _updateAsset: function(index, oldData, newData, oEntity) {
    },
    _deleteAsset: function(index, oEntity) {
    },
    _renderAsset: function(oAsset) {
        this.modifierProvider.apply(oAsset,oAsset._renderModifier);
    },
    _stateAsset: function(index, oAsset) {
    },
    _getAssetProviderInstance: function (id, opts) {
        if (typeof IRIS.ctrl.assetProvider[id] !== 'undefined')
            return new IRIS.ctrl.assetProvider[id](opts);
        else
            return false;
    },
    _getModifierProviderInstance: function(id, opts) {
        if (typeof IRIS.ctrl.modifierProvider[id] !== 'undefined')
            return new IRIS.ctrl.modifierProvider[id](opts);
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

IRIS.MODIFIER_TARGET_POSITION = 'position';
IRIS.MODIFIER_TARGET_SCALE = 'scale';
IRIS.MODIFIER_TARGET_COLOR = 'color';
IRIS.MODIFIER_TARGET_SIZE = 'size';
IRIS.MODIFIER_TARGET_ROTATION = 'rotation';

IRIS.Modifier = Class.extend({
    _defaultLapse: 500,
    _defaultEasing: 'linear',
    _fromZone: false,
    _toZone: false,
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
        } else if (IRIS._isNumber(from)) {
            from =  this._normalize(from);
        } else if (IRIS._isString(from)) {
            from = false; //TODO: specify special behaviors, such as take the asset current value as start point
        } else
            from = false;
        this.from = from;
    },
    setTo: function(to) {
        if (IRIS._isObject(to)) {
            if (!IRIS._isUndef(to.zone) && IRIS.isZone(to.zone)) {
                this._toZone = true;
                to = IRIS.getZone(to.zone, to);
            } else
                to = this._normalize(to);
        } else if (IRIS._isNumber(to)) {
            to = this._normalize(to);
        } else if (IRIS._isString(to)) {
            to = false; //TODO: specify special behaviors, such as take the asset current value as end point
        } else
            to = false;
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
            var fromValue = this.from;

        if (this.to === false)
            this.apply(oAsset, fromValue);
        else {
            if (this._toZone)
                var toValue = this.to.getStep();
            else
                var toValue = this.to;
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

IRIS.ModifierProvider = Class.extend({
    _modifierIns: {},
    //_entityAsset: {},
    _modifierOpts: {},
    init: function(opts) {
        if (IRIS._isObject(opts)) {
            for(var key in opts) {
                opts[key] = this._normalizeOpts(key, opts[key]);
                //this._registerEntityAssetRel(key,opts[key].entity);
                this._registerModifierOpts(key, opts[key]);
            }
        }
    },
    getModifier: function(id) {
        if (typeof this._modifierIns[id] !== 'undefined')
            return this._modifierIns[id];
        var opts = this.getModifierOpts(id);
        if (opts) {
            switch (opts.target) {
                default:
                    var oModifier = this._getModifier('id', opts);
            }
            /*var oModifier = new IRIS.Modifier({
                            id: id,
                            target: opts.target,
                            zone: opts.zone,
                            zoneOpts: opts.zoneOpts});*/
            this._modifierIns[id] = oModifier;
            return oModifier;
        }
        return false;
    },
    apply: function(oAsset, modifierIds) {
        for(var key in modifierIds) {
            if (IRIS._isString(modifierIds[key])) {
                if (!IRIS._isUndef(this._modifierOpts[modifierIds[key]])) {
                    //TODO: implement concept of shared and private modifiers
                    //IF shared we create an instance of a modifier bound to this provider
                    var modifierIns = this._modifierIns[modifierIds[key]];
                    if (IRIS._isUndef(modifierIns)) {
                        modifierIns = this._getModifierInstance(this._modifierOpts[modifierIds[key]]);
                        this._modifierIns[modifierIds[key]] = modifierIns;
                    }
                    if (modifierIns)
                        modifierIns._apply(oAsset);
                }
            } else {
                modifierIds[key].apply(oAsset);
            }
        }
    },
    getModifierOpts: function(id) {
        if (!IRIS._isUndef(this._modifierOpts[id]))
            return this._modifierOpts[id];
        return false;
    },
    _getModifierInstance: function(opts) {
        switch(opts.target) {
            case IRIS.MODIFIER_TARGET_POSITION:
                return new IRIS.ThreejsPositionModifier(opts);
            default:
                return false;
        }
    },
    _normalizeOpts: function(modifierId, opts) {
        if (typeof opts == 'object') {
            if (typeof opts.id == 'undefined')
                opts.id = modifierId;
        }
        return opts;
    },
    _registerModifierOpts: function(modifierId, opts) {
        this._modifierOpts[modifierId] = opts;
    }
});

IRIS.ctrl.modifierProvider = {};
IRIS.registerModifierProvider = function(modifierProviderClass, id) {
    IRIS.ctrl.modifierProvider[id] = modifierProviderClass;
};

IRIS.Scene = function(opts){
    this.init = opts.init;
    this.val = opts.val;
    this.obj = {};

    this.addAsset = opts.addAsset;
    this.removeAsset = opts.removeAsset;
    this.onFrame = opts.onFrame;

    this.ctrl = {
        asset:{}
    };
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
        this.addAsset(oAsset);
    },
    _removeAsset: function() {
        //TODO: unregister asset instance
        // Apply removeSetters
        this.removeAsset();
    }
};

IRIS.TweenModifier = Class.extend({
    init: function(opts) {
        this.target  = opts.target;
        this.from    = opts.from;
        this.to      = opts.to;
        this.lapse   = opts.lapse;
        this.easing  = opts.easing;
        this.applyFn = opts.applyFn;
        this.from.__target  = this.target;
        this.from.__applyFn = this.applyFn;
        this.tween = new TWEEN.Tween(this.from)
                         .to(this.to, this.lapse)
                         .easing(this.easing)
                         .onUpdate(function(){
                            this.__applyFn(this.__target, this);
                         });
        this.tween.start();
    },
    apply: function(oAsset) {
        TWEEN.update();
    }
});

IRIS.ZONE_TYPE_LINE_2D = 'line2D';
IRIS.ZONE_TYPE_CIRCLE = 'circle';
IRIS.ZONE_TYPE_DISC = 'disc';
IRIS.ZONE_TYPE_SIN = 'sin';
IRIS.ZONE_TYPE_COS = 'cos';
IRIS.ZONE_TYPE_TAN = 'tan';
IRIS.ZONE_TYPE_SQUARE = 'square';
IRIS.ZONE_TYPE_RECTANGLE = 'rectangle';
IRIS.ZONE_TYPE_VERTEX = 'vertex';

IRIS.ZONE_TYPE_LINE_3D = 'line3D';
IRIS.ZONE_TYPE_SPHERE = 'sphere';
IRIS.ZONE_TYPE_BALL = 'ball';
IRIS.ZONE_TYPE_BOX = 'box';
IRIS.ZONE_TYPE_CUBE = 'cube';
IRIS.ZONE_TYPE_SPRING = 'spring';

IRIS.ZONE_PATTERN_RANDOM = 0;
IRIS.ZONE_PATTERN_LINEAL = 1;

IRIS.ZONE_PLANE_XY = 'xy';
IRIS.ZONE_PLANE_YX = 'yx';
IRIS.ZONE_PLANE_YZ = 'yz';
IRIS.ZONE_PLANE_ZY = 'zy';
IRIS.ZONE_PLANE_XZ = 'xz';
IRIS.ZONE_PLANE_ZX = 'zx';

IRIS.BaseVectorZone = Class.extend({
    init: function(opts) {
        this.x = IRIS._setterUndef(opts.x,0);
        this.y = IRIS._setterUndef(opts.y,0);
        this.pattern = IRIS._setterUndef(opts.pattern,IRIS.ZONE_PATTERN_RANDOM);
        this.step = IRIS._setterUndef(opts.step, 0.1);
        this.scale = IRIS._setterUndef(opts.scale, 1);
    }
});

IRIS.Vector2Zone = IRIS.BaseVectorZone.extend({
    init: function(opts) {
        this._super(opts);
        this.plane = IRIS._setterUndef(opts.plane, false);
        if (this.plane) {
            this.rotation = IRIS._setterVector3(opts.rotation, new IRIS.Vector3(0,0,0));
            this.position = IRIS._setterVector3(opts.position, new IRIS.Vector3(0,0,0));
        } else {
            this.rotation = IRIS._setterVector2(opts.rotation, new IRIS.Vector2(0,0));
            this.position = IRIS._setterVector2(opts.position, new IRIS.Vector2(0,0));
        }
    },
    _vector2ToPlane: function(x, y, plane) {
        if (x instanceof IRIS.Vector2) {
            plane = y;
            y = x.y;
            x = x.x;
        }
        switch (plane) {
            case IRIS.ZONE_PLANE_YX:
                return new IRIS.Vector3(y, x, 0);
            case IRIS.ZONE_PLANE_YZ:
                return new IRIS.Vector3(0, x, y);
            case IRIS.ZONE_PLANE_ZY:
                return new IRIS.Vector3(0, y, x);
            case IRIS.ZONE_PLANE_XZ:
                return new IRIS.Vector3(x, 0, y);
            case IRIS.ZONE_PLANE_ZX:
                return new IRIS.Vector3(y, 0, x);
            default:
                return new IRIS.Vector3(x, y, 0);
        }
    }
});

IRIS.Vector3Zone = IRIS.BaseVectorZone.extend({
    init: function(opts) {
        this._super(opts);
        this.z = IRIS._setterUndef(opts.z,0);
        this.rotation = IRIS._setterVector3(opts.rotation, new IRIS.Vector3(0,0,0));
        this.position = IRIS._setterVector3(opts.position, new IRIS.Vector3(0,0,0));
    }
});

IRIS.ctrl.zone = {};
IRIS.registerZone = function(zoneClass, id) {
    IRIS.ctrl.zone[id] = zoneClass;
};
IRIS.getZone = function(id, opts) {
    if (IRIS._isUndef(IRIS.ctrl.zone[id]))
        return false;
    return new IRIS.ctrl.zone[id](opts);
};
IRIS.isZone = function(id) {
    if (IRIS._isUndef(IRIS.ctrl.zone[id]))
        return false;
    return true;
};


IRIS.VertexZone = IRIS.Vector2Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        if (!IRIS._isUndef(opts.vertices))
            this.setVertices(opts.vertices);
        this._stepVector = 0;
    },
    setVertices: function(vertices) {
        var defVec = new IRIS.Vector2(0, 0);
        if (IRIS._isArray(vertices)) {
            for(var key in vertices) {
                vertices[key] = IRIS._setterVector2(vertices[key], defVec);
                if (this.plane)
                    vertices[key] = this._vector2ToPlane(vertices[key], this.plane);
            }
            this.vertices = vertices;
            this._lengths = [];
            this._sumLengths = [];
            this._length = 0;
            var nextVertex;
            for(var i = 0; i < this.vertices.length; i++) {
                if (i == this.vertices.length-1)
                    nextVertex = this.vertices[0];
                else
                    nextVertex = this.vertices[i+1];
                var length = this.vertices[i].dist(nextVertex);
                this._lengths.push(length);
                this._sumLengths.push(this._length);
                this._length += length;
            }
        } else {
            this.vertices = false;
        }
    },
    getStep: function() {
        if (this.pattern == IRIS.ZONE_PATTERN_RANDOM) {
            this._stepVector = IRIS._random(0, this._length);
        } else {
            this._stepVector += this.step;
            if (this._stepVector > this._length)
                this._stepVector -= this._length;
        }
        return this._getPointAtLength(this._stepVector);;
    },
    _getPointAtLength: function(length) {
        var index = 0;
        for(var i = 0;i <= this._sumLengths.length; i++)
            if (length > this._sumLengths[i])
                index=i;
            else
                break;
        var startVertex = this.vertices[index];
        if (index == this.vertices.length-1)
            var endVertex = this.vertices[0];
        else
            var endVertex = this.vertices[index+1];
        var blend = (length - this._sumLengths[index])/this._lengths[index];
        return startVertex.pointTo(endVertex, blend).mul(this.scale);
    }
});

IRIS.registerZone(IRIS.VertexZone, IRIS.ZONE_TYPE_VERTEX);

IRIS.ScaleInitializer = IRIS.SingleValueInitializer.extend({
    init: function(opts) {
        this._super(opts);
    },
    _run: function(oAsset, scale) {
        oAsset.scale = scale;
    }
});

IRIS.CircleZone = IRIS.Vector2Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this.radius = IRIS._setterUndef(opts.radius,1);
        this._stepVector = 0;
    },
    getStep: function() {
        if (this.pattern == IRIS.ZONE_PATTERN_RANDOM)
            var theta = Math.PI * 2 * Math.random();
        else {
            var theta = this._stepVector;
            this._stepVector += this.step;
        }
        return new IRIS.Vector3(this.radius * Math.cos(theta) * this.scale + this.x, this.radius * Math.sin(theta) * this.scale + this.y, 0);
    }
});

IRIS.registerZone(IRIS.CircleZone, IRIS.ZONE_TYPE_CIRCLE);

IRIS.Line2DZone = IRIS.Vector2Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this.toX = IRIS._setterUndef(opts.toX,1);
        this.toY = IRIS._setterUndef(opts.toY,1);
        if (this.plane) {
            this._start = this._vector2ToPlane(this.x, this.y, this.plane);
            this._end = this._vector2ToPlane(this.toX, this.toY, this.plane);
        } else {
            this._start = new IRIS.Vector2(this.x, this.y);
            this._end = new IRIS.Vector2(this.toX, this.toY);
        }
        this._len = this._end.clone().sub(this._start);
        this._stepVector = 0;
    },
    getStep: function() {
        var len = this._len.clone();
        if (this.pattern == IRIS.ZONE_PATTERN_RANDOM)
            len.mul(Math.random());
        else {
            len.mul(this._stepVector)
            this._stepVector += this.step;
        }
        return len.add(this._start).mul(this.scale);
    }
});

IRIS.registerZone(IRIS.Line2DZone, IRIS.ZONE_TYPE_LINE_2D);

IRIS.Line3DZone = IRIS.Vector3Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this.toX = IRIS._setterUndef(opts.toX,1);
        this.toY = IRIS._setterUndef(opts.toY,1);
        this.toZ = IRIS._setterUndef(opts.toZ,1);
        this._start = new IRIS.Vector3(this.x, this.y, this.z);
        this._end = new IRIS.Vector3(this.toX, this.toY, this.toZ);
        this._len = this._end.clone().sub(this._start);
        this._stepVector = 0;
    },
    getStep: function() {
        var len = this._len.clone();
        if (this.pattern == IRIS.ZONE_PATTERN_RANDOM)
            len.mul(Math.random());
        else {
            len.mul(this._stepVector)
            this._stepVector += this.step;
        }
        return len.add(this._start).mul(this.scale);
    }
});

IRIS.registerZone(IRIS.Line3DZone, IRIS.ZONE_TYPE_LINE_3D);

IRIS.RectangleZone = IRIS.VertexZone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this.lengthX = IRIS._setterUndef(opts.lengthX, 1);
        this.lengthY = IRIS._setterUndef(opts.lengthY, 1);
        var vertices = [
            {x: this.x + this.lengthX/2, y: this.y + this.lengthY/2},
            {x: this.x - this.lengthX/2, y: this.y + this.lengthY/2},
            {x: this.x - this.lengthX/2, y: this.y - this.lengthY/2},
            {x: this.x + this.lengthX/2, y: this.y - this.lengthY/2},          
        ];
        this.setVertices(vertices);
    },
    getStep: function() {
        return this._super();
    }
});

IRIS.registerZone(IRIS.RectangleZone, IRIS.ZONE_TYPE_RECTANGLE);

IRIS.SphereZone = IRIS.Vector3Zone.extend({
    init: function(opts) {
        opts = IRIS._setterUndef(opts, {});
        this._super(opts);
        this.radius = IRIS._setterUndef(opts.radius,1);
        this._stepVector = 0;
    },
    getStep: function() {
        if (this.pattern == IRIS.ZONE_PATTERN_RANDOM) {
            var theta = Math.PI * 2 * Math.random();
            var phi = theta;
        } else {
            var theta = this._stepVector;
            var phi = this._stepVector;
            this._stepVector += this.step;
        }
        return new IRIS.Vector3(this.radius * Math.cos(phi) * Math.sin(theta) * this.scale + this.x,
                                this.radius * Math.sin(phi) * Math.sin(theta) * this.scale + this.y,
                                this.radius * Math.cos(theta) * this.scale + this.z);
    }
});

IRIS.registerZone(IRIS.SphereZone, IRIS.ZONE_TYPE_SPHERE);

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

IRIS.ThreejsModifierProvider = IRIS.ModifierProvider.extend({
    init: function(opts) {
        this._super(opts);
    },
    _getModifier: function(id, opt) {
        var oModifier = new IRIS.Modifier({
                            id: id,
                            target: opts.target,
                            zone: opts.zone,
                            zoneOpts: opts.zoneOpts});
        return oModifier;
    }

});

IRIS.registerModifierProvider(IRIS.ThreejsModifierProvider, 'threejs');

IRIS.MODIFIER_TARGET_POSITION = 'position';
IRIS.MODIFIER_TARGET_SCALE = 'scale';
IRIS.MODIFIER_TARGET_COLOR = 'color';
IRIS.MODIFIER_TARGET_SIZE = 'size';
IRIS.MODIFIER_TARGET_ROTATION = 'rotation';

IRIS.ThreejsPositionModifier = IRIS.Modifier.extend({
    init: function(opts) {
        this._super(opts);
    },
    apply: function(oAsset, val) {
        oAsset.position = val;
        oAsset.object.position.x = val.x;
        oAsset.object.position.y = val.y;
        oAsset.object.position.z = val.z;
    }
});

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
    },
    pointTo: function(v2, blend) {
        var x = this.x + blend * (v2.x - this.x);
        var y = this.y + blend * (v2.y - this.y);
        return new IRIS.Vector2(x, y);
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
        var z_d = v3.z - this.z;
        return x_d * x_d + y_d * y_d + z_d * z_d;
    },
    pointTo: function(v3, blend) {
        var x = this.x + blend * (v3.x - this.x);
        var y = this.y + blend * (v3.y - this.y);
        var z = this.z + blend * (v3.z - this.z);
        return new IRIS.Vector3(x, y, z);
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

IRIS._normalizeToVector2 = function(value, defaultParams) {
    if (IRIS._isNumber(value))
        return new IRIS.Vector2(value, value);
    else if (IRIS._isObject(value))
        return new IRIS.Vector2(value.x, value.y);
    else if (!IRIS._isUndef(defaultParams))
        return new IRIS.Vector2(defaultParams.x, defaultParams.y);
    else
        return false;
};

IRIS._normalizeToVector3 = function(value, defaultParams) {
    if (IRIS._isNumber(value))
        return new IRIS.Vector3(value, value, value);
    else if (IRIS._isObject(value))
        return new IRIS.Vector3(value.x, value.y, value.z);
    else if (!IRIS._isUndef(defaultParams))
        return new IRIS.Vector3(defaultParams.x, defaultParams.y, defaultParams.z);
    else
        return false;
};

IRIS._normalizeToNumber = function(value, defaultValue) {
    if (IRIS._isUndef(value) && !IRIS._isUndef(defaultValue))
        return defaultValue;
    if (IRIS._isNumber(value))
        return value;
    else
        return parseFloat(value);
};

IRIS._normalizeToColor = function(value, defaultParams) {
    if (IRIS._isNumber(value))
        return new IRIS.Color(value, value, value, 1);
    else if (IRIS._isObject(value))
        return new IRIS.Color(value.r, value.g, value.b, value.a);
    else if (!IRIS._isUndef(defaultParams))
        return new IRIS.Color(defaultParams.r, defaultParams.g, defaultParams.b, defaultParams.a);
    else
        return false;
};


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
                    this.engine.render();
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
