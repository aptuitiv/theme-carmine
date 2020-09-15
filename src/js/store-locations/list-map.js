/**
 * Javascript for the map on the store location list map page
 */
storeLocationsListMap = {
    center: null,
    loadLimit: 50,
    location: {
        lat: '',
        lng: ''
    },
    locationIcon: '',
    markers: {
        data: [],
        icon: '',
        loading: false
    },
    list: {
        hasData: false,
        loading: false,
        pagesLoaded: 0, // Number of "pages" of trails already loaded
        pagesNeeded: 0, // Total number of "pages" of trails to load
        total: 0 // Total number of trails available
    },
    search: {
        form: null,
        markers: [],
        total: 0,
        type: '',
        ields: {},
        fromUrl: false
    },
    searching: false,
    cluster: {
        sm: '',
        md: '',
        lg: ''
    },
    // Viewing the original full list or search results
    // 'full' or 'search'
    view: 'full',
    zoom: 8,

    isSearchPage: false,
    itemIds: [],

    /**
     * Holds the value of the zoom when the map is initialized
     * @type {Number}
     * @private
     */
    initialZoom: 8,

    /**
     * Holds whether or not to fit the map to the bounds of the displayed markers
     * @type {boolean}
     * @private
     */
    fitToBounds: true,

    /**
     * Holds the latitude center point
     * @type {Number}
     * @private
     */
    latitude: 45,

    /**
     * Holds the longitude center point
     * @type {Number}
     * @private
     */
    longitude: -69,

    /**
     * Holds the map object
     * @type {object}
     * @private
     */
    mapObj: null,

    /**
     * Holds the zoom value
     * @type {Number}
     * @private
     */
    zoom: 8,

    /**
     * Holds the view type for the trail list
     * 'map' or 'list'
     */
    view: 'map',

    /**
     * Sets the latitude center point
     * @param {Number} latitude
     */
    setLatitude: function(latitude) {
        this.latitude = latitude;
    },

    /**
     * Sets the longitude center point
     * @param {Number} longitude
     */
    setLongitude: function(longitude) {
        this.longitude = longitude;
    },

    /**
     * Sets the latitude and longitude to focus on.
     *
     * This turns off the fit to bounds and sets a different zoom value
     *
     * @param {Number} latitude
     * @param {Number} longitude
     */
    setFocusLocation: function(latitude, longitude) {
        this.setLatitude(latitude);
        this.setLongitude(longitude);
        this.fitToBounds = false;
        this.zoom = 10;
    },

    /**
     * Sets the initial zoom
     * @param {Number} zoom
     */
    setZoom: function(zoom) {
        this.zoom = zoom;
    },

    /**
     * Sets the image path to the small marker cluster image
     * @param {string} image
     */
    setMarkerClusterSmImage: function(image) {
        this.cluster.sm = image;
    },

    /**
     * Sets the image path to the medum marker cluster image
     * @param {string} image
     */
    setMarkerClusterMdImage: function(image) {
        this.cluster.md = image;
    },

    /**
     * Sets the image path to the large marker cluster image
     * @param {string} image
     */
    setMarkerClusterLgImage: function(image) {
        this.cluster.lg = image;
    },

    /**
     * Sets the path to the marker icon to show a trail on the map
     * @param {string} icon
     */
    setMarkerIcon: function(icon) {
        this.markers.icon = icon;
    },

    /**
     * Sets the path to the icon to show the user's location
     * @param {string} icon
     */
    setLocationIcon: function(icon) {
        this.locationIcon = icon;
    },

    /**
     * Sets the total number of trails available for the trail list
     * @param {Number} total
     */
    setListTotal: function(total) {
        this.list.pagesNeeded = Math.ceil(total / this.loadLimit);
        this.list.total = total;

    },

    /**
     * Sets whether or not to fit the map to the bounds of the displayed markers
     * @param {bool} fit
     */
    setFitToBounds: function(fit) {
        if (fit === true) {
            this.fitToBounds = true;
        } else {
            this.fitToBounds = false;
        }
    },

    /**
     * Main method to call to setup the map
     */
    run: function() {
        var _self = this;
        this.mapObj = new map();
        this.search.form = $('.js-searchForm');
        this._setupSearch();
        new mapUtilities(this.mapObj);

        // Set the map center point
        this.mapObj.setCenter(this.latitude, this.longitude);
        this.center = this.mapObj.center;

        // Set the map zoom level
        this.mapObj.setZoom(this.zoom);
        this.initialZoom = this.zoom = this.zoom;

        // Full screen
        this.mapObj.config.fullScreen = false;

        /**
         * Set the correct height and width for the InfoBox offset
         * Get the size from the custom "iconSize" attribute to determine how much
         * of a height offset to have
         */
        this.mapObj.config.infoBox.trailMarkerInfoBoxPositionCallback = function(width, height) {
            var returnVal = {
                width: width,
                height: height
            };
            // "this" is the marker object
            var iconHeight = this.icon.iconSize.h;

            // The desired difference between the offset height and the icon height
            var diff = 18;

            // Offset height is smaller for smaller screens so set the difference to be less
            if (height == -55) {
                diff = 13;
            }

            // Set the new offset height based on the icon height
            returnVal.height = -1 * (iconHeight + diff);

            return returnVal;
        }

        // Trail marker callback
        this.mapObj.config.trailMarker.iconCallback = function(item) {
            var width = 27,
                height = 42;

            var marker = {
                // SVG must have height and width properties set
                url: _self.markers.icon,
                size: new google.maps.Size(width, height),
                scaledSize: new google.maps.Size(width, height),
                iconSize: {w: width, h: height} // Custom attribute used when calculating the offset size in trailMarkerInfoBoxPositionCallback
            };
            return marker;
        };
        this.mapObj.config.geoLocationTrack.icon = {
            url: _self.locationIcon,
            size: new google.maps.Size(45, 45),
            scaledSize: new google.maps.Size(25, 25),
            anchor: new google.maps.Point(12,25) // Set the anchor point from 0, 0 to the bottom center. This fixes issues with the marker "moving" when zooming out
        }
        this.mapObj.config.trailMarker.height = 35;
        this.mapObj.config.trailMarker.width = 27;
        // Allow zooming out to any value
        this.mapObj.config.minZoom = null;
        this.mapObj.config.scrollWheel = true;

        // Map types
        mapTypes.init(this.mapObj);
        mapTypes.setDefaultType('terrain');

        // Set whether or not the map should zoom to fit all markers within the viewport
        this.mapObj.config.fitToBoundsMarker = this.fitToBounds;
        // Adjust the initial zoom level after fitBounds() is called
        this.mapObj.config.fitToBoundsCallback = function() {
            // 'this' is the map object
            _self.initialZoom = this.getZoom();
            _self.center = this.getCenter();
        }

        // Build the map
        this.mapObj.run('map-canvas', function() {
            $('.js-mapLoading').fadeOut(300);
            _self.center = _self.mapObj.map.getCenter();
            _self.zoom = _self.mapObj.map.getZoom();
            mapTypes.run();
            _self.mapObj.setupGeoLocation(function(lat, lng) {
                storeLocations.setLatitude(lat);
                storeLocations.setLongitude(lng);
                _self.location.lat = lat;
                _self.location.lng = lng;
            });
            //_self.setupPlacesSearch();
            //_self.setupResetButton();

            // Setup marker clustering
            _self.setupMarkerClusters();

            _self._loadContent();
        });

        if (supportsHistoryApi()) {
            window.addEventListener('popstate', function(e) {
                urlQueryValues.reset();
                if (!urlQueryValues.hasValues()) {
                    _self._resetSearch();
                } else {
                    _self._loadContent();
                }
            });
        }
    },

    /**
     * Loads the initial data for the page
     * @private
     */
    _loadContent: function() {

        // First test for specific values to search by
        var _self = this,
            searchFromUrl = false,
            searchGeo = false,
            params,
            paramKey,
            paramVal,
            term = null;
        this.search.fromUrl = false;
        this.search.fields = {};
        if (urlQueryValues.hasValues()) {
            this._getQueryValue('type', function(value) {
                return this._validateStringParameter(value);
            });
            this._getQueryValue('sponsor', function(value) {
                return this._validateStringParameter(value);
            });
            this._getQueryValue('geo', function(value) {
                return this._validateStringParameter(value);
            });
            this._getQueryValue('status', function(value) {
                return this._validateStringParameter(value);
            });
            this._getQueryValue('town', function(value) {
                return this._validateIntParameter(value);
            });
            this._getQueryValue('distance', function(value) {
                return this._validateIntParameter(value);
            });
            this._getQueryValue('item', function(value) {
                return this._validateItemIdParameter(value);
            });

            term = urlQueryValues.get('term');
            if (typeof term === 'undefined' || typeof term !== 'string' || term.length == 0) {
                term = null;
            }
            if (Object.keys(this.search.fields).length > 0 || term !== null) {
                searchFromUrl = true;
            }
        }

        if (searchFromUrl === false) {
            /**
             * Load normal data
             */
            if (_self.isSearchPage === false) {
                _self.loadItems();
            } else {
                _self.loadSearchItems();
            }
        } else {
            this.searching = true;
            this.search.fromUrl = true;
            /**
             * Perform a search based on values in the URL
             */
            $('.js-searchSponsor').prop('checked', false);
            params = Object.entries(this.search.fields);
            for (var i = 0, l = params.length; i < l; i++) {
                paramKey = params[i][0];
                paramVal = params[i][1];
                if (paramKey == 'type') {
                    $('.js-searchType').val(paramVal);
                } else if (paramKey == 'sponsor') {
                    if (paramVal == 'Yes') {
                        $('.js-searchSponsor').prop('checked', true).change();
                    }
                } else if (paramKey == 'geo') {
                    if (navigator.geolocation) {
                        searchGeo = true;
                        $('.js-searchGeo').prop('checked', true).change();
                    }
                } else if (paramKey == 'town') {
                    $('.js-searchLocationField').val(paramVal);
                } else if (paramKey == 'status') {
                    $('.js-searchStatus').val(paramVal);
                } else if (paramKey == 'distance') {
                    $('.js-searchDistance').val(paramVal);
                } else if (paramKey == 'item') {
                    if (typeof paramVal === 'string') {
                        $('.js-searchItemIds').append('<input type="hidden" name="field[appItemId]" value="' + paramVal + '">');
                    } else if (Array.isArray(paramVal)) {
                        paramVal.forEach(function (val) {
                            $('.js-searchItemIds').append('<input type="hidden" name="field[appItemId][]" value="' + val + '">');
                        });
                    }
                }
            }

            // Handle the search term
            if (term !== null) {
                $('.js-searchTerm').val(term);
            }

            // Submit the search
            if (searchGeo) {
                if (typeof this.location.lat === 'number') {
                    this._submitSearch();
                } else {
                    // The location value hasn't been set yet. Wait a bit and try again
                    setTimeout(function() {
                        if (typeof _self.location.lat !== 'number') {
                            // The location still hasn't been retrieved. Remove the geo search and submit
                            $('.js-searchGeo').attr('checked', false).change();
                        }
                        _self._submitSearch();
                    }, 500);
                }
            } else {
                this._submitSearch();
            }
        }
    },

    /**
     * Submits the search form
     * @private
     */
    _submitSearch: function() {
        this.search.form.submit();
        this._hideSearch();
    },

    /**
     * Gets a value from the URL query parameters
     * @param {string} key
     * @param {function=} callback
     * @private
     */
    _getQueryValue: function(key, callback) {
        var value = urlQueryValues.get(key);
        if (typeof value !== 'undefined') {
            if (typeof callback === 'function') {
                value = callback.call(this, value);
            }
            if (typeof value !== 'undefined' && value !== null) {
                this.search.fields[key] = value;
            }
        }
    },

    /**
     * Validates the item id URL parameter for searching
     * @param {string|Array} value
     * @returns {*}
     * @private
     */
    _validateItemIdParameter: function(value) {
        var returnValue = null,
            ids,
            numIds,
            id;
        if (typeof value === 'string') {
            ids = value.split(',');
            numIds = ids.length;
            if (numIds > 1) {
                returnValue = [];
                for (var i = 0; i < numIds; i++) {
                    id = parseInt(ids[i]);
                    if (id > 0) {
                        returnValue.push(id);
                    }
                }
            } else {
                id = parseInt(value);
                if (id > 0) {
                    returnValue = id;
                }
            }
        } else if (Array.isArray(value)) {
            for (var i = 0, l = value.length; i < l; i++) {
                id = parseInt(value[i]);
                if (id > 0) {
                    returnValue.push(id);
                }
            }
        }
        return returnValue;
    },

    /**
     * Validates a URL parameter that should be an integer
     *
     * @param {string|number} value
     * @returns {Number|*}
     * @private
     */
    _validateIntParameter: function(value) {
        value = parseInt(value);
        if (value > 0) {
            return value;
        }
    },

    /**
     * Validates a string URL parameter
     * @param {string} value
     * @returns {string}
     * @private
     */
    _validateStringParameter: function(value) {
        if (typeof value === 'string') {
            return value;
        }
    },


    /**
     * Sets up the trail search functionality
     * @private
     */
    _setupSearch: function() {
        var _self = this;
        $('.js-searchClose').on('click', function(e) {
            e.preventDefault();
            _self._hideSearch();
        });

        // Show/hide search box
        $('.js-serviceNavSearch').on('click', function(e) {
            e.preventDefault();
            var link = $(this);
            if (link.hasClass('is-active')) {
                // Search is shown. Hide it.
                _self._hideSearch();
            } else {
                _self._showSearch();
            }
            link.blur();
        });



        // Reset the form
        $('.js-formReset').on('click', function(e) {
            e.preventDefault();
            $(this).blur();
            _self._resetSearch();
        });

        // Submit the form
        this.search.form.submit(function(e) {
            e.preventDefault();

            if (_self.search.fromUrl === false) {
                _self._setSearchInUrl();
            } else {
                // Future searches won't be from the URL so reset it
                _self.search.fromUrl = false;
            }

            // Close search box after searching
            _self._hideSearch();

            // Show the loading message
            $('.js-mapOverlay').show();

            _self.searching = true;
            _self.clearMap();
            _self.itemIds = [];

            // Get the service type that was searched for
            _self.search.type = $('.js-searchType').val().toLowerCase().trim();

            $(this).ajaxSubmit({
                dataType: 'json',
                success: function (data) {
                    var total,
                        heading,
                        ids;
                    $('.js-searchTotalTrails').hide();
                    $('.js-totalTrails').hide();
                    _self.search.total = 0;
                    total = parseInt(data.total);
                    if (total > 0) {
                        _self.search.total = total;
                        _self.hideNotFound();

                        heading = total + ' Trailside Service';
                        if (total > 1) {
                            heading += 's';
                        }
                        heading += ' Found';
                        $('.js-searchTotalTrails').html(heading).show();

                        // Load the markers
                        ids = data.ids;
                        if (typeof ids === 'number') {
                            ids = [ids];
                        } else {
                            ids = ids.split(',');
                        }

                        for (var i = ids.length - 1; i >= 0; i--) {
                            _self.itemIds.push(ids[i]);
                        }
                        _self.loadSearchItems();
                    } else {
                        _self.showNotFound();
                    }
                }
            });
        });
    },

    /**
     * Reset the search form
     * @private
     */
    _resetSearch: function() {
        var url,
            searching = this.searching;

        if (supportsHistoryApi()) {
            url = '/store-locations';
            window.history.pushState(null, null, url);
        }

        // Reset the form fields
        this.search.form.get(0).reset();
        $('input[type=hidden]', this.search.form).val('').change();

        // Hide the "not found" message
        this.hideNotFound();

        // Change the view type
        this.searching = false;

        this.search.type = '';

        // Hide search markers, pins, and show original
        if (searching) {
            this.clearMap();
            this._showMapView();
        }

        // Show search box
        this._showSearch();

        // Set the location field values back if they have them
        $('.js-geoLocationLat').val(this.location.lat);
        $('.js-geoLocationLng').val(this.location.lng);
        $('.js-searchGeo').change();
    },

    /**
     * Sets the search parameters in the URL
     * @private
     */
    _setSearchInUrl: function() {
        if (supportsHistoryApi()) {
            var formValues = this.search.form.serializeArray(),
                name,
                nameNoBrackets,
                value,
                ids = [],
                params = [],
                map = {
                    'field[type]': 'type',
                    'field[summitSponsor]': 'sponsor',
                    'x': 'geo',
                    'field[towns]': 'town',
                    'field[appItemId]': 'item',
                    'field[closureStatus.raw]': 'status',
                    'geoDistance[geolocation][distance]': 'distance',
                    'term': 'term'
                };
            if (Array.isArray(formValues)) {
                for (var i = 0, l = formValues.length; i < l; i ++) {
                    name = formValues[i]['name'];
                    value = formValues[i]['value'];
                    if (typeof value === 'string' && value.length > 0) {
                        if (!name.match(/\[(\d+)?\]$/)) {
                            if (typeof map[name] !== 'undefined') {
                                params.push(map[name] + '=' + encodeURIComponent(value));
                            }
                        } else {
                            nameNoBrackets = name.replace(/\[(\d+)?\]/, '');
                            if (typeof map[nameNoBrackets] !== 'undefined') {
                                if (nameNoBrackets !== 'field[appItemId]') {
                                    params.push(map[nameNoBrackets] + '=' + encodeURIComponent(value));
                                } else {
                                    ids.push(value);
                                }
                            }
                        }
                    }
                }
                if (ids.length > 0) {
                    params.push('item=' + ids.join(','));
                }
            }
            if (params.length > 0) {
                params = '?' + params.join('&');
                if (params != window.location.search) {
                    window.history.pushState(null, null, '/store-locations' + params);
                    urlQueryValues.reset();
                }
            }
        }
    },

    /**
     * Shows the not found message
     */
    showNotFound: function() {
        $('.js-mapOverlay').hide();
        $('.js-mapCanvas').hide();
        $('.js-searchNoResults').show();
        $('.js-searchTotalTrails').hide();
        $('.js-totalTrails').hide();
        $('.js-mapList').hide();
        if (!$('.js-loadItems').hasClass('u-hidden')) {
            $('.js-loadItems').hide();
        }
    },

    /**
     * Hides the not found message
     */
    hideNotFound: function() {
        $('.js-mapCanvas').show();
        $('.js-searchNoResults').hide();
        if (!$('.js-loadItems').hasClass('u-hidden')) {
            $('.js-loadItems').show();
        }
    },

    /**
     * Clears the map of info boxes and markers
     */
    clearMap: function() {
        this.mapObj.removeInfoBoxes();
        this.mapObj.removeMarkers();
    },

    /**
     * Shows the appropriate list view of trails
     * instead of the map view
     * @private
     */
    _showMapView: function() {
        $('.js-searchTotalTrails').hide();
        $('.js-totalTrails').show();
        if (this.markers.data.length == 0) {
            this.loadItems(true, true);
        } else {
            // Markers have already been loaded. Show them
            this.mapObj.setupTrailMarkers(this.markers.data);
            this.mapObj.fitToBounds();
            this.mapObj.repaintMarkerCluster();
        }
    },

    /**
     * Show the search panel
     * @private
     */
    _showSearch: function() {
        $('.js-serviceNavSearch').addClass('is-active');
        $('.js-search').show();
        if (window.innerWidth > 350) {
            $('.js-searchClose').show();
        }
    },

    /**
     * Hide the search panel
     * @private
     */
    _hideSearch: function() {
        $('.js-serviceNavSearch').removeClass('is-active');
        $('.js-search').hide();
        $('.js-searchClose').hide();
    },

    /**
     * Sets up the marker clusters
     */
    setupMarkerClusters: function() {
        /**
         * Add the marker cluster styles (i.e. the cluster icons to show).
         * You can call map.addMarkerClusterStyle() to add as many as you want.
         */
        this.mapObj.addMarkerClusterStyle({
            'url': this.cluster.sm,
            'width': '41',
            'height': '41'
        });
        this.mapObj.addMarkerClusterStyle({
            'url': this.cluster.md,
            'width': '54',
            'height': '54'
        });
        this.mapObj.addMarkerClusterStyle({
            'url': this.cluster.lg,
            'width': '67',
            'height': '67',
            textSize: 16
        });

        /**
         * Setup the marker cluster.
         * Optionally pass a callback function to calculate which cluster
         * style to show.
         * Optionally pass an object to set cluster options.
         */
        this.mapObj.setupMarkerCluster(null, {
            maxZoom: 18,
            minimumClusterSize: 2
        });
    },

    /**
     * Loads all of the trail markers for the trail list pages
     * @param {boolean=} showLoading Whether or not to show the loading message
     */
    loadItems: function(showLoading, fitToBounds) {
        var _self = this;
        if (showLoading) {
            $('.js-mapOverlay').show();
        }
        if (!ap.isDefined(fitToBounds)) {
            fitToBounds = true;
        }
        if (this.markers.loading === false && this.markers.data.length == 0) {
            this.markers.loading = true;
            $.getJSON('/store-locations/map-items', function (data) {
                _self.markers.loading = false;
                _self.markers.data = data;
                _self.mapObj.setupTrailMarkers(data);
                if (fitToBounds) {
                    _self.mapObj.fitToBounds(true);
                }
                _self.mapObj.repaintMarkerCluster();
                $('.js-mapOverlay').hide();
            });
        }
    },



    /**
     * Loads trails for search results
     */
    loadSearchItems: function() {
        var _self = this;
        this.search.markers = [];
        if (this.itemIds.length > 0) {
            $.ajax({
                type: 'POST',
                url: '/store-locations/map-items',
                data: {'id': _self.itemIds},
                dataType: 'json',
                success: function (data) {
                    _self.clearMap();
                    _self.search.markers = data;
                    _self.mapObj.setupTrailMarkers(data);
                    _self.mapObj.fitToBounds();
                    _self.mapObj.repaintMarkerCluster();
                    $('.js-mapOverlay').hide();
                }
            });
        }
    }
};
