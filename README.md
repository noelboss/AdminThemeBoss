# Admin Theme Boss
#### A light and clear theme based on Uikit 3

### Features

* Five unique color options: blue, vibrant, black & pink
* Beautiful redesigned login screen
* Modern typography using Roboto Condensed
* Extended breadcrumb with edit links
* Extends the default AdminThemeUikit so you can continue using all current (and future) AdminThemeUikit features
* Option to activate theme for all users
* Compatibility with AdminOnStreoids and other third party modules


## Release Updates

Checkout the [Releases Page and subscribe to updates](http://releases.noelboss.com/adminthemeboss) or take a look at the [CHANGELOG.md](https://github.com/noelboss/AdminThemeBoss/blob/master/CHANGELOG.md) file for a full change log.


# Color Variants:

### ProcessWire Blue

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/pw-pt.png "Default ProcessWire Blue Page Tree")

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/pw.png "Default ProcessWire Blue")

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/pw-login.png "Default ProcessWire Blue Login")

### Dark Black

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/black-pt.png "Dark Black Page Tree")

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/black.png "Dark Black")

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/black-login.png "Dark Black Login")


### Vibrant Blue

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/vibrant.png "Vibrant Blue")

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/vibrant-login.png "Vibrant Blue Login")


### Happy Pink

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/pink.png "Happy Pink")

### Smooth Green **new with 0.6.1**

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/green.png "Smooth Green")


## Requirements

Requires AdminThemeUikit installed and activated.


## Installation

1. Make sure the above requirements are met
1. Go to “Modules > Site > Add New“
2. Paste the Module Class Name “AdminThemeBoss“ into the field “Add Module From Directory“
3. Click “Download And Install“
4. On the overview, click “Download And Install“ again
5. On the following screen, click “Install Now“

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/installation.png "Installation using URL")


### Manually

1. Make sure the above requirements are met
2. Download the theme files from [GitHub](https://github.com/noelboss/AdminThemeBoss) or the [ProcessWire Modules Repository](https://modules.processwire.com/modules/admin-theme-uikit/).
3. Copy all of the files for this module into /site/modules/AdminThemeBoss/
4. Go to “Modules > Refresh” in your admin
5. Click “Install“ on the “AdminThemeBoss“ Module


## Modify yourself

This is how you modify the themes less files on your own: Run “yarn watch“ to recompile css on file change:

	# Change into uikit folder:
	$ cd AdminThemeBoss/uikit

	# install node_modules:
	$ yarn

	# recompile on change
	$ yarn watch

	# or with npm:
	$ npm run watch

Now you can modify the less file(s) under “AdminThemeBoss/uikit/custom/…“.
The primary theme file is “AdminThemeBoss/uikit/custom/theme/main.less“.


If you wan't to add your own theme, modify “AdminThemeBoss/uikit/themes.json“ and add your new less file ro “AdminThemeBoss/uikit/custom/newtheme.less“.

## Update to latest AdminThemeUikit

There is a [script](https://github.com/noelboss/AdminThemeBoss/blob/master/upgrade-theme.sh) that you can run to update the dependencies. It makes a backup of the current theme, downloads the latest AdminThemeUikit and puts everything back together.

## License: MIT

See included [LICENSE](https://github.com/noelboss/AdminThemeBoss/blob/master/LICENSE) file for full license text.

© [noelboss.com](https://www.noelboss.com) | [ProcessWire Modules](https://modules.processwire.com/authors/noelboss/)
