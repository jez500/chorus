# Chorus
A nice web ui for xbmc, focused on user experience
Currently only for music, but it might support video and photos in the future

## Author
Jeremy Graham
mail@jez500.com

## Requirements
- XBMC v12 or 13
- A modern web browser, this has been developed and tested in Chrome

## Installing
Install webinerface.chorus.zip via the zip, basically:
XBMC > Programs > get more > (keep pressing .. until you see "install from zip")
http://wiki.xbmc.org/index.php?title=Add-on_manager#How_to_install_from_a_ZIP_file
TODO: Get it in the XBMC repo

## Enabling
- XBMC > Stystem > Settings > Services > Webserver
- tick allow access via http
- select web interface
- select chorus

## Using
Add your music sources and do a full music scan in xbmc.
Then simply go to the address of the computer running xbmc in your browser
(if you are using a port number add that to the url)
eg.
- http://localhost/
- http://localhost:8080/
- http://192.168.0.10/
TIP: Get your IP via XBMC > System > System Info

## Under the hood
Chorus uses the following libraries:

- jQuery 1.9
- backbone
- underscore
- bootstrap
- jquery ui
- backstretch
- scrollTo
- total storage
- Font awesome

## Developers

### Compiling
Sass and Grunt are used to compile css and js in the dist folder

### Contributing
If you would like to make this project better then go for it, contributors are welcome!



