/*! UIkit 3.0.0-rc.17 | http://www.getuikit.com | (c) 2014 - 2018 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define('uikittest', factory) :
    (factory());
}(this, (function () { 'use strict';

    var objPrototype = Object.prototype;

    var hyphenateCache = {};
    var hyphenateRe = /([a-z\d])([A-Z])/g;

    function hyphenate(str) {

        if (!(str in hyphenateCache)) {
            hyphenateCache[str] = str
                .replace(hyphenateRe, '$1-$2')
                .toLowerCase();
        }

        return hyphenateCache[str];
    }

    function toUpper(_, c) {
        return c ? c.toUpperCase() : '';
    }

    function ucfirst(str) {
        return str.length ? toUpper(null, str.charAt(0)) + str.slice(1) : '';
    }

    var strPrototype = String.prototype;
    var startsWithFn = strPrototype.startsWith || function (search) { return this.lastIndexOf(search, 0) === 0; };

    function startsWith(str, search) {
        return startsWithFn.call(str, search);
    }

    var includesFn = function (search) { return ~this.indexOf(search); };
    var includesStr = strPrototype.includes || includesFn;
    var includesArray = Array.prototype.includes || includesFn;

    function includes(obj, search) {
        return obj && (isString(obj) ? includesStr : includesArray).call(obj, search);
    }

    var isArray = Array.isArray;

    function isFunction(obj) {
        return typeof obj === 'function';
    }

    function isObject(obj) {
        return obj !== null && typeof obj === 'object';
    }

    function isWindow(obj) {
        return isObject(obj) && obj === obj.window;
    }

    function isDocument(obj) {
        return isObject(obj) && obj.nodeType === 9;
    }

    function isJQuery(obj) {
        return isObject(obj) && !!obj.jquery;
    }

    function isNode(obj) {
        return obj instanceof Node || isObject(obj) && obj.nodeType >= 1;
    }

    var toString = objPrototype.toString;
    function isNodeCollection(obj) {
        return toString.call(obj).match(/^\[object (NodeList|HTMLCollection)\]$/);
    }

    function isString(value) {
        return typeof value === 'string';
    }

    function isNumber(value) {
        return typeof value === 'number';
    }

    function isNumeric(value) {
        return isNumber(value) || isString(value) && !isNaN(value - parseFloat(value));
    }

    function isUndefined(value) {
        return value === void 0;
    }

    function toNode(element) {
        return isNode(element) || isWindow(element) || isDocument(element)
            ? element
            : isNodeCollection(element) || isJQuery(element)
                ? element[0]
                : isArray(element)
                    ? toNode(element[0])
                    : null;
    }

    var arrayProto = Array.prototype;
    function toNodes(element) {
        return isNode(element)
            ? [element]
            : isNodeCollection(element)
                ? arrayProto.slice.call(element)
                : isArray(element)
                    ? element.map(toNode).filter(Boolean)
                    : isJQuery(element)
                        ? element.toArray()
                        : [];
    }

    function each(obj, cb) {
        for (var key in obj) {
            cb.call(obj[key], obj[key], key);
        }
    }

    function attr(element, name, value) {

        if (isObject(name)) {
            for (var key in name) {
                attr(element, key, name[key]);
            }
            return;
        }

        if (isUndefined(value)) {
            element = toNode(element);
            return element && element.getAttribute(name);
        } else {
            toNodes(element).forEach(function (element) {

                if (isFunction(value)) {
                    value = value.call(element, attr(element, name));
                }

                if (value === null) {
                    removeAttr(element, name);
                } else {
                    element.setAttribute(name, value);
                }
            });
        }

    }

    function removeAttr(element, name) {
        element = toNodes(element);
        name.split(' ').forEach(function (name) { return element.forEach(function (element) { return element.removeAttribute(name); }
            ); }
        );
    }

    function find(selector, context) {
        return toNode(_query(selector, context, 'querySelector'));
    }

    function findAll(selector, context) {
        return toNodes(_query(selector, context, 'querySelectorAll'));
    }

    function _query(selector, context, queryFn) {
        if ( context === void 0 ) context = document;


        if (!selector || !isString(selector)) {
            return null;
        }

        selector = selector.replace(contextSanitizeRe, '$1 *');

        var removes;

        if (isContextSelector(selector)) {

            removes = [];

            selector = selector.split(',').map(function (selector, i) {

                var ctx = context;

                selector = selector.trim();

                if (selector[0] === '!') {

                    var selectors = selector.substr(1).trim().split(' ');
                    ctx = closest(context.parentNode, selectors[0]);
                    selector = selectors.slice(1).join(' ').trim();

                }

                if (selector[0] === '-') {

                    var selectors$1 = selector.substr(1).trim().split(' ');
                    var prev = (ctx || context).previousElementSibling;
                    ctx = matches(prev, selector.substr(1)) ? prev : null;
                    selector = selectors$1.slice(1).join(' ');

                }

                if (!ctx) {
                    return null;
                }

                if (!ctx.id) {
                    ctx.id = "uk-" + (Date.now()) + i;
                    removes.push(function () { return removeAttr(ctx, 'id'); });
                }

                return ("#" + (escape(ctx.id)) + " " + selector);

            }).filter(Boolean).join(',');

            context = document;

        }

        try {

            return context[queryFn](selector);

        } catch (e) {

            return null;

        } finally {

            removes && removes.forEach(function (remove) { return remove(); });

        }

    }

    var contextSelectorRe = /(^|,)\s*[!>+~-]/;
    var contextSanitizeRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;

    function isContextSelector(selector) {
        return isString(selector) && selector.match(contextSelectorRe);
    }

    var elProto = Element.prototype;
    var matchesFn = elProto.matches || elProto.webkitMatchesSelector || elProto.msMatchesSelector;

    function matches(element, selector) {
        return toNodes(element).some(function (element) { return matchesFn.call(element, selector); });
    }

    var closestFn = elProto.closest || function (selector) {
        var ancestor = this;

        do {

            if (matches(ancestor, selector)) {
                return ancestor;
            }

            ancestor = ancestor.parentNode;

        } while (ancestor && ancestor.nodeType === 1);
    };

    function closest(element, selector) {

        if (startsWith(selector, '>')) {
            selector = selector.slice(1);
        }

        return isNode(element)
            ? element.parentNode && closestFn.call(element, selector)
            : toNodes(element).map(function (element) { return element.parentNode && closestFn.call(element, selector); }).filter(Boolean);
    }

    var escapeFn = window.CSS && CSS.escape || function (css) { return css.replace(/([^\x7f-\uFFFF\w-])/g, function (match) { return ("\\" + match); }); };
    function escape(css) {
        return isString(css) ? escapeFn.call(null, css) : '';
    }

    function within(element, selector) {
        return !isString(selector)
            ? element === selector || (isDocument(selector)
                ? selector.documentElement
                : toNode(selector)).contains(toNode(element)) // IE 11 document does not implement contains
            : matches(element, selector) || closest(element, selector);
    }

    function on() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];


        var ref = getArgs(args);
        var targets = ref[0];
        var type = ref[1];
        var selector = ref[2];
        var listener = ref[3];
        var useCapture = ref[4];

        targets = toEventTargets(targets);

        if (selector) {
            listener = delegate(targets, selector, listener);
        }

        if (listener.length > 1) {
            listener = detail(listener);
        }

        type.split(' ').forEach(function (type) { return targets.forEach(function (target) { return target.addEventListener(type, listener, useCapture); }
            ); }
        );
        return function () { return off(targets, type, listener, useCapture); };
    }

    function off(targets, type, listener, useCapture) {
        if ( useCapture === void 0 ) useCapture = false;

        targets = toEventTargets(targets);
        type.split(' ').forEach(function (type) { return targets.forEach(function (target) { return target.removeEventListener(type, listener, useCapture); }
            ); }
        );
    }

    function getArgs(args) {
        if (isFunction(args[2])) {
            args.splice(2, 0, false);
        }
        return args;
    }

    function delegate(delegates, selector, listener) {
        var this$1 = this;

        return function (e) {

            delegates.forEach(function (delegate) {

                var current = selector[0] === '>'
                    ? findAll(selector, delegate).reverse().filter(function (element) { return within(e.target, element); })[0]
                    : closest(e.target, selector);

                if (current) {
                    e.delegate = delegate;
                    e.current = current;

                    listener.call(this$1, e);
                }

            });

        };
    }

    function detail(listener) {
        return function (e) { return isArray(e.detail) ? listener.apply(void 0, [e].concat(e.detail)) : listener(e); };
    }

    function isEventTarget(target) {
        return target && 'addEventListener' in target;
    }

    function toEventTarget(target) {
        return isEventTarget(target) ? target : toNode(target);
    }

    function toEventTargets(target) {
        return isArray(target)
                ? target.map(toEventTarget).filter(Boolean)
                : isString(target)
                    ? findAll(target)
                    : isEventTarget(target)
                        ? [target]
                        : toNodes(target);
    }

    /* global DocumentTouch */

    var isIE = /msie|trident/i.test(window.navigator.userAgent);
    var isRtl = attr(document.documentElement, 'dir') === 'rtl';

    var hasTouchEvents = 'ontouchstart' in window;
    var hasPointerEvents = window.PointerEvent;
    var hasTouch = hasTouchEvents
        || window.DocumentTouch && document instanceof DocumentTouch
        || navigator.maxTouchPoints; // IE >=11

    function prepend(parent, element) {

        parent = $(parent);

        if (!parent.hasChildNodes()) {
            return append(parent, element);
        } else {
            return insertNodes(element, function (element) { return parent.insertBefore(element, parent.firstChild); });
        }
    }

    function append(parent, element) {
        parent = $(parent);
        return insertNodes(element, function (element) { return parent.appendChild(element); });
    }

    function insertNodes(element, fn) {
        element = isString(element) ? fragment(element) : element;
        return element
            ? 'length' in element
                ? toNodes(element).map(fn)
                : fn(element)
            : null;
    }

    var fragmentRe = /^\s*<(\w+|!)[^>]*>/;
    var singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

    function fragment(html) {

        var matches$$1 = singleTagRe.exec(html);
        if (matches$$1) {
            return document.createElement(matches$$1[1]);
        }

        var container = document.createElement('div');
        if (fragmentRe.test(html)) {
            container.insertAdjacentHTML('beforeend', html.trim());
        } else {
            container.textContent = html;
        }

        return container.childNodes.length > 1 ? toNodes(container.childNodes) : container.firstChild;

    }

    function $(selector, context) {
        return !isString(selector)
            ? toNode(selector)
            : isHtml(selector)
                ? toNode(fragment(selector))
                : find(selector, context);
    }

    function isHtml(str) {
        return str[0] === '<' || str.match(/^\s*</);
    }

    function addClass(element) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        apply$1(element, args, 'add');
    }

    function removeClass(element) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        apply$1(element, args, 'remove');
    }

    function apply$1(element, args, fn) {
        args = getArgs$1(args).filter(Boolean);

        args.length && toNodes(element).forEach(function (ref) {
            var classList = ref.classList;

            supports.Multiple
                ? classList[fn].apply(classList, args)
                : args.forEach(function (cls) { return classList[fn](cls); });
        });
    }

    function getArgs$1(args) {
        return args.reduce(function (args, arg) { return args.concat.call(args, isString(arg) && includes(arg, ' ') ? arg.trim().split(' ') : arg); }
            , []);
    }

    var supports = {};

    // IE 11
    (function () {

        var list = document.createElement('_').classList;
        if (list) {
            list.add('a', 'b');
            list.toggle('c', false);
            supports.Multiple = list.contains('b');
            supports.Force = !list.contains('c');
        }
        list = null;

    })();

    var cssNumber = {
        'animation-iteration-count': true,
        'column-count': true,
        'fill-opacity': true,
        'flex-grow': true,
        'flex-shrink': true,
        'font-weight': true,
        'line-height': true,
        'opacity': true,
        'order': true,
        'orphans': true,
        'widows': true,
        'z-index': true,
        'zoom': true
    };

    function css(element, property, value) {

        return toNodes(element).map(function (element) {

            if (isString(property)) {

                property = propName(property);

                if (isUndefined(value)) {
                    return getStyle(element, property);
                } else if (!value && value !== 0) {
                    element.style.removeProperty(property);
                } else {
                    element.style[property] = isNumeric(value) && !cssNumber[property] ? (value + "px") : value;
                }

            } else if (isArray(property)) {

                var styles = getStyles(element);

                return property.reduce(function (props, property) {
                    props[property] = styles[propName(property)];
                    return props;
                }, {});

            } else if (isObject(property)) {
                each(property, function (value, property) { return css(element, property, value); });
            }

            return element;

        })[0];

    }

    function getStyles(element, pseudoElt) {
        element = toNode(element);
        return element.ownerDocument.defaultView.getComputedStyle(element, pseudoElt);
    }

    function getStyle(element, property, pseudoElt) {
        return getStyles(element, pseudoElt)[property];
    }

    var cssProps = {};

    function propName(name) {

        var ret = cssProps[name];
        if (!ret) {
            ret = cssProps[name] = vendorPropName(name) || name;
        }
        return ret;
    }

    var cssPrefixes = ['webkit', 'moz', 'ms'];
    var ref = document.createElement('_');
    var style = ref.style;

    function vendorPropName(name) {

        name = hyphenate(name);

        if (name in style) {
            return name;
        }

        var i = cssPrefixes.length, prefixedName;

        while (i--) {
            prefixedName = "-" + (cssPrefixes[i]) + "-" + name;
            if (prefixedName in style) {
                return prefixedName;
            }
        }
    }

    /*
        Based on:
        Copyright (c) 2016 Wilson Page wilsonpage@me.com
        https://github.com/wilsonpage/fastdom
    */

    var fastdom = {

        reads: [],
        writes: [],

        read: function(task) {
            this.reads.push(task);
            scheduleFlush();
            return task;
        },

        write: function(task) {
            this.writes.push(task);
            scheduleFlush();
            return task;
        },

        clear: function(task) {
            return remove$1(this.reads, task) || remove$1(this.writes, task);
        },

        flush: function() {

            runTasks(this.reads);
            runTasks(this.writes.splice(0, this.writes.length));

            this.scheduled = false;

            if (this.reads.length || this.writes.length) {
                scheduleFlush();
            }

        }

    };

    function scheduleFlush() {
        if (!fastdom.scheduled) {
            fastdom.scheduled = true;
            requestAnimationFrame(fastdom.flush.bind(fastdom));
        }
    }

    function runTasks(tasks) {
        var task;
        while ((task = tasks.shift())) {
            task();
        }
    }

    function remove$1(array, item) {
        var index = array.indexOf(item);
        return !!~index && !!array.splice(index, 1);
    }

    /* global UIkit */

    var storage = window.sessionStorage;
    var key = '_uikit_style';
    var keyinverse = '_uikit_inverse';
    var docEl = document.documentElement;

    // try to load themes.json
    var request = new XMLHttpRequest();
    request.open('GET', '../themes.json', false);
    request.send(null);

    var themes = request.status === 200 ? JSON.parse(request.responseText) : {};
    var styles = {
        core: {css: '../dist/css/uikit-core.css'},
        theme: {css: '../dist/css/uikit.css'}
    };
    var component = location.pathname.split('/').pop().replace(/.html$/, '');

    for (var theme in themes) {
        styles[theme] = themes[theme];
    }

    var variations = {
        '': 'Default',
        light: 'Dark',
        dark: 'Light'
    };

    if (getParam('style') && getParam('style').match(/\.(json|css)$/)) {
        styles.custom = getParam('style');
    }

    storage[key] = storage[key] || 'core';
    storage[keyinverse] = storage[keyinverse] || '';

    var dir = storage._uikit_dir || 'ltr';

    // set dir
    docEl.dir = dir;

    var style$1 = styles[storage[key]] || styles.theme;

    // add style
    document.writeln(("<link rel=\"stylesheet\" href=\"" + (dir !== 'rtl' ? style$1.css : style$1.css.replace('.css', '').concat('-rtl.css')) + "\">"));

    // add javascript
    document.writeln('<script src="../dist/js/uikit.js"></script>');
    document.writeln(("<script src=\"" + (style$1.icons ? style$1.icons : '../dist/js/uikit-icons.js') + "\"></script>"));

    on(window, 'load', function () { return setTimeout(function () { return fastdom.write(function () {

        var $body = document.body;
        var $container = prepend($body, (" <div class=\"uk-container\"> <select class=\"uk-select uk-form-width-small\" style=\"margin: 20px 20px 20px 0\"> <option value=\"index.html\">Overview</option> " + ([
                        'accordion',
                        'alert',
                        'align',
                        'animation',
                        'article',
                        'background',
                        'badge',
                        'base',
                        'breadcrumb',
                        'button',
                        'card',
                        'close',
                        'column',
                        'comment',
                        'container',
                        'countdown',
                        'cover',
                        'description-list',
                        'divider',
                        'dotnav',
                        'drop',
                        'dropdown',
                        'filter',
                        'flex',
                        'form',
                        'grid',
                        'grid-masonry',
                        'grid-parallax',
                        'heading',
                        'height',
                        'height-expand',
                        'height-viewport',
                        'icon',
                        'iconnav',
                        'image',
                        'label',
                        'leader',
                        'lightbox',
                        'link',
                        'list',
                        'margin',
                        'marker',
                        'modal',
                        'nav',
                        'navbar',
                        'notification',
                        'offcanvas',
                        'overlay',
                        'padding',
                        'pagination',
                        'parallax',
                        'position',
                        'placeholder',
                        'progress',
                        'scroll',
                        'scrollspy',
                        'search',
                        'section',
                        'slidenav',
                        'slider',
                        'slideshow',
                        'sortable',
                        'spinner',
                        'sticky',
                        'sticky-navbar',
                        'subnav',
                        'svg',
                        'switcher',
                        'tab',
                        'table',
                        'text',
                        'thumbnav',
                        'tile',
                        'toggle',
                        'tooltip',
                        'totop',
                        'transition',
                        'utility',
                        'upload',
                        'video',
                        'visibility',
                        'width'
                    ].sort().map(function (name) { return ("<option value=\"" + name + ".html\">" + (name.split('-').map(ucfirst).join(' ')) + "</option>"); }).join('')) + " </select> <select class=\"uk-select uk-form-width-small\" style=\"margin: 20px\"> " + (Object.keys(styles).map(function (style) { return ("<option value=\"" + style + "\">" + (ucfirst(style)) + "</option>"); }).join('')) + " </select> <select class=\"uk-select uk-form-width-small\" style=\"margin: 20px\"> " + (Object.keys(variations).map(function (name) { return ("<option value=\"" + name + "\">" + (variations[name]) + "</option>"); }).join('')) + "         </select> <label style=\"margin: 20px\"> <input type=\"checkbox\" class=\"uk-checkbox\"/> <span style=\"margin: 5px\">RTL</span> </label> </div> "));

        var ref = $container.children;
        var $tests = ref[0];
        var $styles = ref[1];
        var $inverse = ref[2];
        var $rtl = ref[3];

        // Tests
        // ------------------------------

        on($tests, 'change', function () {
            if ($tests.value) {
                location.href = "" + ($tests.value) + (styles.custom ? ("?style=" + (getParam('style'))) : '');
            }
        });
        $tests.value = component && (component + ".html");

        // Styles
        // ------------------------------

        on($styles, 'change', function () {
            storage[key] = $styles.value;
            location.reload();
        });
        $styles.value = storage[key];

        // Variations
        // ------------------------------

        $inverse.value = storage[keyinverse];

        if ($inverse.value) {

            removeClass(document.querySelectorAll('*'), [
                'uk-navbar-container',
                'uk-card-default',
                'uk-card-muted',
                'uk-card-primary',
                'uk-card-secondary',
                'uk-tile-default',
                'uk-tile-muted',
                'uk-tile-primary',
                'uk-tile-secondary',
                'uk-section-default',
                'uk-section-muted',
                'uk-section-primary',
                'uk-section-secondary',
                'uk-overlay-default',
                'uk-overlay-primary'
            ]);

            css(docEl, 'background', $inverse.value === 'dark' ? '#fff' : '#222');
            addClass($body, ("uk-" + ($inverse.value)));

        }

        on($inverse, 'change', function () {
            storage[keyinverse] = $inverse.value;
            location.reload();
        });

        // RTL
        // ------------------------------

        on($rtl, 'change', function (ref) {
            var target = ref.target;

            storage._uikit_dir = target.checked ? 'rtl' : 'ltr';
            location.reload();
        });
        $rtl.firstElementChild.checked = dir === 'rtl';

        css(docEl, 'paddingTop', '');

    }); }, 100); });

    css(docEl, 'paddingTop', '80px');

    function getParam(name) {
        var match = new RegExp(("[?&]" + name + "=([^&]*)")).exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

})));
