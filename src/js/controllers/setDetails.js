/**
 * A controller to handle all saves back to the xbmc database
 */

app.setDetail = {

  /**
   * Param order is very important
   */
  songParams: [
    'songid', 'title', 'artist', 'albumartist', 'genre', 'year', 'rating', 'album', 'track', 'disc', 'duration', 'comment'
  ],

  artistParams: [
    'artistid', 'artist', 'instrument', 'style', 'mood', 'born', 'formed', 'description', 'genre', 'died', 'disbanded', 'yearsactive'
  ],

  albumParams: [
    'albumid', 'title', 'artist', 'description', 'genre', 'theme', 'mood', 'style', 'type', 'albumlabel', 'rating', 'year'
  ],

  episodeParams: [
    'episodeid', 'title', 'playcount', 'runtime', 'director', 'plot', 'rating', 'votes', 'lastplayed', 'writer', 'firstaired', 'productioncode', 'season', 'episode'
  ],






  save: function(type, model){

  }

};
