// Copyright 2015 Towry Wang
// @license MIT 
// http://github.com/towry/maxlx-default

// sorted by height
MaxlStrategy.makeStrategy('default', function () {

    this.onInit(function (ctx, scope) {
        if (!ctx.options.container) {
            scope.container = $(document.body);
        }
        else {
            scope.container = $(ctx.options.container);
        }
        /*
         else {
            throw new Error("Strategy default requires a container");
         }
        */

        scope.elements = ctx.elements;
        scope.array = Array.prototype.slice.call(scope.elements);
        scope.totalWidth = ctx.totalWidth;
        scope.leftw = scope.totalWidth, scope.usedw = 0, scope.top = 0;
        $.each(scope.array, function (i) {
            scope.array[i] = $(scope.array[i]);
        });
    });

    this.use(function (scope, next) {
        var first = getFirst(scope);
        first.css({
            'position': 'absolute',
            'left': 0,
            'top': 0
        })
        scope.usedw += getWidth(first);
        scope.leftw = scope.totalWidth - scope.usedw;
    });

    function bin2d (ele, scope) {
        var less = [], great = [], equal = [];
        var _, _w, w = getWidth(ele);
        var _h, h = getHeight(ele);

        for (var i = 0, I = scope.array.length; i < I; i++) {
           _ = scope.array[i]; 
           _w = getWidth(_);
           _h = getHeight(_);

           if (_h == h) {
               equal.push(_);
           } else if (_h > h) {
               great.push(_);
           } else {
               less.push(_);
           }

           if (equal.length) {
               after(arr, scope);
           }
        }
    }

    function after (arr, scope) {
        if (!arr.length) return;

            
    }

    // this can be recursively
    // in the first place, depth is 1, means 100%
    function split (ele, depth, scope) {
        var equal = [], less = [], great = [];
        var w = getWidth(ele);
        // because it's sorted by height
        var h = getHeight(ele) / depth;
        var w2, h2;
        var n;
        
        for (var i = 0, I = scope.array.length; i < I; i++) {
            n = scope.arrray[i];
            w2 = getWidth(n);
            h2 = getHeight(n);

            if (h2 == h) {
                equal.push(n);
            } else if (h2 > h) {
                great.push(n);
            } else {
                less.push(n);
            }

            if (!equal.length && !less.length) {
                // stop split, just use great
                after(great, scope);
                return;
            }
            else if (equal.length) {
                after(equal, scope);
                return;
            }
            else {
            }
        }
    }

    function getWidth (ele) {
        return (parseInt(ele.css('margin-left'), 10) || 0) + (parseInt(ele.css('margin-right'), 10) || 0) + ele.width();
    }
    function getHeight (ele) {
        return (parseInt(ele.css('margin-top'), 10) || 0) + (parseInt(ele.css('margin-bottom'), 10) || 0) + ele.height();
    }

    function findMin (scope) {
        if (!scope.array.length) {
            return;
        }
        var m = $(scope.array[0]).width();
        var n;

        for (var i = 1, I = scope.array.length; i < I; i++) {
            n = $(scope.array[i]).width();
            if (n < m) {
                m = n;
            }
        }

        scope.min = m;
    }

    function place (ele, scope) {
        setTimeout(function (_) {
            return function () {
                var css = {
                    'position': 'absolute',
                    'left': scope.usedw,
                    'top': scope.top
                }

                scope.usedw += _.width();
                scope.leftw = scope.totalWidth - scope.usedw; 
                if (scope.leftw < scope.min) {
                    scope.top += scope.maxHeight;
                }
            }
        }.call(this, ele));
    }

    function getFirst (scope) {
        var length = scope.array.length;
        var first;

        if (length === 1) {
            return scope.array[0];
        }

        first = Math.floor(Math.random() * length);
        return (scope.array.splice(first, 1)).pop();
    }
});

