
# customScrollbarCssJs
  
Custom Scrollbar is a lightweight, pure JavaScript and CSS solution for creating fully customizable scrollbars. Built on ```<div>``` elements, it allows complete styling control using your own CSS. With a small footprint and a few basic options, it provides a simple yet flexible way to enhance scrolling experiences.

## Available options::
**scrollbarDirection**: vertical/horizontal -> default: 'vertical'

**scrollbarPosX**: left/right -> default: 'right'
**scrollbarPosY**: top/bottom -> default: 'bottom'

**alwaysVisible**: true/false -> default: 'false'

**scrollbarClass**: default: ''

## Usage/Examples

```html
<script src="customScrollbarCssJs.min.js"></script>
<script>
    const myScrollbar = new customScrollbarCssJs('.my-element', {
        scrollbarDirection: 'horizontal',
        scrollbarClass: 'my-scrollbar',
    });
</script>
