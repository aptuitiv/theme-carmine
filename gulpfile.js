// Configuration and utilities
import * as util from './gulp/utilities.js';
import { config } from './gulp/config.js';

// Load gulp
import gulp from 'gulp';

// Load gulp modules
import copy from './gulp/copy.js';
import { criticalCss, css, stylelint } from './gulp/css.js';
import { deleteFile, deploy, deployFile, download } from './gulp/deploy.js';
import { font } from './gulp/font.js';
import { images } from './gulp/image.js';
import { jslint, scripts } from './gulp/javascript.js';
import { sprite } from './gulp/svg.js';
import { processTheme, processThemeConfig, processLegacyThemeConfig, pullTheme, pushTheme } from './gulp/theme.js';

import notifier from 'node-notifier';

/**
 * Watch for file changes and then process the files
 * @param {function} done
 */
function watch(done) {
    // Copy static assets
    gulp.watch(config.copy.reduce(util.flatten, []), { events: 'all' }, copy);

    // CSS
    gulp.watch(config.paths.watch.css, { events: 'all' }, css);

    // Fonts
    gulp.watch(config.paths.src.font, { events: ['add', 'change'] }, font)
        .on('unlink', function (file) {
            util.deleteFile(file, config.paths.src.font, config.paths.dist.font, 'font');
        });

    // Images
    gulp.watch(config.paths.src.img, { events: ['add', 'change'] }, images)
        .on('unlink', function (file) {
            util.deleteFile(file, config.paths.src.img, config.paths.dist.img, 'image');
        });

    // Scripts
    gulp.watch(config.scripts.reduce(util.flatten, []), { events: 'all' }, scripts);

    // SVG Icons
    gulp.watch(config.paths.src.icon, sprite);

    // Theme
    gulp.watch(config.paths.src.theme, { events: ['add', 'change'] }, processTheme)
        .on('unlink', function (file) {
            util.deleteFile(file, config.paths.src.theme, config.paths.dist.theme, 'template');
        });

    // Theme configuration JSON
    gulp.watch(config.paths.src.themeConfig, { events: ['add', 'change'] }, processThemeConfig)
        .on('unlink', function (file) {
            util.deleteFile(file, config.paths.src.themeConfig, config.paths.dist.themeConfig, 'theme config');
        });

    // Legacy theme.json configuration
    gulp.watch(config.paths.src.base + '/theme.json', processLegacyThemeConfig);

    // FTP upload
    gulp.watch(config.paths.dist.base)
        .on('add', function (path) {
            deployFile(path);
            notifier.notify({
                title: 'Gulp Deploy',
                message: 'File added to FTP server!',
                sound: true
            });
        })
        .on('change', function (path) {
            deployFile(path);
            notifier.notify({
                title: 'Gulp Deploy',
                message: 'File changed on FTP server!',
                sound: true
            });
        })
        .on('unlink', function (path) {
            deleteFile(path);
            notifier.notify({
                title: 'Gulp Deploy',
                message: 'File deleted from FTP server!',
                sound: true
            });
        });

    done();
}

// Set the display properties of the theme pull function
watch.description = 'Watch for file changes and then process the files';


// Build tasks
const build = gulp.series(
    gulp.parallel(
        copy,
        css,
        font,
        images,
        scripts,
        sprite,
        processThemeConfig,
        processTheme
    ),
    pushTheme
);

const defaultTask = gulp.series(build, watch);

// Export gulp methods
export {
    build,
    copy,
    criticalCss,
    css,
    defaultTask as default,
    deploy,
    download,
    font,
    images,
    jslint,
    pullTheme,
    pushTheme,
    processTheme as theme,
    processThemeConfig as themeConfig,
    processLegacyThemeConfig as themeConfigLegacy,
    scripts,
    sprite as svgSprite,
    stylelint,
    watch
}
