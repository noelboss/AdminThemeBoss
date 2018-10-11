#!/bin/bash
#set -x

back="$(date +%Y-%m-%d-%H-%M-%S)";

printf "\n\nCreate backup folder:"
if [ ! -d ./bak ]; then
	mkdir -p ./bak;
fi
if [ ! -d ./bak/$back ]; then
	mkdir -p ./bak/$back;
fi

##mv "src bak/src-$d"
printf "\n\nMove custom out of uikit folder:"
cp -R ./uikit/custom ./custom

printf "\n\nBackup old stuff:"
mv ./uikit ./bak/$back/uikit
mv ./AdminThemeUikit ./bak/$back/AdminThemeUikit

printf "\n\nDownload new AdminThemeUikit"
git clone https://github.com/ryancramerdesign/AdminThemeUikit download

printf "\n\nUse ryans uikit"
mv ./download/uikit ./uikit

printf "\n\nMove ryans custom files to AdminThemeUikit"
mv ./uikit/custom ./AdminThemeUikit

printf "\n\nTrash the rest"
rm -rf download

printf "\n\nMove custom theme stuff back into new uikit folder"
mv custom/ uikit/custom

printf "\n\nGo to new directory"
cd uikit

printf "\n\nInstall node modules"
yarn

printf "\n\ndone…"
printf "

ATTENTION:
------------------------------------------------
You need to manually remove or comment the last line from ryans _import.less:

# AdminThemeUikit/pw/_import.less last line:
// @import \"pw-theme-reno.less\";

Then you can run
$ uikit/yarn compile-less

or for development:
$ uikit/yarn watch


Enjoy…

"


