/**
 * Common map functions for the trail detail and trail list pages
 */
mapUtilities = function(map, isEmbedded) {
    this.setupMap(map);
    if (isEmbedded === true) {
        this.isEmbedded = true;
    }
};

mapUtilities.prototype = {

    /**
     * Whether or not the map is embedded
     */
    isEmbedded: false,

    /**
     * Common map setup methods
     */
    setupMap: function(map) {
        // Adjust the segment weights
        map.config.segmentWeight = 4;

        // Callback method to setup the segment color
        map.config.segmentColorCallback = function(segment) {
            var color = '#ff9c00';
            if (ap.isDefined(segment.activity) && segment.activity.length > 0) {
                if (segment.activity == 'paddling') {
                    color = '#3e9ed8';
                }
            } else if (ap.isDefined(segment.color)) {
                color = segment.color;
            }
            return color;
        };

        // Callback to setup the segment
        map.config.segmentCallback = function(pObj, segment) {
            var dashed = false;
            if (ap.isDefined(segment.activity) && segment.activity.length > 0) {
                if (segment.activity == 'paddling') {
                    dashed = true;
                }
            }

            if (dashed) {
                var lineSymbol = {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 3
                };
                pObj.strokeOpacity = 0;
                pObj.icons = [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '15px'
                }];
            }
            return pObj;
        }

        // Setup the map loaded callback function
        map.config.loadedCallback = function() {

        }

        // Setup the geolocation button callback
        map.config.geoLocationIcon.buttonCallback = function() {
            var control = document.createElement('div');
            control.className = 'MapBtn MapBtn-geo Tooltip Tooltip--right';
            control.setAttribute('data-tooltip', 'Go to my location');
            control.index = 1;
            control.innerHTML = '<svg class="Icon MapBtn-icon" role="img"><use xlink:href="#icon-location" /></svg>';
            return control;
        }
        map.config.geoLocationIcon.position = 'LEFT_BOTTOM';

        this._setupInfoBox(map);
    },

    /**
     * Setup the InfoBox callbacks to set the HTML
     */
    _setupInfoBox: function(map) {
        var _self = this;
        map.config.infoBox.readyCallback = function() {
            // Move the close box to be inside the popup div
            $('div.infoBox > img').prependTo($('div.infoBox .MapPopup-header')).css({position: 'absolute', top: '10px', right: '6px'});
        };
        map.config.infoBox.poiCallback = function(poi) {
            return mapInfoBox.getPOIInfoBoxContent(poi);
        };
        map.config.infoBox.segmentCallback = function(segment) {
            if (typeof segment.b !== 'undefined' && segment.b == 1) {
                // This is a segment on the trailside services map.
                // Show the same as what a trail popup does
                return mapInfoBox.getTrailMarkerInfoBoxContent(segment);
            } else {
                return mapInfoBox.getSegmentInfoBoxContent(segment);
            }
        };
        map.config.infoBox.trailMarkerCallback = function(trail) {
            var type = 'trail';
            if (typeof trail.t !== 'undefined' && trail.t == 0) {
                var type = 'service';
            }
            if (type == 'trail') {
                var showIcons = true;
                if (_self.isEmbedded) {
                    showIcons = false;
                }
                return mapInfoBox.getTrailMarkerInfoBoxContent(trail, showIcons);
            } else {
                return mapInfoBox.getTrailsideServiceMarkerInfoBoxContent(trail);
            }
        };
    }
};

/**
 * Infobox Helper
 *
 * Callback methods to get the InfoBox content
 */
