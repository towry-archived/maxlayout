# Maxlayout

Play html layout with javascript

#### Example

HTML code:
```html
<div class="container">
	<div class="item item-1"></div>
	<div class="item item-2"></div>
	<div class="item item-3"></div>
	<div class="item item-4"></div>
	<div class="item item-5"></div>
</div>
```

javascript code:
```javascript
(function ($) {
    var lay = maxlayout('.item', {container: '.container','strategy': 'bin-packing'});
    
    $("#arrange").on('click', function (e) {
        lay.arrange();
    });
}(jQuery));
```
