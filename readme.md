# Chorus
A nice modern web UI for Kodi. Browse your music, movies or TV shows from the comfort of your
own web browser. You can play media via Kodi or stream it in your browser. Works best with Chrome
but plays well with most modern browsers.

Used by the [Doghouse Media Team](http://dhmedia.com.au) to control the shared office music box
(an old pc running Kodi with chorus, plugged into an amp and a nas)

[View the changelog](https://github.com/jez500/chorus/blob/master/dist/changelog.txt)

## Author
Jeremy Graham
[email address](mail@jez500.com)

## Quick links
- [Chorus Github] (https://github.com/jez500/chorus)
- [Chorus @ Kodi forum's thread] (http://forum.kodi.tv/showthread.php?tid=183451)
- [Chorus addon @ Kodi website] (http://addons.kodi.tv/show/webinterface.chorus/)

## Chorus on the web
- [Chorus is a powerful web based remote control for Kodi](http://lifehacker.com/chorus-is-a-powerful-web-based-remote-control-for-xbmc-1577148641)
- [Kodi users: Turn your browser into a remote control with Chorus] (http://www.makeuseof.com/tag/xbmc-users-turn-browser-remote-control-chorus/)

## Requirements
- Kodi v14 or newer
- A modern web browser, it has been developed and tested in Chrome

## Installing / Updating
You can download Chorus via the official Kodi repo
- Kodi > Settings > Services > Web Server > Web Interface > get more
- Or use the zip in this repo

## Enabling
- NAvigate to System > Settings > Services > Webserver
- Tick allow access via http
- Click select web interface
- Select Chorus
- Enable "Allow programs on other systems to control Kodi" (under "Remote control") to get the best performance

## Using
Add your music/movies sources and do a full music/video scan in Kodi.
Then simply go to the address of the computer running Kodi in your browser

There are a few ways to access web interfaces in Kodi
- http://localhost/
- http://localhost:8080/
- http://kodi.ip/
- http://kodi-ip/:port/addons/webinterface.chorus/
TIP: Get your IP via Kodi > System > System information
     
## Performance
If you have a large library (20000+ songs), some things get a bit sluggish, especially
if either client or server are low power (e.g. not a pc).

## Target device
Chorus resizes nicely to fit on almost any screen. This is still a work in progress and some functionality is not
yet responsive.


## Stream music from Kodi's library into your browser ##
As of version 0.2.0 you can use chorus to control Kodi or use it to stream the music direct to your browser!
This is still quite experimental and there are a few minor hiccups to consider:
- [It doesn't want to work with Firefox](https://github.com/jez500/chorus/issues/5), possible an issue with HTML5 audio and mp3s. When using Chrome and even Internet Explorer 10 it works great.
- Seeking works intermittently, I think it might be to do with how much of the song is cached, I have also heard that Gotham might fix this but have not yet tried.
- It didn't work on my Android Media Player, this could also be caused by the Kodi version/build
- I Haven't tested it over the internet yet, but works great over a LAN
Otherwise it works really well!

### How to use this browser streaming ###
In the top right there are some tabs, two of them are named Kodi and Local, this is how you toggle what player the UI
is controlling.  In Local mode the colour scheme becomes lighter with a hint of blue, In Kodi mode the colors are
the default darker scheme with a touch of orange.  When you are in a given mode, actions affect that player, so if you
click play on a track when in Local mode, it will play through the browser, likewise, when in Kodi mode all commands are
sent to Kodi.  You can also add media to other playlists by clicking the menu buttons (three dots vertical) on most media items.


## Video streaming
Video streaming via HTML5 "sort of" works, it really depends on the codec used. An embedded VLC player is also available with better codec support.
This looks like the best we can get until Kodi supports transcoding. Look for the "stream" tab on a movie.


## Supported Kodi addons
With search integration
- [SoundCloud add-on](http://addons.kodi.tv/show/plugin.audio.soundcloud/)
- [Radio add-on](http://addons.kodi.tv/show/plugin.audio.radio_de/) - [fix for labels](https://github.com/jez500/plugin.audio.radio_de)
Tested and works
- [SHOUTcast 2](http://addons.kodi.tv/show/plugin.audio.shoutcast/) - [fix for labels](https://github.com/jez500/plugin.audio.shoutcast)


## Issues, bugs and suggestions
Open an issue [Click to open issue](https://github.com/jez500/chorus/issues/new) - Mention what version Chorus/Kodi you are using.

## Under the hood
Chorus uses the following open source libraries, credits to all authors:

- jQuery
- backbone
- underscore
- bootstrap
- jquery ui
- backstretch
- scrollTo
- total storage
- Font awesome
- Sound Manager 2
- for all, see lib/enabled

## Developers


### Compiling
Sass and Grunt are used to compile css and js in the dist folder.
To get your environment setup first install [Bundler](http://bundler.io) and [npm](https://www.npmjs.org/).
- Install required gems with `bundle install --path vendor/bundle`
- Install NodeJs packages with `npm install`
- Run grunt `npm test`

### Contributing
If you would like to make this project better I would appreciate any help. Send me your merge requests!
A few things that are "nice to haves"

- Backbone, this is my first project using backbone and I am sure I could be doing some things better (refactor)
- Addons, Make it work with your favourite addon - I attempted Google music but failed even using it via the UI
- Mobile/Tablet App, I would love to reuse a lot of the code as an app, but don't know how
- Browser streaming audio playback... [maybe you want it to work in Firefox](https://github.com/jez500/chorus/issues/5)?
- Photo library, I wouldn't use it, but you might!

## Donate
Are you a fan of Chorus? You can [buy me a beer](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=ZCGV976794JHE&lc=AU&item_name=Chorus%20Beer%20Fund&currency_code=AUD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted) to say thanks :)

## Screenshots

### Homepage (now playing)
![alt text](https://raw.githubusercontent.com/jez500/chorus/master/screenshots/home.jpg "Homepage/Now Playing")

### Search
![alt text](https://raw.githubusercontent.com/jez500/chorus/master/screenshots/search.jpg "Search")

### Artists
![alt text](https://raw.githubusercontent.com/jez500/chorus/master/screenshots/artist.jpg "Artists")

![alt text](https://raw.githubusercontent.com/jez500/chorus/master/screenshots/artist1.jpg "Artists Landing")

### Albums
![alt text](https://raw.githubusercontent.com/jez500/chorus/master/screenshots/album.jpg "Albums")

![alt text](https://raw.githubusercontent.com/jez500/chorus/master/screenshots/album1.jpg "Albums landing")

### Movies
![alt text](https://raw.githubusercontent.com/jez500/chorus/master/screenshots/movies.jpg "Movies")

![alt text](https://raw.githubusercontent.com/jez500/chorus/master/screenshots/movie.jpg "Movie")
