/* =========================================================================== *\
    JavaScript for navigation menus
\* =========================================================================== */

/**
 * Small screen navigation
 */
// eslint-disable-next-line
const smallScreenNav = {
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
    init() {
        const self = this;
        this.button = $('.js-ssNavBtn');
        this.nav = $('.js-mainNav');

        this.button.on('click', (e) => {
            e.preventDefault();
            self.button.toggleClass('is-active');
            self.nav.toggle();
        });

        $('.js-dropdown').on('click', function onClick(e) {
            if ($(window).width() <= self.width) {
                e.preventDefault();
                $(this).toggleClass('is-active').parent().toggleClass('is-active');
            }
        });
    },
};

/**
 * Adds accessibly functionality to the main navigation.
 * Adds support for navigating with the keyboard.
 *
 * Add "data-access-nav" attribute to the navigation menu.
 * Add "js-navLink" class to the navigation link tags.
 * Add "js-skip" class to any items that should be skipped.
 * Useful for items that are hidden for small screens.
 * Add "js-dropdownMenu" class to the <ul> tag that contains the sub navigation
 * Add "js-dropdownParent" class to a <li> tag that contains a sub list for a drop down.
 * Add "js-dropdown" to any link tags that have a drop down.
 */
// eslint-disable-next-line
const navAccess = {
    init() {
        const menus = document.querySelectorAll('[data-access-nav]');
        const self = this;
        if (menus.length > 0) {
            menus.forEach((menu) => {
                self.setupMenu(menu);
            });
        }
    },

    /**
     * Sets up the menu for accessibility
     * @param {Element} menu
     */
    setupMenu(menu) {
        const nav = menu.querySelectorAll('.js-navLink');
        const self = this;
        let key;
        const next = ['ArrowDown', 'Down', 'Tab', 'Spacebar', ' '];
        const prev = ['ArrowUp', 'Up', 'Tab', 'Spacebar', ' '];
        const left = ['ArrowLeft', 'Left'];
        const right = ['ArrowRight', 'Right'];
        let focusEl;
        nav.forEach((item) => {
            // Handle the "keydown" event
            item.addEventListener('keydown', (e) => {
                key = e.key;
                if (next.indexOf(key) >= 0) {
                    // Going forwards
                    if (e.shiftKey) {
                        // Shift key was down
                        self.focus(e, e.target);
                    } else {
                        // Moving forward
                        self.focus(e, e.target, true);
                    }
                } else if (prev.indexOf(key) >= 0) {
                    // Going backwards
                    if (e.shiftKey) {
                        // Negating going backwards so going forwards
                        self.focus(e, e.target, true);
                    } else {
                        self.focus(e, e.target);
                    }
                } else if (left.indexOf(key) >= 0) {
                    // Jumping backwards
                    self.focus(e, e.target, false, true);
                } else if (right.indexOf(key) >= 0) {
                    // Jumping forwards
                    self.focus(e, e.target, true, true);
                } else if (key === 'Escape') {
                    // Close the menu
                    const parentLi = self.getParent(e.target).parentNode;
                    if (parentLi !== null) {
                        focusEl = self.getLink(parentLi);
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
    focus(event, el, next, jumping) {
        let focusEl = null;
        let isFirst = false;
        const isLast = this.isDropdownLast(el);
        isFirst = this.isDropdownFirst(el);
        let sibling;
        if (next) {
            if (jumping) {
                // Jump to next top level navigation link
                this.deactivateParent(el);
                focusEl = this.getNextInLevel(this.getParent(el));
            } else {
                if (isLast) {
                    // Deactivate this dropdown
                    this.deactivateParent(el);
                }
                sibling = el.nextElementSibling;
                // If next element is a dropdown, expand it
                if (sibling !== null && sibling.nodeName.toLowerCase() === 'ul') {
                    this.activate(el.parentNode);
                }
                focusEl = this.getNextLink(el); // next navLink
            }
        } else if (jumping) {
            // Jump to previous top level navigation link
            this.deactivateParent(el);
            focusEl = this.getPrevInLevel(this.getParent(el));
        } else if (isFirst) {
            // Close dropdown and move to top level navigation
            this.deactivateParent(el);
            focusEl = this.getParent(el);
        } else {
            sibling = el.parentNode.previousElementSibling;
            if (sibling !== null && sibling.classList.contains('js-dropdownParent')) {
                // Link before a sibling with dropdown (skip over dropdown)
                focusEl = this.getPrevInLevel(el);
            } else {
                focusEl = this.getPrevLink(el); // Get the previous navLink
            }
        }
        if (focusEl) {
            event.preventDefault();
            focusEl.focus();
        } else {
            el.blur();
        }
    },

    /**
     * Activates a drop down
     * @param {Element} el
     */
    activate(el) {
        if (el.classList.contains('js-dropdownParent')) {
            el.classList.add('is-active');
            // change the aria-expanded and aria-hidden values on the <ul> tag
            el.querySelector('a').setAttribute('aria-expanded', 'true');
        }
    },
    /**
     * Deactivates a drop down
     * @param {Element} el
     */
    deactivateParent(el) {
        const parent = this.getParent(el);
        parent.parentNode.classList.remove('is-active');
        // change the aria-expanded and aria-hidden values on the <ul> tag
        parent.setAttribute('aria-expanded', 'false');
    },
    // Returns returns true is the first element of a dropdown list
    isDropdownFirst(el) {
        // get all children links in dropdown
        const dropdownNavs = Array.prototype.slice.call(this.getParent(el).parentNode.querySelectorAll('.js-navLink'));
        // if it is the first link (after the main navigation link)
        return dropdownNavs.indexOf(el) === 1;
    },
    // Returns true if the last element of a dropdown
    isDropdownLast(el) {
        const dropdownNavs = Array.prototype.slice.call(this.getParent(el).parentNode.querySelectorAll('.js-navLink')); // get all children links in dropdown
        return dropdownNavs.indexOf(el) === (dropdownNavs.length - 1); // if it is the last link
    },
    // Returns the index of this link out of all other navLinks
    getLinkIndex(el) {
        const list = Array.prototype.slice.call(document.querySelectorAll('.js-navLink'));
        return list.indexOf(el);
    },
    // Returns the index of the parent top level navigation
    getParentIndex(el) {
        const list = Array.prototype.slice.call(el.parentNode.children);
        return list.indexOf(el);
    },
    // Returns the previous navLink
    getPrevLink(el) {
        const list = Array.prototype.slice.call(document.querySelectorAll('.js-navLink'));
        return list[this.getLinkIndex(el) - 1];
    },
    // Returns the next navLink
    getNextLink(el) {
        const list = Array.prototype.slice.call(document.querySelectorAll('.js-navLink'));
        return list[this.getLinkIndex(el) + 1];
    },
    // Returns the parent navigation link
    getParent(el) {
        let node = el;
        while (node !== document.body) {
            if (node.classList.contains('js-dropdownParent') || node.parentNode.classList.contains('js-mainNav')) {
                break;
            }
            node = node.parentNode;
        }
        return this.getLink(node);
    },
    // Returns the direct sibling navigation link before the active one
    getPrevInLevel(el) {
        return this.getLink(el.parentNode.previousElementSibling);
    },
    // Returns the direct sibling navigation link after the active one
    getNextInLevel(el) {
        return this.getLink(el.parentNode.nextElementSibling);
    },
    /**
     * Gets the first navigation in the element
     * @param {Element} el
     * @returns {Element}
     */
    getLink(el) {
        return el ? el.querySelector('a.js-navLink') : null;
    },
};
