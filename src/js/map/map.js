/**
 * Map object for building out the Google Map for the trail list and trail detail pages
 *
 * Usage with the BranchCMS trail app:
 * - load the google maps api (https://maps.googleapis.com/maps/api/js)
 *   and this file
 * - build the trail object via branch code and use it to initialize the
 *   Trail Map.
 *
 * The {trail} data is used in the trailMap object.
 *
 * Example:
 *
 * <script>
 * if (trail === undefined) {
 *   var trail = {};
 * }
 * trail.latitude = {#trail.latitude}
 * trail.longitude = {#trail.longitude}
 * trail.zoom = {#trail.zoom}
 *
 * // Add the trail segments, features and images as needed for the site
 *
 * // Configure the map options
 * trailMap.config.geolocation.track = false;
 *
 * // Initialize the map
 * trailMap.run('canvas-id');
 */

/**
 * Map object to setup the trail map
 */
map = function () {
    /**
     * Set initial property values. This makes sure that they
     * are unique for each map instance that is using it.
     */
    this.bounds = null;
    this.canvas = null;
    this.center = null;
    this.config = {
        // Whether or not to zoom the map to show all markers/segments on the map
        fitToBoundsMarker: false,
        // Whether or not to zoom the map to show all segments on the map
        fitToBoundsSegments: false,
        // Maximum zoom level when fitting to bounds
        fitToBoundsMazZoom: 13,
        // Callback for when fitBounds() is run
        fitToBoundsCallback() {},
        // Full screen
        fullScreen: true,
        // Optional callback to set the full screen control options
        fullScreenControlOptionsCallback: null,
        // Config on whether or not to support clicking an icon to go to the current user's location
        geoLocationIcon: {
            // A callback function to call to generate the geo location icon. This will override the default icon.
            buttonCallback: null,
            enable: true,
            position: 'BOTTOM_LEFT',
            src: '/theme/custom/images/gps-zoom.png',
            title: 'Zoom to location',
        },
        // Whether or not to support tracking the user's location as they move
        geoLocationTrack: {
            enable: true,
            icon: '/theme/custom/images/gps-dot.png',
            title: 'Your Location',
        },
        infoBox: {
            // Image path for the close icon
            closeIcon: '/theme/custom/images/close.png',
            // Callback function to get the InfoBox content for a POI
            poiCallback() {},
            // POI InfoBox width
            poiWidth: 250,
            // Callback for when the "domready" InfoBox even
            readyCallback() {},
            // Callback function to get the InfoBox content for a segment
            segmentCallback() {},
            // Segment InfoBox width when window width > 800
            segmentWidth: 350,
            // Segment InfoBox width when window width < 800
            segmentWidthMd: 350,
            // Segment InfoBox width when window width < 600
            segmentWidthSm: 300,
            // Segment InfoBox width when window width < 400
            segmentWidthXs: 250,
            // Callback function to get the InfoBox content for trail markers
            trailMarkerCallback() {},
            // Callback to adjust the InfoBox offset position for trail markers
            trailMarkerInfoBoxPositionCallback() {},
            // Callback function for the trail marker when the infobox dom is ready
            trailMarkerReadyCallback() {},
            // Trail marker InfoBox width when window width > 800
            trailMarkerWidth: 350,
            // Trail marker InfoBox width when window width < 800
            trailMarkerWidthMd: 350,
            // Trail marker InfoBox width when window width < 600
            trailMarkerWidthSm: 300,
            // Trail marker InfoBox width when window width < 400
            trailMarkerWidthXs: 250,
        },
        // Holds the callback function to call once the map is loaded
        loadedCallback: null,
        // The default map type. 'hybrid', 'roadmap', 'satellite' or 'terrain'
        mapType: 'hybrid',
        // Whether or not to use the default Google one or have a custom map type control
        mapTypeControl: false,
        // The minimum zoom value. This sets how far out they can zoom. 1 is the furthest out (whole world). 21 is the closest zoom
        minZoom: null,
        // Holds whether or not the mouse is down on the map
        mouseDown: false,
        // Whether or not to support clicking an POI icon to get more information
        poiClick: true,
        // Whether or not to support clicking POI image icons to get more information
        poiImage: {
            enable: false,
            icon: '/images/trails/feature-markers/photo.png',
            title: 'Photo',
        },
        // Holds the link class for the related trails
        relatedTrailslinkClass: 'js-rtShowHide',
        /**
         * Holds the color for the related trail segments.
         * If 'same' then it'll use the same method of getting the color as regular line segments.
         * Otherwise the value should be a hex color or color name.
         */
        relatedSegmentColor: 'same',
        // Holds whether or not to support clicking related trail segments
        relatedSegmentClick: true,
        // Holds whether or not to support hovering over related trail segments
        relatedSegmentHover: true,
        // Whether or not to show a tooltip on trail hover
        relatedSegmentHoverTooltip: false,
        // The weight of related segments
        relatedSegmentWeight: 4,
        // The weight of related segments when hovering
        relatedSegmentHoverWeight: 10,
        // Holds whether or not to zoom by scrolling
        scrollWheel: true,
        // Holds the callback function to set the properties for a line segment (like dashed or not)
        segmentCallback: null,
        // Whether or not to support clicking the line segment to get more information in a popup
        segmentClick: true,
        // The default segment color
        segmentColor: 'yellow',
        /**
         * Holds the color for the segment hover line.
         * If 'same' then it'll use the same color as the regular line.
         * Otherwise the value should be a hex color or color name.
         * This applies to both regular segments and related trail line segments.
         */
        segmentHoverColor: 'same',
        // Holds the callback function to get the correct color for a line segment
        segmentColorCallback: null,
        // Whether or not to support hovering a line segment to highlight it
        segmentHover: true,
        // Whether or not to show a tooltip on trail hover
        segmentHoverTooltip: false,
        // Whether or not segments should show by default
        segmentVisibleDefault: true,
        // Whether or not show segments only when a certain zoom level is reached
        segmentShowOnZoom: false,
        // If showing segments on zoom then this is the zoom level and higher (closer zoom) where segments will show
        segmentShowOnZoomLevel: 14,
        // Holds whether or not to limit showing segments within the bounds of the map viewport
        segmentShowWithinBounds: false,
        // The weight of the segment hover stroke
        segmentHoverWeight: 10,
        // The weight of the segment stroke
        segmentWeight: 2,
        // Street view
        streetView: true,
        // Trail list marker options
        trailMarker: {
            // Trail marker icon height
            height: 35,
            // Callback to get the trail marker icon
            iconCallback: null,
            // Trail marker icon width
            width: 25,
        },
    };
    this.controlCallbacks = [];
    this.fullScreen = {
        in: false,
        inCenter: null,
        out: true,
        outCenter: null,
    };
    this.geoLocationIcon = null;
    this.geoLocationDisplayed = false;
    this.hasSegments = false;
    this.infoBoxes = [];
    this.infoBoxType = '',
    this.lines = [];
    this.markers = {};
    this.markerClusterStyles = [];
    this.markerClusterer = null;
    this.myLocation = null;
    this.myLocationMarker = null;
    this.map = null;
    this.segmentSelected = false;
    this.segmentsShown = false;
    this.changingSegmentVisibility = false;
    this.tooltip = false;
    this.zoom = 15;
};

