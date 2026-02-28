# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Carmine is an Aptuitiv starter theme for **BranchCMS**. It is designed to be copied into per-site repositories, installed via FTP, and customized. Templates use **Twig**, styles use plain CSS with the **Cacao CSS** utility framework, and JS is bundled into global-object modules.

## Build System

All builds use `@aptuitiv/website-build-tools` (the `aptuitiv-build` CLI). Configuration lives in `.aptuitiv-buildrc.js`.

### Key Commands

| Command | Purpose |
|---|---|
| `npm run build` | Build all theme files (CSS, JS, icons, images, copies) |
| `npm run watch` | Watch for changes and auto-deploy via FTP |
| `npm run css` | Compile CSS only |
| `npm run js` | Compile JavaScript only |
| `npm run icons` | Process SVG icons |
| `npm run stylelint` | Lint CSS |
| `npm run jslint` | Lint JavaScript |
| `npm run deploy` | Upload all built theme files via FTP |
| `npm run init` | Initialize dev environment (sets up FTP `.env`) |

### JavaScript Bundles

Configured in `.aptuitiv-buildrc.js`. Two output bundles:
- **main.js** — micromodal + script-loader, iframe-loader, notifications, navigation, accordion, main
- **lightbox.js** — fslightbox (excluded from ESLint)

### CSS Build Order

`src/css/main.css` imports in this order (order matters for specificity):
1. `base/` — resets, fonts, typography
2. `components/` — BEM component styles
3. `apps/` — CMS app styles (blog, calendar, gallery)
4. **Cacao CSS utilities** — must come last so utility classes can override component styles

## Architecture

### Source Layout (`src/`)

- **css/components/** — Each component is a folder with an `index.css` and feature-specific files (e.g., `banner/banner.css`, `banner/banner-slider.css`)
- **js/** — Global-object modules with `init()` methods. No module bundler; files are concatenated in the order specified in `.aptuitiv-buildrc.js`
- **templates/** — Twig templates for BranchCMS
  - Page layouts: `one-column.twig`, `full-width.twig`, `narrow.twig`, two-column variants, `404.twig`
  - `content-builder/` — ~35 block-type templates used by the CMS content builder
  - `macros/` — Reusable Twig macros (`banner.twig`, `form-macros.twig`, `macros.twig`)
  - `snippets/` — Header, footer, and shared partials
- **config/** — Theme JSON configs consumed by the CMS Theme Editor
- **icons/** — SVG icon source files
- **theme.json** — Master theme definition (content areas, content builder elements, form/search templates)

### Runtime Dependencies

| Library | Used For |
|---|---|
| cacao-css | Utility-first CSS framework |
| Splide | Carousels/sliders (+ video extension) |
| just-validate | Form validation |
| masonry-layout | Masonry grid layouts |
| micromodal | Modal dialogs (bundled into main.js) |
| fslightbox | Lightbox image viewer (separate bundle) |

Splide, just-validate, and masonry are **copied** to `dist/` (not bundled) and loaded on-demand via `script-loader.js`.

### Deployment

Theme files deploy via FTP to BranchCMS. FTP credentials are in `.env` (not committed). The remote path structure mirrors `theme/custom/{css,js,fonts,images,templates,config}`.

## Code Style

- **Indentation:** 4 spaces (`.editorconfig`)
- **Line endings:** LF
- **CSS:** BEM naming (`.Banner`, `.Banner-bg`, `.Banner--noMedia`); 120-char print width; Cacao utility classes in templates
- **JS:** Single quotes, semicolons, arrow parens always (`.prettierrc.cjs`)
- **Responsive breakpoint:** 1024px for mobile/desktop navigation switch
