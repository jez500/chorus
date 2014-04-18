/**
 * A Generic view used as a wrapper for sub pages
 *
 * Why aren't they using to standard backbone router you say?
 * All of these are really experimental features, rarely used if any were to
 * be developed into a primary feature it would be refactored into its own view,
 * This way more can be reused
 *
 * @type {*|void|Object|extend|extend|extend}
 */
app.XbmcView = Backbone.View.extend({

  tagName:'div',

  className:'xbmc-page',



  initialize:function () {

  },


  render:function () {

    var pages = {
        'jsonrpc': 'An interface to deal directly with the xbmc jsonrpc',
        'storage': 'Local Storage Data Dump',
        'changelog': 'Updates to Chorus'
      };

    switch(this.model){
      // Json rpc test page
      case 'jsonrpc':
        this.$el = new app.XbmcJSONrpcView().render().$el;
        return this; // exit here
      // Local storage dump
      case 'storage':
        this.$el = new app.XbmcLocalDumpView().render().$el;
        return this; // exit here
      // Local storage dump
      case 'changelog':
        this.$el = new app.XbmcChorusChangeLog().render().$el;
        return this; // exit here
    }

    this.$el = $('<ul class="page-list"></ul>');

    for(var p in pages){
      var $el = $('<li>').append('<h3><a href="#xbmc/' + p + '">'+ p +'</a></h3>').append('<p>'+pages[p]+'</p>');
      this.$el.append($el);
    }


    return this;
  }


});




/********************************************************************************
 * Local storage dump
 ********************************************************************************/


app.XbmcLocalDumpView = Backbone.View.extend({

  tagName:'div',

  className:'xbmc-page',



  initialize:function () {

  },


  render:function () {

    var keys = [app.playlists.storageKeyLists, app.playlists.storageKeyThumbsUp];

    var self = this;
    this.$el.empty();

    $(keys).each(function(i, k){

      var $el = $('<pre>');
      $el.prependTo('<h2>' + k + '</h2>');
      app.storageController.getStorage(k, function(data){
        console.log(data);
        var d = {};
        d[k] = data;
        $el.html(JSON.stringify(d, null, 4));
        self.$el.append($el);
      });
    });



    return this;
  }

});


/********************************************************************************
 * Change log
 ********************************************************************************/


app.XbmcChorusChangeLog = Backbone.View.extend({

  tagName:'div',

  className:'xbmc-page changelog',

  render:function () {

    var self = this;
    this.$el.html('Loading ChangeLog');

    // get changelog file content
    $.get('changelog.txt', function(data){
      // render
      self.$el.html(app.nl2br(data));
      // set title
      app.ui.setTitle('<a href="#xbmc/home">XBMC</a>Chorus ChangeLog');
    });

    return this;
  }

});


/********************************************************************************
 * JsonRPC tester
 ********************************************************************************/


