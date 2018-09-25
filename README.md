# Admin Theme Boss
#### A light and clear theme based on Uikit 3

### Features

* Three unique color options
* Beautiful typografy using Roboto Condensed
* Extended breadcrumb with edit links
* Extends AdminThemeUikit, you can continue using all AdminThemeUikit features
* Option to activate theme for all users


## Color Variants:

### ProcessWire Blue
![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/pw.png "Default ProcessWire Blue")

### Vibrant Blue
![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/vibrant.png "Vibrant Blue Color")

### Dark Black
![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/black.png "Dark Black Color")

![alt text](https://raw.githubusercontent.com/noelboss/AdminThemeBoss/master/docs/images/login.png "Dark Black Color Login")


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
4. Click “Install“ on the “AdminThemeBoss“ Module


## Change Log

See [CHANGELOG.md](CHANGELOG.md) file for full change log.

## Modify yourself

This is how you modify the themes less files on your own: Run “yarn watch“ to recompile css on file change:

	# Change into Uikit Folder:
	$ cd AdminThemeBoss/uikit

	# recompile on change
	$ yarn watch

	# or with npm:
	$ npm run watch

Now you can modify the less file(s) under “AdminThemeBoss/uikit/custom/…“.
The primary theme file is “AdminThemeBoss/uikit/custom/pw/custom-theme.less“.


If you wan't to add your own theme, modify “AdminThemeBoss/uikit/themes.json“ and add your new less file ro “AdminThemeBoss/uikit/custom/newtheme.less“.


## License: MIT

See included [LICENSE](LICENSE) file for full license text.

© [noelboss.com](https://www.noelboss.com) | [ProcessWire Modules](https://modules.processwire.com/authors/noelboss/)
