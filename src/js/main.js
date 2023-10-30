/* global smallScreenNav:readonly, navAccess:readonly */

/* =========================================================================== *\
    Global Javascript for all pages
\* =========================================================================== */

/**
 * Get a cookie value
 * @param {string} cname Cookie name
 * @returns string
 */
const getCookieValue = (cname) => {
    const b = document.cookie.match(`(^|;)\\s*${cname}\\s*=\\s*([^;]+)`);
    return b ? b.pop() : '';
};

/**
 * Set a cookie
 * @param {string} cname Cookie name
 * @param {string} cvalue Cookie value
 * @param {number} exdays Number of days to set cookie for
 */
const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    const existing = getCookieValue(cname);
    let cookievalue = cvalue;
    if (existing.length > 0) {
        cookievalue = `${existing}-${cvalue}`;
    }
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cookievalue}; ${expires};path=/`;
};

/**
 * Set up the notifications bar functionality
 */
const setupNotifications = () => {
    const notificationButtons = document.querySelectorAll('.js-notificationClose');
    notificationButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            // Hide notification
            e.currentTarget.closest('.js-notification').classList.add('u-hidden');
            // Set cookie to hide on load
            setCookie('notificationMsgHide', e.currentTarget.dataset.id, 10);
        });
    });
};

// Handle the document load event
const init = () => {
    smallScreenNav.init();
    navAccess.init();
    accordion.init();
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
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
