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
        $.each(scope.array, function (i) {
            scope.array[i] = $(scope.array[i]);
        });
        scope.sortBy = ctx.options.sortBy || 'width';
    });

    this.use(function (scope, next) {

        if (scope.sortBy === 'width') {
            sortByWidth(scope);
        } else {
            sortByHeight(scope);
        }
        next();
    });

    function sortByWidth (scope) {
        var arrayByWidth = quickSort(scope.array, compareWidth);
        var table = [];
        var item;
        var width = 0;

        for (var i = 0, I = arrayByWidth.length; i < I; i++) {
            item = arrayByWidth[i];
            table.push({left: width, top: 0});
            width += getWidth(item);
        }

        for (var i = arrayByWidth.length - 1; i >= 0; i--) {
            setTimeout(function (n) {
                return function () {
                    var item = arrayByWidth[n];
                    var coor = table[n];
                    item.css({
                        'position': 'absolute',
                        'left': coor.left,
                        'top': coor.top
                    });
                }
            }.call(this, i));
        }
    }

    function sortByHeight (scope) {
        var arrayByHeight = quickSort(scope.array, compareHeight);
        var table = [];
        var item;
        var height = 0;

        for (var i = 0, I = arrayByHeight.length; i < I; i++) {
            item = arrayByHeight[i];
            table.push({left: 0, top: height});
            height += getHeight(item);
        }

        for (var i = 0, I = arrayByHeight.length; i < I; i++) {
            setTimeout(function (n) {
                return function () {
                    var item = arrayByHeight[n];
                    var coor = table[n];
                    item.css({
                        'position': 'absolute',
                        'left': coor.left,
                        'top': coor.top
                    });
                }
            }.call(this, i));
        }
    }

    function compareWidth (a, b) {
        var _a = getWidth(a);
        var _b = getWidth(b);
        
        return _a - _b;
    }
    function compareHeight (a, b) {
        var _a = getHeight(a);
        var _b = getHeight(b);

        return _a - _b;
    }


    function getWidth (ele) {
        return (parseInt(ele.css('margin-left'), 10) || 0) + (parseInt(ele.css('margin-right'), 10) || 0) + ele.width();
    }
    function getHeight (ele) {
        return (parseInt(ele.css('margin-top'), 10) || 0) + (parseInt(ele.css('margin-bottom'), 10) || 0) + ele.height();
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