app.XbmcJSONrpcView = Backbone.View.extend({

  tagName:'div',

  className:'xbmc-page',


  events: {
    "change #method": "changeMethod",
    "click #doit": "executeQuery"
  },


  initialize:function () {

  },


  render:function () {

    // set title
    app.ui.setTitle('<a href="#xbmc/home">XBMC</a>jsonRPC');

    this.$el.empty();

    var tpl =
      '<h3>JSONrpc tester</h3>' +
        '<p class="alert alert-warning">Use this to test out commands on the api, be careful - you could break something</p>' +
        '<div id="execute">' +
        '<strong>Method:</strong> <select id="method"><option>Loading...</option></select> <span id="method-name"></span>' +
        '<div id="description">Loading</div>' +
        '<span id="params"></span>' +
      '</div><h3>Result</h3><pre id="result"></pre>';

    this.$el.html(tpl);

    this.$select = $('#method', this.$el);
    this.$res = $('#result', this.$el);
    this.$params = $('#params', this.$el);



    this.executeForm();

    return this;
  },

  /**
   * Load up form with data
   */
  executeForm:function(){

    var self = this;

    app.xbmcController.command('JSONRPC.Introspect', [], function(data){

      // cache for later
      app.cached.Introspect = data.result;

      self.$select.empty();


      for(var m in data.result.methods){
        self.$select.append($('<option>', {
          value: m,
          text: m
        }));
      }

      console.log(data);
      self.$res.html(JSON.stringify(data, null, 4));

      self.changeMethod();

      self.$select.chosen({search_contains: true});
    });

  },

  changeMethod: function(){

    var method = this.$select.val(),
     methodObj = app.cached.Introspect.methods[method];

    this.$params.empty();

    $('#description', this.$el).html(methodObj.description);
    $('#method-name', this.$el).html(method);


    for(var p in methodObj.params){
      var param = methodObj.params[p],
        $div = $('<div />'),
        $el = {};

      // load up type with refs
      if(param.$ref){
        param.type = app.cached.Introspect.types[param.$ref];
      }
      param.type = (typeof param.type == 'undefined' ? '' : param.type);

      // set the text
      var text = (typeof param.description == 'undefined' ? '' : param.description + "\n\r") +
        (param.type !== '' ? JSON.stringify(param.type, null, 2) : '');


      // The element used
      // have options, make a select
      if(typeof param.type.enums != 'undefined' && param.type.enums.length > 0){
        $el = $('<select>');
        for(var m in param.type.enums){
          $el.append($('<option>', {
            value: param.type.enums[m],
            text: param.type.enums[m]
          }));
        }
        $el.addClass('select');
      } else {
        // standard input fallback
        $el = $('<input>', {
          type: 'text',
          value: '',
          placeholder: param.default
        });
      }
      $el.addClass('paramEl');

      // build and append
      $div
        .append($('<label>' + param.name + (param.required ? '*' : '') + (this.isEncoded('t', param, $el) ? ' (JSON Encoded)' : '' ) +  '</label> '))
        .append($el)
        .append($('<pre>' + text + '</pre>'))
        .addClass('param ' + (param.required ? 'required' : ''));

      this.$params.append($div);
    }

    // add execute button
    var $ex = $('<div />')
      .addClass('param actions')
      .append('<button class="btn" id="doit">Execute</button>');

    this.$params.append($ex);


    this.$res.html(JSON.stringify(methodObj, null, 4));

  },

  /**
   *
   *  eg
   *  plugin.audio.soundcloud
   *  val = ["path", "name", "thumbnail"] (must use double quotes)
   *
   *  {"item": {"file: "plugin://plugin.audio.soundcloud//soundcloud.com/stantonwarriors/stanton-party-banger-minimix-xmas-2013?url=plugin%3A%2F%2Fmusic%2FSoundCloud%2Ftracks%2F126133023&permalink=126133023&oauth_token=1-1824-1197378-f1263d5f451071290&mode=15" }}
   *
   */
  executeQuery:function(){

    var $params = $('#params .paramEl'),
      method = this.$select.val(),
      methodObj = app.cached.Introspect.methods[method],
      params = [],
      self = this;

    // parse params
    $params.each(function(i,d){
      var val = $(d).val(),
        m = methodObj.params[i];
      console.log(val);
      // parse if req
      if(self.isEncoded( val, m, $(d) )){
        val = $.parseJSON( val );
        console.log(val);
      }

      if(val.length > 0){
        params.push(val);
      }
    });
    console.log(params);
    // do it
    app.xbmcController.command(method, params, function(data){
      console.log(data);
      self.$res.html(JSON.stringify(data, null, 4)).removeClass('error');
      $.scrollTo(self.$res);
    }, function(data){
      self.$res.html(JSON.stringify(data, null, 4)).addClass('error');
      $.scrollTo(self.$res);
    });

  },

  isEncoded:function(text, param, $el){
    console.log(param);
    if(param.type.type == 'integer'){ return false; }
    return (!$el.hasClass('select') && text !== '' && (typeof param.type == 'object' || param.type == 'array'));
  }
});