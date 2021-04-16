/**
 * Shared map type functionality for the trail detail and the trail list pages
 */
mapTypes = {
    /**
     * Holds the map types container jQuery object
     */
    container: null,

    /**
     * Holds the default map type
     * @type {string}
     */
    defaultType: '',

    /**
     * Holds the map object
     * @type {object}
     * @private
     */
    mapObj: null,

    /**
     * Initialization method.
     * Should be called before run()
     */
    init(map) {
        map.config.mapTypeControl = false;
        this.mapObj = map;
    },

    /**
     * Sets the default map type
     * @param {string} type The map type
     */
    setDefaultType(type) {
        this.mapObj.setMapType(type);
        this.defaultType = type;
    },

    /**
     * Returns the default type
     * @returns {string}
     */
    getDefaultType() {
        return this.defaultType;
    },

    /**
     * Main method to setup and run the map types functionality
     */
    run() {
        let control;
        let toggle;
        let toggleActive;
        let toggleInactive;
        let types;
        // Add the map types control to the map
        control = document.createElement('div');
        control.className = 'Map-types js-mapTypes';
        control.index = -1;

        // Create the toggle element
        toggle = document.createElement('div');
        toggle.className = 'Map-typeToggle';
        toggle.setAttribute('data-state', 'closed');
        toggle.addEventListener('click', function () {
            if (this.getAttribute('data-state') == 'closed') {
                this.setAttribute('data-state', 'open');
                $('.js-mapTypes').addClass('is-active');
            } else {
                this.setAttribute('data-state', 'closed');
                $('.js-mapTypes').removeClass('is-active');
            }
        });
        control.appendChild(toggle);

        toggleActive = document.createElement('span');
        toggleActive.className = 'Map-typeToggleActive';
        toggleActive.innerHTML = 'Base Maps <svg class="Icon Map-typeToggleIcon" role="img"><use xlink:href="#icon-chevron-right" /></svg>';
        toggle.appendChild(toggleActive);

        toggleInactive = document.createElement('span');
        toggleInactive.className = 'Map-typeToggleInactive';
        toggleInactive.innerHTML = '<svg class="Icon Map-typeToggleIcon" role="img"><use xlink:href="#icon-chevron-left" /></svg>';
        toggle.appendChild(toggleInactive);

        // Map Types wrapper
        types = document.createElement('div');
        types.className = 'Map-typesWrapper';
        control.appendChild(types);

        // Map Types
        this._addMapType('roadmap', 'Map', types);
        this._addMapType('hybrid', 'Photo', types);
        this._addMapType('terrain', 'Terrain', types);

        this.mapObj.addCustomControl(google.maps.ControlPosition.LEFT_TOP, control);
    },

    /**
     * Adds a map type button
     * @param {string} type The map type
     * @param {string} text The button text
     * @param {HTMLElement} parent The parent element to add to
     * @private
     */
    _addMapType(type, text, parent) {
        const el = document.createElement('span');
        let classes = 'Map-type js-mapType';
        if (type === this.defaultType) {
            classes += ' is-current';
        }
        el.className = classes;
        el.setAttribute('data-maptype', type);
        el.innerHTML = text;
        el.addEventListener('click', function () {
            mapTypes.handleClick(this);
        });
        parent.appendChild(el);
    },

    /**
     * Handles clicking the map type button
     * @param {HTMLElement} el
     */
    handleClick(el) {
        const type = el.getAttribute('data-maptype');
        if (type === 'roadmap' || type === 'hybrid' || type === 'terrain') {
            $('.js-mapType').removeClass('is-current');
            $(el).addClass('is-current');
            this.mapObj.setMapType(type);
        }
    },

    /**
     * Set a specific map type
     * @param {string} type
     */
    setType(type) {
        const el = document.querySelector(`[data-maptype="${type}"]`);
        el.click();
    },

    /**
     * Hide the map types menu if it's open
     */
    hideTypeMenu() {
        const el = document.querySelector('.Map-typeToggle');
        el.setAttribute('data-state', 'closed');
        $('.js-mapTypes').removeClass('is-active');
    },

    /**
     * Resets the menu back it's original state
     */
    reset() {
        this.setType(this.defaultType);
        this.hideTypeMenu();
    },
};