mapInfoBox = {
    /**
     * Holds the InfoBox content as it's being built
     * @type {string}
     * @private
     */
    content: '',

    /**
     * Gets the HTML for the InfoBox plugin content
     * @param {Object} poi The POI information.
     * @param {boolean} directions Whether or not to show the directions link
     * @returns {string}
     */
    getPOIInfoBoxContent: function(poi, directions) {
        directions = directions || false;
        this.content = '';
        this._wrapperOpen();

        this._header(poi.title);

        if (poi.poiName.length > 0 || poi.notes.length > 0 || directions == true || (typeof poi.subtitle !== 'undefined' && poi.subtitle.length > 0)) {
            this._contentWrapperOpen();
            if (poi.poiName.length > 0) {
                this._paragraph(poi.poiName);
            }
            if (typeof poi.subtitle !== 'undefined' && poi.subtitle.length > 0) {
                this._paragraph(poi.subtitle);
            }
            if (poi.notes.length > 0) {
                this._paragraph(poi.notes, 'Notes:');
            }
            if (directions == true) {
                this.content += '<p><a href="https://www.google.com/maps/dir/?api=1&destination=' + poi.lat + ',' + poi.lng + '" target="_blank">Get directions to here</a>';
            }
            this._contentWrapperClose();
        }

        this._wrapperClose();

        return this.content;
    },

    /**
     * Gets the content for the segment popup
     * @param {Object} segment The segment information
     * @returns {string}
     */
    getSegmentInfoBoxContent: function(segment) {
        this.content = '';
        this._wrapperOpen();
        this._header(segment.name);

        this._contentWrapperOpen();

        if (typeof segment.distance !== 'undefined') {
            var m = 'mile';
            if (segment.distance != 1) {
                m += 's';
            }
            this._paragraph(segment.distance + ' ' + m, 'Segment Length:');
        }

        this._contentWrapperClose();

        this._wrapperClose();

        return this.content;
    },

    /**
     * Gets the content for the trail marker info box
     * @param {Object} trail The trail information
     * @returns {string}
     */
    getTrailMarkerInfoBoxContent: function(trail, showIcons) {
        this.content = '';
        this._wrapperOpen();
        this._image(trail.img, trail.imgW, trail.imgH, trail.name, trail.url);
        this._header(trail.name, trail.url, showIcons, trail.id);

        this._contentWrapperOpen();

        this._paragraph(trail.abs);

        this._contentWrapperClose();

        this._wrapperClose();

        return this.content;
    },

    /**
     * Gets the content for the trailside service marker info box
     * @param {Object} trail The trail information
     * @returns {string}
     */
    getTrailsideServiceMarkerInfoBoxContent: function(item) {
        this.content = '';
        this._wrapperOpen();
        this._image(item.img, item.imgW, item.imgH, item.name, item.url);
        //this._logo(item.img, item.imgW, item.imgH, item.name, item.url);
        this._header(item.name, item.url);

        this._contentWrapperOpen();

        this._paragraph(item.desc);

        this.content += '<div class="u-textCenter">';
        this._button('View details', item.url, 'View service details');
        this.content += '</div>';

        this._contentWrapperClose();

        this._wrapperClose();

        return this.content;
    },

    /**
     * Gets the button content
     *
     * @param {string} text The button text
     * @param {string} url The button URL
     * @param {string} title The button title
     * @private
     */
    _button: function(text, url, title) {
        this.content += '<div class="MapPopup-button">';
        this.content += '<a target="_blank" title="' + title + '" href="' + url + '">' + text + '</a>';
        this.content += '</div>';
    },

    /**
     * Gets the image HTML
     * @param {string} src The image src
     * @param {int} width The image width
     * @param {int} height The image height
     * @param {string} alt The image alt text
     * @param {string} url The image URL
     * @private
     */
    _image: function(src, width, height, alt, url) {
        if (ap.isString(src)) {
            this.content += '<div class="MapPopup-imageWrap">';
            this.content += '<div class="MapPopup-image">';
            this.content += '<a href="' + url + '" target="_blank">';
            this.content += '<div class="Constrain Constrain--3by2" style="background-image: url(\'' + src + '\');"></div>';
            //this.content += '<img src="' + src + '" width="' + width + '" height="' + height + '" alt="' + alt + '">';
            this.content += '</a>';
            this.content += '</div>';
            this.content += '</div>';
        }
    },

    /**
     * Gets the image HTML
     * @param {string} src The image src
     * @param {int} width The image width
     * @param {int} height The image height
     * @param {string} alt The image alt text
     * @param {string} url The image URL
     * @private
     */
    _logo: function(src, width, height, alt, url) {
        if (ap.isString(src)) {
            this.content += '<div class="MapPopup-imageWrap">';
            this.content += '<a href="' + url + '" target="_blank" class="MapPopup-logo">';
            this.content += '<img src="' + src + '" width="' + width + '" height="' + height + '" alt="' + alt + '" class="MapPopup-logoImg">';
            this.content += '</a>';
            this.content += '</div>';
        }
    },

    /**
     * Adds a paragraph of content
     * @param {string} content Paragraph content
     * @param {string} [heading] Optional heading
     * @private
     */
    _paragraph: function(content, heading) {
        if (ap.isString(content)) {
            if (ap.isString(heading)) {
                this.content += '<p><strong>' + heading + '</strong> ' + content + '</p>';
            } else {
                this.content += '<p>' + content + '</p>';
            }
        }
    },

    /**
     * Gets a small heading
     * @param {string} text
     * @private
     */
    _smallHeading: function(text) {
        if (ap.isString(text)) {
            this.content += '<p><strong>' + text + '</strong></p>';
        }
    },

    /**
     * Gets the opening HTML for the content wrapper
     * @private
     */
    _contentWrapperOpen: function() {
        this.content += '<div class="MapPopup-content">';
    },

    /**
     * Gets the closing HTML for the content wrapper
     * @private
     */
    _contentWrapperClose: function() {
        this.content += '</div>';
    },

    /**
     * Gets the opening HTML for a grid
     * @private
     */
    _gridOpen: function() {
        this.content += '<table class="Statistics">';
    },

    /**
     * Gets the content for a grid row that contains icons
     * @param {string} header The row header
     * @param {string} content The row content
     */
    _gridIconRow: function(header, icons) {
        if (ap.isArray(icons)) {
            var activityIcons = "";
            for (var i=0; i < icons.length; i++) {
                if (ap.isString(icons[i])) {
                    activityIcons += '<img src="/layout/images/icons/' + icons[i] + '" width="30" height="30" alt="' + icons[i] + '" class="MapPopup-icon">';
                }
            }
            if (activityIcons.length > 0) {
                this.content += '<tr>';
                this.content += '<td class="Statistics-cell Statistics-cell--label u-weightBold">' + header + '</td>';
                this.content += '<td class="Statistics-cell">' + activityIcons + '</td>';
                this.content += '</tr>';
            }
        }
    },

    /**
     * Gets the content for a grid row
     * @param {string} header The row header
     * @param {string} content The row content
     */
    _gridRow: function(header, content) {
        if (ap.isString(content)) {
            this.content += '<tr>';
            this.content += '<td class="Statistics-cell Statistics-cell--label u-weightBold">' + header + '</td>';
            this.content += '<td class="Statistics-cell">' + content + '</td>';
            this.content += '</tr>';
        }
    },

    /**
     * Gets the closing HTML for a grid
     * @private
     */
    _gridClose: function() {
        this.content += '</table>';
    },

    /**
     * Gets the content for the InfoBox header
     *
     * @param {string} text The header text
     * @param {string} [url] OPTIONAL URL to make the header text a link
     * @private
     */
    _header: function(text, url, icons, id) {
        icons = icons || false;
        if (ap.isString(text)) {
            this.content += '<div class="MapPopup-header">';
            if (icons) {
                var wishlistStatus = trailListPage.getStatus('wishlist', id),
                    favoriteStatus = trailListPage.getStatus('favorite', id);
                this.content += '<div class="MapPopup-icons">';
                this.content += '<button class="MyTrailButton MyTrailButton--list MyTrailButton--wishlist js-myTrailsWishlist js-myTrailsPopupWishlist" type="button" data-status="' + wishlistStatus + '" data-id="' + id + '" data-list="yes" data-tip="' + accountTrails.getTrailLinkTooltip('wishlist', wishlistStatus) + '">';
                this.content += '<svg class="Icon MyTrailButton-icon MyTrailButton-icon--fill" role="img"><use xlink:href="#icon-bookmark" /></svg>';
                this.content += '<svg class="Icon MyTrailButton-icon MyTrailButton-icon--outline" role="img"><use xlink:href="#icon-bookmark-outline" /></svg>';
                this.content += '</button>';
                this.content += '<button class="MyTrailButton MyTrailButton--list MyTrailButton--favorite js-myTrailsFavorite js-myTrailsPopupFavorite" type="button" data-status="' + favoriteStatus + '" data-id="' + id + '" data-list="yes" data-tip="' + accountTrails.getTrailLinkTooltip('favorite', favoriteStatus) + '">';
                this.content += '<svg class="Icon MyTrailButton-icon MyTrailButton-icon--fill" role="img"><use xlink:href="#icon-heart" /></svg>';
                this.content += '<svg class="Icon MyTrailButton-icon MyTrailButton-icon--outline" role="img"><use xlink:href="#icon-heart-outline" /></svg>';
                this.content += '</button>';
                this.content += '</div>';
            }
            if (ap.isString(url)) {
                this.content += '<a href="' + url + '" target="_blank" class="MapPopup-title">' + text + '</a>';
            } else {
                this.content += '<span class="MapPopup-title">' + text + '</span>';
            }
            this.content += '</div>';
        }
    },

    /**
     * Gets the opening HTML for the InfoBox
     * @private
     */
    _wrapperOpen: function() {
        this.content += '<div class="MapPopup-inner">';
    },

    /**
     * Gets the closing HTML for the InfoBox
     * @private
     */
    _wrapperClose: function() {
        this.content += '</div>';
    }
};

