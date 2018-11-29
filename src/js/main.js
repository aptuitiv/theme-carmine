/* =========================================================================== *\
    Global Javascript for all pages
\* =========================================================================== */


$(function() {
    smallScreenNav.init();
    navAccess.init();

    var link = document.querySelector('.js-btop');
    link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });
});

/**
 * Small screen navigation
 */
var smallScreenNav = {
    button: null,
    /**
     * Holds the navigation object
     * @type jQuery
     * @private
     */
    nav: null,

    /**
     * The max window width where the small screen navigation is shown
     * @type number
     * @private
     */
    width: 1050,

    /**
     * Initialization
     */
    init: function() {
        var self = this;
        this.button = $('.js-ssNavBtn');
        this.nav = $('.js-mainNav');

        this.button.on('click', function(e) {
            e.preventDefault();
            self.button.toggleClass('is-active');
            self.nav.toggle();
        });

        $('.js-dropdown').on('click', function(e) {
            if ($(window).width() <= self.width) {
                e.preventDefault();
                $(this).toggleClass('is-active').parent().toggleClass('is-active');
            }
        });
    }
};

/**
 * Adds accessibly functionality to the main navigation.
 * Adds support for navigating with the keyboard.
 *
 * Add "data-access-nav" attribute to the navigation menu.
 * Add "js-navLink" class to the navigation link tags.
 * Add "js-skip" class to any items that should be skipped. Useful for items that are hidden for small screens.
 * Add "js-dropdownMenu" class to the <ul> tag that contains the sub navigation
 * Add "js-dropdownParent" class to a <li> tag that contains a sub list for a drop down.
 * Add "js-dropdown" to any link tags that have a drop down.
 */
