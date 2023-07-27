# Carmine Theme

## FTP

We use the [Basic FTP](https://www.npmjs.com/package/basic-ftp) library to upload and dowload files.

You will need to create a `.env` file with the FTP credentials.

Use this format:

```.env
# FTP Environment - deploying to live or a dev environment
# Values should be "live" for the production environment or "dev" for
# sites that are run in the Aptuitiv Developer Development environment for testing.
FTP_ENVIRONMENT = live

# Live server FTP information
FTP_SERVER = ftp1.branchcms.com
FTP_USERNAME = my_ftp_username
FTP_PASSWORD = my_ftp_password

# Development server FTP information
FTP_DEV_SERVER = TBD
FTP_DEV_USERNAME = TBD
FTP_DEV_PASSWORD = TBD
```

The `FTP_ENVIRONMENT` should be set to `live` for uploading to production sites. Set the following variables:

-   `FTP_SERVER`: The FTP server
-   `FTP_USERNAME`: The FTP username
-   `FTP_PASSWORD`: The FTP password

If you are using a clone of the website in the Aptuitiv Development environment for testing then set `FTP_ENVIRONMENT` to "dev" and set the `FTP_DEV_SERVER`, `FTP_DEV_USERNAME`, and `FTP_DEV_PASSWORD`.

## Updating Derivitive Sites

The following websites are based on Carmine and should be updated when new versions of Carmine are released:

- [The Breathable Home](https://github.com/aptuitiv/client-the-breathable-home)
- [Munson Road Storage](https://github.com/aptuitiv/client-munson-road-storage)

### Updating the Repo

First, you'll need to add the remote for the other site locally if you haven't already.

```bash
git remote add other-site git@github.com:aptuitiv/other-site.git
git fetch other-site
git switch -c other-main other-site/main
```

Then, merge the updates into the other site's main branch.

```bash
git merge master
git push -u other-site main
```

### Updating the Site

Now that the repo is up to date, you'll need to update the files on the FTP server. It is recommended that you keep a separate clone of the other site's repo on your computer for uploading.

```bash
cd /the/location/of/the/other/site
git pull
gulp build
gulp deploy
```