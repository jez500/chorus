# Chorus
A nice web ui for xbmc, focused on user experience
Currently only for music, but it might support video and photos in the future.

Used by the [Doghouse Media Team](https://dhmedia.com.au) to control the shared
office music box (an old pc running XBMC with chorus, plugged into an amp)

## Author
Jeremy Graham
mail@jez500.com

## Requirements
- XBMC v12 or 13
- A modern web browser, this has been developed and tested in Chrome

## Installing
Install webinerface.chorus.zip via the zip, basically:
XBMC > Settings > AddOns > Install from zip
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

## Performance
If you have a large library (20000+ songs), some things get a bit sluggish, especially
if either client or server are low power (eg. not a pc).

## Target Device
This is really tailored for a fairly large screen, it downsizes nicely to about 1200px wide.
Mobile it is useless at the moment, but a possibility for the future.

## Supported xbmc addons
- Soundcloud

## Under the hood
Chorus uses the following libraries:

- jQuery
- backbone
- underscore
- bootstrap
- jquery ui
- backstretch
- scrollTo
- total storage
- Font awesome
- lots more, see lib/enabled

## Developers


### Compiling
Sass and Grunt are used to compile css and js in the dist folder

### Contributing
If you would like to make this project better I would appreciate any help. Send me your merge requests!
A few things that are "nice to haves"
