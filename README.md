# theme-carmine
Aptuitiv's premier theme for websites powered by our CMS.

## Installation

### Set Up Repo
You'll want to create a new git repository for the site that Carmine is being installed to. Copy the contents of this repo to that repo. That will allow you to make modifications that only affect that website.

From that folder, you'll need to install the dependencies, run an initial build, and set up FTP. You can set up FTP using [create-ftp-env](https://github.com/aptuitiv/create-ftp-env) or by following the [FTP section below](#ftp). When prompted for credentials, you can find them in the CMS under Settings -> Domain / FTP / DNS.

```bash
npm install
gulp build
create-ftp-env
```

### Preparing the CMS
Before deploying, you'll want to log into the CMS for the new site and do the following. These prepare the CMS for deploying the theme files.

1. Turn on **SSL** by enabling "My site supports SSL", "Entire public site is secure", and "Entire administration is secure" from Settings -> Security.
1. Disable **Cache** under Settings -> Cache.
1. Install the **Theme** configuration by uploading it under Design -> View Themes -> Update and continuing on the next page.
1. Prime the **Page Templates** by visiting Design -> Templates.
1. Edit the "Home" page to use the "One Column" *Page Template* from Content -> Pages.
1. Delete the "Default" *Page Template* from Design -> Templates.
1. Set the "Banner" *Content Layout's* available *Content Areas* to be only the "Banner" *Content Area* under Content -> Content Layouts -> Banner -> Edit this Content Layout.
1. Set up **Template Content Layout Assignments** to map the "Banner" *Content Layout* to the "Banner" *Content Area* for the "One Column" and "Two Column" *Page Templates* under Content -> Page Settings -> Template Content Layout Assignments.
1. Prime the **Snippets** by visiting Design -> Snippets.
1. Prime the **Navigation Templates** by visiting Design -> Navigation -> Navigation Templates.
1. Create a "Main" *Navigation Menu* using the "Main" *Navigation Template* and select "Show sub navigation all the time" from Design -> Navigation -> Navigation Menus.
1. Create a "Footer" *Navigation Menu* using the "Footer" *Navigation Template* from Design -> Navigation -> Navigation Menus.
1. Prime the **Content Builder Elements** by visiting Design -> Content Builder.
1. Prime the **Collection Widgets** by visiting Widgets -> Collections -> Notifications.
1. Prime the **Form Templates** by visiting Forms -> Templates.
1. Prime the **Search Templates** by visiting Site Manager -> Search -> Templates -> Templates.
1. Edit and save the **Search Form** under Site Manager -> Search -> Forms. This will generate the form fields.
1. Set a sensible **Admin Theme** under Settings -> Admin Theme.

### Deploying the Theme
1. Deploy the theme files using the `gulp deploy` command and wait until completed (~30 seconds).
1. Update the **Rich Text Editor** CSS file path from Settings -> Rich Text Editor.

### Configuring the Theme
To finish the installation, you'll need to configure some basic options of the theme.

1. Update the **Company Information** under Settings -> Company Information.
1. Configure **Theme Settings** under Design -> Theme Editor.
    1. Set the default **Banner Image** sizes under Settings -> Banner Images. Set these to 2000x1000, 1000x500, 500x250.
    1. Upload a **Header** logo or set the text logo under Settings -> Header.
    1. Update the **Color Palette** under Palettes -> Color Palette. Add "Primary" (#871E0F), "Secondary" (#591108), and "Typography" (#333).
    1. Update the **Font Palette** under Palettes -> Font Palette. Add "Montserrat" and "Open Sans" with default weights. Disable all of the System fonts under the "System" tab.
    1. Go through all of the **Theme Styles** from the Theme Styles tab and update all color references to use the *Color Palette* if matching one.
    1. Update **Typography** under Styles -> Typography to use "Open Sans" for the base font family and "Montserrat" for the heading font family.

You've now got Carmine installed and configured on your new site. From here you can customize the styles in the *Theme Editor* or make template changes.

## Making Changes
If you want to make changes, all you have to do is run `gulp watch` while making all file changes. They will be deployed automatically.

## FTP
We recommend using [create-ftp-env](https://github.com/aptuitiv/create-ftp-env) for generating the `.env` file automatically.

You can alternatively create a manual `.env` file with the following data instead:
```.env
FTP_ENVIRONMENT = live
FTP_SERVER = ftp1.branchcms.com
FTP_USERNAME = my_ftp_username
FTP_PASSWORD = my_ftp_password
```
