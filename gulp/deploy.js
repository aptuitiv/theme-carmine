/* =========================================================================== *\
    Deploy assets via FTP
\* =========================================================================== */

// Configuration and utilities
import { config } from './config.js';

// Require plugins
import * as basicFtp from 'basic-ftp';
import chalk from 'chalk';
import fancyLog from 'fancy-log'
import 'dotenv/config';

/**
 * Delete the file from the FTP server
 *
 * @param {string} path The path to the file to delete
 */
async function deleteFile(path) {
    // Get the remote path for the file to remove.
    // Remove the dist folder from the path.
    let removePath = path;
    const dist = config.paths.dist.base;
    if (removePath.substring(0, dist.length) === dist) {
        removePath = removePath.slice(dist.length);
    }

    // Get the FTP connection
    const client = new basicFtp.Client();
    client.trackProgress(info => {
        fancyLog(chalk.magenta(`FTP ${info.type}`) + ' ' + chalk.cyan(path) + ' to ' + chalk.cyan(info.name));
    })

    try {
        await client.access({
            host: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_SERVER : process.env.FTP_DEV_SERVER,
            user: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_USERNAME : process.env.FTP_DEV_USERNAME,
            password: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_PASSWORD : process.env.FTP_DEV_PASSWORD,
        });
        await client.remove(removePath);

    } catch (err) {
        fancyLog(chalk.red(err));
    }
    client.close();
}

// Set the display properties of function
deleteFile.description = 'Delete the file via FTP';

/**
 * Deploy all files
 */
async function deploy() {
    // Get the FTP connection
    const client = new basicFtp.Client();
    client.trackProgress(info => {
        fancyLog(chalk.magenta(`FTP ${info.type}`) + ' ' + chalk.cyan(info.name) + ` ${info.bytes} bytes`);
    })

    try {
        await client.access({
            host: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_SERVER : process.env.FTP_DEV_SERVER,
            user: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_USERNAME : process.env.FTP_DEV_USERNAME,
            password: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_PASSWORD : process.env.FTP_DEV_PASSWORD,
        });
        await client.uploadFromDir(config.paths.dist.base);

    } catch (err) {
        fancyLog(chalk.red(err));
    }
    client.close();
}

// Set the display properties of function
deploy.description = 'Deploy all files via FTP';

/**
 * Deploy the file to the server
 * @param {string} path The file path to upload
 */
async function deployFile(path) {
    // Get the path to upload the file to.
    // Remove the dist folder from the path.
    let uploadPath = path;
    const dist = config.paths.dist.base;
    if (uploadPath.substring(0, dist.length) === dist) {
        uploadPath = uploadPath.slice(dist.length);
    }

    // Get the FTP connection
    const client = new basicFtp.Client();
    client.trackProgress(info => {
        fancyLog(chalk.magenta(`FTP ${info.type}`) + ' ' + chalk.cyan(path) + ' to ' + chalk.cyan(info.name) + ` ${info.bytes} bytes`);
    })

    try {
        await client.access({
            host: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_SERVER : process.env.FTP_DEV_SERVER,
            user: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_USERNAME : process.env.FTP_DEV_USERNAME,
            password: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_PASSWORD : process.env.FTP_DEV_PASSWORD,
        });
        await client.ensureDir(uploadPath.substring(0, uploadPath.lastIndexOf("/")));
        await client.uploadFrom(path, uploadPath);

    } catch (err) {
        fancyLog(chalk.red(err));
    }
    client.close();
}

// Set the display properties of the function
deployFile.description = 'Deploy the file via FTP';

/**
 * Download all theme files via FTP to the dist folder
 */
async function download() {
    // Get the FTP connection
    const client = new basicFtp.Client();
    client.trackProgress(info => {
        fancyLog(chalk.magenta(`FTP ${info.type}`) + ' ' + chalk.cyan(info.name) + ` ${info.bytes} bytes`);
    })

    try {
        await client.access({
            host: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_SERVER : process.env.FTP_DEV_SERVER,
            user: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_USERNAME : process.env.FTP_DEV_USERNAME,
            password: process.env.FTP_ENVIRONMENT === 'live' ? process.env.FTP_PASSWORD : process.env.FTP_DEV_PASSWORD,
        });
        await client.downloadToDir('dist/theme', 'theme');

    } catch (err) {
        fancyLog(chalk.red(err));
    }
    client.close();
}

// Set the display properties of the function
download.description = 'Download all files in the theme folder via FTP';

// Export module
export {
    deleteFile,
    deploy,
    deployFile,
    download
}
