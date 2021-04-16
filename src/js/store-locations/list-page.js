/**
 * Holds Javascript for the main map page for the store locator
 */

/**
 * Gets whether or not the browser supports the history API
 * @returns {boolean}
 */
function supportsHistoryApi() {
    return !!(window.history && history.pushState);
}

/**
 * Provides methods for working with URL query parameters
 */
const urlQueryValues = {
    /**
     * The URL query parameter values
     * @var {object|URLSearchParams}
     * @private
     */
    values: null,

    /**
     * Gets the value from the URL query parameters if it exists
     * @param {string} key The name of the parameter to get
     * @returns {string}
     */
    get(key) {
        this.init();
        let returnValue = null;
        if (typeof this.values[key] !== 'undefined') {
            returnValue = this.values[key];
            // If return value is an array with only one value, return just the one value
            if (returnValue.length == 1) {
                returnValue = returnValue[0];
            }
        }

        return returnValue;
    },

    /**
     * Gets whether or not there are any query parameters
     * @returns {boolean}
     */
    hasValues() {
        this.init();
        return Object.keys(this.values).length > 0;
    },

    /**
     * Gets the query parameter values if they don't already exist
     * @private
     */
    init() {
        if (this.values === null) {
            // This is the first time. Get the URL parameters if they exist.
            this.values = this._getAllUrlParams();
        }
    },

    /**
     * Resets the parameters to match what's in the URL now
     */
    reset() {
        this.values = this._getAllUrlParams();
    },

    /**
     * Replaces (or sets) a query value
     * @param {string} key
     * @param {string|Array} value
     */
    set(key, value) {
        this.reset();
        this.values[key] = value;
    },

    /**
     * Returns the query parameters as a string
     * @params {string=} The parameter key to skip
     * @returns {string}
     */
    toString(skip) {
        let returnValue = '';
        let values;
        let key;
        let val;
        if (this.hasValues()) {
            returnValue = '?';
            values = Object.entries(this.values);
            for (let i = 0, l = values.length; i < l; i++) {
                key = values[i][0];
                if (typeof skip === 'undefined' || key != skip) {
                    val = values[i][1];
                    if (i > 0) {
                        returnValue += '&';
                    }
                    if (typeof val === 'string') {
                        returnValue += `${key}=${val}`;
                    } else if (Array.isArray(val)) {
                        val.forEach((thisVal, index) => {
                            if (index > 0) {
                                returnValue += '&';
                            }
                            returnValue += `${key}[]${thisVal}`;
                        });
                    }
                }
            }
        }
        if (returnValue === '?') {
            returnValue = '';
        }
        return returnValue;
    },

    /**
     * Get all the URL params
     *
     * @link https://www.sitepoint.com/get-url-parameters-with-javascript/
     * @param {string=} url
     * @returns {{}}
     * @private
     */
    _getAllUrlParams(url) {
        // get query string from url (optional) or window
        let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

        // we'll store the parameters here
        const obj = {};

        // if query string exists
        if (queryString) {
            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            const arr = queryString.split('&');

            for (let i = 0; i < arr.length; i++) {
                // separate the keys and the values
                const a = arr[i].split('=');

                // set parameter name and value (use 'true' if empty)
                const paramName = a[0];
                let paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                // (optional) keep case consistent
                // paramName = paramName.toLowerCase();
                // if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
                if (typeof paramValue === 'string') paramValue = decodeURIComponent(paramValue);

                // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                if (paramName.match(/\[(\d+)?\]$/)) {
                    // create key if it doesn't exist
                    const key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!obj[key]) obj[key] = [];

                    // if it's an indexed array e.g. colors[2]
                    if (paramName.match(/\[\d+\]$/)) {
                        // get the index value and add the entry at the appropriate position
                        const index = /\[(\d+)\]/.exec(paramName)[1];
                        obj[key][index] = paramValue;
                    } else {
                        // otherwise add the value to the end of the array
                        obj[key].push(paramValue);
                    }
                } else {
                    // we're dealing with a string
                    if (!obj[paramName]) {
                        // if it doesn't exist, create property
                        obj[paramName] = paramValue;
                    } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                        // if property does exist and it's a string, convert it to an array
                        obj[paramName] = [obj[paramName]];
                        obj[paramName].push(paramValue);
                    } else {
                        // otherwise add the property
                        obj[paramName].push(paramValue);
                    }
                }
            }
        }
        return obj;
    },
};

