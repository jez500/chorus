# Chorus
A nice web ui for xbmc, focused on user experience
Currently only for music, but it might support video and photos in the future.

Used by the [Doghouse Media Team](https://dhmedia.com.au) to control the shared office music box
(an old pc running XBMC with chorus, plugged into an amp and a nas)

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
Chorus uses the following libraries, creds to all authors:

- jQuery
- backbone
- underscore
- bootstrap
- jquery ui
- backstretch
- scrollTo
- total storage
- Font awesome
- for all, see lib/enabled

## Developers


### Compiling
Sass and Grunt are used to compile css and js in the dist folder

### Contributing
If you would like to make this project better I would appreciate any help. Send me your merge requests!
A few things that are "nice to haves"

- Backbone, this is my first project using backbone and I am sure I could be doing some things better (refactor)
- Addons, Make it work with your favourite addon - I attempted google music but failed even using it via the ui
- Mobile/Tablet App, I would love to reuse a lot of the code as an app, but dont know how
- Video Support, It would be cool to both browse your video library but also play videos via the browser
- In Browser audio playback, this was a feature of xbmcwui and I miss it a bit
- Photo library, I wouldn't use it, but you might!

## Screenshots

### Homepage (now playing)
![alt text](https://raw2.github.com/jez500/chorus/master/screenshots/home.jpg "Homepage/Now Playing")

### Artists
![alt text](https://raw2.github.com/jez500/chorus/master/screenshots/artist.jpg "Artists")

### Search
![alt text](https://raw2.github.com/jez500/chorus/master/screenshots/search.jpg "Search")

### Albums
![alt text](https://raw2.github.com/jez500/chorus/master/screenshots/album.jpg "Albums")