/**
 * Verge
 */
!function(root, name, make) {
    if (typeof module != 'undefined' && module['exports']) module['exports'] = make();
    else root[name] = make();
}(this, 'verge', function() {

    var xports = {}
        , win = typeof window != 'undefined' && window
        , doc = typeof document != 'undefined' && document
        , docElem = doc && doc.documentElement
        , matchMedia = win['matchMedia'] || win['msMatchMedia']
        , mq = matchMedia ? function(q) {
        return !!matchMedia.call(win, q).matches;
    } : function() {
        return false;
    }
        , viewportW = xports['viewportW'] = function() {
        var a = docElem['clientWidth'], b = win['innerWidth'];
        return a < b ? b : a;
    }
        , viewportH = xports['viewportH'] = function() {
        var a = docElem['clientHeight'], b = win['innerHeight'];
        return a < b ? b : a;
    };

    /**
     * Test if a media query is active. Like Modernizr.mq
     * @since 1.6.0
     * @return {boolean}
     */
    xports['mq'] = mq;

    /**
     * Normalized matchMedia
     * @since 1.6.0
     * @return {MediaQueryList|Object}
     */
    xports['matchMedia'] = matchMedia ? function() {
        // matchMedia must be binded to window
        return matchMedia.apply(win, arguments);
    } : function() {
        // Gracefully degrade to plain object
        return {};
    };

    /**
     * @since 1.8.0
     * @return {{width:number, height:number}}
     */
    function viewport() {
        return {'width':viewportW(), 'height':viewportH()};
    }
    xports['viewport'] = viewport;

    /**
     * Cross-browser window.scrollX
     * @since 1.0.0
     * @return {number}
     */
    xports['scrollX'] = function() {
        return win.pageXOffset || docElem.scrollLeft;
    };

    /**
     * Cross-browser window.scrollY
     * @since 1.0.0
     * @return {number}
     */
    xports['scrollY'] = function() {
        return win.pageYOffset || docElem.scrollTop;
    };

    /**
     * @param {{top:number, right:number, bottom:number, left:number}} coords
     * @param {number=} cushion adjustment
     * @return {Object}
     */
    function calibrate(coords, cushion) {
        var o = {};
        cushion = +cushion || 0;
        o['width'] = (o['right'] = coords['right'] + cushion) - (o['left'] = coords['left'] - cushion);
        o['height'] = (o['bottom'] = coords['bottom'] + cushion) - (o['top'] = coords['top'] - cushion);
        return o;
    }

    /**
     * Cross-browser element.getBoundingClientRect plus optional cushion.
     * Coords are relative to the top-left corner of the viewport.
     * @since 1.0.0
     * @param {Element|Object} el element or stack (uses first item)
     * @param {number=} cushion +/- pixel adjustment amount
     * @return {Object|boolean}
     */
    function rectangle(el, cushion) {
        el = el && !el.nodeType ? el[0] : el;
        if (!el || 1 !== el.nodeType) return false;
        return calibrate(el.getBoundingClientRect(), cushion);
    }
    xports['rectangle'] = rectangle;

    /**
     * Get the viewport aspect ratio (or the aspect ratio of an object or element)
     * @since 1.7.0
     * @param {(Element|Object)=} o optional object with width/height props or methods
     * @return {number}
     * @link http://w3.org/TR/css3-mediaqueries/#orientation
     */
    function aspect(o) {
        o = null == o ? viewport() : 1 === o.nodeType ? rectangle(o) : o;
        var h = o['height'], w = o['width'];
        h = typeof h == 'function' ? h.call(o) : h;
        w = typeof w == 'function' ? w.call(o) : w;
        return w/h;
    }
    xports['aspect'] = aspect;

    /**
     * Test if an element is in the same x-axis section as the viewport.
     * @since 1.0.0
     * @param {Element|Object} el
     * @param {number=} cushion
     * @return {boolean}
     */
    xports['inX'] = function(el, cushion) {
        var r = rectangle(el, cushion);
        return !!r && r.right >= 0 && r.left <= viewportW();
    };

    /**
     * Test if an element is in the same y-axis section as the viewport.
     * @since 1.0.0
     * @param {Element|Object} el
     * @param {number=} cushion
     * @return {boolean}
     */
    xports['inY'] = function(el, cushion) {
        var r = rectangle(el, cushion);
        return !!r && r.bottom >= 0 && r.top <= viewportH();
    };

    /**
     * Test if an element is in the viewport.
     * @since 1.0.0
     * @param {Element|Object} el
     * @param {number=} cushion
     * @return {boolean}
     */
    xports['inViewport'] = function(el, cushion) {
        // Equiv to `inX(el, cushion) && inY(el, cushion)` but just manually do both
        // to avoid calling rectangle() twice. It gzips just as small like this.
        var r = rectangle(el, cushion);
        return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW();
    };

    /* Added by Aptuitiv */
    xports['isSmallScreen'] = function() {
        return viewportW() < 600 || viewportH() < 600;
    };

    /* Added by Aptuitiv */
    xports['isTouch'] = function() {
        var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        var mqx = function(query) {
            return window.matchMedia(query).matches;
        }

        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            return true;
        }

        // include the 'heartz' as a way to have a non matching MQ to help terminate the join
        // https://git.io/vznFH
        var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return mqx(query);
    }

    return xports;
});
