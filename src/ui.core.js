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
    clone: function() {
        return new IRIS.Color(this.r, this.g, this.b, this.a);
    }
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

