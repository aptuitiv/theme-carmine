/**
 * Helper methods
 */
if (ap === undefined) {
    var ap = {};
}
/**
 * Tests to see if the thing is an array
 *
 * @param {Array} thing
 * @returns {boolean}
 */
ap.isArray = function (thing) {
    return ap.isObject(thing) && (typeof thing.length !== 'undefined') && ap.isFunction(thing.splice);
};
/**
 * Tests to see if the thing is defined
 *
 * @param {Object} thing
 * @returns {boolean}
 */
ap.isDefined = function (thing) {
    return typeof thing !== 'undefined';
};
/**
 * Tests to see if the thing is an object
 *
 * @param {Object} thing
 * @returns {boolean}
 */
ap.isObject = function (thing) {
    return !!thing && (typeof thing === 'object');
};
/**
 * Tests to see if the thing is a function
 *
 * @param {Function} thing
 * @returns {boolean}
 */
ap.isFunction = function (thing) {
    return typeof thing === 'function';
};
/**
 * Tests to see if the thing is a number
 *
 * @param {number} thing
 * @returns {boolean}
 */
ap.isNumber = function (thing) {
    return typeof thing === 'number';
};
/**
 * Tests to see if the thing is boolean
 *
 * @param {boolean} thing
 * @returns {boolean}
 */
ap.isBool = function (thing) {
    return typeof thing === 'boolean';
};
/**
 * Tests to see if the thing is a string
 *
 * @param {string} thing
 * @returns {boolean}
 */
ap.isString = function (thing) {
    return typeof thing === 'string' && thing.length > 0;
};
/**
 * Tests to see if the thing is a DOM element
 *
 * @param {Object} thing
 * @returns {boolean}
 */
ap.isElement = function (thing) {
    return ap.isObject(thing) && thing.nodeType && thing.nodeType === 1;
};

/**
 * ap Event object
 *
 * Provides methods for working with events
 */
ap.event = {
    /**
     * Adds an event listener to an element
     *
     * If 'selector' and 'callback' are set then the event is being added to a parent element.
     * The event will bubble up until the element that matches 'selector' is found.
     * If 'selector' is a function then either the event bubbling will be handled in the callback
     * function or the 'element' is the exact element that the event is occuring on.
     *
     * Right now 'selector' is limited to a single class name
     *
     * In the callback function 'this' will refer to either the 'element' parameter if delegation is
     * not done or the element that matches 'selector' if delegation is done.
     *
     * @param {HTMLElement} element
     * @param {string} event The event to add
     * @param {string|Function} selector The selector to delegate the event to or the callback function
     * @param {Function} [callback] The callback function
     */
    add(element, event, selector, callback) {
        // Setup a new callback method to handle event delegation
        const callbackNew = function (e) {
            if (ap.isFunction(selector)) {
                selector.call(this, e);
            } else if (ap.isFunction(callback)) {
                let el = e.target; let
                    found;
                // Traverse the event target's parent nodes to find the element control element
                while (el && el.nodeType === 1 && !(found = el.classList.contains(selector))) {
                    el = el.parentElement;
                }
                if (found) {
                    callback.call(el, e);
                }
            }
        };

        // Add the event listener
        if (element.addEventListener) { // W3C DOM
            element.addEventListener(event, callbackNew, false);
        } else if (element.attachEvent) { // IE < 9 DOM
            element.attachEvent(`on${event}`, callbackNew);
        }
    },

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered.
     *
     * The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     *
     * @see http://davidwalsh.name/javascript-debounce-function
     *
     * @param {Function} func
     * @param {int} wait The number of milliseconds to wait before calling 'func'
     * @param {bool} [immediate] Whether or not to trigger the function on the leading edge, instead of the trailing
     * @returns {Function}
     */
    debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this; const
                args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    },
};
/**
 * Extends the properties of the first object with the properties of the second
 *
 * @param {Object} dest
 * @param {Object} source
 * @returns {Object}
 */
ap.extend = function (dest, source) {
    for (const prop in source) {
        dest[prop] = source[prop];
    }
    return dest;
};
/**
 * Gets the window width
 * @see http://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window for
 *      getting the window width cross browser.
 * @returns {Number}
 */
ap.getWindowWidth = function () {
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];
    const w = window.innerWidth || e.clientWidth || g.clientWidth;
    return w;
};
