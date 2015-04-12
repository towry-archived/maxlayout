/*!
 * Maxlayout library
 * 
 * @copyright (c) 2015, Towry Wang
 * @license MIT http://towry.me/mit-license
 */

window.maxlayout = (function ($) {

    function MaxLayout (selector, options) {
        this.options = $.extend({}, options);
        this.selector = selector;

        init.call(this);
    }

    /*Layout:: */
    function init () {
        this.elements = $(this.selector);
        if (!this.elements.length) return;
    }

    // arrange the layout
    // you can call this method mutiple times
    MaxLayout.prototype.arrange = function () {
        var strategy;
        if (this.options.strategy) {
            strategy = getStrategy(this.options.strategy);
        }
        if (typeof strategy === 'undefined') {
            strategy = getStrategy('default');
        }

        strategy.implement(this);
    }
    MaxLayout.prototype.config = function (name, value) {
        if (!this.options) return;
        this.options[name] = value;
    }

    var Strategy = {factories: {}};

    function getStrategy(strategy) {
        return Strategy.getStrategy(strategy);
    }

    Strategy.getStrategy = function (s) {
        if (!(s in this.factories)) {
            return (void 0);
        }

        var strategy = this.factories[s];
        if (typeof strategy === 'object' && typeof strategy.get === 'function') {
            return strategy.get();
        } else {
            return strategy();
        }
    }

    Strategy.makeStrategy = function (n, s) {
        if (n in this.factories) {
            throw new Error("strategy {" + n + "} already exists");
        }
        this.factories[n] = function () {
            var _s = new StrategyConcrete(n);
            s.call(_s);

            return _s;
        };
    }

    function StrategyConcrete () {
        var context = null;
        var callbacks = [];
        var initCallback = null;
        var scope = {};

        this.onInit = function (cb) {
            initCallback = cb;
        }

        this.implement = function (ctx) {
            context = ctx;

            initCallback !== null && initCallback.call(this, ctx, scope);
            next();
        }

        this.use = function (cb) {
            if (!typeof cb === 'function') {
                throw new TypeError("you must provide a callback");
            }
            callbacks.push(cb);
        }

        function next () {
            var cb = callbacks.shift();
            cb && cb.call(null, scope, next);
        }
    }
        

    window.MaxlStrategy = Strategy;

    return function (selector, options) {
        var lay = new MaxLayout(selector, options);
        var api = {
            arrange: function () { lay.arrange.call(lay) },
            config: function () { var args = [].slice.call(arguments); lay.config.apply(lay, args); }
        };
        
        return api;
    };
})(jQuery);

