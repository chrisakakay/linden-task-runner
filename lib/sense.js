var SenseDOM = (function () {
    var defaultElement;
    var defaultComputedStyle;

    function offset(el) {
        if (!el.getBoundingClientRect) {
            return {};
        }

        var rect = el.getBoundingClientRect();

        return {
            top:    rect.top + document.body.scrollTop,
            left:   rect.left + document.body.scrollLeft,
            width:  el.offsetWidth,
            height: el.offsetHeight
        }
    }

    function style(el) {
        var style   = getComputedStyle(el);
        var diff    = {};
        var i       = 0;
        var propertyValue;

        for (i; i < style.length; i++) {
            propertyValue = style.getPropertyValue(style[i]);
            if (defaultComputedStyle.getPropertyValue(style[i]) !== propertyValue) {
                diff[style[i]] = propertyValue;
            }
        }

        return diff;
    }

    function init() {
        defaultElement          = document.createElement('linden-dummy-' + (new Date().getTime()));
        document.body.appendChild(defaultElement);
        defaultComputedStyle    = getComputedStyle(defaultElement);
    }

    init();

    return {
        offset:     offset,
        style:      style
    }
}());

var Sense = (function () {
    var tree            = { name: 'ROOT', children: [], path: '' };
    var excludedTags    = ['SCRIPT', 'STYLE', 'OPTION'];

    function walk(node, func, point) {
        var t = func(node);

        point.children.push(t);
        node = node.firstChild;

        while (node) {
            if (node.nodeType === 1 && excludedTags.indexOf(node.tagName) === -1) {
                walk(node, func, t);
            }

            node = node.nextSibling;
        }
    }

    function build(node) {
        return {
            type: node.tagName,
            props: {
                id:         node.id,
                class:      node.className,
                style:      SenseDOM.style(node)
            },
            offset: SenseDOM.offset(node),
            children: []
        }
    }

    function getJSON() {
        return JSON.stringify(tree);
    }

    function init(node) {
        walk(node, build, tree);
    }

    return {
        init: init,
        getJSON: getJSON
    }
}());