map.prototype = {
    /**
     * Holds the Latitude / Longitude bounds for the map
     * @type {google.maps.LatLngBounds}
     * @private
     */
    bounds: null,

    /**
     * Holds the map canvas DOM element
     * @type {HTMLElement}
     * @private
     */
    canvas: null,

    /**
     * Holds the map center
     * @type {google.maps.LatLng}
     * @private
     */
    center: null,

    /**
     * Holds configuration on how to setup the map
     * and what functionality to include in the map.
     * @type {Object}
     */
    config: {},

    controlCallbacks: [],

    /**
     * Holds information about if the map is in full screen mode
     */
    fullScreen: {},

    /**
     * Holds the geo location icon that when clicked will move the user to their current location.
     * @type {HTMLElement}
     * @private
     */
    geoLocationIcon: null,

    /**
     * Holds whether or not the geo location icon is displayed
     * @type {boolean}
     * @private
     */
    geoLocationDisplayed: false,

    /**
     * Holds whether or not there are any segments on the map
     */
    hasSegments: false,

    /**
     * Holds the info boxes for markers and segments on the map
     * @type {Array}
     * @private
     */
    infoBoxes: [],

    /**
     * Holds the info box type for the current open info box
     * @type {string}
     * @private
     */
    infoBoxType: '',

    /**
     * Holds the segment lines being displayed on the map
     * @type {Array}
     * @private
     */
    lines: [],

    /**
     * Holds the markers that are being displayed on the map
     * @type {Object}
     * @private
     */
    markers: {},

    /**
     * Holds the marker cluster styles
     * @type {Array}
     * @private
     */
    markerClusterStyles: [],

    /**
     * Holds the marker clusterer object
     * @type {MarkerClusterer}
     */
    markerClusterer: null,

    /**
     * Holds the user's current geo location
     * @type {google.maps.LatLng}
     * @private
     */
    myLocation: null,

    /**
     * Holds the marker to show the user's current geo location
     * @type {google.maps.Marker}
     * @private
     */
    myLocationMarker: null,

    /**
     * Holds the Google map object
     * @type {google.maps.Map}
     * @private
     */
    map: null,

    /**
     * Holds whether or not the segment is hovered or clicked
     * @type {bool}
     * @private
     */
    segmentSelected: false,

    /**
     * Holds whether or line segments have been displayed when zooming
     * @type {boolean}
     * @private
     */
    segmentsShown: false,

    /**
     * Holds whether or not segments are currently being displayed or hidden
     * @type {boolean}
     */
    changingSegmentVisibility: false,

    /**
     * Holds the tooltip element for markers
     * {HTMLElement}
     * @private
     */
    tooltip: null,

    /**
     * Holds the zoom value
     */
    zoom: 15,

    /**
     * Sets the map center value
     *
     * @param {Number} latitude
     * @param {Number} longitude
     */
    setCenter(latitude, longitude) {
        this.center = new google.maps.LatLng(latitude, longitude);
    },

    /**
     * Sets the map zoom value
     * @param {int} zoom The default zoom value
     */
    setZoom(zoom) {
        this.zoom = this._getZoom(zoom);
    },

    /**
     * Main method to call to setup the map
     *
     * @param {string} canvasId The canvas element id
     * @param {Function} callback A callback function to call when the map is setup
     */
    run(canvasId, callback) {
        this.canvas = document.getElementById(canvasId);
        // wait for the map to load before initializing
        google.maps.event.addDomListener(window, 'load', () => {
            this._setupMap();
            if (ap.isFunction(callback)) {
                callback.call();
            }
        });
    },

    /**
     * Sets the map type
     *
     * @param {string} type The map type
     */
    setMapType(type) {
        if (ap.isObject(this.map)) {
            this.map.setMapTypeId(this._getMapType(type));
        } else {
            this.config.mapType = type;
        }
    },

    /**
     * Sets a custom map type
     * @param {string} type The custom map type
     */
    setCustomMapType(type) {
        this.map.setMapTypeId(type);
    },

    /**
     * Sets up the Google map object.
     * Called from the Google load callback.
     */
    _setupMap() {
        const _self = this;
        const mapOptions = {
            center: this.center,
            cursor: 'pointer',
            fullscreenControl: this.config.fullScreen,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER,
            },
            mapTypeControl: this.config.mapTypeControl,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_CENTER,
            },
            mapTypeId: this._getMapType(),
            minZoom: this.config.minZoom,
            rotateControl: false,
            scaleControl: true,
            scrollwheel: this.config.scrollWheel,
            streetViewControl: this.config.streetView,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM,
            },
            styles: [
                {
                    featureType: 'administrative.province',
                    elementType: 'geometry.stroke',
                    stylers: [
                        { saturation: 15 },
                        { lightness: -25 },
                        { weight: 1.5 },
                    ],
                },
                {
                    featureType: 'poi',
                    elementType: 'geometry.fill',
                    stylers: [
                        { color: '#C5E3BF' },
                    ],
                },
                {
                    featureType: 'poi.business',
                    elementType: 'all',
                    stylers: [{ visibility: 'off' }],
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [
                        { lightness: 100 },
                        { visibility: 'simplified' },
                    ],
                },
                {
                    featureType: 'road',
                    elementType: 'geometry.fill',
                    stylers: [
                        { color: '#D1D1B8' },
                    ],
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [
                        { color: '#C6E2FF' },
                        { visibility: 'on' },
                    ],
                },
                {
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [
                        { color: '#409fff' },
                        { saturation: 15 },
                        { lightness: 40 },
                    ],
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text',
                    stylers: [
                        { color: '#0073e6' },
                        { saturation: 35 },
                        { lightness: 60 },
                    ],
                },
                {
                    featureType: 'water',
                    elementType: 'labels.text.fill',
                    stylers: [
                        { color: '#359aff' },
                        { saturation: 40 },
                    ],
                },
            ],
            zoom: this.zoom,
            zoomControl: true,
            zoomControlOptions: {
                position: verge.isSmallScreen() ? google.maps.ControlPosition.RIGHT_TOP : google.maps.ControlPosition.LEFT_TOP,
            },
        };

        if (typeof this.config.fullScreenControlOptionsCallback === 'function') {
            mapOptions.fullscreenControlOptions = this.config.fullScreenControlOptionsCallback.call();
        }

        this.map = new google.maps.Map(this.canvas, mapOptions);

        // Setup the tooltip element
        this.tooltip = document.createElement('div');
        this.tooltip.classList.add('Map-tooltip');
        this.canvas.appendChild(this.tooltip);

        // Set street view options
        this.map.getStreetView().setOptions({
            // Address control shows in street view
            addressControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM,
            },
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER,
            },
            panControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER,
            },
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER,
            },
        });

        /**
         * Setup a one time event to simulate the 'load' event for the map when it first loads.
         */
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
            if (ap.isFunction(_self.config.loadedCallback)) {
                _self.config.loadedCallback.call(map);
            }
            if (_self.controlCallbacks.length > 0) {
                for (const key in _self.controlCallbacks) {
                    if (_self.controlCallbacks.hasOwnProperty(key)) {
                        if (ap.isFunction(_self.controlCallbacks[key])) {
                            _self.controlCallbacks[key].call(_self);
                        }
                    }
                }
            }
        });

        /**
         * Keep map centered when resizing window.
         * The 'idle' event is triggered when the map stops panning or zooming. It gets the new
         * center values to be used with the window resize event to recenter the map.
         */
        google.maps.event.addDomListener(this.map, 'idle', () => {
            /**
             * Get the full screen element to test and see if the map is in full screen mode
             */
            const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

            // IE will be null and other browsers will be undefined if not in full screen
            if (ap.isDefined(fullscreenElement) && fullscreenElement !== null) {
                if (this.fullScreen.in === true) {
                    /**
                     * Still full screen
                     * Record the center point.
                     * This is used to recenter the map in the correct spot when going out
                     * of full screen mode.
                     */
                    this.fullScreen.in = true;
                    this.fullScreen.out = false;
                    this.fullScreen.inCenter = this.map.getCenter();
                } else {
                    /**
                     * Just got into full screen. Do nothing because we don't want to overwrite the
                     * last center point of when it was not in full screen mode.
                     */
                }
            } else if (this.fullScreen.in === false) {
                /**
                 * Not in full screen and was not just in full screen
                 * Record the center point
                 */
                this.fullScreen.out = true;
                this.fullScreen.in = false;
                this.fullScreen.outCenter = this.map.getCenter();
            }
        });

        /**
         * Try to keep the map in its original center point when resizing (i.e. mobile or full screen)
         */
        google.maps.event.addDomListener(window, 'resize', () => {
            let center = this.map.getCenter();
            /**
             * Get the full screen element to test and see if the map is in full screen mode.
             * If so, then depending on when it went into full screen then the center point might be overwritten.
             */
            const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

            // IE will be null and other browsers will be undefined if not in full screen
            if (ap.isDefined(fullscreenElement) && fullscreenElement !== null) {
                /**
                 * The map is in full screen mode.
                 */
                if (this.fullScreen.out === true) {
                    /**
                     * The map just got into full screen mode.
                     * Set the center to be the position that it was when out of full screen mode
                     */
                    center = this.fullScreen.outCenter;
                    this.fullScreen.inCenter = center;
                    this.fullScreen.in = true;
                    this.fullScreen.out = false;
                } else {
                    /**
                     * Already in full screen mode.
                     * Record the center point to be used when going out of full screen.
                     */
                    this.fullScreen.in = true;
                    this.fullScreen.out = false;
                    this.fullScreen.inCenter = center;
                }
            } else if (this.fullScreen.in == true) {
                /**
                 * The map was just in full screen mode but isn't anymore.
                 * Use the center position recorded in full screen.
                 */
                center = this.fullScreen.inCenter;
                this.fullScreen.in = false;
                this.fullScreen.out = true;
            }

            /**
             * Trigger resize event so that the map reevaluates it's edges and center.
             * Needed for re-centering to work properly.
             */
            google.maps.event.trigger(this.map, 'resize');

            // Set the new center
            this.map.setCenter(center);
        });

        /**
         * Setup the latitude/longitude bounds if necessary
         */
        if (this.config.fitToBoundsMarker === true || this.config.fitToBoundsSegments === true) {
            this.bounds = new google.maps.LatLngBounds();
        }

        /**
         * Setup events to track the mouse. Used to help with showing/hiding lines
         */
        google.maps.event.addListener(this.map, 'mouseup', () => {
            _self.mouseDown = false;
        });
        google.maps.event.addListener(this.map, 'mousedown', () => {
            _self.mouseDown = true;
        });

        /**
         * Setup events to handle showing/hiding trails on zoom or within bounds if necessary
         */
        if (this.config.segmentShowOnZoom === true || this.config.segmentShowWithinBounds === true) {
            /**
             * Setup the getBounds() method
             * @returns {google.maps.LatLngBounds}
             */
            google.maps.Polyline.prototype.getBounds = function () {
                const bounds = new google.maps.LatLngBounds();
                this.getPath().forEach((e) => {
                    bounds.extend(e);
                });
                return bounds;
            };

            google.maps.event.addListener(this.map, 'zoom_changed', () => {
                _self._showHideSegmentsOnZoom();
            });
            google.maps.event.addListener(this.map, 'center_changed', () => {
                if (_self.mouseDown === false) {
                    _self._showSegmentsWithinBounds();
                }
            });
            google.maps.event.addListener(this.map, 'dragend', () => {
                _self._showSegmentsWithinBounds();
            });
        }
    },

    /**
     * Adds a custom control to the map
     *
     * Example:
     * map.addCustomControl(google.maps.ControlPosition.TOP_LEFT, myControlElement);
     *
     * @param {google.maps.ControlPosition} position The position for the control
     * @param {HTMLElement} control The control element
     * @param {function=} callback Optional callback for once the map is initialized
     */
    addCustomControl(position, control, callback) {
        this.map.controls[position].push(control);
        if (ap.isFunction(callback)) {
            this.controlCallbacks.push(callback);
        }
    },

    /**
     * Centers the map
     */
    centerMap() {
        this.map.setCenter(this.center);
    },

    /**
     * Zooms to a certain value
     * @param {Number} zoom
     */
    zoomTo(zoom) {
        if (ap.isNumber(zoom)) {
            this.map.setZoom(zoom);
        }
    },

    /**
     * Gets the zoom value
     * @returns {Number}
     */
    getZoom() {
        return this.map.getZoom();
    },

    /**
     * Gets the center value
     * @returns {string}
     */
    getCenter() {
        const c = this.map.getCenter();
        return c.toString();
    },

    /**
     * Setup each segment as a group of polylines. Store the group of polylines in the segment object.
     *
     * @param {Array} segments
     */
    setupSegments(segments) {
        if (ap.isArray(segments)) {
            for (const key in segments) {
                if (segments.hasOwnProperty(key)) {
                    this._addPolyline(segments[key]);
                }
            }
        }

        /**
         * Try to show hidden lines if necessary
         */
        // if (this.config.segmentShowOnZoom === true) {
        //     this.showHideSegments();
        // } else if (this.config.segmentShowWithinBounds === true) {
        //     this._showBoundedLines();
        // }
    },

    /**
     * Sets up the related trails functionality
     * @param {Array} segments The related trail segments
     */
    setupRelatedTrails(segments) {
        const _self = this;
        if (ap.isArray(segments)) {
            for (const key in segments) {
                if (segments.hasOwnProperty(key)) {
                    this._addPolyline(segments[key], {
                        map: null,
                        relatedTrailId: segments[key].trailId,
                    }, true);
                }
            }

            // Setup the click event for the show/hide classes
            $(document).ready(() => {
                $(`.${_self.config.relatedTrailslinkClass}`).on('click', function (e) {
                    e.preventDefault();
                    _self.closeAllInfoBoxes();
                    const status = $(this).data('showing');
                    const trailId = $(this).data('trailid');

                    if (status == 'hidden') {
                        $(this).data('showing', 'showing').text('Hide');
                    } else {
                        $(this).data('showing', 'hidden').text('Show');
                    }

                    for (const key in _self.lines) {
                        if (_self.lines.hasOwnProperty(key)) {
                            if (_self.lines[key].related === true) {
                                line = _self.lines[key].line;
                                if (ap.isDefined(line.relatedTrailId)) {
                                    if (trailId == line.relatedTrailId) {
                                        if (status === 'hidden') {
                                            line.setMap(_self.map);
                                        } else {
                                            line.setMap(null);
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            });
        }
    },

    /**
     * Add a polyline to the map based on a segment's data
     * Creates 2 polylines. One for cosmetic purposes that shows on hover.
     * Returns a list of polylines created for the segment.
     *
     * The segment object is expected to contain a 'json' value what is an object.
     * Each value in the json object is another object that contains
     * the latitude and longitude for that segment point.
     * It should also contain the segment type to support showing and hiding specific segment types.
     * For example:
     * {
     *   json:
     *     {
     *       "154":{"lng":"-90.512311264704124","lat":"41.510430401988046"},
     *       "155":{"lng":"-90.512250747013454","lat":"41.510403355298777"}
     *     },
     *   type: 'segmentType'
     * }
     *
     * @param {Object} segment The segment  object
     * @param {Object} [additionalData] Holds any additional data to add to the polyline
     * @param {bool} [related] Whether or not the line segment is a related trail
     * @private
     * @returns {Array}
     */
    _addPolyline(segment, additionalData, related) {
        related = related || false;
        const _self = this;
        if (ap.isObject(segment.json)) {
            // Set that the map has segments
            this.hasSegments = true;

            // Holds the hovered poly line
            let lineHover = null;
            let loc;

            // Create an array of LatLng objects for polyline use
            const coords = [];
            for (const key in segment.json) {
                if (segment.json.hasOwnProperty(key)) {
                    loc = new google.maps.LatLng(segment.json[key].lat, segment.json[key].lng);
                    coords.push(loc);
                    if (this.config.fitToBoundsSegments && related == false) {
                        this.bounds.extend(loc);
                    }
                }
            }

            // Create the regular line
            let pObj = {
                clickable: this.config.segmentClick,
                map: this.map,
                path: coords,
                strokeColor: this._getSegmentColor(segment, related, false),
                strokeOpacity: 1.0,
                strokeWeight: related === false ? this.config.segmentWeight : this.config.relatedSegmentWeight,
                zIndex: related === false ? 3 : 5,
            };
            if (ap.isObject(additionalData)) {
                pObj = ap.extend(pObj, additionalData);
            }

            if (ap.isFunction(this.config.segmentCallback)) {
                pObj = this.config.segmentCallback.call(this, pObj, segment, related);
            }

            const line = new google.maps.Polyline(pObj);

            /**
             * Hide the line initially if it's only supposed to be shown when
             * a certain zoom level is reached or only within the bounds of the map
             */
            if (this.config.segmentVisibleDefault === false || this.config.segmentShowOnZoom === true || this.config.segmentShowWithinBounds === true) {
                line.setVisible(false);
            }

            // Add this line to the array of all segment lines
            const lineObj = {
                line,
                related,
            };
            if (ap.isString(segment.type)) {
                lineObj.type = segment.type;
            }
            this.lines.push(lineObj);

            /**
             * Add the hover effect on the segments if necessary
             */
            let hoverConfig = this.config.segmentHover;
            let clickConfig = this.config.segmentClick;
            if (related === true) {
                hoverConfig = this.config.relatedSegmentHover;
                clickConfig = this.config.relatedSegmentClick;
            }
            if (hoverConfig === true) {
                // create the hover polyline
                let hObj = {
                    path: coords,
                    strokeColor: this._getSegmentColor(segment, related, true),
                    strokeOpacity: 0,
                    strokeWeight: related === false ? this.config.segmentHoverWeight : this.config.relatedSegmentHoverWeight,
                    map: this.map,
                    zIndex: related === false ? 2 : 4,
                };
                if (ap.isObject(additionalData)) {
                    hObj = ap.extend(hObj, additionalData);
                }

                lineHover = new google.maps.Polyline(hObj);

                /**
                 * Hide the line initially if it's only supposed to be shown when
                 * a certain zoom level is reached or only within the bounds of the map
                 */
                if (this.config.segmentVisibleDefault === false || this.config.segmentShowOnZoom === true || this.config.segmentShowWithinBounds === true) {
                    lineHover.setVisible(false);
                }

                // Add this line to the array of all segment lines
                const lineHoverObj = {
                    line: lineHover,
                    related,
                };
                if (ap.isString(segment.type)) {
                    lineHoverObj.type = segment.type;
                }
                this.lines.push(lineHoverObj);

                // setup hover listeners
                google.maps.event.addListener(line, 'mouseover', (e) => {
                    lineHover.setOptions({ strokeOpacity: 0.5 });
                    if ((!related && _self.config.segmentHoverTooltip) || (related && _self.config.relatedSegmentHoverTooltip)) {
                        if (typeof segment.name !== 'undefined') {
                            const point = _self.getPixelsFromLocation(_self.map, e.latLng);
                            _self.tooltip.innerHTML = segment.name;
                            _self.tooltip.style.display = 'block';
                            _self.tooltip.style.left = `${point.x}px`;
                            _self.tooltip.style.top = `${point.y + 30}px`;
                        }
                    }
                });
                google.maps.event.addListener(line, 'mouseout', () => {
                    if (_self.segmentSelected !== segment.id) {
                        lineHover.setOptions({ strokeOpacity: 0 });
                    }
                    if ((!related && _self.config.segmentHoverTooltip) || (related && _self.config.relatedSegmentHoverTooltip)) {
                        _self.tooltip.style.display = 'none';
                    }
                });
                google.maps.event.addListener(lineHover, 'mouseover', (e) => {
                    lineHover.setOptions({ strokeOpacity: 0.5 });
                    if ((!related && _self.config.segmentHoverTooltip) || (related && _self.config.relatedSegmentHoverTooltip)) {
                        if (typeof segment.name !== 'undefined') {
                            const point = _self.getPixelsFromLocation(_self.map, e.latLng);
                            _self.tooltip.innerHTML = segment.name;
                            _self.tooltip.style.display = 'block';
                            _self.tooltip.style.left = `${point.x}px`;
                            _self.tooltip.style.top = `${point.y + 30}px`;
                        }
                    }
                });
                google.maps.event.addListener(lineHover, 'mouseout', () => {
                    if (_self.segmentSelected !== segment.id) {
                        lineHover.setOptions({ strokeOpacity: 0 });
                    }
                    if ((!related && _self.config.segmentHoverTooltip) || (related && _self.config.relatedSegmentHoverTooltip)) {
                        _self.tooltip.style.display = 'none';
                    }
                });

                /**
                 * Add the click event for the segments if necessary
                 */
                if (clickConfig === true) {
                    google.maps.event.addListener(lineHover, 'click', (e) => {
                        _self.setupSegmentInfoBox(e, segment, lineHover);
                        if ((!related && _self.config.segmentHoverTooltip) || (related && _self.config.relatedSegmentHoverTooltip)) {
                            _self.tooltip.style.display = 'none';
                        }
                    });
                }
            }

            /**
             * Add the click event for the segments if necessary
             */
            if (this.config.segmentClick === true) {
                google.maps.event.addListener(line, 'click', (e) => {
                    _self.setupSegmentInfoBox(e, segment, lineHover);
                    if ((!related && _self.config.segmentHoverTooltip) || (related && _self.config.relatedSegmentHoverTooltip)) {
                        _self.tooltip.style.display = 'none';
                    }
                });
            }
        }
    },

    /**
     * Gets the correct color for the line segment
     * @param {Object} segment The segment information
     * @param {bool} [related] Whether the line segment is a related trail segment
     * @param {bool} [hover] Whether the line segment is a hover segment
     * @returns {string}
     * @private
     */
    _getSegmentColor(segment, related, hover) {
        let color = this.config.segmentColor;
        related = related || false;
        hover = hover || false;

        // Since hovering applies to related trails too the hover config should be checked first
        if (hover === true && this.config.segmentHoverColor !== 'same') {
            color = this.config.segmentHoverColor;
        } else if (related === true && this.config.relatedSegmentColor !== 'same') {
            color = this.config.relatedSegmentColor;
        } else if (ap.isFunction(this.config.segmentColorCallback)) {
            color = this.config.segmentColorCallback.call(this, segment);
        }
        return color;
    },

    /**
     * Sets up the segment info box
     * @param {Object} e The Google event object
     * @param {Object} segment The segment data
     * @param {google.maps.PolyLine} lineHover The hover line
     */
    setupSegmentInfoBox(e, segment, lineHover) {
        const _self = this;

        const w = ap.getWindowWidth();
        let width = _self.config.infoBox.segmentWidth;
        let offsetH = -25;
        if (w < 400) {
            width = _self.config.infoBox.segmentWidthXs;
        } else if (w < 600) {
            width = _self.config.infoBox.segmentWidthSm;
        } else if (w < 800) {
            offsetH = -23;
            width = _self.config.infoBox.segmentWidthMd;
        }
        const offsetW = -1 * (width / 2);

        // Close all open infoboxes (which should only be one.)
        this.closeAllInfoBoxes();

        // Set the line to be selected
        this.segmentSelected = segment.id;

        if (lineHover !== null) {
            lineHover.setOptions({ strokeOpacity: 0.25 });
        }

        // InfoBox docs: https://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/reference.html
        const infobox = new InfoBox({
            alignBottom: true, // Put the infobox on the top of the marker.
            closeBoxURL: _self.config.infoBox.closeIcon,
            boxClass: 'MapPopup',
            boxStyle: {
                width: `${width}px`,
            },
            content: _self.config.infoBox.segmentCallback.call(this, segment),
            disableAutoPan: false,
            position: e.latLng,
            infoBoxClearance: new google.maps.Size(50, 20),
            pixelOffset: new google.maps.Size(offsetW, offsetH),
        });
        infobox.onRemove = function () {
            if (this.div_) {
                this.div_.parentNode.removeChild(this.div_);
                this.div_ = null;
            }
            _self.segmentSelected = false;
            if (lineHover !== null) {
                lineHover.setOptions({ strokeOpacity: 0 });
            }
        };
        google.maps.event.addListener(infobox, 'domready', function () {
            _self.config.infoBox.readyCallback.call(this, segment);
        });
        infobox.open(_self.map);

        // Add the new box to the infobox array, so it can be closed later when another infobox window is opened.
        this.infoBoxType = 'segment';
        this.infoBoxes.push(infobox);
    },

    /**
     * Sets up the Points of Interest icons
     *
     * pois should be an array where each value is an object. The object should at minimum have the following data:
     * {
     *  icon: "/images/trails/feature-markers/college-01.png",
     *  lat: 41.51379090909092,
     *  lng: -90.49309090909088,
     *  subtitle: "Sub Title",
     *  title: "College/University"
     * }
     * @param {Array} pois The array of points of interests
     */
    setupPointsOfInterest(pois) {
        if (ap.isArray(pois)) {
            for (const key in pois) {
                if (pois.hasOwnProperty(key)) {
                    this._addPOIMarker(pois[key]);
                }
            }
        }
    },

    /**
     * Adds a Point of Interest Marker
     * @param {Object} poi The data for a single point of interest
     * @private
     */
    _addPOIMarker(poi) {
        const _self = this;

        const latLng = new google.maps.LatLng(poi.lat, poi.lng);
        let opt;
        let title;
        opt = {
            map: this.map,
            position: latLng,
            zIndex: 2,
        };

        this._addMarkerBounds(latLng);

        if (ap.isString(poi.icon)) {
            opt.icon = poi.icon;
        }
        if (ap.isString(poi.title) && poi.title.length > 0) {
            title = poi.title;
            if (ap.isString(poi.subtitle) && poi.subtitle.length > 0) {
                title += `<br>${poi.subtitle}`;
            }
        }

        const marker = new google.maps.Marker(opt);

        // Add the 'click' event to show the info box
        google.maps.event.addListener(marker, 'click', function () {
            // Close all open infoboxes (which should only be one.)
            _self.closeAllInfoBoxes();

            const infobox = new InfoBox({
                alignBottom: true, // Put the infobox on the top of the marker.
                closeBoxURL: _self.config.infoBox.closeIcon,
                boxClass: 'MapPopup',
                boxStyle: {
                    width: `${_self.config.infoBox.poiWidth}px`,
                },
                content: _self.config.infoBox.poiCallback.call(this, poi),
                disableAutoPan: false,
                infoBoxClearance: new google.maps.Size(50, 20),
                pixelOffset: new google.maps.Size(-125, -65),
            });
            google.maps.event.addListener(infobox, 'domready', function () {
                _self.config.infoBox.readyCallback.call(this, poi);
            });

            infobox.open(_self.map, marker);
            // Add the new box to the infobox array, so it can be closed later when another infobox window is opened.
            _self.infoBoxType = 'marker';
            _self.infoBoxes.push(infobox);
        });

        google.maps.event.addListener(marker, 'mouseover', (e) => {
            const point = _self.getPixelsFromLocation(_self.map, e.latLng);
            _self.tooltip.innerHTML = poi.title;
            _self.tooltip.style.display = 'block';
            _self.tooltip.style.left = `${point.x}px`;
            _self.tooltip.style.top = `${point.y + 16}px`;
        });
        google.maps.event.addListener(marker, 'mouseout', () => {
            _self.tooltip.style.display = 'none';
        });

        // Add the tool tip
        // marker.attachTipTool(title, {'cssClass': 'Tiptool'});

        // Add to the markers array. This will allow markers to be shown/hidden via the legend
        this._addMarker(marker, poi.title);
    },

    /**
     * Sets up the trail image points of interest
     * @param {Array} images The trail images
     */
    setupImagePointsOfInterest(images) {
        if (this.config.poiImage.enable === true && ap.isArray(images)) {
            for (const key in images) {
                if (images.hasOwnProperty(key)) {
                    this._addPOIImageMarker(images[key]);
                }
            }
        }
    },

    /**
     * Adds a POI image marker
     * @param {Object} image The image data
     * @private
     */
    _addPOIImageMarker(image) {
        const _self = this;

        const latLng = new google.maps.LatLng(image.lat, image.lng);
        let opt;
        opt = {
            position: latLng,
            map: this.map,
            icon: this.config.poiImage.icon,
            zIndex: 1,
        };

        this._addMarkerBounds(latLng);

        const marker = new google.maps.Marker(opt);

        google.maps.event.addListener(marker, 'click', () => {
            // Close all open infoboxes (if there are any)
            _self.closeAllInfoBoxes();
            // Open image popup
            $.magnificPopup.open({
                items: {
                    src: image.src,
                },
                type: 'image',
                image: {
                    titleSrc() {
                        let title = '';
                        if (image.caption) title += image.caption;
                        if (image.credit) title += ` - Photo courtesy: ${image.credit}`;
                        return title;
                    },
                },
            }, 0);
        });

        google.maps.event.addListener(marker, 'mouseover', (e) => {
            const point = _self.getPixelsFromLocation(_self.map, e.latLng);
            _self.tooltip.innerHTML = _self.config.poiImage.title;
            _self.tooltip.style.display = 'block';
            _self.tooltip.style.left = `${point.x}px`;
            _self.tooltip.style.top = `${point.y + 16}px`;
        });
        google.maps.event.addListener(marker, 'mouseout', () => {
            _self.tooltip.style.display = 'none';
        });

        // marker.attachTipTool(this.config.poiImage.title, {'cssClass': 'Tiptool'});
    },

    /**
     * Sets up the markers for marking individual trails on a map showing multiple trails
     * @param {Array} trails
     */
    setupTrailMarkers(trails) {
        if (ap.isArray(trails)) {
            for (const key in trails) {
                if (trails.hasOwnProperty(key)) {
                    this._addTrailMarker(trails[key]);
                }
            }
        }
    },

    /**
     * Adds a trail marker
     * @param {Object} trail The data for a trail
     * @private
     */
    _addTrailMarker(trail) {
        const _self = this;

        // Get the latitude / longitude point for the trail
        const latLng = new google.maps.LatLng(trail.lat, trail.lng);
        this._addMarkerBounds(latLng);

        // Setup the marker options
        const opt = {
            map: this.map,
            optimized: false,
            position: latLng,
            zIndex: 99,
        };
        /**
         * Get the marker icon if possible
         */
        if (ap.isFunction(this.config.trailMarker.iconCallback)) {
            opt.icon = this.config.trailMarker.iconCallback.call(this, trail);
            // opt.height = this.config.trailMarker.height;
            // opt.width = this.config.trailMarker.width;
        }

        const marker = new google.maps.Marker(opt);

        // Add the 'click' event to show the info box
        google.maps.event.addListener(marker, 'click', function () {
            const w = ap.getWindowWidth();
            let width = _self.config.infoBox.trailMarkerWidth;
            let offsetH = -58;
            if (w < 400) {
                width = _self.config.infoBox.trailMarkerWidthXs;
            } else if (w < 600) {
                width = _self.config.infoBox.trailMarkerWidthSm;
            } else if (w < 800) {
                offsetH = -55;
                width = _self.config.infoBox.trailMarkerWidthMd;
            }
            let offsetW = -1 * (width / 2);

            if (typeof _self.config.infoBox.trailMarkerInfoBoxPositionCallback === 'function') {
                const offset = _self.config.infoBox.trailMarkerInfoBoxPositionCallback.call(this, offsetW, offsetH);
                if (typeof offset !== 'undefined' && typeof offset.width !== 'undefined' && typeof offset.height !== 'undefined') {
                    offsetW = offset.width;
                    offsetH = offset.height;
                }
            }

            const infobox = new InfoBox({
                alignBottom: true, // Put the infobox on the top of the marker.
                closeBoxURL: _self.config.infoBox.closeIcon,
                boxClass: 'MapPopup',
                boxStyle: {
                    width: `${width}px`,
                },
                content: _self.config.infoBox.trailMarkerCallback.call(this, trail),
                disableAutoPan: false,
                infoBoxClearance: new google.maps.Size(50, 45),
                pixelOffset: new google.maps.Size(offsetW, offsetH),
            });
            google.maps.event.addListener(infobox, 'domready', function () {
                _self.config.infoBox.readyCallback.call(this, trail);
                _self.config.infoBox.trailMarkerReadyCallback.call(this, trail);
            });
            // Close all open infoboxes (which should only be one.)
            _self.closeAllInfoBoxes();
            infobox.open(_self.map, marker);
            // Add the new box to the infobox array, so it can be closed later when another infobox window is opened.
            _self.infoBoxType = 'marker';
            _self.infoBoxes.push(infobox);
        });

        if (!verge.isTouch()) {
            google.maps.event.addListener(marker, 'mouseover', (e) => {
                const point = _self.getPixelsFromLocation(_self.map, e.latLng);
                _self.tooltip.innerHTML = trail.name;
                _self.tooltip.style.display = 'block';
                _self.tooltip.style.left = `${point.x}px`;
                _self.tooltip.style.top = `${point.y + 16}px`;
            });
            google.maps.event.addListener(marker, 'mouseout', () => {
                _self.tooltip.style.display = 'none';
            });
        }

        // Add the tool tip
        // marker.attachTipTool(trail.name, {'cssClass': 'Tiptool'});

        // Add to the markers array.
        this._addMarker(marker, 'Trail', trail.id);

        if (typeof this.markerClusterer === 'object' && this.markerClusterer !== null) {
            this.markerClusterer.addMarker(marker, true);
        }
    },

    getPixelsFromLocation(map, latLng) {
        const projection = map.getProjection();
        const bounds = map.getBounds();
        const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
        const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
        const scale = Math.pow(2, map.getZoom());
        const worldPoint = projection.fromLatLngToPoint(latLng);
        return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
    },

    /**
     * Close all currently open info boxes.
     * Do this before a new info box is opened.
     * @private
     */
    closeAllInfoBoxes() {
        for (let i = this.infoBoxes.length - 1; i >= 0; i--) {
            this.infoBoxes[i].close();
        }
        this.infoBoxes = [];
    },

    /**
     * Close info boxes if their type is "segment"
     */
    closeSegmentInfoBoxes() {
        if (this.infoBoxType == 'segment') {
            this.closeAllInfoBoxes();
        }
    },

    /**
     * Sets up the geo location functionality
     *
     * An example usage of the callback function could be to show the geo location sorting
     * in the search box.
     * The callback method should accept two parameters: latitude, longitude
     * @param {Function} [callback] Optional callback function to call while the location is being watched
     */
    setupGeoLocation(callback) {
        if (this.config.geoLocationIcon.enable === true && this.config.geoLocationTrack.enable === true) {
            if (navigator.geolocation) {
                const _self = this;

                /**
                 * Setup the geo location tracking icon.
                 * This is setup even if geo tracking is turned off because
                 * it would be needed for moving to the user's current location when the
                 * geo location icon is clicked.
                 */
                this.myLocationMarker = new google.maps.Marker({
                    icon: _self.config.geoLocationTrack.icon,
                    map: null,
                    optimized: false,
                    title: _self.config.geoLocationTrack.title,
                    zIndex: 0,
                });

                google.maps.event.addListener(this.myLocationMarker, 'mouseover', (e) => {
                    const point = _self.getPixelsFromLocation(_self.map, e.latLng);
                    _self.tooltip.innerHTML = 'My location';
                    _self.tooltip.style.display = 'block';
                    _self.tooltip.style.left = `${point.x}px`;
                    _self.tooltip.style.top = `${point.y + 16}px`;
                });
                google.maps.event.addListener(this.myLocationMarker, 'mouseout', () => {
                    _self.tooltip.style.display = 'none';
                });

                // Setup the watch event
                navigator.geolocation.watchPosition(
                    // Success
                    function (pos) {
                        _self.myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                        _self._showGeoLocationIcon();
                        _self._showGeoLocation();
                        if (ap.isFunction(callback)) {
                            callback.call(this, pos.coords.latitude, pos.coords.longitude);
                        }
                    },
                    // Error
                    (error) => {
                        // Handle error here
                    },
                    // Configuration options
                    {
                        enableHighAccuracy: true,
                    },
                );

                /**
                 * Setup the "zoom to my location" icon/functionality
                 * if it's enabled in in the config.
                 */
                if (this.config.geoLocationIcon.enable === true) {
                    if (ap.isFunction(this.config.geoLocationIcon.buttonCallback)) {
                        // Get the icon element from the callback function
                        this.geoLocationIcon = this.config.geoLocationIcon.buttonCallback.call(this);
                    } else {
                        // Create the default icon
                        this.geoLocationIcon = document.createElement('img');
                        this.geoLocationIcon.src = this.config.geoLocationIcon.src;
                        this.geoLocationIcon.alt = this.config.geoLocationIcon.title;
                        this.geoLocationIcon.title = this.config.geoLocationIcon.title;
                        this.geoLocationIcon.style.cursor = 'pointer';
                        this.geoLocationIcon.style.zIndex = '1';
                    }

                    ap.event.add(this.geoLocationIcon, 'click', () => {
                        _self.map.getStreetView().setVisible(false);
                        _self.myLocationMarker.setPosition(_self.myLocation);
                        _self.myLocationMarker.setMap(_self.map);
                        _self.map.setCenter(_self.myLocation);
                    });
                }
            }
        }
    },

    /**
     * Shows the geo location icon if geo location is supported and being watched
     */
    _showGeoLocationIcon() {
        if (this.config.geoLocationIcon.enable === true) {
            if (this.geoLocationDisplayed === false) {
                this.addCustomControl(google.maps.ControlPosition[this.config.geoLocationIcon.position], this.geoLocationIcon);
                this.geoLocationDisplayed = true;
            }
        }
    },

    /**
     * Shows the user's current geo location on the map
     */
    _showGeoLocation() {
        if (this.config.geoLocationTrack.enable === true && this.myLocation !== null) {
            this.myLocationMarker.setPosition(this.myLocation);
            this.myLocationMarker.setMap(this.map);
        }
    },

    /**
     * Adds a marker cluster style
     *
     * Need to do this at least once before calling setupMarkerCluster()
     *
     * Example options object
     * {
     *    url: "/layout/images/cluster/cluster-sm.png",
     *    width: 30,
     *    height: 30,
     *    textSize: 11,
     *    textColor: "white"
     * }
     *
     * @param {Object} options The style options object
     */
    addMarkerClusterStyle(options) {
        let style = {
            url: '/layout/images/cluster/cluster-md.png',
            width: 45,
            height: 45,
            textSize: 14,
            textColor: 'white',
        };
        style = ap.extend(style, options);
        this.markerClusterStyles.push(style);
    },

    /**
     * Sets up marker clusters
     *
     * See http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html#MarkerClustererOptions
     * for options
     *
     * The calculatorCallback function takes two parameters:
     * numberMarkers: {Number} The number of markers being considered for the cluster
     * numberStyles: {Number} The number of marker styles available
     * The function should return back an object:
     * {text: 'Cluster text', index: 2}
     * 'text' is the text to show on the cluster
     * 'index' is the 1-based index of the marker styles array to set which style to use
     *
     * Example callback function (in this example there are 3 marker styles):
     * function (numMarkers) {
     *       if (numMarkers >= 20) {
     *           return {text: numMarkers, index: 3};
     *       }
     *       if (numMarkers < 20 && numMarkers >= 10) {
     *           return {text: numMarkers, index: 2};
     *       }
     *       if (numMarkers < 10 && numMarkers > 1) {
     *           return {text: ml, index: 1};
     *       }
     *   },
     *
     * @param {Function} [calculatorCallback] A callback function to determine which cluster style to show
     * @param {object} [options] Cluster options to set
     *
     */
    setupMarkerCluster(calculatorCallback, options) {
        // MarkerClustererOptions - see http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html#MarkerClustererOptions
        const mcOpts = {
            // The size of the square grid in pixels to look for markers in. The larger the number the more markers included in a cluster.
            gridSize: 40,
            // The maximum zoom level at which clustering is enabled or null if clustering is to be enabled at all zoom levels.
            maxZoom: null,
            // The minimum number of markers to include in a cluster. A larger number will result in fewer clusters.
            minimumClusterSize: 2,
        };
        if (ap.isObject(options)) {
            ap.extend(mcOpts, options);
        }

        mcOpts.styles = this.markerClusterStyles;

        // Convert the markers object to an array. That is how the cluster class needs them.
        const markers = [];
        // for (var key in this.markers) {
        //     if (this.markers.hasOwnProperty(key)) {
        //         for (var sk in this.markers[key]) {
        //             if(this.markers[key].hasOwnProperty(sk)) {
        //                 markers.push(this.markers[key][sk]);
        //             }
        //         }
        //     }
        // }

        // Add a destroy method to the MarkerCluster class to properly remove the events
        // MarkerClusterer.prototype.destroy = function() {
        //     // Clear events for the markers
        //     for (let m of this.markers_) {
        //         google.maps.event.clearInstanceListeners(m);
        //         this.removeMarker(m, true);
        //     }
        //     // Clear the events for the marker clusters
        //     for (let c of this.clusters_) {
        //         google.maps.event.clearInstanceListeners(c.getMarkerClusterer());
        //         google.maps.event.clearInstanceListeners(c.clusterIcon_.div_);
        //     }
        //
        //     // Clear all the clusters
        //     this.resetViewport();
        // }

        // See http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/docs/reference.html#MarkerClusterer
        this.markerClusterer = new MarkerClusterer(this.map, markers, mcOpts);
        /**
         * Set the calculator function.
         * For some reason setting this as an option in mcOpts doesn't work.
         */
        if (ap.isFunction(calculatorCallback)) {
            /**
             * Callback function accepts two arguments:
             * markers: {Array} the markers that are being considered for the cluster
             * numClusterIconStyles: {Number} The number of available cluster styles.
             */
            this.markerClusterer.setCalculator((markers, numberStyles) => calculatorCallback.call(map, markers.length, numberStyles));
            this.markerClusterer.repaint();
        }
    },

    /**
     * Resets and repaints the marker clustering
     */
    repaintMarkerCluster() {
        if (typeof this.markerClusterer === 'object' && this.markerClusterer != null) {
            this.markerClusterer.resetViewport();
        }
    },

    /**
     * Shows all markers
     */
    showAllMarkers() {
        this._showHideAllMarkers(true);
    },

    /**
     * Hides all markers
     */
    hideAllMarkers() {
        this._showHideAllMarkers(false);
    },

    /**
     * Handles showing or hiding all markers
     * @param {bool} visible Whether or not the markers should be visible
     * @private
     */
    _showHideAllMarkers(visible) {
        for (const key in this.markers) {
            if (this.markers.hasOwnProperty(key)) {
                this._setMarkersVisibility(this.markers[key], visible);
            }
        }
    },

    /**
     * Shows markers of a specific type
     * @param {string} type The marker type
     */
    showMarkers(type) {
        this._showHideMarkers(type, true);
    },

    /**
     * Hides markers of a specific type
     * @param {string} type The marker type
     */
    hideMarkers(type) {
        this._showHideMarkers(type, false);
    },

    /**
     * Handles showing or hiding markers based on marker type
     * @param {string} type The marker type
     * @param {bool} visible Whether or not to show the marker
     * @private
     */
    _showHideMarkers(type, visible) {
        for (const key in this.markers) {
            if (this.markers.hasOwnProperty(key)) {
                if (key === type) {
                    this._setMarkersVisibility(this.markers[key], visible);
                }
            }
        }
    },

    /**
     * Sets the visibility of a group of markers
     * @param {Array} markers An array of markers
     * @param {bool} visible Whether or not the markers are visible
     * @private
     */
    _setMarkersVisibility(markers, visible) {
        for (let i = markers.length - 1; i >= 0; i--) {
            markers[i].setVisible(visible);
        }
    },

    /**
     * Removes all markers from the map
     */
    removeMarkers() {
        let markers;
        for (const key in this.markers) {
            if (this.markers.hasOwnProperty(key)) {
                markers = this.markers[key];
                for (let i = markers.length - 1; i >= 0; i--) {
                    markers[i].setMap(null);
                }
            }
        }
        this.markers = {};

        // Reset the bounds
        this.bounds = new google.maps.LatLngBounds();

        if (typeof this.markerClusterer === 'object' && this.markerClusterer !== null) {
            this.markerClusterer.clearMarkers();
        }
    },

    /**
     * Adds a marker to the marker array
     * @param {google.maps.Marker} marker
     * @param {string} title The marker title
     * @param {string} id The unique identifider for the marker
     * @private
     */
    _addMarker(marker, title, id) {
        if (!ap.isString(id) || id.length === 0) {
            id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        }
        if (!ap.isString(title) || title.length === 0) {
            title = 'point';
        }
        if (!ap.isDefined(this.markers[title])) {
            this.markers[title] = {};
        }
        this.markers[title][id] = marker;
    },

    /**
     * Simulates a click event on the marker
     *
     * @param {string} id The marker id
     * @param {string} title The marker type
     */
    clickMarker(id, title) {
        if (!ap.isString(title) || title.length === 0) {
            title = 'Trail';
        }
        if (ap.isDefined(this.markers[title]) && ap.isDefined(this.markers[title][id])) {
            const marker = this.markers[title][id];
            const pos = marker.getPosition();
            this.map.setCenter(pos);
            google.maps.event.trigger(marker, 'click');
        }
    },

    /**
     * Gets the correct zoom value based on the viewport size
     * @param {int} defaultZoom The default zoom value
     * @private
     */
    _getZoom(defaultZoom) {
        let zoom = defaultZoom;
        const width = window.innerWidth;

        // If the window is smaller get different zoom values than the default
        if (width <= 480) {
            zoom = 13;
        } else if (width <= 650) {
            zoom = 14;
        }
        return zoom;
    },

    /**
     * Gets the correct map type based on the config value
     *
     * @param {string} [type] The map type
     * @returns {string}
     * @private
     */
    _getMapType(type) {
        type = type || this.config.mapType.toLowerCase();
        if (type === 'hybrid') {
            type = google.maps.MapTypeId.HYBRID;
        } else if (type === 'roadmap') {
            type = google.maps.MapTypeId.ROADMAP;
        } else if (type === 'satellite') {
            type = google.maps.MapTypeId.SATELLITE;
        } else if (type === 'terrain') {
            type = google.maps.MapTypeId.TERRAIN;
        } else {
            type = this.config.mapType;
        }
        return type;
    },

    /**
     * Adds to the lat/lng bounds for markers
     * @param {google.maps.LatLng} latLng
     * @private
     */
    _addMarkerBounds(latLng) {
        if (this.config.fitToBoundsMarker === true) {
            this.bounds.extend(latLng);
        }
    },

    /**
     * Fits the map to the lat/lng bounds if necessary
     * @param {boolean} callback
     * @private
     */
    fitToBounds(callback) {
        callback = callback || false;
        const _self = this;
        if (
            (this.config.fitToBoundsMarker === true && Object.keys(this.markers).length > 0)
            || (this.config.fitToBoundsSegments === true && this.hasSegments === true)
        ) {
            if (!this.bounds.isEmpty()) {
                /**
                 * Event to confirm that you haven't zoomed in to far. If there is
                 * only a small number of markers then it could zoom in really far
                 */
                google.maps.event.addListenerOnce(this.map, 'idle', function () {
                    if (_self.map.getZoom() > _self.config.fitToBoundsMazZoom) {
                        _self.map.setZoom(_self.config.fitToBoundsMazZoom);
                    }
                    if (callback) {
                        if (typeof _self.config.fitToBoundsCallback === 'function') {
                            _self.config.fitToBoundsCallback.call(this);
                        }
                    }
                });
                this.map.fitBounds(this.bounds);
            }
        }
    },

    /**
     * Shows or hides segments when zooming
     * @private
     */
    _showHideSegmentsOnZoom() {
        if (this.config.segmentShowOnZoom == true) {
            if (this.getZoom() >= this.config.segmentShowOnZoomLevel) {
                // Mark segments as shown
                this.segmentsShown = true;

                // Show the lines
                if (this.config.segmentShowWithinBounds) {
                    // Only show lines within the map viewport
                    this._showBoundedLines();
                } else {
                    // Show all lines
                    this._setLinesVisibility(true);
                }
            } else {
                /**
                 * Hide the lines, but only if they have already been shown
                 */
                if (this.segmentsShown === true) {
                    this._setLinesVisibility(false);
                }
            }
        } else {
            this._showSegmentsWithinBounds();
        }
    },

    /**
     * Shows segments within bounds if necesary
     * @private
     */
    _showSegmentsWithinBounds() {
        if (this.config.segmentShowWithinBounds === true && this.segmentsShown === true) {
            this._showBoundedLines();
        }
    },

    /**
     * Shows or hides line segments depending on their current visibility
     * @return boolean
     */
    showHideSegments() {
        let isVisible = false;
        if (this.segmentsShown) {
            // Segments are already shown. Hide them now
            isVisible = this._setLinesVisibility(false);
        } else if (this.config.segmentShowWithinBounds === true) {
            this._showBoundedLines();
            // Segments are not visible. Show them within the bounds of the map
            this.segmentsShown = true;
            isVisible = true;
        } else if (!this.segmentsShown) {
            // Segments are not visible. Show them.
            isVisible = this._setLinesVisibility(true);
        }
        return isVisible;
    },

    /**
     * Hides all line segments
     */
    hideSegments() {
        this._setLinesVisibility(false);
    },

    /**
     * Sets the visibility for all lines
     * @param {boolean} visible
     * @private
     */
    _setLinesVisibility(visible) {
        this.changingSegmentVisibility = true;
        let line;
        for (const key in this.lines) {
            if (this.lines.hasOwnProperty(key)) {
                line = this.lines[key].line;
                line.setVisible(visible);
            }
        }
        this.segmentsShown = visible;
        this.changingSegmentVisibility = false;
    },

    /**
     * Handles showing only the line segments that are within the viewport of the map
     * @private
     */
    _showBoundedLines() {
        this.changingSegmentVisibility = true;
        const bounds = this.map.getBounds();
        let line;
        for (const key in this.lines) {
            if (this.lines.hasOwnProperty(key)) {
                line = this.lines[key].line;
                if (bounds.intersects(line.getBounds())) {
                    line.setVisible(true);
                }
            }
        }
        this.changingSegmentVisibility = false;
    },

    /**
     * Removes all segments from the map
     */
    removeSegments() {
        let line;
        for (const key in this.lines) {
            if (this.lines.hasOwnProperty(key)) {
                line = this.lines[key].line;
                line.setMap(null);
            }
        }
        this.lines = [];
        this.segmentsShown = false;
    },

    /**
     * Removes all info boxes from the map
     */
    removeInfoBoxes() {
        this.closeAllInfoBoxes();
        this.infoBoxes = [];
    },
};
