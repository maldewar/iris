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