var storeLocations = {
    fieldDistance: null,
    fieldLat: null,
    fieldLon: null,
    fieldLocation: null,
    form: null,
    geocoder: null,
    itemIds: [],
    latitude: 45,
    longitude: -69,

    init() {
        this.form = document.querySelector('.js-slSearchForm');
        this.fieldDistance = document.querySelector('.js-searchDistance');
        this.fieldLat = document.querySelector('.js-geoLocationLat');
        this.fieldLon = document.querySelector('.js-geoLocationLon');
        this.fieldLocation = document.querySelector('.js-slSearchLocation');
        this.geocoder = new google.maps.Geocoder();

        this.setupSearch();

        const locations = document.querySelector('.js-locations');
        locations.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('js-locationBtn')) {
                storeLocationsListMap.mapObj.clickMarker(e.target.getAttribute('data-id'));
            }
        });
    },

    /**
     * Set up the search form
     * @private
     */
    setupSearch() {
        const _self = this;
        // Set up the search form
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            _self.itemIds = [];
            $('.js-locations').html('<p>SEARCHING...</p>');

            _self.getLocation(() => {
                _self.search();
            });
        });
    },

    /**
     * Perform the actual search
     */
    search() {
        const _self = this;
        $(this.form).ajaxSubmit({
            dataType: 'json',
            success(data) {
                let total;
                let ids;
                total = parseInt(data.total);
                console.log('Total: ', total);
                if (total > 0) {
                    _self.setItemIds(data.ids);

                    _self.loadSearchItems();
                } else {
                    _self.showNotFound();
                }
            },
        });
    },

    /**
     * Sets item ids
     * @private
     * @param string|number ids The ids from the search results. Either a single number or a comma separated string of numbers
     */
    setItemIds(ids) {
        this.itemIds = [];
        if (typeof ids === 'number') {
            ids = [ids];
        } else {
            ids = ids.split(',');
        }

        for (let i = ids.length - 1; i >= 0; i--) {
            this.itemIds.push(ids[i]);
        }
    },

    /**
     * Load the items that were returned in the search results
     */
    loadSearchItems() {
        const _self = this;
        storeLocationsListMap.search.markers = [];
        if (this.itemIds.length > 0) {
            $.ajax({
                type: 'POST',
                url: '/store-locations/map-items',
                data: { id: _self.itemIds },
                dataType: 'json',
                success(data) {
                    $('.js-locations').empty();
                    storeLocationsListMap.clearMap();
                    storeLocationsListMap.search.markers = data;
                    storeLocationsListMap.mapObj.setupTrailMarkers(data);
                    storeLocationsListMap.mapObj.fitToBounds();
                    storeLocationsListMap.mapObj.repaintMarkerCluster();

                    // Show items in sidebar

                    if (ap.isArray(data)) {
                        let item; let
                            el;
                        for (const key in data) {
                            if (data.hasOwnProperty(key)) {
                                item = data[key];
                                el = '<div class="StoreLocations-item">';
                                el += `<div class="StoreLocations-title"><a href="${item.url}" target="_blank" class="u-linkSubtle">${item.name}</a></div>`;
                                el += '<div class="StoreLocations-address">';
                                el += `${item.addr}<br>${item.city}, ${item.state} ${item.zip}`;
                                el += '</div>'; // End StoreLocations-address
                                el += '<div class="StoreLocations-buttons">';
                                el += '<button type="button" class="StoreLocations-button">View on Map</button>';
                                el += `<a href="${item.url}" class="StoreLocations-button" target="_blank">View Details</a>`;
                                el += '</div>'; // End StoreLocations-buttons
                                el += '</div>'; // End StoreLocations-item
                                $('.js-locations').append(el);
                            }
                        }
                    }
                },
            });
        }
    },

    /**
     * Shows the not found message
     */
    showNotFound() {
        $('.js-locations').html('<p><b>No locations were found near you</b>');
        // $('.js-mapOverlay').hide();
        // $('.js-mapCanvas').hide();
        // $('.js-searchNoResults').show();
        // $('.js-searchTotalTrails').hide();
        // $('.js-totalTrails').hide();
        // $('.js-mapList').hide();
        // if (!$('.js-loadItems').hasClass('u-hidden')) {
        //     $('.js-loadItems').hide();
        // }
    },

    setLatitude(latitude) {
        this.latitude = latitude;
        this.fieldLat.value = latitude;
    },
    setLongitude(longitude) {
        this.longitude = longitude;
        this.fieldLon.value = longitude;
    },

    getLocation(callback) {
        const address = this.fieldLocation.value;
        if (address.length > 0) {
            this.geocoder.geocode({
                address: encodeURI(address),
                // componentRestrictions: {
                //     'country': 'US'
                // }
            }, (results, status) => {
                if (status == 'OK' && results.length > 0) {
                    console.log(results);
                    storeLocations.setLocation(results[0].geometry.location);
                    if (typeof callback === 'function') {
                        callback.apply();
                    }
                }
            });
        }
    },

    setLocation(latlng) {
        const lat = latlng.lat();
        const lng = latlng.lng();

        // Set the latitude and longitude values
        this.setLatitude(lat);
        this.setLongitude(lng);

        // Set the map center and zoom
        // this.map.setCenter(latlng);
        // if (this.map.getZoom() < 12) {
        //     this.map.setZoom(16);
        // }
        //
        // // Set the marker and tooltip position
        // this.marker.setPosition(latlng);
        // this.setMarkerTooltip(lat, lng);
        //
        // this.locationSet = true;
    },

    getAddress() {
        let i;
        let l;
        let addr;
        let addrPart;
        this.geocoder.geocode({
            location: {
                lat: this.latitude,
                lng: this.longitude,
            },
        }, (results, status) => {
            if (status == 'OK') {
                // A valid response was returned
                for (i = 0, l = results.length; i < l; i++) {
                    addr = results[i];
                    if (addr.types.some((val) => val == 'street_address')
                    ) {
                        storeLocations.fieldLocation.value = addr.formatted_address;
                        break;
                    }
                }
            }
        });
    },
};
