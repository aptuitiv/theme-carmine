# Plan: Carmine block and accessibility fixes

Created: 2026-09-12

Found while comparing the Skeleton theme with Carmine and Harvest. Carmine is the reference theme for blocks, so these are bugs in Carmine itself.

## Theme-specific fixes

- [x] **`blocks/image-grid.twig`** — missing `{` on the `count4` line (fixed 2026-09-12)
- [x] **`blocks/grid-2-columns.twig` … `grid-6-columns.twig`** — use `macros.blockMargin()`/`macros.blockWidth()` but never `{% import 'macros/macros' as macros %}` (added in commit `265e272`). Add the import at the top of each file, as heading.twig and html-code.twig do.
    - `blocks/columned-content.twig` had the same problem (uses `macros.blockMargin()`/`blockWidth()` without importing `macros`); added the import there too.
- [x] **`404.twig`** — `<main class="py-4" id="main">` (line 10) is nested inside `narrow.twig`'s `<main id="main">`, giving a duplicate landmark and id. Change the inner element to a `<div>`.
- [x] **Skip link CSS** — `.Header-skipToMain` in `src/css/components/header/header.css` uses `z-index: 100`, the same as the sticky header's default, so the focused link can be painted under the header. Use Harvest's approach: `z-index: calc(var(--Header-sticky-z-index, 100) + 1)` (Harvest `src/css/components/header/skip-to-main.css`).
- [x] **Two-column layouts** — `id="main"` is on the `.Content` wrapper, so the skip link lands before the breadcrumb. Consider moving it to the `<main>` element.
    - Moved to `<main>` in both two-column layouts. Every layout now has exactly one `#main`, on its `<main>`.
- [x] **`blocks/image-row.twig:9`** — `href="{image.url}"` uses single braces, so the link is broken. Change to `href="{{ image.url }}"`, and drop `target="_blank"` or add a visually hidden "(opens in a new window)".
    - Kept `target="_blank"`, added `rel="noopener"` and the visually hidden text (same as Skeleton).
- [x] **`blocks/google-ratings-bar.twig`** — each star is its own labelled image, so screen readers repeat "Star rating". The visible text already states the rating, so wrap the stars and number in `aria-hidden="true"` and use `iconAriaHidden` (Skeleton has this fix).
- [x] **Reviews link setting** — there are two "URL to view reviews" fields. Use the Settings one and remove the Styles one (Skeleton has this change):
    - [x] `blocks/google-ratings-bar.twig` — change `_core.theme.settings.googleRatingsBarReviewsLink` to `_core.theme.settings.customerRatingsBarReviewsLink` (3 places)
    - [x] `config/theme-styles.json` — in the "Blocks - Google Ratings Bar" group, remove the first "Review link" subgroup, which only holds `googleRatingsBarReviewsLink`. Keep the second "Review link" subgroup (the link typography).
    - Existing sites that set the link under Styles will need it re-entered under Settings → Customer Reviews & Ratings.
- [x] **`js/sticky-header.js`** — `hide()` moves the header offscreen even when keyboard focus is inside it (WCAG 2.4.11). Skip hiding when `header.contains(document.activeElement)`.
    - Also added a `focusin` listener on the header that calls `show()`, so a hidden header comes back when focus moves into it.
- [x] **`calendar/sidebar.twig`** — `<table class="CalendarMiniGrid u-margBottom4">` uses `u-margBottom4`, which isn't defined in any CSS (legacy class). Remove it (Skeleton has this change).
- [x] **`blog/post.twig:50`** — `target="_blank"` link with no new-window warning.
    - Added `rel="noopener"` and a visually hidden "(opens in a new window)".
- [x] **Main `<nav>`** — `<nav class="NavBar js-navBar" id="navbar">` has no `aria-label`. Add `aria-label="Main"`.
- [x] **`js/navigation/accessibility.js:270`** — `getParent()` stops climbing when `node.parentNode` has the `js-mainNav` class, but `navigation/main.twig` no longer outputs `js-mainNav` on the menu `<ul>`. For top-level items the loop runs up to `<body>` and returns the wrong link, which breaks keyboard navigation between menu levels. Either add `js-mainNav` back to the `<ul>` or change the check to `MainNav`.
    - Added `js-mainNav` back to the menu `<ul>` (kept `MainNav`). Only `accessibility.js` selects `js-mainNav`.

## Accessibility fixes shared by all themes

Carmine isn't a good reference for these — each needs a new fix.

