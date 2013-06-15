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
