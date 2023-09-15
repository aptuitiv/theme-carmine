// The source directory to build from
var src = 'src';
// The base directory to build into. A temporary location for things that need to be built first before moving to distribution
var build = '_build';
// The full destination folder where assets (images, css, js) will be built into for distribution
var dist = 'dist';
var distTheme = `${dist}/theme/custom`;

/**
 * Data that is set to the config variable in gulpfile.js
 */
const config = {
    /**
     * Holds the base URL for the site to use within the gulp scripts.
     * It should include the closing "/"
     * http://www.mysite.com/
     */
    url: 'http://carmine-theme.branchcms.com',

    /**
     * Paths for different asset sources and their distribution path
     */
    paths: {
        src: {
            base: src,
            css: [
                src + '/css/main.css',
            ],
            font: src + '/fonts/**/*.{eot,ttf,woff,woff2}',
            icon: src + '/icons/**/*.svg',
            img: src + '/images/**/*.{gif,jpg,jpeg,png,svg,webp}',
            js: src + '/js',
            jslint: src + '/js/**/*.js',
            stylelint: [src + '/css/**/*.css'],
            theme: src + '/theme/**/*.twig',
            themeConfig: src + '/config/**/*.json',
            themeFolder: src + '/theme'
        },
        build: {
            base: build,
            css: build + '/css'
        },
        criticalCss: {
            src: distTheme + '/css/main.css'
        },
        dist: {
            base: dist,
            baseTheme: distTheme,
            css: distTheme + '/css',
            font: distTheme + '/fonts',
            img: distTheme + '/images',
            js: distTheme + '/js',
            theme: distTheme + '/templates',
            themeConfig: distTheme + '/config',
            themeFiles: distTheme + '/templates/**/*.twig'
        },
        theme: '/theme/custom',
        watch: {
            css: [src + '/css/**/*.css']
        }
    },

    /**
     * Files to copy from another folder, typically node_modules.
     * src is the files to get
     * dest is the folder within the root 'distTheme' folder to put
     */
    copy: [
        {
            src: 'node_modules/@splidejs/splide/dist/**/*',
            dest: 'splide'
        },
        {
            src: 'node_modules/just-validate/dist/just-validate.production.min.js',
            dest: 'just-validate'
        },
        {
            src: ['node_modules/masonry-layout/dist/*.{pkgd.min.js, min.js}'],
            dest: 'masonry'
        },
        {
            src: 'node_modules/fslightbox/index.js',
            dest: 'fslightbox'
        }
    ],

    /**
     * Templates to generate critical CSS for.
     * 'template' is the name(path) of the template to generate for
     * 'url' is a sample URL of a page using that template to generate the critical CSS from
     */
    criticalCss: [
        {'template': 'default', 'url': ''},
    ],

    /**
     * Path to export the theme files to and from.
     * This creates a folder that can simply be copied to start a new website from this theme
     */
    export: {
        dest: '_export',
        src: [
            {
                src: src + '/**/*',
                dest: 'src'
            },
            {
                src: '.editorconfig',
                dest: ''
            },
            {
                src: '.eslintignore',
                dest: ''
            },
            {
                src: '.eslintrc.js',
                dest: ''
            },
            {
                src: '.gitignore',
                dest: ''
            },
            {
                src: '.prettierignore',
                dest: ''
            },
            {
                src: '.prettierrc.js',
                dest: ''
            },
            {
                src: '.stylelintrc',
                dest: ''
            },
            {
                src: 'gulp/**/*',
                dest: 'gulp'
            },
            {
                src: 'gulpfile.js',
                dest: ''
            },
            {
                src: 'package.json',
                dest: ''
            }
        ]
    },

    /**
     * Scripts to build
     * name: The name of the file to build
     * src: The sources for the file
     */
    scripts: [
        {
            name: 'main.js',
            src: [
                src + '/js/script-loader.js',
                src + '/js/iframe-loader.js',
                src + '/js/navigation.js',
                src + '/js/main.js'
            ]
        },
        {
            name: 'forms.js',
            src: [
                src + '/js/forms.js'
            ]
        }
    ]
};
export { config };