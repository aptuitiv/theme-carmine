# Arlo Theme

A basic starting point for an Aptuitiv theme.

## Usage

The goal of this theme is to be copied to another repository for the site you're working on. From there, you can install it on the website, and edit it as needed.

## Installation

### Set Up Repo

You'll want to create a new git repository for the site that this is being installed to. Copy the contents of this repo to that repo. That will allow you to make modifications that only affect that website.

In the command line run `npm i` to install the packages.

Log into the CMS and go to Settings -> Domain / FTP / DNS.

In the project command line run

```bash
npm run init
```

That will initialize the development environment. Follow the prompts to set up the FTP connection.

(If you have the [Aptuitiv website-build-tools](https://github.com/aptuitiv/website-build-tools) installed globally you can do the above things in one step with the `aptuitiv-build init` command.)

### Preparing the CMS

Before deploying, you'll want to log into the CMS for the new site and do the following. These prepare the CMS for deploying the theme files.

1. Configuration
   - Turn on **SSL** by enabling "My site supports SSL", "Entire public site is secure", and "Entire administration is secure" from Settings -> Security.
   - Disable **Cache** under Settings -> Cache.
2. Install the **Theme** configuration by uploading it under Design -> View Themes -> Update and continuing on the next page.
3. Prime templates
   - Prime the **Page Templates** by visiting Design -> Templates.
   - Prime the **Snippets** by visiting Design -> Snippets.
   - Prime the **Navigation Templates** by visiting Design -> Navigation -> Navigation Templates.
   - Prime the **Form Templates** by visiting Forms -> Templates.
4. Pages
   - Edit the "Home" page to use the "One Column" *Page Template* from Content -> Pages.
   - Delete the "Default" *Page Template* from Design -> Templates.
   - Set the "Banner" *Content Layout's* available *Content Areas* to be only the "Banner" *Content Area* under Content -> Content Layouts -> Banner -> Edit this Content Layout.
   - Set up **Template Content Layout Assignments** to map the "Banner" *Content Layout* to the "Banner" *Content Area* for the "One Column" and "Two Column" *Page Templates* under Content -> Page Settings -> Template Content Layout Assignments.

5. Navigation. Go to Design -> Navigation -> Navigation Menus
    - Create a navigation menu called `Footer`.
      - Template: `Footer`
      - Show sub navigation: `Never`.
    - Create a navigation menu called `Header bar`.
      - Template: `Header bar`
      - Show sub navigation: `Never`.
    - Create a navigation menu called `Main`.
      - Template: `Main`
      - Show sub navigation: `Show all sub navigation all the time`
    - Create a navigation menu called `Pop out menu`.
      - Template: `Pop out menu`
      - Show sub navigation: `Show all sub navigation all the time`

6. Prime the **Content Builder Elements** by visiting Design -> Content Builder.
7. Prime the **Collection Widgets** by visiting Widgets -> Collections -> Notifications.
8. Search
   - Prime the **Search Templates** by visiting Site Manager -> Search -> Templates -> Templates.
   - Edit and save the **Search Form** under Site Manager -> Search -> Forms. This will generate the form fields.

### Deploying the Theme

If you ran `npm run init` as described above then the site files are already built. If not, then run `npm run build` to build the files.

Deploy all of the theme files with `npm run deploy`. That will upload the files via FTP to the server.

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

You've now got an instance of the theme installed and configured on your new site. From here you can customize the styles in the *Theme Editor* or make template changes.

## Making Changes

If you want to make changes, all you have to do is run `npm run watch` while making all file changes. They will be deployed automatically.

## FTP

We recommend using the [Aptuitiv website-build-tools](https://github.com/aptuitiv/website-build-tools) and the `init` command for generating the `.env` file automatically.

You can alternatively create a manual `.env` file with the following data instead:

```.env
FTP_ENVIRONMENT = live
FTP_SERVER = ftp1.branchcms.com
FTP_USERNAME = my_ftp_username
FTP_PASSWORD = my_ftp_password
```
