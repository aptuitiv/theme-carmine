/* global smallScreenNav:readonly, navAccess:readonly */

/* =========================================================================== *\
    Global Javascript for all pages
\* =========================================================================== */

/**
 * Get a cookie value
 * @param {string} cname Cookie name
 * @returns string
 */
function getCookieValue(cname) {
    const b = document.cookie.match(`(^|;)\\s*${cname}\\s*=\\s*([^;]+)`);
    return b ? b.pop() : '';
}

/**
 * Set a cookie
 * @param {string} cname Cookie name
 * @param {string} cvalue Cookie value
 * @param {number} exdays Number of days to set cookie for
 */
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    const existing = getCookieValue(cname);
    let cookievalue = cvalue;
    if (existing.length > 0) {
        cookievalue = `${existing}-${cvalue}`;
    }
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cookievalue}; ${expires};path=/`;
}

/**
 * Set up the notifications bar functionality
 */
function setupNotifications() {
    let id; let
        parent;
    $('.js-notificationClose').on('click', function onClick(e) {
        e.preventDefault();
        parent = $(this).parents('.js-notification:first');
        parent.hide();
        id = this.getAttribute('data-id');
        setCookie('notificationMsgHide', id, 10);
    });
}

document.onreadystatechange = function () {
    if (document.readyState !== 'loading') {
        smallScreenNav.init();
        navAccess.init();
        setupNotifications();

        const link = document.querySelector('.js-btop');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        });
    }
};