- [x] **Accordion isn't keyboard-operable** — the heading is `<div class="Accordion-heading js-accordionHeading">` with only a click listener. Use a `<button>` with `aria-expanded` and `aria-controls` (`blocks/accordion.twig`, `js/accordion.js`). *High*
    - Also added `width: 100%` on the heading and `visibility: hidden` on closed content (`css/components/accordion/accordion.css`), same as Skeleton.
- [x] **Mobile submenus hidden from screen readers** — submenu `<ul>` elements render with `aria-hidden="true"` and `aria-expanded="false"` (`navigation/main.twig:4`). The small-screen tap handler only toggles classes (`js/navigation/small-screen.js`), so an opened submenu stays hidden. Move `aria-expanded` to the toggle. *High*
- [x] **Mobile menu** — no Escape to close, no focus trap, no focus return (`js/navigation/small-screen.js`). The `role="menubar"`/`menuitem` pattern is the wrong fit for site navigation; consider plain `<nav><ul>` with disclosure buttons.
    - Escape now closes the menu and returns focus to the menu button. The menu button keeps its `aria-label` because it has no visible text.
    - Skipped — same as Skeleton: the focus trap and the rewrite from `menubar`/`menuitem` to a disclosure pattern.
- [x] **Modals** — the close button `<button class="Modal-close" data-micromodal-close></button>` has no accessible name; the dialog has no `aria-labelledby`; the popup uses `disableFocus: true` so focus doesn't move into it; the notification icon has no `aria-hidden` (`widgets/collections/popups.twig`, `notifications.twig`).
    - Also removed `disableFocus` from `MicroModal.init()` in `js/main.js`.
- [x] **Pagination** — wrap in `<nav aria-label="Pagination">`, add `aria-current="page"` to the current page, and change the chevron icons from `role="img"` to `aria-hidden="true"` (`snippets/pagination.twig`).
- [x] **`iconImg` macro** outputs `<svg role="img" alt="…">` — `alt` isn't valid on `<svg>`. Use `aria-label` or a `<title>` (`macros/macros.twig`).
    - Removed `alt`. The macro already labels the SVG with a `<title>` through `aria-labelledby`.
- [x] **`rel="noopenner"` typo** — should be `noopener`.
    - Fixed in both `snippets/header.twig` and `snippets/footer.twig`. Also added `rel="noopener"` to the footer credit link.
- [x] **`title` as the only label** on social and logo links; social links open in a new window with no warning.
    - Added a visually hidden "(opens in a new window)" to the header and footer social links and the footer credit link. The `title` attributes stay: social links already get their name from the `iconImg` `<title>`, and logo links from the logo's alt text or visible text (same as Skeleton).
- [x] **Form errors** — `formErrorContainer` has no `role="alert"`/`aria-live`; `form.js` never sets `aria-invalid` or `aria-describedby` (`macros/form-macros.twig`, `js/form.js`).
- [x] **Required marker** — add `aria-hidden="true"` to the `*` in labels (the `required` attribute already conveys it).
- [x] **Upload previews** use `alt="Image"` (`macros/form-macros.twig`).
- [x] **No `prefers-reduced-motion` CSS** — accordion transitions, Splide fade/autoplay, and `Modal-slide` ignore it; the image-gallery slider can autoplay with no pause control.
    - Added the `prefers-reduced-motion` block to `css/base/base.css`.
    - Skipped — same as Skeleton: the slider pause/play control.
- [ ] **Video/audio** — no `<track>` captions or transcript option (`blocks/video.twig`, `blocks/audio.twig`).
    - Skipped — same as Skeleton.
- [x] **Landmark labels** — footer navs and sidebar `<aside>` elements have no `aria-label`.
    - The footer nav `<ul>` is wrapped in `<nav aria-label="Footer">` in `navigation/footer.twig`. The sidebar `<aside>` elements are labelled "Section navigation" and "Sidebar".
- [ ] **`lang="en"` is hardcoded** in `snippets/header.twig`.
    - Skipped — same as Skeleton.

## Verification

- [ ] `npm run build` completes and `npm run stylelint` shows no new warnings
    - `npm run stylelint` passes. `npm run build` wasn't run.
- [ ] Keyboard check: Tab from page load shows the skip link above the sticky header; focus inside the sticky header keeps it visible; accordion headings open with Enter/Space

## Follow-up fixes (2026-09-13)

- [x] **`blocks/columned-content.twig` width override** — removed the `width:` values from `count2`–`count6` and every `{% set width = countN.width %}` line. They overwrote the block's Width field, so the Width setting never took effect (same fix as image-grid, Carmine commit `1745710`).
