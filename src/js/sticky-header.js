/* ===========================================================================
    Sticky header behavior

    Adds .is-sticky to the header when it crosses the viewport top, using an
    IntersectionObserver against a JS-injected sentinel. When Header--hideOnScroll
    is also present, the header hides on scroll-down / reveals on scroll-up
    below the 1024px nav breakpoint by animating the sticky element's `top`
    value to a measured negative-offsetHeight (so it slides to just-off-screen
    without leaving a blank gap that `transform: translateY` would).
=========================================================================== */

const stickyHeader = {
    header: null,
    lastScrollY: 0,
    smallScreenBreakpoint: 1024,
    config: {
        lowThreshold: 0.25,
        highThreshold: 0.75,
    },

    init() {
        this.header = document.querySelector('.Header--sticky');
        if (!this.header) return;
        if (!this.featuresSupported()) return;
        this.updateAnchorOffset();
        this.observeSticky();
        window.addEventListener('resize', () => this.updateAnchorOffset());
        if (this.header.classList.contains('Header--hideOnScroll')) {
            this.setupScrollListener();
        }
    },

    /**
     * Set --Header-sticky-anchor-offset to the live header height so that
     * scroll-padding-top on .has-sticky-header always matches the current
     * header — across desktop / mobile breakpoints, sticky-state shrink,
     * and per-element hide-when-sticky collapses.
     */
    updateAnchorOffset() {
        document.documentElement.style.setProperty(
            '--Header-sticky-anchor-offset',
            `${this.header.offsetHeight}px`,
        );
    },

    hide() {
        if (this.header.classList.contains('is-hidden')) return;
        this.header.style.top = `-${this.header.offsetHeight}px`;
        this.header.classList.add('is-hidden');
    },

    show() {
        if (!this.header.classList.contains('is-hidden')) return;
        this.header.style.top = '0px';
        this.header.classList.remove('is-hidden');
    },

    featuresSupported() {
        return (
            'IntersectionObserver' in window &&
            typeof CSS !== 'undefined' &&
            typeof CSS.supports === 'function' &&
            CSS.supports('position', 'sticky')
        );
    },

    observeSticky() {
        const sentinel = document.createElement('div');
        sentinel.style = `position: absolute; z-index: -1; width: 1px; height: ${this.header.clientHeight / 2}px;`;
        this.header.parentNode.insertBefore(sentinel, this.header);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio <= this.config.lowThreshold) {
                        this.header.classList.add('is-sticky');
                        this.resyncScrollY();
                    } else if (
                        entry.intersectionRatio >= this.config.highThreshold
                    ) {
                        this.header.classList.remove('is-sticky');
                        this.resyncScrollY();
                    }
                });
            },
            {
                threshold: [
                    this.config.lowThreshold,
                    this.config.highThreshold,
                ],
            },
        );
        observer.observe(sentinel);
    },

    /**
     * Re-baseline lastScrollY after a layout shift caused by toggling
     * .is-sticky (e.g. per-element hide-when-sticky rules collapsing
     * elements via `display: none`). Without this, the next scroll event
     * can read a smaller scrollY than lastScrollY — scroll anchoring's
     * silent adjustment — and be misread as scroll-up, which flips the
     * header back into view mid-hide and produces a jitter.
     */
    resyncScrollY() {
        requestAnimationFrame(() => {
            this.lastScrollY = window.scrollY;
            this.updateAnchorOffset();
        });
    },

    setupScrollListener() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        window.addEventListener('resize', () => this.handleResize());
    },

    handleScroll() {
        const currentScrollY = window.scrollY;
        if (window.innerWidth >= this.smallScreenBreakpoint) {
            this.show();
            this.lastScrollY = currentScrollY;
            return;
        }
        if (currentScrollY < 50) {
            this.show();
        } else if (currentScrollY > this.lastScrollY) {
            this.hide();
        } else if (currentScrollY < this.lastScrollY) {
            this.show();
        }
        this.lastScrollY = currentScrollY;
    },

    handleResize() {
        if (window.innerWidth >= this.smallScreenBreakpoint) {
            this.show();
        }
    },
};

export default stickyHeader;
