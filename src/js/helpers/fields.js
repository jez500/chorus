/**
 * All core XBMC fields, used when retrieving collections
 * can be used to tweak performance but limit functionality
 *
 * @type {{}}
 */

app.fields = {


  /**
   * Get fields for a given type
   * If the second param is true it will provide all available fields for that type via {type}Full property
   *
   * @param type string
   * @param full bool
   * @returns []
   */
  get: function(type, full){
    if(app.fields.data[type] !== undefined){
      var list = app.fields.data[type],
        fullName = type + 'Full';
      // If a full set of fields is requested we add them to the list
      if(full !== undefined && full === true &&
        app.fields.data[fullName] !== undefined &&
        $.inArray(app.fields.data[fullName][0], list) == -1){
          $.each(app.fields.data[fullName], function(i,d){
            list.push(d);
          });
      }
      // return array of field names
      return list;
    }
    return [];
  },

  data: {
    // fields to grab from xbmc
    artist: [
      "instrument",
      "style",
      "mood",
      "born",
      "formed",
      "description",
      "genre",
      "died",
      "disbanded",
      "yearsactive",
      "musicbrainzartistid",
      "fanart",
      "thumbnail"
    ],
    album: [
      "title",
      "description",
      "artist",
      "genre",
      "theme",
      "mood",
      "style",
      "type",
      "albumlabel",
      "rating",
      "year",
      "fanart",
      "thumbnail",
      "playcount",
      "genreid",
      "artistid",
      "displayartist"
    ],
    song: [
      "title",
      "artist",
      "albumartist",
      "genre",
      "year",
      "rating",
      "album",
      "track",
      "duration",
      "playcount",
      "fanart",
      "thumbnail",
      "file",
      "albumid",
      "lastplayed",
      "disc",
      "genreid",
      "artistid",
      "displayartist",
      "albumartistid"
    ],

    movie: [
      "title",
      "genre",
      "year",
      "tagline",
      "originaltitle",
      "lastplayed",
      "playcount",
      "runtime",
      "thumbnail",
      "file",
      "sorttitle",
      "resume",
      "fanart",
      "dateadded"
    ],

    movieFull: [
      "rating",
      "director",
      "trailer",
      "plot",
      "plotoutline",
      "writer",
      "studio",
      "mpaa",
      "cast",
      "country",
      "imdbnumber",
      "set",
      "showlink",
      "streamdetails",
      "top250",
      "votes",
      "setid",
      "tag",
      "art"
    ],

    tvshow: [
      "title",
      "year",
      "genre",
      "playcount",
      "episode",
      "thumbnail",
      "file",
      "season",
      "watchedepisodes"
    ],

    tvshowFull: [
      "lastplayed",
      "rating",
      "plot",
      "studio",
      "mpaa",
      "cast",
      "imdbnumber",
      "premiered",
      "votes",
      "fanart",
      "originaltitle",
      "sorttitle",
      "episodeguide",
      "dateadded",
      "tag",
      "art"
    ],

    tvepisode: [
      "title",
      "playcount",
      "runtime",
      "season",
      "episode",
      "originaltitle",
      "showtitle",
      "lastplayed",
      "thumbnail",
      "file",
      "resume",
      "tvshowid",
      "dateadded",
      "uniqueid",
      "fanart"
    ],

    tvepisodeFull: [
      "art",
      "cast",
      "productioncode",
      "director",
      "plot",
      "votes",
      "rating",
      "writer",
      "firstaired",
      "streamdetails"
    ],

    tvseason: [
      "season",
      "showtitle",
      "playcount",
      "episode",
      "fanart",
      "thumbnail",
      "tvshowid",
      "watchedepisodes",
      "art"
    ],

    file: [
      'title',
      'size',
      'mimetype',
      'file',
      'dateadded',
      'thumbnail',
      'artistid',
      'albumid',
      'uniqueid'
    ],

    playlistItem: [
      "title",
      "artist",
      "albumartist",
      "genre",
      "year",
      "rating",
      "album",
      "track",
      "duration",
      "playcount",
      "director",
      "tagline",
      "plotoutline",
      "originaltitle",
      "lastplayed",
      "mpaa",
      "cast",
      "country",
      "imdbnumber",
      "premiered",
      "runtime",
      "showlink",
      "streamdetails",
      "votes",
      "firstaired",
      "season",
      "episode",
      "showtitle",
      "thumbnail",
      "fanart",
      "file",
      "resume",
      "artistid",
      "albumid",
      "tvshowid",
      "watchedepisodes",
      "disc",
      "tag",
      "art",
      "genreid",
      "displayartist",
      "albumartistid",
      "description",
      "theme",
      "mood",
      "style",
      "albumlabel",
      "sorttitle",
      "uniqueid",
      "dateadded",
      "channel",
      "channeltype",
      "hidden",
      "locked",
      "channelnumber",
      "starttime",
      "endtime"
    ],

    channel: [
      "thumbnail",
      "channeltype",
      "hidden",
      "locked",
      "channel",
      "lastplayed"
    ]
  }


};