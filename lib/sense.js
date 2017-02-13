var SenseDOM = (function () {
    var defaultElement;
    var defaultComputedStyle;

    function offset(el) {
        if (!el.getBoundingClientRect) {
            console.log(el);
            return {};
        }

        var rect = el.getBoundingClientRect();

        return {
            top:    rect.top + document.body.scrollTop,
            left:   rect.left + document.body.scrollLeft
        }
    }

    function getStyle(el) {
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
        offset: offset,
        getStyle: getStyle
    }
}());

var Sense = (function () {
    var tree = { name: 'ROOT', nodes: [], path: '' };

    function walk(node, func, point) {
        var t = func(node, point);

        point.nodes.push(t);
        node = node.firstChild;

        while (node) {
            if (node.nodeType === 1 && node.tagName !== 'SCRIPT') {
                walk(node, func, t);
            }

            node = node.nextSibling;
        }
    }

    function build(node, parent) {
        var elem    = {};

        elem.name   = node.tagName;
        elem.nodes  = [];
        // elem.style  = SenseDOM.getStyle(node);
        elem.offset = {
            top: SenseDOM.offset(node).top,
            left: SenseDOM.offset(node).left,
            width: 0,
            height: 0
        };

        if (node.id !== '') {
            elem.name += '#' + node.id;
        }

        if (node.className !== '') {
            elem.name += '.' + node.className.split(' ').join('.');
        }

        elem.path = parent.path + (parent.path ? ' ' : '') + elem.name;

        return elem;
    }

    function convertToJson() {
        return JSON.stringify(tree);
    }

    function init(node) {
        walk(node, build, tree);
    }

    return {
        init: init,
        getJSON: convertToJson
    }
}());
