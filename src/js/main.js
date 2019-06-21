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
            left = ['ArrowLeft', 'Left'],
            right = ['ArrowRight', 'Right'],
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
                } else if (left.indexOf(key) >= 0) {
                    // Jumping backwards
                    _self.focus(e, e.target, false, true);
                } else if (right.indexOf(key) >= 0) {
                    // Jumping forwards
                    _self.focus(e, e.target, true, true);

                } else if (key == 'Escape') {
                    // Close the menu
                    var parentLi = _self.getParent(e.target);
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
    focus: function (event, el, next, jumping) {
        var focusEl = null,
            isFirst = false,
            isLast = el.parentNode.classList.contains('is-last') ? true : false,
            isFirst = el.parentNode.classList.contains('is-first') ? true : false,
            isParent = el.parentNode.parentNode.classList.contains('js-mainNav'),
            parentLi,
            sibling;


        if (next) {
            if (jumping) {
                // jump to next top level navigation link
                this.deactivateParent(el);
                focusEl = this.getLink(this.getNextParent(el));
            } else {
                if(isLast) {
                    // deactivate this dropdown
                    this.deactivateParent(el);
                }
                sibling = el.nextElementSibling;
                // if next element is a dropdown, expand it
                if (sibling !== null && sibling.nodeName.toLowerCase() == 'ul') {
                    this.activate(el.parentNode);
                }
                focusEl = this.getNextLink(el); // next navLink
            }
        } else {
            if (jumping) {
                // jump to previous top level navigation link
                this.deactivateParent(el);
                focusEl = this.getLink(this.getPrevParent(el));
            } else {
                if (isFirst) {
                    // close dropdown and move to top level navigation
                    this.deactivateParent(el);
                    focusEl = this.getLink(this.getParent(el));
                } else {
                    if (isParent){
                        // this is a top level link, move to previous one
                        focusEl = this.getLink(this.getPrevParent(el));
                    } else {
                        focusEl = this.getPrevLink(el); // previous navLink
                    }
                }
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
    deactivateParent: function (el) {
        parent = this.getParent(el);
        parent.classList.remove('is-active');
        // change the aria-expanded and aria-hidden values on the <ul> tag
        var ul = parent.querySelector('ul');
        if (ul !== null) {
            ul.setAttribute('aria-expanded', 'false');
            /*ul.setAttribute('aria-hidden', 'true');*/
        }
    },
    // Returns the index of this link out of all other navLinks
    getLinkIndex: function(el) {
        return $('a.js-navLink').index(el);
    },
    // Returns the index of the parent top level navigation
    getParentIndex: function(el) {
        return $('.js-mainNav').children().index(el);
    },
    // Returns the previous navLink
    getPrevLink: function (el) {
        return $('a.js-navLink')[this.getLinkIndex(el) - 1] || el; // return el if undefined
    },
    // Returns the next navLink
    getNextLink: function (el) {
        return $('a.js-navLink')[this.getLinkIndex(el) + 1] || el; // return el if undefined
    },
    // Returns the top level navigation element list element
    getParent: function (el) {
        if(el.parentNode.parentNode.classList.contains('js-mainNav')){
            return el.parentNode;
        }
        return $(el).parents('.js-mainNav>.js-dropdownParent').first()[0];
    },
    // Returns the top level navigation link before the active one
    getPrevParent: function (el) {
        var parent = this.getParent(el);
        return $('.js-mainNav').children()[this.getParentIndex(parent) - 1] || el; // return el if undefined
    },
    // Returns the top level navigation link after the active one
    getNextParent: function (el) {
        var parent = this.getParent(el);
        return $('.js-mainNav').children()[this.getParentIndex(parent) + 1] || el; // return el if undefined
    },

    /**
     * Gets the first navigation in the element
     * @param {Element} el
     * @returns {Element}
     */
    getLink: function (el) {
        return el.querySelector('a.js-navLink');
    },
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