var navAccess = {
    init: function () {
        var menus = document.querySelectorAll('[data-access-nav]'),
            _self = this;
        if (menus.length > 0) {
            menus.forEach(function (menu) {
                _self.setupMenu(menu);
            });
        }
    },

    /**
     * Sets up the menu for accessibility
     * @param {Element} menu
     */
    setupMenu: function (menu) {
        var nav = menu.querySelectorAll('.js-navLink'),
            subs = menu.querySelectorAll('.js-dropdownMenu'),
            _self = this,
            key,
            next = ['ArrowDown', 'Down', 'Tab', 'Spacebar', ' '],
            prev = ['ArrowUp', 'Up', 'Tab', 'Spacebar', ' '],
            focusEl;
        if (subs.length > 0) {
            subs.forEach(function (sub) {
                sub.setAttribute('role', 'menu');
                /*sub.setAttribute('aria-hidden', true);*/
            });
        }
        nav.forEach(function (item) {
            // Handle the "keydown" event
            item.addEventListener('keydown', function (e) {
                key = e.key;
                if (next.indexOf(key) >= 0) {
                    // Going forwards
                    if (e.shiftKey) {
                        // Shift key was down
                        _self.focus(e, e.target);
                    } else {
                        // Moving forward
                        _self.focus(e, e.target, true);
                    }
                } else if (prev.indexOf(key) >= 0) {
                    // Going backwards
                    if (e.shiftKey) {
                        // Negating going backwards so going forwards
                        _self.focus(e, e.target, true);
                    } else {
                        _self.focus(e, e.target);
                    }
                } else if (key == 'Escape') {
                    // Close the menu
                    var parentLi = _self.getParentLi(e.target);
                    if (parentLi !== null) {
                        focusEl = _self.getLink(parentLi);
                        focusEl.focus();
                    }
                }
            });
        });
    },

    /**
     * Move the focus to the next/previous element
     * @param {object} event The event that triggered the focus
     * @param {Element} el The target of the keydown event
     * @param {boolean} [next] Whether or not moving to the next item
     */
    focus: function (event, el, next) {
        var focusEl = null,
            isFirst = false,
            isLast = el.parentNode.nextElementSibling === null ? true : false,
            parentLi,
            sibling;

        /**
         * If either the parent doesn't have a previous item, or it does and it's class list contains "js-skip"
         * (for items hidden except for small screens) and the previous sibling doesn't have any previous siblings.
         */
        if (
            el.parentNode.previousElementSibling === null
            || (el.parentNode.previousElementSibling.classList.contains('js-skip') && el.parentNode.previousElementSibling.previousElementSibling === null)
        ) {
            isFirst = true;
        }

        if (isFirst && !next) {
            /**
             * This is the first element and the direction is backwards (shift key was held down or up arrow pressed).
             * Navigate up the dom to the parent LI containing the UL that this link is in.
             */
            parentLi = this.getParentLi(el);
            if (parentLi !== null) {
                focusEl = this.getLink(parentLi);
            }
        } else if (isLast && next) {
            /**
             * This is the last element and moving to the next one.
             * It could be the top level last item or a child last item.
             * If top level last item check to see if the sibling is a <ul>.
             * If a child last item then go up to the next UL
             */
            if (el.nextElementSibling && el.nextElementSibling.nodeName.toLowerCase() == 'ul') {
                // The next element is a sub navigation list. Expand it
                sibling = el.nextElementSibling;
                if (sibling !== null) {
                    this.activate(el.parentNode);
                }
            } else {
                sibling = this.goUp(el);
            }
            if (sibling !== null) {
                focusEl = this.getLink(sibling);
            }
        } else if (next) {
            // Going forwards
            if (el.nextElementSibling && el.nextElementSibling.nodeName.toLowerCase() == 'ul') {
                // The next element is a sub navigation list. Expand it
                sibling = el.nextElementSibling;
                this.activate(el.parentNode);
            } else {
                // Navigate up to the parent li and get the sibling next to that
                sibling = el.parentNode.nextElementSibling;
            }
            if (sibling !== null) {
                focusEl = this.getLink(sibling);
            } else {
                focusEl = el;
            }
        } else {
            // Going backwards
            sibling = el.parentNode.previousElementSibling;
            if (sibling !== null) {
                focusEl = this.getLink(sibling);
            }
        }

        if (focusEl !== null) {
            event.preventDefault();
            focusEl.focus();
        }
    },

    /**
     * Activates a drop down
     * @param {Element} el
     */
    activate: function (el) {
        if (el.classList.contains('js-dropdownParent')) {
            el.classList.add('is-active');
            // change the aria-expanded and aria-hidden values on the <ul> tag
            var ul = el.querySelector('ul');
            if (ul !== null) {
                ul.setAttribute('aria-expanded', 'true');
                /*ul.setAttribute('aria-hidden', 'false');*/
            }
        }
    },

    /**
     * Deactivates a drop down
     * @param {Element} el
     */
    deactivate: function (el) {
        el.classList.remove('is-active');
        // change the aria-expanded and aria-hidden values on the <ul> tag
        var ul = el.querySelector('ul');
        if (ul !== null) {
            ul.setAttribute('aria-expanded', 'false');
            /*ul.setAttribute('aria-hidden', 'true');*/
        }
    },

    /**
     * Gets the LI tag that the link is in and deactivates it before returning it
     * @param el
     * @returns {Node}
     */
    getParentLi: function (el) {
        this.deactivate(el.parentNode);
        var li = el.parentNode.parentNode.parentNode;
        if (li !== null && li.nodeName.toLowerCase() == 'li') {
            this.deactivate(li);
        }
        return li;
    },

    /**
     * Goes up to the parent navigation item and then gets it's next sibling
     * @param el
     * @returns {*}
     */
    goUp: function (el) {
        var parentLi = this.getParentLi(el),
            focusEl = null;
        if (parentLi !== null) {
            if (parentLi.nextElementSibling) {
                focusEl = parentLi.nextElementSibling;
            }
        }
        return focusEl;
    },

    /**
     * Gets the first navigation in the element
     * @param {Element} el
     * @returns {Element}
     */
    getLink: function (el) {
        return el.querySelector('a.js-navLink');
    }
};

/**
 * Sets the height of all the elements to be the same
 * @param elements
 */
function equalSize(elements)
{
    var maxHeight = 0,
        h;
    elements.css('height', '');
    elements.each(function() {
        h = $(this).height();
        if (h > maxHeight) {
            maxHeight = h;
        }
    });
    elements.height(maxHeight);
}
