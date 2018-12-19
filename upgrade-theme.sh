#!/bin/bash
#set -x
folder=backup
back="$(date +%Y-%m-%d-%H-%M-%S)";

printf "\n\nCreate backup folder:"
if [ ! -d ./$folder ]; then
	mkdir -p ./$folder;
fi
if [ ! -d ./$folder/$back ]; then
	mkdir -p ./$folder/$back;
fi

##mv "src $folder/src-$d"
printf "\n\nMove custom out of uikit folder:"
cp -R ./uikit/custom ./custom

printf "\n\nBackup old stuff:"
mv ./uikit ./$folder/$back/uikit
mv ./AdminThemeUikit ./$folder/$back/AdminThemeUikit

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
rm ./AdminThemeUikit/pw/pw-theme-reno.less
touch ./AdminThemeUikit/pw/pw-theme-reno.less

printf "\n\nGo to new directory"
cd uikit

printf "\n\nInstall node modules"
yarn

printf "\n\nRecompiling"
yarn compile

printf "\n\ndone…"
printf "

You can now run
$ uikit/yarn compile-less

or for development:
$ uikit/yarn watch


Enjoy…

"


