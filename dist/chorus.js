/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
  var
  // The deferred used on DOM ready
    readyList,

  // A central reference to the root jQuery(document)
    rootjQuery,

  // Support: IE<10
  // For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
    core_strundefined = typeof undefined,

  // Use the correct document accordingly with window argument (sandbox)
    location = window.location,
    document = window.document,
    docElem = document.documentElement,

  // Map over jQuery in case of overwrite
    _jQuery = window.jQuery,

  // Map over the $ in case of overwrite
    _$ = window.$,

  // [[Class]] -> type pairs
    class2type = {},

  // List of deleted data cache ids, so we can reuse them
    core_deletedIds = [],

    core_version = "1.10.2",

  // Save a reference to some core methods
    core_concat = core_deletedIds.concat,
    core_push = core_deletedIds.push,
    core_slice = core_deletedIds.slice,
    core_indexOf = core_deletedIds.indexOf,
    core_toString = class2type.toString,
    core_hasOwn = class2type.hasOwnProperty,
    core_trim = core_version.trim,

  // Define a local copy of jQuery
    jQuery = function( selector, context ) {
      // The jQuery object is actually just the init constructor 'enhanced'
      return new jQuery.fn.init( selector, context, rootjQuery );
    },

  // Used for matching numbers
    core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

  // Used for splitting on whitespace
    core_rnotwhite = /\S+/g,

  // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

  // A simple way to check for HTML strings
  // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
  // Strict HTML recognition (#11290: must start with <)
    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

  // Match a standalone tag
    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

  // JSON RegExp
    rvalidchars = /^[\],:{}\s]*$/,
    rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
    rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
    rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

  // Matches dashed string for camelizing
    rmsPrefix = /^-ms-/,
    rdashAlpha = /-([\da-z])/gi,

  // Used by jQuery.camelCase as callback to replace()
    fcamelCase = function( all, letter ) {
      return letter.toUpperCase();
    },

  // The ready event handler
    completed = function( event ) {

      // readyState === "complete" is good enough for us to call the dom ready in oldIE
      if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
        detach();
        jQuery.ready();
      }
    },
  // Clean-up method for dom ready events
    detach = function() {
      if ( document.addEventListener ) {
        document.removeEventListener( "DOMContentLoaded", completed, false );
        window.removeEventListener( "load", completed, false );

      } else {
        document.detachEvent( "onreadystatechange", completed );
        window.detachEvent( "onload", completed );
      }
    };

  jQuery.fn = jQuery.prototype = {
    // The current version of jQuery being used
    jquery: core_version,

    constructor: jQuery,
    init: function( selector, context, rootjQuery ) {
      var match, elem;

      // HANDLE: $(""), $(null), $(undefined), $(false)
      if ( !selector ) {
        return this;
      }

      // Handle HTML strings
      if ( typeof selector === "string" ) {
        if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
          // Assume that strings that start and end with <> are HTML and skip the regex check
          match = [ null, selector, null ];

        } else {
          match = rquickExpr.exec( selector );
        }

        // Match html or make sure no context is specified for #id
        if ( match && (match[1] || !context) ) {

          // HANDLE: $(html) -> $(array)
          if ( match[1] ) {
            context = context instanceof jQuery ? context[0] : context;

            // scripts is true for back-compat
            jQuery.merge( this, jQuery.parseHTML(
              match[1],
              context && context.nodeType ? context.ownerDocument || context : document,
              true
            ) );

            // HANDLE: $(html, props)
            if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
              for ( match in context ) {
                // Properties of context are called as methods if possible
                if ( jQuery.isFunction( this[ match ] ) ) {
                  this[ match ]( context[ match ] );

                  // ...and otherwise set as attributes
                } else {
                  this.attr( match, context[ match ] );
                }
              }
            }

            return this;

            // HANDLE: $(#id)
          } else {
            elem = document.getElementById( match[2] );

            // Check parentNode to catch when Blackberry 4.6 returns
            // nodes that are no longer in the document #6963
            if ( elem && elem.parentNode ) {
              // Handle the case where IE and Opera return items
              // by name instead of ID
              if ( elem.id !== match[2] ) {
                return rootjQuery.find( selector );
              }

              // Otherwise, we inject the element directly into the jQuery object
              this.length = 1;
              this[0] = elem;
            }

            this.context = document;
            this.selector = selector;
            return this;
          }

          // HANDLE: $(expr, $(...))
        } else if ( !context || context.jquery ) {
          return ( context || rootjQuery ).find( selector );

          // HANDLE: $(expr, context)
          // (which is just equivalent to: $(context).find(expr)
        } else {
          return this.constructor( context ).find( selector );
        }

        // HANDLE: $(DOMElement)
      } else if ( selector.nodeType ) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;

        // HANDLE: $(function)
        // Shortcut for document ready
      } else if ( jQuery.isFunction( selector ) ) {
        return rootjQuery.ready( selector );
      }

      if ( selector.selector !== undefined ) {
        this.selector = selector.selector;
        this.context = selector.context;
      }

      return jQuery.makeArray( selector, this );
    },

    // Start with an empty selector
    selector: "",

    // The default length of a jQuery object is 0
    length: 0,

    toArray: function() {
      return core_slice.call( this );
    },

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function( num ) {
      return num == null ?

        // Return a 'clean' array
        this.toArray() :

        // Return just the object
        ( num < 0 ? this[ this.length + num ] : this[ num ] );
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function( elems ) {

      // Build a new jQuery matched element set
      var ret = jQuery.merge( this.constructor(), elems );

      // Add the old object onto the stack (as a reference)
      ret.prevObject = this;
      ret.context = this.context;

      // Return the newly-formed element set
      return ret;
    },

    // Execute a callback for every element in the matched set.
    // (You can seed the arguments with an array of args, but this is
    // only used internally.)
    each: function( callback, args ) {
      return jQuery.each( this, callback, args );
    },

    ready: function( fn ) {
      // Add the callback
      jQuery.ready.promise().done( fn );

      return this;
    },

    slice: function() {
      return this.pushStack( core_slice.apply( this, arguments ) );
    },

    first: function() {
      return this.eq( 0 );
    },

    last: function() {
      return this.eq( -1 );
    },

    eq: function( i ) {
      var len = this.length,
        j = +i + ( i < 0 ? len : 0 );
      return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
    },

    map: function( callback ) {
      return this.pushStack( jQuery.map(this, function( elem, i ) {
        return callback.call( elem, i, elem );
      }));
    },

    end: function() {
      return this.prevObject || this.constructor(null);
    },

    // For internal use only.
    // Behaves like an Array's method, not like a jQuery method.
    push: core_push,
    sort: [].sort,
    splice: [].splice
  };

// Give the init function the jQuery prototype for later instantiation
  jQuery.fn.init.prototype = jQuery.fn;

  jQuery.extend = jQuery.fn.extend = function() {
    var src, copyIsArray, copy, name, options, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
      deep = target;
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
      target = {};
    }

    // extend jQuery itself if only one argument is passed
    if ( length === i ) {
      target = this;
      --i;
    }

    for ( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) != null ) {
        // Extend the base object
        for ( name in options ) {
          src = target[ name ];
          copy = options[ name ];

          // Prevent never-ending loop
          if ( target === copy ) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
            if ( copyIsArray ) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];

            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[ name ] = jQuery.extend( deep, clone, copy );

            // Don't bring in undefined values
          } else if ( copy !== undefined ) {
            target[ name ] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  };

  jQuery.extend({
    // Unique for each copy of jQuery on the page
    // Non-digits removed to match rinlinejQuery
    expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

    noConflict: function( deep ) {
      if ( window.$ === jQuery ) {
        window.$ = _$;
      }

      if ( deep && window.jQuery === jQuery ) {
        window.jQuery = _jQuery;
      }

      return jQuery;
    },

    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,

    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,

    // Hold (or release) the ready event
    holdReady: function( hold ) {
      if ( hold ) {
        jQuery.readyWait++;
      } else {
        jQuery.ready( true );
      }
    },

    // Handle when the DOM is ready
    ready: function( wait ) {

      // Abort if there are pending holds or we're already ready
      if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
        return;
      }

      // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
      if ( !document.body ) {
        return setTimeout( jQuery.ready );
      }

      // Remember that the DOM is ready
      jQuery.isReady = true;

      // If a normal DOM Ready event fired, decrement, and wait if need be
      if ( wait !== true && --jQuery.readyWait > 0 ) {
        return;
      }

      // If there are functions bound, to execute
      readyList.resolveWith( document, [ jQuery ] );

      // Trigger any bound ready events
      if ( jQuery.fn.trigger ) {
        jQuery( document ).trigger("ready").off("ready");
      }
    },

    // See test/unit/core.js for details concerning isFunction.
    // Since version 1.3, DOM methods and functions like alert
    // aren't supported. They return false on IE (#2968).
    isFunction: function( obj ) {
      return jQuery.type(obj) === "function";
    },

    isArray: Array.isArray || function( obj ) {
      return jQuery.type(obj) === "array";
    },

    isWindow: function( obj ) {
      /* jshint eqeqeq: false */
      return obj != null && obj == obj.window;
    },

    isNumeric: function( obj ) {
      return !isNaN( parseFloat(obj) ) && isFinite( obj );
    },

    type: function( obj ) {
      if ( obj == null ) {
        return String( obj );
      }
      return typeof obj === "object" || typeof obj === "function" ?
        class2type[ core_toString.call(obj) ] || "object" :
        typeof obj;
    },

    isPlainObject: function( obj ) {
      var key;

      // Must be an Object.
      // Because of IE, we also have to check the presence of the constructor property.
      // Make sure that DOM nodes and window objects don't pass through, as well
      if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
        return false;
      }

      try {
        // Not own constructor property must be Object
        if ( obj.constructor &&
          !core_hasOwn.call(obj, "constructor") &&
          !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
          return false;
        }
      } catch ( e ) {
        // IE8,9 Will throw exceptions on certain host objects #9897
        return false;
      }

      // Support: IE<9
      // Handle iteration over inherited properties before own properties.
      if ( jQuery.support.ownLast ) {
        for ( key in obj ) {
          return core_hasOwn.call( obj, key );
        }
      }

      // Own properties are enumerated firstly, so to speed up,
      // if last one is own, then all properties are own.
      for ( key in obj ) {}

      return key === undefined || core_hasOwn.call( obj, key );
    },

    isEmptyObject: function( obj ) {
      var name;
      for ( name in obj ) {
        return false;
      }
      return true;
    },

    error: function( msg ) {
      throw new Error( msg );
    },

    // data: string of html
    // context (optional): If specified, the fragment will be created in this context, defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    parseHTML: function( data, context, keepScripts ) {
      if ( !data || typeof data !== "string" ) {
        return null;
      }
      if ( typeof context === "boolean" ) {
        keepScripts = context;
        context = false;
      }
      context = context || document;

      var parsed = rsingleTag.exec( data ),
        scripts = !keepScripts && [];

      // Single tag
      if ( parsed ) {
        return [ context.createElement( parsed[1] ) ];
      }

      parsed = jQuery.buildFragment( [ data ], context, scripts );
      if ( scripts ) {
        jQuery( scripts ).remove();
      }
      return jQuery.merge( [], parsed.childNodes );
    },

    parseJSON: function( data ) {
      // Attempt to parse using the native JSON parser first
      if ( window.JSON && window.JSON.parse ) {
        return window.JSON.parse( data );
      }

      if ( data === null ) {
        return data;
      }

      if ( typeof data === "string" ) {

        // Make sure leading/trailing whitespace is removed (IE can't handle it)
        data = jQuery.trim( data );

        if ( data ) {
          // Make sure the incoming data is actual JSON
          // Logic borrowed from http://json.org/json2.js
          if ( rvalidchars.test( data.replace( rvalidescape, "@" )
            .replace( rvalidtokens, "]" )
            .replace( rvalidbraces, "")) ) {

            return ( new Function( "return " + data ) )();
          }
        }
      }

      jQuery.error( "Invalid JSON: " + data );
    },

    // Cross-browser xml parsing
    parseXML: function( data ) {
      var xml, tmp;
      if ( !data || typeof data !== "string" ) {
        return null;
      }
      try {
        if ( window.DOMParser ) { // Standard
          tmp = new DOMParser();
          xml = tmp.parseFromString( data , "text/xml" );
        } else { // IE
          xml = new ActiveXObject( "Microsoft.XMLDOM" );
          xml.async = "false";
          xml.loadXML( data );
        }
      } catch( e ) {
        xml = undefined;
      }
      if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
        jQuery.error( "Invalid XML: " + data );
      }
      return xml;
    },

    noop: function() {},

    // Evaluates a script in a global context
    // Workarounds based on findings by Jim Driscoll
    // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
    globalEval: function( data ) {
      if ( data && jQuery.trim( data ) ) {
        // We use execScript on Internet Explorer
        // We use an anonymous function so that context is window
        // rather than jQuery in Firefox
        ( window.execScript || function( data ) {
          window[ "eval" ].call( window, data );
        } )( data );
      }
    },

    // Convert dashed to camelCase; used by the css and data modules
    // Microsoft forgot to hump their vendor prefix (#9572)
    camelCase: function( string ) {
      return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    },

    nodeName: function( elem, name ) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },

    // args is for internal usage only
    each: function( obj, callback, args ) {
      var value,
        i = 0,
        length = obj.length,
        isArray = isArraylike( obj );

      if ( args ) {
        if ( isArray ) {
          for ( ; i < length; i++ ) {
            value = callback.apply( obj[ i ], args );

            if ( value === false ) {
              break;
            }
          }
        } else {
          for ( i in obj ) {
            value = callback.apply( obj[ i ], args );

            if ( value === false ) {
              break;
            }
          }
        }

        // A special, fast, case for the most common use of each
      } else {
        if ( isArray ) {
          for ( ; i < length; i++ ) {
            value = callback.call( obj[ i ], i, obj[ i ] );

            if ( value === false ) {
              break;
            }
          }
        } else {
          for ( i in obj ) {
            value = callback.call( obj[ i ], i, obj[ i ] );

            if ( value === false ) {
              break;
            }
          }
        }
      }

      return obj;
    },

    // Use native String.trim function wherever possible
    trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
      function( text ) {
        return text == null ?
          "" :
          core_trim.call( text );
      } :

      // Otherwise use our own trimming functionality
      function( text ) {
        return text == null ?
          "" :
          ( text + "" ).replace( rtrim, "" );
      },

    // results is for internal usage only
    makeArray: function( arr, results ) {
      var ret = results || [];

      if ( arr != null ) {
        if ( isArraylike( Object(arr) ) ) {
          jQuery.merge( ret,
            typeof arr === "string" ?
              [ arr ] : arr
          );
        } else {
          core_push.call( ret, arr );
        }
      }

      return ret;
    },

    inArray: function( elem, arr, i ) {
      var len;

      if ( arr ) {
        if ( core_indexOf ) {
          return core_indexOf.call( arr, elem, i );
        }

        len = arr.length;
        i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

        for ( ; i < len; i++ ) {
          // Skip accessing in sparse arrays
          if ( i in arr && arr[ i ] === elem ) {
            return i;
          }
        }
      }

      return -1;
    },

    merge: function( first, second ) {
      var l = second.length,
        i = first.length,
        j = 0;

      if ( typeof l === "number" ) {
        for ( ; j < l; j++ ) {
          first[ i++ ] = second[ j ];
        }
      } else {
        while ( second[j] !== undefined ) {
          first[ i++ ] = second[ j++ ];
        }
      }

      first.length = i;

      return first;
    },

    grep: function( elems, callback, inv ) {
      var retVal,
        ret = [],
        i = 0,
        length = elems.length;
      inv = !!inv;

      // Go through the array, only saving the items
      // that pass the validator function
      for ( ; i < length; i++ ) {
        retVal = !!callback( elems[ i ], i );
        if ( inv !== retVal ) {
          ret.push( elems[ i ] );
        }
      }

      return ret;
    },

    // arg is for internal usage only
    map: function( elems, callback, arg ) {
      var value,
        i = 0,
        length = elems.length,
        isArray = isArraylike( elems ),
        ret = [];

      // Go through the array, translating each of the items to their
      if ( isArray ) {
        for ( ; i < length; i++ ) {
          value = callback( elems[ i ], i, arg );

          if ( value != null ) {
            ret[ ret.length ] = value;
          }
        }

        // Go through every key on the object,
      } else {
        for ( i in elems ) {
          value = callback( elems[ i ], i, arg );

          if ( value != null ) {
            ret[ ret.length ] = value;
          }
        }
      }

      // Flatten any nested arrays
      return core_concat.apply( [], ret );
    },

    // A global GUID counter for objects
    guid: 1,

    // Bind a function to a context, optionally partially applying any
    // arguments.
    proxy: function( fn, context ) {
      var args, proxy, tmp;

      if ( typeof context === "string" ) {
        tmp = fn[ context ];
        context = fn;
        fn = tmp;
      }

      // Quick check to determine if target is callable, in the spec
      // this throws a TypeError, but we will just return undefined.
      if ( !jQuery.isFunction( fn ) ) {
        return undefined;
      }

      // Simulated bind
      args = core_slice.call( arguments, 2 );
      proxy = function() {
        return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
      };

      // Set the guid of unique handler to the same of original handler, so it can be removed
      proxy.guid = fn.guid = fn.guid || jQuery.guid++;

      return proxy;
    },

    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
      var i = 0,
        length = elems.length,
        bulk = key == null;

      // Sets many values
      if ( jQuery.type( key ) === "object" ) {
        chainable = true;
        for ( i in key ) {
          jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
        }

        // Sets one value
      } else if ( value !== undefined ) {
        chainable = true;

        if ( !jQuery.isFunction( value ) ) {
          raw = true;
        }

        if ( bulk ) {
          // Bulk operations run against the entire set
          if ( raw ) {
            fn.call( elems, value );
            fn = null;

            // ...except when executing function values
          } else {
            bulk = fn;
            fn = function( elem, key, value ) {
              return bulk.call( jQuery( elem ), value );
            };
          }
        }

        if ( fn ) {
          for ( ; i < length; i++ ) {
            fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
          }
        }
      }

      return chainable ?
        elems :

        // Gets
        bulk ?
          fn.call( elems ) :
          length ? fn( elems[0], key ) : emptyGet;
    },

    now: function() {
      return ( new Date() ).getTime();
    },

    // A method for quickly swapping in/out CSS properties to get correct calculations.
    // Note: this method belongs to the css module but it's needed here for the support module.
    // If support gets modularized, this method should be moved back to the css module.
    swap: function( elem, options, callback, args ) {
      var ret, name,
        old = {};

      // Remember the old values, and insert the new ones
      for ( name in options ) {
        old[ name ] = elem.style[ name ];
        elem.style[ name ] = options[ name ];
      }

      ret = callback.apply( elem, args || [] );

      // Revert the old values
      for ( name in options ) {
        elem.style[ name ] = old[ name ];
      }

      return ret;
    }
  });

  jQuery.ready.promise = function( obj ) {
    if ( !readyList ) {

      readyList = jQuery.Deferred();

      // Catch cases where $(document).ready() is called after the browser event has already occurred.
      // we once tried to use readyState "interactive" here, but it caused issues like the one
      // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
      if ( document.readyState === "complete" ) {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        setTimeout( jQuery.ready );

        // Standards-based browsers support DOMContentLoaded
      } else if ( document.addEventListener ) {
        // Use the handy event callback
        document.addEventListener( "DOMContentLoaded", completed, false );

        // A fallback to window.onload, that will always work
        window.addEventListener( "load", completed, false );

        // If IE event model is used
      } else {
        // Ensure firing before onload, maybe late but safe also for iframes
        document.attachEvent( "onreadystatechange", completed );

        // A fallback to window.onload, that will always work
        window.attachEvent( "onload", completed );

        // If IE and not a frame
        // continually check to see if the document is ready
        var top = false;

        try {
          top = window.frameElement == null && document.documentElement;
        } catch(e) {}

        if ( top && top.doScroll ) {
          (function doScrollCheck() {
            if ( !jQuery.isReady ) {

              try {
                // Use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                top.doScroll("left");
              } catch(e) {
                return setTimeout( doScrollCheck, 50 );
              }

              // detach all dom ready events
              detach();

              // and execute any waiting functions
              jQuery.ready();
            }
          })();
        }
      }
    }
    return readyList.promise( obj );
  };

// Populate the class2type map
  jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
  });

  function isArraylike( obj ) {
    var length = obj.length,
      type = jQuery.type( obj );

    if ( jQuery.isWindow( obj ) ) {
      return false;
    }

    if ( obj.nodeType === 1 && length ) {
      return true;
    }

    return type === "array" || type !== "function" &&
      ( length === 0 ||
        typeof length === "number" && length > 0 && ( length - 1 ) in obj );
  }

// All jQuery objects should point back to these
  rootjQuery = jQuery(document);
  /*!
   * Sizzle CSS Selector Engine v1.10.2
   * http://sizzlejs.com/
   *
   * Copyright 2013 jQuery Foundation, Inc. and other contributors
   * Released under the MIT license
   * http://jquery.org/license
   *
   * Date: 2013-07-03
   */
  (function( window, undefined ) {

    var i,
      support,
      cachedruns,
      Expr,
      getText,
      isXML,
      compile,
      outermostContext,
      sortInput,

    // Local document vars
      setDocument,
      document,
      docElem,
      documentIsHTML,
      rbuggyQSA,
      rbuggyMatches,
      matches,
      contains,

    // Instance-specific data
      expando = "sizzle" + -(new Date()),
      preferredDoc = window.document,
      dirruns = 0,
      done = 0,
      classCache = createCache(),
      tokenCache = createCache(),
      compilerCache = createCache(),
      hasDuplicate = false,
      sortOrder = function( a, b ) {
        if ( a === b ) {
          hasDuplicate = true;
          return 0;
        }
        return 0;
      },

    // General-purpose constants
      strundefined = typeof undefined,
      MAX_NEGATIVE = 1 << 31,

    // Instance methods
      hasOwn = ({}).hasOwnProperty,
      arr = [],
      pop = arr.pop,
      push_native = arr.push,
      push = arr.push,
      slice = arr.slice,
    // Use a stripped-down indexOf if we can't use a native one
      indexOf = arr.indexOf || function( elem ) {
        var i = 0,
          len = this.length;
        for ( ; i < len; i++ ) {
          if ( this[i] === elem ) {
            return i;
          }
        }
        return -1;
      },

      booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

    // Regular expressions

    // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
      whitespace = "[\\x20\\t\\r\\n\\f]",
    // http://www.w3.org/TR/css3-syntax/#characters
      characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

    // Loosely modeled on CSS identifier characters
    // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
    // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
      identifier = characterEncoding.replace( "w", "w#" ),

    // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
      attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
        "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

    // Prefer arguments quoted,
    //   then not containing pseudos/brackets,
    //   then attribute selectors/non-parenthetical expressions,
    //   then anything else
    // These preferences are here to reduce the number of selectors
    //   needing tokenize in the PSEUDO preFilter
      pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

    // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
      rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

      rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
      rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

      rsibling = new RegExp( whitespace + "*[+~]" ),
      rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

      rpseudo = new RegExp( pseudos ),
      ridentifier = new RegExp( "^" + identifier + "$" ),

      matchExpr = {
        "ID": new RegExp( "^#(" + characterEncoding + ")" ),
        "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
        "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
        "ATTR": new RegExp( "^" + attributes ),
        "PSEUDO": new RegExp( "^" + pseudos ),
        "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
          "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
          "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
        "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
        // For use in libraries implementing .is()
        // We use this for POS matching in `select`
        "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
          whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
      },

      rnative = /^[^{]+\{\s*\[native \w/,

    // Easily-parseable/retrievable ID or TAG or CLASS selectors
      rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

      rinputs = /^(?:input|select|textarea|button)$/i,
      rheader = /^h\d$/i,

      rescape = /'|\\/g,

    // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
      runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
      funescape = function( _, escaped, escapedWhitespace ) {
        var high = "0x" + escaped - 0x10000;
        // NaN means non-codepoint
        // Support: Firefox
        // Workaround erroneous numeric interpretation of +"0x"
        return high !== high || escapedWhitespace ?
          escaped :
          // BMP codepoint
          high < 0 ?
            String.fromCharCode( high + 0x10000 ) :
            // Supplemental Plane codepoint (surrogate pair)
            String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
      };

// Optimize for push.apply( _, NodeList )
    try {
      push.apply(
        (arr = slice.call( preferredDoc.childNodes )),
        preferredDoc.childNodes
      );
      // Support: Android<4.0
      // Detect silently failing push.apply
      arr[ preferredDoc.childNodes.length ].nodeType;
    } catch ( e ) {
      push = { apply: arr.length ?

        // Leverage slice if possible
        function( target, els ) {
          push_native.apply( target, slice.call(els) );
        } :

        // Support: IE<9
        // Otherwise append directly
        function( target, els ) {
          var j = target.length,
            i = 0;
          // Can't trust NodeList.length
          while ( (target[j++] = els[i++]) ) {}
          target.length = j - 1;
        }
      };
    }

    function Sizzle( selector, context, results, seed ) {
      var match, elem, m, nodeType,
      // QSA vars
        i, groups, old, nid, newContext, newSelector;

      if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
        setDocument( context );
      }

      context = context || document;
      results = results || [];

      if ( !selector || typeof selector !== "string" ) {
        return results;
      }

      if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
        return [];
      }

      if ( documentIsHTML && !seed ) {

        // Shortcuts
        if ( (match = rquickExpr.exec( selector )) ) {
          // Speed-up: Sizzle("#ID")
          if ( (m = match[1]) ) {
            if ( nodeType === 9 ) {
              elem = context.getElementById( m );
              // Check parentNode to catch when Blackberry 4.6 returns
              // nodes that are no longer in the document #6963
              if ( elem && elem.parentNode ) {
                // Handle the case where IE, Opera, and Webkit return items
                // by name instead of ID
                if ( elem.id === m ) {
                  results.push( elem );
                  return results;
                }
              } else {
                return results;
              }
            } else {
              // Context is not a document
              if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                contains( context, elem ) && elem.id === m ) {
                results.push( elem );
                return results;
              }
            }

            // Speed-up: Sizzle("TAG")
          } else if ( match[2] ) {
            push.apply( results, context.getElementsByTagName( selector ) );
            return results;

            // Speed-up: Sizzle(".CLASS")
          } else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
            push.apply( results, context.getElementsByClassName( m ) );
            return results;
          }
        }

        // QSA path
        if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
          nid = old = expando;
          newContext = context;
          newSelector = nodeType === 9 && selector;

          // qSA works strangely on Element-rooted queries
          // We can work around this by specifying an extra ID on the root
          // and working up from there (Thanks to Andrew Dupont for the technique)
          // IE 8 doesn't work on object elements
          if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
            groups = tokenize( selector );

            if ( (old = context.getAttribute("id")) ) {
              nid = old.replace( rescape, "\\$&" );
            } else {
              context.setAttribute( "id", nid );
            }
            nid = "[id='" + nid + "'] ";

            i = groups.length;
            while ( i-- ) {
              groups[i] = nid + toSelector( groups[i] );
            }
            newContext = rsibling.test( selector ) && context.parentNode || context;
            newSelector = groups.join(",");
          }

          if ( newSelector ) {
            try {
              push.apply( results,
                newContext.querySelectorAll( newSelector )
              );
              return results;
            } catch(qsaError) {
            } finally {
              if ( !old ) {
                context.removeAttribute("id");
              }
            }
          }
        }
      }

      // All others
      return select( selector.replace( rtrim, "$1" ), context, results, seed );
    }

    /**
     * Create key-value caches of limited size
     * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */
    function createCache() {
      var keys = [];

      function cache( key, value ) {
        // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
        if ( keys.push( key += " " ) > Expr.cacheLength ) {
          // Only keep the most recent entries
          delete cache[ keys.shift() ];
        }
        return (cache[ key ] = value);
      }
      return cache;
    }

    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */
    function markFunction( fn ) {
      fn[ expando ] = true;
      return fn;
    }

    /**
     * Support testing using an element
     * @param {Function} fn Passed the created div and expects a boolean result
     */
    function assert( fn ) {
      var div = document.createElement("div");

      try {
        return !!fn( div );
      } catch (e) {
        return false;
      } finally {
        // Remove from its parent by default
        if ( div.parentNode ) {
          div.parentNode.removeChild( div );
        }
        // release memory in IE
        div = null;
      }
    }

    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */
    function addHandle( attrs, handler ) {
      var arr = attrs.split("|"),
        i = attrs.length;

      while ( i-- ) {
        Expr.attrHandle[ arr[i] ] = handler;
      }
    }

    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */
    function siblingCheck( a, b ) {
      var cur = b && a,
        diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
          ( ~b.sourceIndex || MAX_NEGATIVE ) -
            ( ~a.sourceIndex || MAX_NEGATIVE );

      // Use IE sourceIndex if available on both nodes
      if ( diff ) {
        return diff;
      }

      // Check if b follows a
      if ( cur ) {
        while ( (cur = cur.nextSibling) ) {
          if ( cur === b ) {
            return -1;
          }
        }
      }

      return a ? 1 : -1;
    }

    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */
    function createInputPseudo( type ) {
      return function( elem ) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
      };
    }

    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */
    function createButtonPseudo( type ) {
      return function( elem ) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type === type;
      };
    }

    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo( fn ) {
      return markFunction(function( argument ) {
        argument = +argument;
        return markFunction(function( seed, matches ) {
          var j,
            matchIndexes = fn( [], seed.length, argument ),
            i = matchIndexes.length;

          // Match elements found at the specified indexes
          while ( i-- ) {
            if ( seed[ (j = matchIndexes[i]) ] ) {
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }

    /**
     * Detect xml
     * @param {Element|Object} elem An element or a document
     */
    isXML = Sizzle.isXML = function( elem ) {
      // documentElement is verified for cases where it doesn't yet exist
      // (such as loading iframes in IE - #4833)
      var documentElement = elem && (elem.ownerDocument || elem).documentElement;
      return documentElement ? documentElement.nodeName !== "HTML" : false;
    };

// Expose support vars for convenience
    support = Sizzle.support = {};

    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setDocument = Sizzle.setDocument = function( node ) {
      var doc = node ? node.ownerDocument || node : preferredDoc,
        parent = doc.defaultView;

      // If no document and documentElement is available, return
      if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
        return document;
      }

      // Set our document
      document = doc;
      docElem = doc.documentElement;

      // Support tests
      documentIsHTML = !isXML( doc );

      // Support: IE>8
      // If iframe document is assigned to "document" variable and if iframe has been reloaded,
      // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
      // IE6-8 do not support the defaultView property so parent will be undefined
      if ( parent && parent.attachEvent && parent !== parent.top ) {
        parent.attachEvent( "onbeforeunload", function() {
          setDocument();
        });
      }

      /* Attributes
       ---------------------------------------------------------------------- */

      // Support: IE<8
      // Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
      support.attributes = assert(function( div ) {
        div.className = "i";
        return !div.getAttribute("className");
      });

      /* getElement(s)By*
       ---------------------------------------------------------------------- */

      // Check if getElementsByTagName("*") returns only elements
      support.getElementsByTagName = assert(function( div ) {
        div.appendChild( doc.createComment("") );
        return !div.getElementsByTagName("*").length;
      });

      // Check if getElementsByClassName can be trusted
      support.getElementsByClassName = assert(function( div ) {
        div.innerHTML = "<div class='a'></div><div class='a i'></div>";

        // Support: Safari<4
        // Catch class over-caching
        div.firstChild.className = "i";
        // Support: Opera<10
        // Catch gEBCN failure to find non-leading classes
        return div.getElementsByClassName("i").length === 2;
      });

      // Support: IE<10
      // Check if getElementById returns elements by name
      // The broken getElementById methods don't pick up programatically-set names,
      // so use a roundabout getElementsByName test
      support.getById = assert(function( div ) {
        docElem.appendChild( div ).id = expando;
        return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
      });

      // ID find and filter
      if ( support.getById ) {
        Expr.find["ID"] = function( id, context ) {
          if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
            var m = context.getElementById( id );
            // Check parentNode to catch when Blackberry 4.6 returns
            // nodes that are no longer in the document #6963
            return m && m.parentNode ? [m] : [];
          }
        };
        Expr.filter["ID"] = function( id ) {
          var attrId = id.replace( runescape, funescape );
          return function( elem ) {
            return elem.getAttribute("id") === attrId;
          };
        };
      } else {
        // Support: IE6/7
        // getElementById is not reliable as a find shortcut
        delete Expr.find["ID"];

        Expr.filter["ID"] =  function( id ) {
          var attrId = id.replace( runescape, funescape );
          return function( elem ) {
            var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
            return node && node.value === attrId;
          };
        };
      }

      // Tag
      Expr.find["TAG"] = support.getElementsByTagName ?
        function( tag, context ) {
          if ( typeof context.getElementsByTagName !== strundefined ) {
            return context.getElementsByTagName( tag );
          }
        } :
        function( tag, context ) {
          var elem,
            tmp = [],
            i = 0,
            results = context.getElementsByTagName( tag );

          // Filter out possible comments
          if ( tag === "*" ) {
            while ( (elem = results[i++]) ) {
              if ( elem.nodeType === 1 ) {
                tmp.push( elem );
              }
            }

            return tmp;
          }
          return results;
        };

      // Class
      Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
        if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
          return context.getElementsByClassName( className );
        }
      };

      /* QSA/matchesSelector
       ---------------------------------------------------------------------- */

      // QSA and matchesSelector support

      // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
      rbuggyMatches = [];

      // qSa(:focus) reports false when true (Chrome 21)
      // We allow this because of a bug in IE8/9 that throws an error
      // whenever `document.activeElement` is accessed on an iframe
      // So, we allow :focus to pass through QSA all the time to avoid the IE error
      // See http://bugs.jquery.com/ticket/13378
      rbuggyQSA = [];

      if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
        // Build QSA regex
        // Regex strategy adopted from Diego Perini
        assert(function( div ) {
          // Select is set to empty string on purpose
          // This is to test IE's treatment of not explicitly
          // setting a boolean content attribute,
          // since its presence should be enough
          // http://bugs.jquery.com/ticket/12359
          div.innerHTML = "<select><option selected=''></option></select>";

          // Support: IE8
          // Boolean attributes and "value" are not treated correctly
          if ( !div.querySelectorAll("[selected]").length ) {
            rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
          }

          // Webkit/Opera - :checked should return selected option elements
          // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
          // IE8 throws error here and will not see later tests
          if ( !div.querySelectorAll(":checked").length ) {
            rbuggyQSA.push(":checked");
          }
        });

        assert(function( div ) {

          // Support: Opera 10-12/IE8
          // ^= $= *= and empty values
          // Should not select anything
          // Support: Windows 8 Native Apps
          // The type attribute is restricted during .innerHTML assignment
          var input = doc.createElement("input");
          input.setAttribute( "type", "hidden" );
          div.appendChild( input ).setAttribute( "t", "" );

          if ( div.querySelectorAll("[t^='']").length ) {
            rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
          }

          // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
          // IE8 throws error here and will not see later tests
          if ( !div.querySelectorAll(":enabled").length ) {
            rbuggyQSA.push( ":enabled", ":disabled" );
          }

          // Opera 10-11 does not throw on post-comma invalid pseudos
          div.querySelectorAll("*,:x");
          rbuggyQSA.push(",.*:");
        });
      }

      if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
        docElem.mozMatchesSelector ||
        docElem.oMatchesSelector ||
        docElem.msMatchesSelector) )) ) {

        assert(function( div ) {
          // Check to see if it's possible to do matchesSelector
          // on a disconnected node (IE 9)
          support.disconnectedMatch = matches.call( div, "div" );

          // This should fail with an exception
          // Gecko does not error, returns false instead
          matches.call( div, "[s!='']:x" );
          rbuggyMatches.push( "!=", pseudos );
        });
      }

      rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
      rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

      /* Contains
       ---------------------------------------------------------------------- */

      // Element contains another
      // Purposefully does not implement inclusive descendent
      // As in, an element does not contain itself
      contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
        function( a, b ) {
          var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
          return a === bup || !!( bup && bup.nodeType === 1 && (
            adown.contains ?
              adown.contains( bup ) :
              a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
            ));
        } :
        function( a, b ) {
          if ( b ) {
            while ( (b = b.parentNode) ) {
              if ( b === a ) {
                return true;
              }
            }
          }
          return false;
        };

      /* Sorting
       ---------------------------------------------------------------------- */

      // Document order sorting
      sortOrder = docElem.compareDocumentPosition ?
        function( a, b ) {

          // Flag for duplicate removal
          if ( a === b ) {
            hasDuplicate = true;
            return 0;
          }

          var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

          if ( compare ) {
            // Disconnected nodes
            if ( compare & 1 ||
              (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

              // Choose the first element that is related to our preferred document
              if ( a === doc || contains(preferredDoc, a) ) {
                return -1;
              }
              if ( b === doc || contains(preferredDoc, b) ) {
                return 1;
              }

              // Maintain original order
              return sortInput ?
                ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                0;
            }

            return compare & 4 ? -1 : 1;
          }

          // Not directly comparable, sort on existence of method
          return a.compareDocumentPosition ? -1 : 1;
        } :
        function( a, b ) {
          var cur,
            i = 0,
            aup = a.parentNode,
            bup = b.parentNode,
            ap = [ a ],
            bp = [ b ];

          // Exit early if the nodes are identical
          if ( a === b ) {
            hasDuplicate = true;
            return 0;

            // Parentless nodes are either documents or disconnected
          } else if ( !aup || !bup ) {
            return a === doc ? -1 :
              b === doc ? 1 :
                aup ? -1 :
                  bup ? 1 :
                    sortInput ?
                      ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                      0;

            // If the nodes are siblings, we can do a quick check
          } else if ( aup === bup ) {
            return siblingCheck( a, b );
          }

          // Otherwise we need full lists of their ancestors for comparison
          cur = a;
          while ( (cur = cur.parentNode) ) {
            ap.unshift( cur );
          }
          cur = b;
          while ( (cur = cur.parentNode) ) {
            bp.unshift( cur );
          }

          // Walk down the tree looking for a discrepancy
          while ( ap[i] === bp[i] ) {
            i++;
          }

          return i ?
            // Do a sibling check if the nodes have a common ancestor
            siblingCheck( ap[i], bp[i] ) :

            // Otherwise nodes in our document sort first
            ap[i] === preferredDoc ? -1 :
              bp[i] === preferredDoc ? 1 :
                0;
        };

      return doc;
    };

    Sizzle.matches = function( expr, elements ) {
      return Sizzle( expr, null, null, elements );
    };

    Sizzle.matchesSelector = function( elem, expr ) {
      // Set document vars if needed
      if ( ( elem.ownerDocument || elem ) !== document ) {
        setDocument( elem );
      }

      // Make sure that attribute selectors are quoted
      expr = expr.replace( rattributeQuotes, "='$1']" );

      if ( support.matchesSelector && documentIsHTML &&
        ( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
        ( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

        try {
          var ret = matches.call( elem, expr );

          // IE 9's matchesSelector returns false on disconnected nodes
          if ( ret || support.disconnectedMatch ||
            // As well, disconnected nodes are said to be in a document
            // fragment in IE 9
            elem.document && elem.document.nodeType !== 11 ) {
            return ret;
          }
        } catch(e) {}
      }

      return Sizzle( expr, document, null, [elem] ).length > 0;
    };

    Sizzle.contains = function( context, elem ) {
      // Set document vars if needed
      if ( ( context.ownerDocument || context ) !== document ) {
        setDocument( context );
      }
      return contains( context, elem );
    };

    Sizzle.attr = function( elem, name ) {
      // Set document vars if needed
      if ( ( elem.ownerDocument || elem ) !== document ) {
        setDocument( elem );
      }

      var fn = Expr.attrHandle[ name.toLowerCase() ],
      // Don't get fooled by Object.prototype properties (jQuery #13807)
        val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
          fn( elem, name, !documentIsHTML ) :
          undefined;

      return val === undefined ?
        support.attributes || !documentIsHTML ?
          elem.getAttribute( name ) :
          (val = elem.getAttributeNode(name)) && val.specified ?
            val.value :
            null :
        val;
    };

    Sizzle.error = function( msg ) {
      throw new Error( "Syntax error, unrecognized expression: " + msg );
    };

    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    Sizzle.uniqueSort = function( results ) {
      var elem,
        duplicates = [],
        j = 0,
        i = 0;

      // Unless we *know* we can detect duplicates, assume their presence
      hasDuplicate = !support.detectDuplicates;
      sortInput = !support.sortStable && results.slice( 0 );
      results.sort( sortOrder );

      if ( hasDuplicate ) {
        while ( (elem = results[i++]) ) {
          if ( elem === results[ i ] ) {
            j = duplicates.push( i );
          }
        }
        while ( j-- ) {
          results.splice( duplicates[ j ], 1 );
        }
      }

      return results;
    };

    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function( elem ) {
      var node,
        ret = "",
        i = 0,
        nodeType = elem.nodeType;

      if ( !nodeType ) {
        // If no nodeType, this is expected to be an array
        for ( ; (node = elem[i]); i++ ) {
          // Do not traverse comment nodes
          ret += getText( node );
        }
      } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
        // Use textContent for elements
        // innerText usage removed for consistency of new lines (see #11153)
        if ( typeof elem.textContent === "string" ) {
          return elem.textContent;
        } else {
          // Traverse its children
          for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
            ret += getText( elem );
          }
        }
      } else if ( nodeType === 3 || nodeType === 4 ) {
        return elem.nodeValue;
      }
      // Do not include comment or processing instruction nodes

      return ret;
    };

    Expr = Sizzle.selectors = {

      // Can be adjusted by the user
      cacheLength: 50,

      createPseudo: markFunction,

      match: matchExpr,

      attrHandle: {},

      find: {},

      relative: {
        ">": { dir: "parentNode", first: true },
        " ": { dir: "parentNode" },
        "+": { dir: "previousSibling", first: true },
        "~": { dir: "previousSibling" }
      },

      preFilter: {
        "ATTR": function( match ) {
          match[1] = match[1].replace( runescape, funescape );

          // Move the given value to match[3] whether quoted or unquoted
          match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

          if ( match[2] === "~=" ) {
            match[3] = " " + match[3] + " ";
          }

          return match.slice( 0, 4 );
        },

        "CHILD": function( match ) {
          /* matches from matchExpr["CHILD"]
           1 type (only|nth|...)
           2 what (child|of-type)
           3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
           4 xn-component of xn+y argument ([+-]?\d*n|)
           5 sign of xn-component
           6 x of xn-component
           7 sign of y-component
           8 y of y-component
           */
          match[1] = match[1].toLowerCase();

          if ( match[1].slice( 0, 3 ) === "nth" ) {
            // nth-* requires argument
            if ( !match[3] ) {
              Sizzle.error( match[0] );
            }

            // numeric x and y parameters for Expr.filter.CHILD
            // remember that false/true cast respectively to 0/1
            match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
            match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

            // other types prohibit arguments
          } else if ( match[3] ) {
            Sizzle.error( match[0] );
          }

          return match;
        },

        "PSEUDO": function( match ) {
          var excess,
            unquoted = !match[5] && match[2];

          if ( matchExpr["CHILD"].test( match[0] ) ) {
            return null;
          }

          // Accept quoted arguments as-is
          if ( match[3] && match[4] !== undefined ) {
            match[2] = match[4];

            // Strip excess characters from unquoted arguments
          } else if ( unquoted && rpseudo.test( unquoted ) &&
            // Get excess from tokenize (recursively)
            (excess = tokenize( unquoted, true )) &&
            // advance to the next closing parenthesis
            (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

            // excess is a negative index
            match[0] = match[0].slice( 0, excess );
            match[2] = unquoted.slice( 0, excess );
          }

          // Return only captures needed by the pseudo filter method (type and argument)
          return match.slice( 0, 3 );
        }
      },

      filter: {

        "TAG": function( nodeNameSelector ) {
          var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
          return nodeNameSelector === "*" ?
            function() { return true; } :
            function( elem ) {
              return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
            };
        },

        "CLASS": function( className ) {
          var pattern = classCache[ className + " " ];

          return pattern ||
            (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
              classCache( className, function( elem ) {
                return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
              });
        },

        "ATTR": function( name, operator, check ) {
          return function( elem ) {
            var result = Sizzle.attr( elem, name );

            if ( result == null ) {
              return operator === "!=";
            }
            if ( !operator ) {
              return true;
            }

            result += "";

            return operator === "=" ? result === check :
              operator === "!=" ? result !== check :
                operator === "^=" ? check && result.indexOf( check ) === 0 :
                  operator === "*=" ? check && result.indexOf( check ) > -1 :
                    operator === "$=" ? check && result.slice( -check.length ) === check :
                      operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
                        operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
                          false;
          };
        },

        "CHILD": function( type, what, argument, first, last ) {
          var simple = type.slice( 0, 3 ) !== "nth",
            forward = type.slice( -4 ) !== "last",
            ofType = what === "of-type";

          return first === 1 && last === 0 ?

            // Shortcut for :nth-*(n)
            function( elem ) {
              return !!elem.parentNode;
            } :

            function( elem, context, xml ) {
              var cache, outerCache, node, diff, nodeIndex, start,
                dir = simple !== forward ? "nextSibling" : "previousSibling",
                parent = elem.parentNode,
                name = ofType && elem.nodeName.toLowerCase(),
                useCache = !xml && !ofType;

              if ( parent ) {

                // :(first|last|only)-(child|of-type)
                if ( simple ) {
                  while ( dir ) {
                    node = elem;
                    while ( (node = node[ dir ]) ) {
                      if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
                        return false;
                      }
                    }
                    // Reverse direction for :only-* (if we haven't yet done so)
                    start = dir = type === "only" && !start && "nextSibling";
                  }
                  return true;
                }

                start = [ forward ? parent.firstChild : parent.lastChild ];

                // non-xml :nth-child(...) stores cache data on `parent`
                if ( forward && useCache ) {
                  // Seek `elem` from a previously-cached index
                  outerCache = parent[ expando ] || (parent[ expando ] = {});
                  cache = outerCache[ type ] || [];
                  nodeIndex = cache[0] === dirruns && cache[1];
                  diff = cache[0] === dirruns && cache[2];
                  node = nodeIndex && parent.childNodes[ nodeIndex ];

                  while ( (node = ++nodeIndex && node && node[ dir ] ||

                    // Fallback to seeking `elem` from the start
                    (diff = nodeIndex = 0) || start.pop()) ) {

                    // When found, cache indexes on `parent` and break
                    if ( node.nodeType === 1 && ++diff && node === elem ) {
                      outerCache[ type ] = [ dirruns, nodeIndex, diff ];
                      break;
                    }
                  }

                  // Use previously-cached element index if available
                } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
                  diff = cache[1];

                  // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                } else {
                  // Use the same loop as above to seek `elem` from the start
                  while ( (node = ++nodeIndex && node && node[ dir ] ||
                    (diff = nodeIndex = 0) || start.pop()) ) {

                    if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
                      // Cache the index of each encountered element
                      if ( useCache ) {
                        (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
                      }

                      if ( node === elem ) {
                        break;
                      }
                    }
                  }
                }

                // Incorporate the offset, then check against cycle size
                diff -= last;
                return diff === first || ( diff % first === 0 && diff / first >= 0 );
              }
            };
        },

        "PSEUDO": function( pseudo, argument ) {
          // pseudo-class names are case-insensitive
          // http://www.w3.org/TR/selectors/#pseudo-classes
          // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
          // Remember that setFilters inherits from pseudos
          var args,
            fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
              Sizzle.error( "unsupported pseudo: " + pseudo );

          // The user may use createPseudo to indicate that
          // arguments are needed to create the filter function
          // just as Sizzle does
          if ( fn[ expando ] ) {
            return fn( argument );
          }

          // But maintain support for old signatures
          if ( fn.length > 1 ) {
            args = [ pseudo, pseudo, "", argument ];
            return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
              markFunction(function( seed, matches ) {
                var idx,
                  matched = fn( seed, argument ),
                  i = matched.length;
                while ( i-- ) {
                  idx = indexOf.call( seed, matched[i] );
                  seed[ idx ] = !( matches[ idx ] = matched[i] );
                }
              }) :
              function( elem ) {
                return fn( elem, 0, args );
              };
          }

          return fn;
        }
      },

      pseudos: {
        // Potentially complex pseudos
        "not": markFunction(function( selector ) {
          // Trim the selector passed to compile
          // to avoid treating leading and trailing
          // spaces as combinators
          var input = [],
            results = [],
            matcher = compile( selector.replace( rtrim, "$1" ) );

          return matcher[ expando ] ?
            markFunction(function( seed, matches, context, xml ) {
              var elem,
                unmatched = matcher( seed, null, xml, [] ),
                i = seed.length;

              // Match elements unmatched by `matcher`
              while ( i-- ) {
                if ( (elem = unmatched[i]) ) {
                  seed[i] = !(matches[i] = elem);
                }
              }
            }) :
            function( elem, context, xml ) {
              input[0] = elem;
              matcher( input, null, xml, results );
              return !results.pop();
            };
        }),

        "has": markFunction(function( selector ) {
          return function( elem ) {
            return Sizzle( selector, elem ).length > 0;
          };
        }),

        "contains": markFunction(function( text ) {
          return function( elem ) {
            return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
          };
        }),

        // "Whether an element is represented by a :lang() selector
        // is based solely on the element's language value
        // being equal to the identifier C,
        // or beginning with the identifier C immediately followed by "-".
        // The matching of C against the element's language value is performed case-insensitively.
        // The identifier C does not have to be a valid language name."
        // http://www.w3.org/TR/selectors/#lang-pseudo
        "lang": markFunction( function( lang ) {
          // lang value must be a valid identifier
          if ( !ridentifier.test(lang || "") ) {
            Sizzle.error( "unsupported lang: " + lang );
          }
          lang = lang.replace( runescape, funescape ).toLowerCase();
          return function( elem ) {
            var elemLang;
            do {
              if ( (elemLang = documentIsHTML ?
                elem.lang :
                elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

                elemLang = elemLang.toLowerCase();
                return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
              }
            } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
            return false;
          };
        }),

        // Miscellaneous
        "target": function( elem ) {
          var hash = window.location && window.location.hash;
          return hash && hash.slice( 1 ) === elem.id;
        },

        "root": function( elem ) {
          return elem === docElem;
        },

        "focus": function( elem ) {
          return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        },

        // Boolean properties
        "enabled": function( elem ) {
          return elem.disabled === false;
        },

        "disabled": function( elem ) {
          return elem.disabled === true;
        },

        "checked": function( elem ) {
          // In CSS3, :checked should return both checked and selected elements
          // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
          var nodeName = elem.nodeName.toLowerCase();
          return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
        },

        "selected": function( elem ) {
          // Accessing this property makes selected-by-default
          // options in Safari work properly
          if ( elem.parentNode ) {
            elem.parentNode.selectedIndex;
          }

          return elem.selected === true;
        },

        // Contents
        "empty": function( elem ) {
          // http://www.w3.org/TR/selectors/#empty-pseudo
          // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
          //   not comment, processing instructions, or others
          // Thanks to Diego Perini for the nodeName shortcut
          //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
          for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
            if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
              return false;
            }
          }
          return true;
        },

        "parent": function( elem ) {
          return !Expr.pseudos["empty"]( elem );
        },

        // Element/input types
        "header": function( elem ) {
          return rheader.test( elem.nodeName );
        },

        "input": function( elem ) {
          return rinputs.test( elem.nodeName );
        },

        "button": function( elem ) {
          var name = elem.nodeName.toLowerCase();
          return name === "input" && elem.type === "button" || name === "button";
        },

        "text": function( elem ) {
          var attr;
          // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
          // use getAttribute instead to test this case
          return elem.nodeName.toLowerCase() === "input" &&
            elem.type === "text" &&
            ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
        },

        // Position-in-collection
        "first": createPositionalPseudo(function() {
          return [ 0 ];
        }),

        "last": createPositionalPseudo(function( matchIndexes, length ) {
          return [ length - 1 ];
        }),

        "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
          return [ argument < 0 ? argument + length : argument ];
        }),

        "even": createPositionalPseudo(function( matchIndexes, length ) {
          var i = 0;
          for ( ; i < length; i += 2 ) {
            matchIndexes.push( i );
          }
          return matchIndexes;
        }),

        "odd": createPositionalPseudo(function( matchIndexes, length ) {
          var i = 1;
          for ( ; i < length; i += 2 ) {
            matchIndexes.push( i );
          }
          return matchIndexes;
        }),

        "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
          var i = argument < 0 ? argument + length : argument;
          for ( ; --i >= 0; ) {
            matchIndexes.push( i );
          }
          return matchIndexes;
        }),

        "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
          var i = argument < 0 ? argument + length : argument;
          for ( ; ++i < length; ) {
            matchIndexes.push( i );
          }
          return matchIndexes;
        })
      }
    };

    Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
    for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
      Expr.pseudos[ i ] = createInputPseudo( i );
    }
    for ( i in { submit: true, reset: true } ) {
      Expr.pseudos[ i ] = createButtonPseudo( i );
    }

// Easy API for creating new setFilters
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();

    function tokenize( selector, parseOnly ) {
      var matched, match, tokens, type,
        soFar, groups, preFilters,
        cached = tokenCache[ selector + " " ];

      if ( cached ) {
        return parseOnly ? 0 : cached.slice( 0 );
      }

      soFar = selector;
      groups = [];
      preFilters = Expr.preFilter;

      while ( soFar ) {

        // Comma and first run
        if ( !matched || (match = rcomma.exec( soFar )) ) {
          if ( match ) {
            // Don't consume trailing commas as valid
            soFar = soFar.slice( match[0].length ) || soFar;
          }
          groups.push( tokens = [] );
        }

        matched = false;

        // Combinators
        if ( (match = rcombinators.exec( soFar )) ) {
          matched = match.shift();
          tokens.push({
            value: matched,
            // Cast descendant combinators to space
            type: match[0].replace( rtrim, " " )
          });
          soFar = soFar.slice( matched.length );
        }

        // Filters
        for ( type in Expr.filter ) {
          if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
            (match = preFilters[ type ]( match ))) ) {
            matched = match.shift();
            tokens.push({
              value: matched,
              type: type,
              matches: match
            });
            soFar = soFar.slice( matched.length );
          }
        }

        if ( !matched ) {
          break;
        }
      }

      // Return the length of the invalid excess
      // if we're just parsing
      // Otherwise, throw an error or return tokens
      return parseOnly ?
        soFar.length :
        soFar ?
          Sizzle.error( selector ) :
          // Cache the tokens
          tokenCache( selector, groups ).slice( 0 );
    }

    function toSelector( tokens ) {
      var i = 0,
        len = tokens.length,
        selector = "";
      for ( ; i < len; i++ ) {
        selector += tokens[i].value;
      }
      return selector;
    }

    function addCombinator( matcher, combinator, base ) {
      var dir = combinator.dir,
        checkNonElements = base && dir === "parentNode",
        doneName = done++;

      return combinator.first ?
        // Check against closest ancestor/preceding element
        function( elem, context, xml ) {
          while ( (elem = elem[ dir ]) ) {
            if ( elem.nodeType === 1 || checkNonElements ) {
              return matcher( elem, context, xml );
            }
          }
        } :

        // Check against all ancestor/preceding elements
        function( elem, context, xml ) {
          var data, cache, outerCache,
            dirkey = dirruns + " " + doneName;

          // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
          if ( xml ) {
            while ( (elem = elem[ dir ]) ) {
              if ( elem.nodeType === 1 || checkNonElements ) {
                if ( matcher( elem, context, xml ) ) {
                  return true;
                }
              }
            }
          } else {
            while ( (elem = elem[ dir ]) ) {
              if ( elem.nodeType === 1 || checkNonElements ) {
                outerCache = elem[ expando ] || (elem[ expando ] = {});
                if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
                  if ( (data = cache[1]) === true || data === cachedruns ) {
                    return data === true;
                  }
                } else {
                  cache = outerCache[ dir ] = [ dirkey ];
                  cache[1] = matcher( elem, context, xml ) || cachedruns;
                  if ( cache[1] === true ) {
                    return true;
                  }
                }
              }
            }
          }
        };
    }

    function elementMatcher( matchers ) {
      return matchers.length > 1 ?
        function( elem, context, xml ) {
          var i = matchers.length;
          while ( i-- ) {
            if ( !matchers[i]( elem, context, xml ) ) {
              return false;
            }
          }
          return true;
        } :
        matchers[0];
    }

    function condense( unmatched, map, filter, context, xml ) {
      var elem,
        newUnmatched = [],
        i = 0,
        len = unmatched.length,
        mapped = map != null;

      for ( ; i < len; i++ ) {
        if ( (elem = unmatched[i]) ) {
          if ( !filter || filter( elem, context, xml ) ) {
            newUnmatched.push( elem );
            if ( mapped ) {
              map.push( i );
            }
          }
        }
      }

      return newUnmatched;
    }

    function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
      if ( postFilter && !postFilter[ expando ] ) {
        postFilter = setMatcher( postFilter );
      }
      if ( postFinder && !postFinder[ expando ] ) {
        postFinder = setMatcher( postFinder, postSelector );
      }
      return markFunction(function( seed, results, context, xml ) {
        var temp, i, elem,
          preMap = [],
          postMap = [],
          preexisting = results.length,

        // Get initial elements from seed or context
          elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

        // Prefilter to get matcher input, preserving a map for seed-results synchronization
          matcherIn = preFilter && ( seed || !selector ) ?
            condense( elems, preMap, preFilter, context, xml ) :
            elems,

          matcherOut = matcher ?
            // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
            postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

              // ...intermediate processing is necessary
              [] :

              // ...otherwise use results directly
              results :
            matcherIn;

        // Find primary matches
        if ( matcher ) {
          matcher( matcherIn, matcherOut, context, xml );
        }

        // Apply postFilter
        if ( postFilter ) {
          temp = condense( matcherOut, postMap );
          postFilter( temp, [], context, xml );

          // Un-match failing elements by moving them back to matcherIn
          i = temp.length;
          while ( i-- ) {
            if ( (elem = temp[i]) ) {
              matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
            }
          }
        }

        if ( seed ) {
          if ( postFinder || preFilter ) {
            if ( postFinder ) {
              // Get the final matcherOut by condensing this intermediate into postFinder contexts
              temp = [];
              i = matcherOut.length;
              while ( i-- ) {
                if ( (elem = matcherOut[i]) ) {
                  // Restore matcherIn since elem is not yet a final match
                  temp.push( (matcherIn[i] = elem) );
                }
              }
              postFinder( null, (matcherOut = []), temp, xml );
            }

            // Move matched elements from seed to results to keep them synchronized
            i = matcherOut.length;
            while ( i-- ) {
              if ( (elem = matcherOut[i]) &&
                (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

                seed[temp] = !(results[temp] = elem);
              }
            }
          }

          // Add elements to results, through postFinder if defined
        } else {
          matcherOut = condense(
            matcherOut === results ?
              matcherOut.splice( preexisting, matcherOut.length ) :
              matcherOut
          );
          if ( postFinder ) {
            postFinder( null, results, matcherOut, xml );
          } else {
            push.apply( results, matcherOut );
          }
        }
      });
    }

    function matcherFromTokens( tokens ) {
      var checkContext, matcher, j,
        len = tokens.length,
        leadingRelative = Expr.relative[ tokens[0].type ],
        implicitRelative = leadingRelative || Expr.relative[" "],
        i = leadingRelative ? 1 : 0,

      // The foundational matcher ensures that elements are reachable from top-level context(s)
        matchContext = addCombinator( function( elem ) {
          return elem === checkContext;
        }, implicitRelative, true ),
        matchAnyContext = addCombinator( function( elem ) {
          return indexOf.call( checkContext, elem ) > -1;
        }, implicitRelative, true ),
        matchers = [ function( elem, context, xml ) {
          return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
            (checkContext = context).nodeType ?
              matchContext( elem, context, xml ) :
              matchAnyContext( elem, context, xml ) );
        } ];

      for ( ; i < len; i++ ) {
        if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
          matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
        } else {
          matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

          // Return special upon seeing a positional matcher
          if ( matcher[ expando ] ) {
            // Find the next relative operator (if any) for proper handling
            j = ++i;
            for ( ; j < len; j++ ) {
              if ( Expr.relative[ tokens[j].type ] ) {
                break;
              }
            }
            return setMatcher(
              i > 1 && elementMatcher( matchers ),
              i > 1 && toSelector(
                // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
              ).replace( rtrim, "$1" ),
              matcher,
              i < j && matcherFromTokens( tokens.slice( i, j ) ),
              j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
              j < len && toSelector( tokens )
            );
          }
          matchers.push( matcher );
        }
      }

      return elementMatcher( matchers );
    }

    function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
      // A counter to specify which element is currently being matched
      var matcherCachedRuns = 0,
        bySet = setMatchers.length > 0,
        byElement = elementMatchers.length > 0,
        superMatcher = function( seed, context, xml, results, expandContext ) {
          var elem, j, matcher,
            setMatched = [],
            matchedCount = 0,
            i = "0",
            unmatched = seed && [],
            outermost = expandContext != null,
            contextBackup = outermostContext,
          // We must always have either seed elements or context
            elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
          // Use integer dirruns iff this is the outermost matcher
            dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

          if ( outermost ) {
            outermostContext = context !== document && context;
            cachedruns = matcherCachedRuns;
          }

          // Add elements passing elementMatchers directly to results
          // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
          for ( ; (elem = elems[i]) != null; i++ ) {
            if ( byElement && elem ) {
              j = 0;
              while ( (matcher = elementMatchers[j++]) ) {
                if ( matcher( elem, context, xml ) ) {
                  results.push( elem );
                  break;
                }
              }
              if ( outermost ) {
                dirruns = dirrunsUnique;
                cachedruns = ++matcherCachedRuns;
              }
            }

            // Track unmatched elements for set filters
            if ( bySet ) {
              // They will have gone through all possible matchers
              if ( (elem = !matcher && elem) ) {
                matchedCount--;
              }

              // Lengthen the array for every element, matched or not
              if ( seed ) {
                unmatched.push( elem );
              }
            }
          }

          // Apply set filters to unmatched elements
          matchedCount += i;
          if ( bySet && i !== matchedCount ) {
            j = 0;
            while ( (matcher = setMatchers[j++]) ) {
              matcher( unmatched, setMatched, context, xml );
            }

            if ( seed ) {
              // Reintegrate element matches to eliminate the need for sorting
              if ( matchedCount > 0 ) {
                while ( i-- ) {
                  if ( !(unmatched[i] || setMatched[i]) ) {
                    setMatched[i] = pop.call( results );
                  }
                }
              }

              // Discard index placeholder values to get only actual matches
              setMatched = condense( setMatched );
            }

            // Add matches to results
            push.apply( results, setMatched );

            // Seedless set matches succeeding multiple successful matchers stipulate sorting
            if ( outermost && !seed && setMatched.length > 0 &&
              ( matchedCount + setMatchers.length ) > 1 ) {

              Sizzle.uniqueSort( results );
            }
          }

          // Override manipulation of globals by nested matchers
          if ( outermost ) {
            dirruns = dirrunsUnique;
            outermostContext = contextBackup;
          }

          return unmatched;
        };

      return bySet ?
        markFunction( superMatcher ) :
        superMatcher;
    }

    compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
      var i,
        setMatchers = [],
        elementMatchers = [],
        cached = compilerCache[ selector + " " ];

      if ( !cached ) {
        // Generate a function of recursive functions that can be used to check each element
        if ( !group ) {
          group = tokenize( selector );
        }
        i = group.length;
        while ( i-- ) {
          cached = matcherFromTokens( group[i] );
          if ( cached[ expando ] ) {
            setMatchers.push( cached );
          } else {
            elementMatchers.push( cached );
          }
        }

        // Cache the compiled function
        cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
      }
      return cached;
    };

    function multipleContexts( selector, contexts, results ) {
      var i = 0,
        len = contexts.length;
      for ( ; i < len; i++ ) {
        Sizzle( selector, contexts[i], results );
      }
      return results;
    }

    function select( selector, context, results, seed ) {
      var i, tokens, token, type, find,
        match = tokenize( selector );

      if ( !seed ) {
        // Try to minimize operations if there is only one group
        if ( match.length === 1 ) {

          // Take a shortcut and set the context if the root selector is an ID
          tokens = match[0] = match[0].slice( 0 );
          if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
            support.getById && context.nodeType === 9 && documentIsHTML &&
            Expr.relative[ tokens[1].type ] ) {

            context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
            if ( !context ) {
              return results;
            }
            selector = selector.slice( tokens.shift().value.length );
          }

          // Fetch a seed set for right-to-left matching
          i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
          while ( i-- ) {
            token = tokens[i];

            // Abort if we hit a combinator
            if ( Expr.relative[ (type = token.type) ] ) {
              break;
            }
            if ( (find = Expr.find[ type ]) ) {
              // Search, expanding context for leading sibling combinators
              if ( (seed = find(
                token.matches[0].replace( runescape, funescape ),
                rsibling.test( tokens[0].type ) && context.parentNode || context
              )) ) {

                // If seed is empty or no tokens remain, we can return early
                tokens.splice( i, 1 );
                selector = seed.length && toSelector( tokens );
                if ( !selector ) {
                  push.apply( results, seed );
                  return results;
                }

                break;
              }
            }
          }
        }
      }

      // Compile and execute a filtering function
      // Provide `match` to avoid retokenization if we modified the selector above
      compile( selector, match )(
        seed,
        context,
        !documentIsHTML,
        results,
        rsibling.test( selector )
      );
      return results;
    }

// One-time assignments

// Sort stability
    support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
    support.detectDuplicates = hasDuplicate;

// Initialize against the default document
    setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
    support.sortDetached = assert(function( div1 ) {
      // Should return 1, but returns 4 (following)
      return div1.compareDocumentPosition( document.createElement("div") ) & 1;
    });

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if ( !assert(function( div ) {
      div.innerHTML = "<a href='#'></a>";
      return div.firstChild.getAttribute("href") === "#" ;
    }) ) {
      addHandle( "type|href|height|width", function( elem, name, isXML ) {
        if ( !isXML ) {
          return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
        }
      });
    }

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
    if ( !support.attributes || !assert(function( div ) {
      div.innerHTML = "<input/>";
      div.firstChild.setAttribute( "value", "" );
      return div.firstChild.getAttribute( "value" ) === "";
    }) ) {
      addHandle( "value", function( elem, name, isXML ) {
        if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
          return elem.defaultValue;
        }
      });
    }

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
    if ( !assert(function( div ) {
      return div.getAttribute("disabled") == null;
    }) ) {
      addHandle( booleans, function( elem, name, isXML ) {
        var val;
        if ( !isXML ) {
          return (val = elem.getAttributeNode( name )) && val.specified ?
            val.value :
            elem[ name ] === true ? name.toLowerCase() : null;
        }
      });
    }

    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[":"] = jQuery.expr.pseudos;
    jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;


  })( window );
// String to Object options format cache
  var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
  function createOptions( options ) {
    var object = optionsCache[ options ] = {};
    jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
      object[ flag ] = true;
    });
    return object;
  }

  /*
   * Create a callback list using the following parameters:
   *
   *	options: an optional list of space-separated options that will change how
   *			the callback list behaves or a more traditional option object
   *
   * By default a callback list will act like an event callback list and can be
   * "fired" multiple times.
   *
   * Possible options:
   *
   *	once:			will ensure the callback list can only be fired once (like a Deferred)
   *
   *	memory:			will keep track of previous values and will call any callback added
   *					after the list has been fired right away with the latest "memorized"
   *					values (like a Deferred)
   *
   *	unique:			will ensure a callback can only be added once (no duplicate in the list)
   *
   *	stopOnFalse:	interrupt callings when a callback returns false
   *
   */
  jQuery.Callbacks = function( options ) {

    // Convert options from String-formatted to Object-formatted if needed
    // (we check in cache first)
    options = typeof options === "string" ?
      ( optionsCache[ options ] || createOptions( options ) ) :
      jQuery.extend( {}, options );

    var // Flag to know if list is currently firing
      firing,
    // Last fire value (for non-forgettable lists)
      memory,
    // Flag to know if list was already fired
      fired,
    // End of the loop when firing
      firingLength,
    // Index of currently firing callback (modified by remove if needed)
      firingIndex,
    // First callback to fire (used internally by add and fireWith)
      firingStart,
    // Actual callback list
      list = [],
    // Stack of fire calls for repeatable lists
      stack = !options.once && [],
    // Fire callbacks
      fire = function( data ) {
        memory = options.memory && data;
        fired = true;
        firingIndex = firingStart || 0;
        firingStart = 0;
        firingLength = list.length;
        firing = true;
        for ( ; list && firingIndex < firingLength; firingIndex++ ) {
          if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
            memory = false; // To prevent further calls using add
            break;
          }
        }
        firing = false;
        if ( list ) {
          if ( stack ) {
            if ( stack.length ) {
              fire( stack.shift() );
            }
          } else if ( memory ) {
            list = [];
          } else {
            self.disable();
          }
        }
      },
    // Actual Callbacks object
      self = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          if ( list ) {
            // First, we save the current length
            var start = list.length;
            (function add( args ) {
              jQuery.each( args, function( _, arg ) {
                var type = jQuery.type( arg );
                if ( type === "function" ) {
                  if ( !options.unique || !self.has( arg ) ) {
                    list.push( arg );
                  }
                } else if ( arg && arg.length && type !== "string" ) {
                  // Inspect recursively
                  add( arg );
                }
              });
            })( arguments );
            // Do we need to add the callbacks to the
            // current firing batch?
            if ( firing ) {
              firingLength = list.length;
              // With memory, if we're not firing then
              // we should call right away
            } else if ( memory ) {
              firingStart = start;
              fire( memory );
            }
          }
          return this;
        },
        // Remove a callback from the list
        remove: function() {
          if ( list ) {
            jQuery.each( arguments, function( _, arg ) {
              var index;
              while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                list.splice( index, 1 );
                // Handle firing indexes
                if ( firing ) {
                  if ( index <= firingLength ) {
                    firingLength--;
                  }
                  if ( index <= firingIndex ) {
                    firingIndex--;
                  }
                }
              }
            });
          }
          return this;
        },
        // Check if a given callback is in the list.
        // If no argument is given, return whether or not list has callbacks attached.
        has: function( fn ) {
          return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
        },
        // Remove all callbacks from the list
        empty: function() {
          list = [];
          firingLength = 0;
          return this;
        },
        // Have the list do nothing anymore
        disable: function() {
          list = stack = memory = undefined;
          return this;
        },
        // Is it disabled?
        disabled: function() {
          return !list;
        },
        // Lock the list in its current state
        lock: function() {
          stack = undefined;
          if ( !memory ) {
            self.disable();
          }
          return this;
        },
        // Is it locked?
        locked: function() {
          return !stack;
        },
        // Call all callbacks with the given context and arguments
        fireWith: function( context, args ) {
          if ( list && ( !fired || stack ) ) {
            args = args || [];
            args = [ context, args.slice ? args.slice() : args ];
            if ( firing ) {
              stack.push( args );
            } else {
              fire( args );
            }
          }
          return this;
        },
        // Call all the callbacks with the given arguments
        fire: function() {
          self.fireWith( this, arguments );
          return this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
          return !!fired;
        }
      };

    return self;
  };
  jQuery.extend({

    Deferred: function( func ) {
      var tuples = [
          // action, add listener, listener list, final state
          [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
          [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
          [ "notify", "progress", jQuery.Callbacks("memory") ]
        ],
        state = "pending",
        promise = {
          state: function() {
            return state;
          },
          always: function() {
            deferred.done( arguments ).fail( arguments );
            return this;
          },
          then: function( /* fnDone, fnFail, fnProgress */ ) {
            var fns = arguments;
            return jQuery.Deferred(function( newDefer ) {
              jQuery.each( tuples, function( i, tuple ) {
                var action = tuple[ 0 ],
                  fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
                // deferred[ done | fail | progress ] for forwarding actions to newDefer
                deferred[ tuple[1] ](function() {
                  var returned = fn && fn.apply( this, arguments );
                  if ( returned && jQuery.isFunction( returned.promise ) ) {
                    returned.promise()
                      .done( newDefer.resolve )
                      .fail( newDefer.reject )
                      .progress( newDefer.notify );
                  } else {
                    newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
                  }
                });
              });
              fns = null;
            }).promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          promise: function( obj ) {
            return obj != null ? jQuery.extend( obj, promise ) : promise;
          }
        },
        deferred = {};

      // Keep pipe for back-compat
      promise.pipe = promise.then;

      // Add list-specific methods
      jQuery.each( tuples, function( i, tuple ) {
        var list = tuple[ 2 ],
          stateString = tuple[ 3 ];

        // promise[ done | fail | progress ] = list.add
        promise[ tuple[1] ] = list.add;

        // Handle state
        if ( stateString ) {
          list.add(function() {
            // state = [ resolved | rejected ]
            state = stateString;

            // [ reject_list | resolve_list ].disable; progress_list.lock
          }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
        }

        // deferred[ resolve | reject | notify ]
        deferred[ tuple[0] ] = function() {
          deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
          return this;
        };
        deferred[ tuple[0] + "With" ] = list.fireWith;
      });

      // Make the deferred a promise
      promise.promise( deferred );

      // Call given func if any
      if ( func ) {
        func.call( deferred, deferred );
      }

      // All done!
      return deferred;
    },

    // Deferred helper
    when: function( subordinate /* , ..., subordinateN */ ) {
      var i = 0,
        resolveValues = core_slice.call( arguments ),
        length = resolveValues.length,

      // the count of uncompleted subordinates
        remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

      // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
        deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

      // Update function for both resolve and progress values
        updateFunc = function( i, contexts, values ) {
          return function( value ) {
            contexts[ i ] = this;
            values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
            if( values === progressValues ) {
              deferred.notifyWith( contexts, values );
            } else if ( !( --remaining ) ) {
              deferred.resolveWith( contexts, values );
            }
          };
        },

        progressValues, progressContexts, resolveContexts;

      // add listeners to Deferred subordinates; treat others as resolved
      if ( length > 1 ) {
        progressValues = new Array( length );
        progressContexts = new Array( length );
        resolveContexts = new Array( length );
        for ( ; i < length; i++ ) {
          if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
            resolveValues[ i ].promise()
              .done( updateFunc( i, resolveContexts, resolveValues ) )
              .fail( deferred.reject )
              .progress( updateFunc( i, progressContexts, progressValues ) );
          } else {
            --remaining;
          }
        }
      }

      // if we're not waiting on anything, resolve the master
      if ( !remaining ) {
        deferred.resolveWith( resolveContexts, resolveValues );
      }

      return deferred.promise();
    }
  });
  jQuery.support = (function( support ) {

    var all, a, input, select, fragment, opt, eventName, isSupported, i,
      div = document.createElement("div");

    // Setup
    div.setAttribute( "className", "t" );
    div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

    // Finish early in limited (non-browser) environments
    all = div.getElementsByTagName("*") || [];
    a = div.getElementsByTagName("a")[ 0 ];
    if ( !a || !a.style || !all.length ) {
      return support;
    }

    // First batch of tests
    select = document.createElement("select");
    opt = select.appendChild( document.createElement("option") );
    input = div.getElementsByTagName("input")[ 0 ];

    a.style.cssText = "top:1px;float:left;opacity:.5";

    // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
    support.getSetAttribute = div.className !== "t";

    // IE strips leading whitespace when .innerHTML is used
    support.leadingWhitespace = div.firstChild.nodeType === 3;

    // Make sure that tbody elements aren't automatically inserted
    // IE will insert them into empty tables
    support.tbody = !div.getElementsByTagName("tbody").length;

    // Make sure that link elements get serialized correctly by innerHTML
    // This requires a wrapper element in IE
    support.htmlSerialize = !!div.getElementsByTagName("link").length;

    // Get the style information from getAttribute
    // (IE uses .cssText instead)
    support.style = /top/.test( a.getAttribute("style") );

    // Make sure that URLs aren't manipulated
    // (IE normalizes it by default)
    support.hrefNormalized = a.getAttribute("href") === "/a";

    // Make sure that element opacity exists
    // (IE uses filter instead)
    // Use a regex to work around a WebKit issue. See #5145
    support.opacity = /^0.5/.test( a.style.opacity );

    // Verify style float existence
    // (IE uses styleFloat instead of cssFloat)
    support.cssFloat = !!a.style.cssFloat;

    // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
    support.checkOn = !!input.value;

    // Make sure that a selected-by-default option has a working selected property.
    // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
    support.optSelected = opt.selected;

    // Tests for enctype support on a form (#6743)
    support.enctype = !!document.createElement("form").enctype;

    // Makes sure cloning an html5 element does not cause problems
    // Where outerHTML is undefined, this still works
    support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

    // Will be defined later
    support.inlineBlockNeedsLayout = false;
    support.shrinkWrapBlocks = false;
    support.pixelPosition = false;
    support.deleteExpando = true;
    support.noCloneEvent = true;
    support.reliableMarginRight = true;
    support.boxSizingReliable = true;

    // Make sure checked status is properly cloned
    input.checked = true;
    support.noCloneChecked = input.cloneNode( true ).checked;

    // Make sure that the options inside disabled selects aren't marked as disabled
    // (WebKit marks them as disabled)
    select.disabled = true;
    support.optDisabled = !opt.disabled;

    // Support: IE<9
    try {
      delete div.test;
    } catch( e ) {
      support.deleteExpando = false;
    }

    // Check if we can trust getAttribute("value")
    input = document.createElement("input");
    input.setAttribute( "value", "" );
    support.input = input.getAttribute( "value" ) === "";

    // Check if an input maintains its value after becoming a radio
    input.value = "t";
    input.setAttribute( "type", "radio" );
    support.radioValue = input.value === "t";

    // #11217 - WebKit loses check when the name is after the checked attribute
    input.setAttribute( "checked", "t" );
    input.setAttribute( "name", "t" );

    fragment = document.createDocumentFragment();
    fragment.appendChild( input );

    // Check if a disconnected checkbox will retain its checked
    // value of true after appended to the DOM (IE6/7)
    support.appendChecked = input.checked;

    // WebKit doesn't clone checked state correctly in fragments
    support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

    // Support: IE<9
    // Opera does not clone events (and typeof div.attachEvent === undefined).
    // IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
    if ( div.attachEvent ) {
      div.attachEvent( "onclick", function() {
        support.noCloneEvent = false;
      });

      div.cloneNode( true ).click();
    }

    // Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
    // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
    for ( i in { submit: true, change: true, focusin: true }) {
      div.setAttribute( eventName = "on" + i, "t" );

      support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
    }

    div.style.backgroundClip = "content-box";
    div.cloneNode( true ).style.backgroundClip = "";
    support.clearCloneStyle = div.style.backgroundClip === "content-box";

    // Support: IE<9
    // Iteration over object's inherited properties before its own.
    for ( i in jQuery( support ) ) {
      break;
    }
    support.ownLast = i !== "0";

    // Run tests that need a body at doc ready
    jQuery(function() {
      var container, marginDiv, tds,
        divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
        body = document.getElementsByTagName("body")[0];

      if ( !body ) {
        // Return for frameset docs that don't have a body
        return;
      }

      container = document.createElement("div");
      container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

      body.appendChild( container ).appendChild( div );

      // Support: IE8
      // Check if table cells still have offsetWidth/Height when they are set
      // to display:none and there are still other visible table cells in a
      // table row; if so, offsetWidth/Height are not reliable for use when
      // determining if an element has been hidden directly using
      // display:none (it is still safe to use offsets if a parent element is
      // hidden; don safety goggles and see bug #4512 for more information).
      div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
      tds = div.getElementsByTagName("td");
      tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
      isSupported = ( tds[ 0 ].offsetHeight === 0 );

      tds[ 0 ].style.display = "";
      tds[ 1 ].style.display = "none";

      // Support: IE8
      // Check if empty table cells still have offsetWidth/Height
      support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

      // Check box-sizing and margin behavior.
      div.innerHTML = "";
      div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

      // Workaround failing boxSizing test due to offsetWidth returning wrong value
      // with some non-1 values of body zoom, ticket #13543
      jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
        support.boxSizing = div.offsetWidth === 4;
      });

      // Use window.getComputedStyle because jsdom on node.js will break without it.
      if ( window.getComputedStyle ) {
        support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
        support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

        // Check if div with explicit width and no margin-right incorrectly
        // gets computed margin-right based on width of container. (#3333)
        // Fails in WebKit before Feb 2011 nightlies
        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
        marginDiv = div.appendChild( document.createElement("div") );
        marginDiv.style.cssText = div.style.cssText = divReset;
        marginDiv.style.marginRight = marginDiv.style.width = "0";
        div.style.width = "1px";

        support.reliableMarginRight =
          !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
      }

      if ( typeof div.style.zoom !== core_strundefined ) {
        // Support: IE<8
        // Check if natively block-level elements act like inline-block
        // elements when setting their display to 'inline' and giving
        // them layout
        div.innerHTML = "";
        div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
        support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

        // Support: IE6
        // Check if elements with layout shrink-wrap their children
        div.style.display = "block";
        div.innerHTML = "<div></div>";
        div.firstChild.style.width = "5px";
        support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

        if ( support.inlineBlockNeedsLayout ) {
          // Prevent IE 6 from affecting layout for positioned elements #11048
          // Prevent IE from shrinking the body in IE 7 mode #12869
          // Support: IE<8
          body.style.zoom = 1;
        }
      }

      body.removeChild( container );

      // Null elements to avoid leaks in IE
      container = div = tds = marginDiv = null;
    });

    // Null elements to avoid leaks in IE
    all = select = fragment = opt = a = input = null;

    return support;
  })({});

  var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
    rmultiDash = /([A-Z])/g;

  function internalData( elem, name, data, pvt /* Internal Use Only */ ){
    if ( !jQuery.acceptData( elem ) ) {
      return;
    }

    var ret, thisCache,
      internalKey = jQuery.expando,

    // We have to handle DOM nodes and JS objects differently because IE6-7
    // can't GC object references properly across the DOM-JS boundary
      isNode = elem.nodeType,

    // Only DOM nodes need the global jQuery cache; JS object data is
    // attached directly to the object so GC can occur automatically
      cache = isNode ? jQuery.cache : elem,

    // Only defining an ID for JS objects if its cache already exists allows
    // the code to shortcut on the same path as a DOM node with no cache
      id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

    // Avoid doing any more work than we need to when trying to get data on an
    // object that has no data at all
    if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
      return;
    }

    if ( !id ) {
      // Only DOM nodes need a new unique ID for each element since their data
      // ends up in the global cache
      if ( isNode ) {
        id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
      } else {
        id = internalKey;
      }
    }

    if ( !cache[ id ] ) {
      // Avoid exposing jQuery metadata on plain JS objects when the object
      // is serialized using JSON.stringify
      cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
    }

    // An object can be passed to jQuery.data instead of a key/value pair; this gets
    // shallow copied over onto the existing cache
    if ( typeof name === "object" || typeof name === "function" ) {
      if ( pvt ) {
        cache[ id ] = jQuery.extend( cache[ id ], name );
      } else {
        cache[ id ].data = jQuery.extend( cache[ id ].data, name );
      }
    }

    thisCache = cache[ id ];

    // jQuery data() is stored in a separate object inside the object's internal data
    // cache in order to avoid key collisions between internal data and user-defined
    // data.
    if ( !pvt ) {
      if ( !thisCache.data ) {
        thisCache.data = {};
      }

      thisCache = thisCache.data;
    }

    if ( data !== undefined ) {
      thisCache[ jQuery.camelCase( name ) ] = data;
    }

    // Check for both converted-to-camel and non-converted data property names
    // If a data property was specified
    if ( typeof name === "string" ) {

      // First Try to find as-is property data
      ret = thisCache[ name ];

      // Test for null|undefined property data
      if ( ret == null ) {

        // Try to find the camelCased property
        ret = thisCache[ jQuery.camelCase( name ) ];
      }
    } else {
      ret = thisCache;
    }

    return ret;
  }

  function internalRemoveData( elem, name, pvt ) {
    if ( !jQuery.acceptData( elem ) ) {
      return;
    }

    var thisCache, i,
      isNode = elem.nodeType,

    // See jQuery.data for more information
      cache = isNode ? jQuery.cache : elem,
      id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

    // If there is already no cache entry for this object, there is no
    // purpose in continuing
    if ( !cache[ id ] ) {
      return;
    }

    if ( name ) {

      thisCache = pvt ? cache[ id ] : cache[ id ].data;

      if ( thisCache ) {

        // Support array or space separated string names for data keys
        if ( !jQuery.isArray( name ) ) {

          // try the string as a key before any manipulation
          if ( name in thisCache ) {
            name = [ name ];
          } else {

            // split the camel cased version by spaces unless a key with the spaces exists
            name = jQuery.camelCase( name );
            if ( name in thisCache ) {
              name = [ name ];
            } else {
              name = name.split(" ");
            }
          }
        } else {
          // If "name" is an array of keys...
          // When data is initially created, via ("key", "val") signature,
          // keys will be converted to camelCase.
          // Since there is no way to tell _how_ a key was added, remove
          // both plain key and camelCase key. #12786
          // This will only penalize the array argument path.
          name = name.concat( jQuery.map( name, jQuery.camelCase ) );
        }

        i = name.length;
        while ( i-- ) {
          delete thisCache[ name[i] ];
        }

        // If there is no data left in the cache, we want to continue
        // and let the cache object itself get destroyed
        if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
          return;
        }
      }
    }

    // See jQuery.data for more information
    if ( !pvt ) {
      delete cache[ id ].data;

      // Don't destroy the parent cache unless the internal data object
      // had been the only thing left in it
      if ( !isEmptyDataObject( cache[ id ] ) ) {
        return;
      }
    }

    // Destroy the cache
    if ( isNode ) {
      jQuery.cleanData( [ elem ], true );

      // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
      /* jshint eqeqeq: false */
    } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
      /* jshint eqeqeq: true */
      delete cache[ id ];

      // When all else fails, null
    } else {
      cache[ id ] = null;
    }
  }

  jQuery.extend({
    cache: {},

    // The following elements throw uncatchable exceptions if you
    // attempt to add expando properties to them.
    noData: {
      "applet": true,
      "embed": true,
      // Ban all objects except for Flash (which handle expandos)
      "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
    },

    hasData: function( elem ) {
      elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
      return !!elem && !isEmptyDataObject( elem );
    },

    data: function( elem, name, data ) {
      return internalData( elem, name, data );
    },

    removeData: function( elem, name ) {
      return internalRemoveData( elem, name );
    },

    // For internal use only.
    _data: function( elem, name, data ) {
      return internalData( elem, name, data, true );
    },

    _removeData: function( elem, name ) {
      return internalRemoveData( elem, name, true );
    },

    // A method for determining if a DOM node can handle the data expando
    acceptData: function( elem ) {
      // Do not set data on non-element because it will not be cleared (#8335).
      if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
        return false;
      }

      var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

      // nodes accept data unless otherwise specified; rejection can be conditional
      return !noData || noData !== true && elem.getAttribute("classid") === noData;
    }
  });

  jQuery.fn.extend({
    data: function( key, value ) {
      var attrs, name,
        data = null,
        i = 0,
        elem = this[0];

      // Special expections of .data basically thwart jQuery.access,
      // so implement the relevant behavior ourselves

      // Gets all values
      if ( key === undefined ) {
        if ( this.length ) {
          data = jQuery.data( elem );

          if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
            attrs = elem.attributes;
            for ( ; i < attrs.length; i++ ) {
              name = attrs[i].name;

              if ( name.indexOf("data-") === 0 ) {
                name = jQuery.camelCase( name.slice(5) );

                dataAttr( elem, name, data[ name ] );
              }
            }
            jQuery._data( elem, "parsedAttrs", true );
          }
        }

        return data;
      }

      // Sets multiple values
      if ( typeof key === "object" ) {
        return this.each(function() {
          jQuery.data( this, key );
        });
      }

      return arguments.length > 1 ?

        // Sets one value
        this.each(function() {
          jQuery.data( this, key, value );
        }) :

        // Gets one value
        // Try to fetch any internally stored data first
        elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
    },

    removeData: function( key ) {
      return this.each(function() {
        jQuery.removeData( this, key );
      });
    }
  });

  function dataAttr( elem, key, data ) {
    // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute
    if ( data === undefined && elem.nodeType === 1 ) {

      var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

      data = elem.getAttribute( name );

      if ( typeof data === "string" ) {
        try {
          data = data === "true" ? true :
            data === "false" ? false :
              data === "null" ? null :
                // Only convert to a number if it doesn't change the string
                +data + "" === data ? +data :
                  rbrace.test( data ) ? jQuery.parseJSON( data ) :
                    data;
        } catch( e ) {}

        // Make sure we set the data so it isn't changed later
        jQuery.data( elem, key, data );

      } else {
        data = undefined;
      }
    }

    return data;
  }

// checks a cache object for emptiness
  function isEmptyDataObject( obj ) {
    var name;
    for ( name in obj ) {

      // if the public data object is empty, the private is still empty
      if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
        continue;
      }
      if ( name !== "toJSON" ) {
        return false;
      }
    }

    return true;
  }
  jQuery.extend({
    queue: function( elem, type, data ) {
      var queue;

      if ( elem ) {
        type = ( type || "fx" ) + "queue";
        queue = jQuery._data( elem, type );

        // Speed up dequeue by getting out quickly if this is just a lookup
        if ( data ) {
          if ( !queue || jQuery.isArray(data) ) {
            queue = jQuery._data( elem, type, jQuery.makeArray(data) );
          } else {
            queue.push( data );
          }
        }
        return queue || [];
      }
    },

    dequeue: function( elem, type ) {
      type = type || "fx";

      var queue = jQuery.queue( elem, type ),
        startLength = queue.length,
        fn = queue.shift(),
        hooks = jQuery._queueHooks( elem, type ),
        next = function() {
          jQuery.dequeue( elem, type );
        };

      // If the fx queue is dequeued, always remove the progress sentinel
      if ( fn === "inprogress" ) {
        fn = queue.shift();
        startLength--;
      }

      if ( fn ) {

        // Add a progress sentinel to prevent the fx queue from being
        // automatically dequeued
        if ( type === "fx" ) {
          queue.unshift( "inprogress" );
        }

        // clear up the last queue stop function
        delete hooks.stop;
        fn.call( elem, next, hooks );
      }

      if ( !startLength && hooks ) {
        hooks.empty.fire();
      }
    },

    // not intended for public consumption - generates a queueHooks object, or returns the current one
    _queueHooks: function( elem, type ) {
      var key = type + "queueHooks";
      return jQuery._data( elem, key ) || jQuery._data( elem, key, {
        empty: jQuery.Callbacks("once memory").add(function() {
          jQuery._removeData( elem, type + "queue" );
          jQuery._removeData( elem, key );
        })
      });
    }
  });

  jQuery.fn.extend({
    queue: function( type, data ) {
      var setter = 2;

      if ( typeof type !== "string" ) {
        data = type;
        type = "fx";
        setter--;
      }

      if ( arguments.length < setter ) {
        return jQuery.queue( this[0], type );
      }

      return data === undefined ?
        this :
        this.each(function() {
          var queue = jQuery.queue( this, type, data );

          // ensure a hooks for this queue
          jQuery._queueHooks( this, type );

          if ( type === "fx" && queue[0] !== "inprogress" ) {
            jQuery.dequeue( this, type );
          }
        });
    },
    dequeue: function( type ) {
      return this.each(function() {
        jQuery.dequeue( this, type );
      });
    },
    // Based off of the plugin by Clint Helfers, with permission.
    // http://blindsignals.com/index.php/2009/07/jquery-delay/
    delay: function( time, type ) {
      time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
      type = type || "fx";

      return this.queue( type, function( next, hooks ) {
        var timeout = setTimeout( next, time );
        hooks.stop = function() {
          clearTimeout( timeout );
        };
      });
    },
    clearQueue: function( type ) {
      return this.queue( type || "fx", [] );
    },
    // Get a promise resolved when queues of a certain type
    // are emptied (fx is the type by default)
    promise: function( type, obj ) {
      var tmp,
        count = 1,
        defer = jQuery.Deferred(),
        elements = this,
        i = this.length,
        resolve = function() {
          if ( !( --count ) ) {
            defer.resolveWith( elements, [ elements ] );
          }
        };

      if ( typeof type !== "string" ) {
        obj = type;
        type = undefined;
      }
      type = type || "fx";

      while( i-- ) {
        tmp = jQuery._data( elements[ i ], type + "queueHooks" );
        if ( tmp && tmp.empty ) {
          count++;
          tmp.empty.add( resolve );
        }
      }
      resolve();
      return defer.promise( obj );
    }
  });
  var nodeHook, boolHook,
    rclass = /[\t\r\n\f]/g,
    rreturn = /\r/g,
    rfocusable = /^(?:input|select|textarea|button|object)$/i,
    rclickable = /^(?:a|area)$/i,
    ruseDefault = /^(?:checked|selected)$/i,
    getSetAttribute = jQuery.support.getSetAttribute,
    getSetInput = jQuery.support.input;

  jQuery.fn.extend({
    attr: function( name, value ) {
      return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
    },

    removeAttr: function( name ) {
      return this.each(function() {
        jQuery.removeAttr( this, name );
      });
    },

    prop: function( name, value ) {
      return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
    },

    removeProp: function( name ) {
      name = jQuery.propFix[ name ] || name;
      return this.each(function() {
        // try/catch handles cases where IE balks (such as removing a property on window)
        try {
          this[ name ] = undefined;
          delete this[ name ];
        } catch( e ) {}
      });
    },

    addClass: function( value ) {
      var classes, elem, cur, clazz, j,
        i = 0,
        len = this.length,
        proceed = typeof value === "string" && value;

      if ( jQuery.isFunction( value ) ) {
        return this.each(function( j ) {
          jQuery( this ).addClass( value.call( this, j, this.className ) );
        });
      }

      if ( proceed ) {
        // The disjunction here is for better compressibility (see removeClass)
        classes = ( value || "" ).match( core_rnotwhite ) || [];

        for ( ; i < len; i++ ) {
          elem = this[ i ];
          cur = elem.nodeType === 1 && ( elem.className ?
            ( " " + elem.className + " " ).replace( rclass, " " ) :
            " "
            );

          if ( cur ) {
            j = 0;
            while ( (clazz = classes[j++]) ) {
              if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
                cur += clazz + " ";
              }
            }
            elem.className = jQuery.trim( cur );

          }
        }
      }

      return this;
    },

    removeClass: function( value ) {
      var classes, elem, cur, clazz, j,
        i = 0,
        len = this.length,
        proceed = arguments.length === 0 || typeof value === "string" && value;

      if ( jQuery.isFunction( value ) ) {
        return this.each(function( j ) {
          jQuery( this ).removeClass( value.call( this, j, this.className ) );
        });
      }
      if ( proceed ) {
        classes = ( value || "" ).match( core_rnotwhite ) || [];

        for ( ; i < len; i++ ) {
          elem = this[ i ];
          // This expression is here for better compressibility (see addClass)
          cur = elem.nodeType === 1 && ( elem.className ?
            ( " " + elem.className + " " ).replace( rclass, " " ) :
            ""
            );

          if ( cur ) {
            j = 0;
            while ( (clazz = classes[j++]) ) {
              // Remove *all* instances
              while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
                cur = cur.replace( " " + clazz + " ", " " );
              }
            }
            elem.className = value ? jQuery.trim( cur ) : "";
          }
        }
      }

      return this;
    },

    toggleClass: function( value, stateVal ) {
      var type = typeof value;

      if ( typeof stateVal === "boolean" && type === "string" ) {
        return stateVal ? this.addClass( value ) : this.removeClass( value );
      }

      if ( jQuery.isFunction( value ) ) {
        return this.each(function( i ) {
          jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
        });
      }

      return this.each(function() {
        if ( type === "string" ) {
          // toggle individual class names
          var className,
            i = 0,
            self = jQuery( this ),
            classNames = value.match( core_rnotwhite ) || [];

          while ( (className = classNames[ i++ ]) ) {
            // check each className given, space separated list
            if ( self.hasClass( className ) ) {
              self.removeClass( className );
            } else {
              self.addClass( className );
            }
          }

          // Toggle whole class name
        } else if ( type === core_strundefined || type === "boolean" ) {
          if ( this.className ) {
            // store className if set
            jQuery._data( this, "__className__", this.className );
          }

          // If the element has a class name or if we're passed "false",
          // then remove the whole classname (if there was one, the above saved it).
          // Otherwise bring back whatever was previously saved (if anything),
          // falling back to the empty string if nothing was stored.
          this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
        }
      });
    },

    hasClass: function( selector ) {
      var className = " " + selector + " ",
        i = 0,
        l = this.length;
      for ( ; i < l; i++ ) {
        if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
          return true;
        }
      }

      return false;
    },

    val: function( value ) {
      var ret, hooks, isFunction,
        elem = this[0];

      if ( !arguments.length ) {
        if ( elem ) {
          hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

          if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
            return ret;
          }

          ret = elem.value;

          return typeof ret === "string" ?
            // handle most common string cases
            ret.replace(rreturn, "") :
            // handle cases where value is null/undef or number
            ret == null ? "" : ret;
        }

        return;
      }

      isFunction = jQuery.isFunction( value );

      return this.each(function( i ) {
        var val;

        if ( this.nodeType !== 1 ) {
          return;
        }

        if ( isFunction ) {
          val = value.call( this, i, jQuery( this ).val() );
        } else {
          val = value;
        }

        // Treat null/undefined as ""; convert numbers to string
        if ( val == null ) {
          val = "";
        } else if ( typeof val === "number" ) {
          val += "";
        } else if ( jQuery.isArray( val ) ) {
          val = jQuery.map(val, function ( value ) {
            return value == null ? "" : value + "";
          });
        }

        hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

        // If set returns undefined, fall back to normal setting
        if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
          this.value = val;
        }
      });
    }
  });

  jQuery.extend({
    valHooks: {
      option: {
        get: function( elem ) {
          // Use proper attribute retrieval(#6932, #12072)
          var val = jQuery.find.attr( elem, "value" );
          return val != null ?
            val :
            elem.text;
        }
      },
      select: {
        get: function( elem ) {
          var value, option,
            options = elem.options,
            index = elem.selectedIndex,
            one = elem.type === "select-one" || index < 0,
            values = one ? null : [],
            max = one ? index + 1 : options.length,
            i = index < 0 ?
              max :
              one ? index : 0;

          // Loop through all the selected options
          for ( ; i < max; i++ ) {
            option = options[ i ];

            // oldIE doesn't update selected after form reset (#2551)
            if ( ( option.selected || i === index ) &&
              // Don't return options that are disabled or in a disabled optgroup
              ( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
              ( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

              // Get the specific value for the option
              value = jQuery( option ).val();

              // We don't need an array for one selects
              if ( one ) {
                return value;
              }

              // Multi-Selects return an array
              values.push( value );
            }
          }

          return values;
        },

        set: function( elem, value ) {
          var optionSet, option,
            options = elem.options,
            values = jQuery.makeArray( value ),
            i = options.length;

          while ( i-- ) {
            option = options[ i ];
            if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
              optionSet = true;
            }
          }

          // force browsers to behave consistently when non-matching value is set
          if ( !optionSet ) {
            elem.selectedIndex = -1;
          }
          return values;
        }
      }
    },

    attr: function( elem, name, value ) {
      var hooks, ret,
        nType = elem.nodeType;

      // don't get/set attributes on text, comment and attribute nodes
      if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
        return;
      }

      // Fallback to prop when attributes are not supported
      if ( typeof elem.getAttribute === core_strundefined ) {
        return jQuery.prop( elem, name, value );
      }

      // All attributes are lowercase
      // Grab necessary hook if one is defined
      if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
        name = name.toLowerCase();
        hooks = jQuery.attrHooks[ name ] ||
          ( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
      }

      if ( value !== undefined ) {

        if ( value === null ) {
          jQuery.removeAttr( elem, name );

        } else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
          return ret;

        } else {
          elem.setAttribute( name, value + "" );
          return value;
        }

      } else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
        return ret;

      } else {
        ret = jQuery.find.attr( elem, name );

        // Non-existent attributes return null, we normalize to undefined
        return ret == null ?
          undefined :
          ret;
      }
    },

    removeAttr: function( elem, value ) {
      var name, propName,
        i = 0,
        attrNames = value && value.match( core_rnotwhite );

      if ( attrNames && elem.nodeType === 1 ) {
        while ( (name = attrNames[i++]) ) {
          propName = jQuery.propFix[ name ] || name;

          // Boolean attributes get special treatment (#10870)
          if ( jQuery.expr.match.bool.test( name ) ) {
            // Set corresponding property to false
            if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
              elem[ propName ] = false;
              // Support: IE<9
              // Also clear defaultChecked/defaultSelected (if appropriate)
            } else {
              elem[ jQuery.camelCase( "default-" + name ) ] =
                elem[ propName ] = false;
            }

            // See #9699 for explanation of this approach (setting first, then removal)
          } else {
            jQuery.attr( elem, name, "" );
          }

          elem.removeAttribute( getSetAttribute ? name : propName );
        }
      }
    },

    attrHooks: {
      type: {
        set: function( elem, value ) {
          if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
            // Setting the type on a radio button after the value resets the value in IE6-9
            // Reset value to default in case type is set after value during creation
            var val = elem.value;
            elem.setAttribute( "type", value );
            if ( val ) {
              elem.value = val;
            }
            return value;
          }
        }
      }
    },

    propFix: {
      "for": "htmlFor",
      "class": "className"
    },

    prop: function( elem, name, value ) {
      var ret, hooks, notxml,
        nType = elem.nodeType;

      // don't get/set properties on text, comment and attribute nodes
      if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
        return;
      }

      notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

      if ( notxml ) {
        // Fix name and attach hooks
        name = jQuery.propFix[ name ] || name;
        hooks = jQuery.propHooks[ name ];
      }

      if ( value !== undefined ) {
        return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
          ret :
          ( elem[ name ] = value );

      } else {
        return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
          ret :
          elem[ name ];
      }
    },

    propHooks: {
      tabIndex: {
        get: function( elem ) {
          // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
          // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
          // Use proper attribute retrieval(#12072)
          var tabindex = jQuery.find.attr( elem, "tabindex" );

          return tabindex ?
            parseInt( tabindex, 10 ) :
            rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
              0 :
              -1;
        }
      }
    }
  });

// Hooks for boolean attributes
  boolHook = {
    set: function( elem, value, name ) {
      if ( value === false ) {
        // Remove boolean attributes when set to false
        jQuery.removeAttr( elem, name );
      } else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
        // IE<8 needs the *property* name
        elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

        // Use defaultChecked and defaultSelected for oldIE
      } else {
        elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
      }

      return name;
    }
  };
  jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
    var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

    jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
      function( elem, name, isXML ) {
        var fn = jQuery.expr.attrHandle[ name ],
          ret = isXML ?
            undefined :
            /* jshint eqeqeq: false */
            (jQuery.expr.attrHandle[ name ] = undefined) !=
              getter( elem, name, isXML ) ?

              name.toLowerCase() :
              null;
        jQuery.expr.attrHandle[ name ] = fn;
        return ret;
      } :
      function( elem, name, isXML ) {
        return isXML ?
          undefined :
          elem[ jQuery.camelCase( "default-" + name ) ] ?
            name.toLowerCase() :
            null;
      };
  });

// fix oldIE attroperties
  if ( !getSetInput || !getSetAttribute ) {
    jQuery.attrHooks.value = {
      set: function( elem, value, name ) {
        if ( jQuery.nodeName( elem, "input" ) ) {
          // Does not return so that setAttribute is also used
          elem.defaultValue = value;
        } else {
          // Use nodeHook if defined (#1954); otherwise setAttribute is fine
          return nodeHook && nodeHook.set( elem, value, name );
        }
      }
    };
  }

// IE6/7 do not support getting/setting some attributes with get/setAttribute
  if ( !getSetAttribute ) {

    // Use this for any attribute in IE6/7
    // This fixes almost every IE6/7 issue
    nodeHook = {
      set: function( elem, value, name ) {
        // Set the existing or create a new attribute node
        var ret = elem.getAttributeNode( name );
        if ( !ret ) {
          elem.setAttributeNode(
            (ret = elem.ownerDocument.createAttribute( name ))
          );
        }

        ret.value = value += "";

        // Break association with cloned elements by also using setAttribute (#9646)
        return name === "value" || value === elem.getAttribute( name ) ?
          value :
          undefined;
      }
    };
    jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
      // Some attributes are constructed with empty-string values when not defined
      function( elem, name, isXML ) {
        var ret;
        return isXML ?
          undefined :
          (ret = elem.getAttributeNode( name )) && ret.value !== "" ?
            ret.value :
            null;
      };
    jQuery.valHooks.button = {
      get: function( elem, name ) {
        var ret = elem.getAttributeNode( name );
        return ret && ret.specified ?
          ret.value :
          undefined;
      },
      set: nodeHook.set
    };

    // Set contenteditable to false on removals(#10429)
    // Setting to empty string throws an error as an invalid value
    jQuery.attrHooks.contenteditable = {
      set: function( elem, value, name ) {
        nodeHook.set( elem, value === "" ? false : value, name );
      }
    };

    // Set width and height to auto instead of 0 on empty string( Bug #8150 )
    // This is for removals
    jQuery.each([ "width", "height" ], function( i, name ) {
      jQuery.attrHooks[ name ] = {
        set: function( elem, value ) {
          if ( value === "" ) {
            elem.setAttribute( name, "auto" );
            return value;
          }
        }
      };
    });
  }


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
  if ( !jQuery.support.hrefNormalized ) {
    // href/src property should get the full normalized URL (#10299/#12915)
    jQuery.each([ "href", "src" ], function( i, name ) {
      jQuery.propHooks[ name ] = {
        get: function( elem ) {
          return elem.getAttribute( name, 4 );
        }
      };
    });
  }

  if ( !jQuery.support.style ) {
    jQuery.attrHooks.style = {
      get: function( elem ) {
        // Return undefined in the case of empty string
        // Note: IE uppercases css property names, but if we were to .toLowerCase()
        // .cssText, that would destroy case senstitivity in URL's, like in "background"
        return elem.style.cssText || undefined;
      },
      set: function( elem, value ) {
        return ( elem.style.cssText = value + "" );
      }
    };
  }

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
  if ( !jQuery.support.optSelected ) {
    jQuery.propHooks.selected = {
      get: function( elem ) {
        var parent = elem.parentNode;

        if ( parent ) {
          parent.selectedIndex;

          // Make sure that it also works with optgroups, see #5701
          if ( parent.parentNode ) {
            parent.parentNode.selectedIndex;
          }
        }
        return null;
      }
    };
  }

  jQuery.each([
    "tabIndex",
    "readOnly",
    "maxLength",
    "cellSpacing",
    "cellPadding",
    "rowSpan",
    "colSpan",
    "useMap",
    "frameBorder",
    "contentEditable"
  ], function() {
    jQuery.propFix[ this.toLowerCase() ] = this;
  });

// IE6/7 call enctype encoding
  if ( !jQuery.support.enctype ) {
    jQuery.propFix.enctype = "encoding";
  }

// Radios and checkboxes getter/setter
  jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = {
      set: function( elem, value ) {
        if ( jQuery.isArray( value ) ) {
          return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
        }
      }
    };
    if ( !jQuery.support.checkOn ) {
      jQuery.valHooks[ this ].get = function( elem ) {
        // Support: Webkit
        // "" is returned instead of "on" if a value isn't specified
        return elem.getAttribute("value") === null ? "on" : elem.value;
      };
    }
  });
  var rformElems = /^(?:input|select|textarea)$/i,
    rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|contextmenu)|click/,
    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

  function returnTrue() {
    return true;
  }

  function returnFalse() {
    return false;
  }

  function safeActiveElement() {
    try {
      return document.activeElement;
    } catch ( err ) { }
  }

  /*
   * Helper functions for managing events -- not part of the public interface.
   * Props to Dean Edwards' addEvent library for many of the ideas.
   */
  jQuery.event = {

    global: {},

    add: function( elem, types, handler, data, selector ) {
      var tmp, events, t, handleObjIn,
        special, eventHandle, handleObj,
        handlers, type, namespaces, origType,
        elemData = jQuery._data( elem );

      // Don't attach events to noData or text/comment nodes (but allow plain objects)
      if ( !elemData ) {
        return;
      }

      // Caller can pass in an object of custom data in lieu of the handler
      if ( handler.handler ) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
        selector = handleObjIn.selector;
      }

      // Make sure that the handler has a unique ID, used to find/remove it later
      if ( !handler.guid ) {
        handler.guid = jQuery.guid++;
      }

      // Init the element's event structure and main handler, if this is the first
      if ( !(events = elemData.events) ) {
        events = elemData.events = {};
      }
      if ( !(eventHandle = elemData.handle) ) {
        eventHandle = elemData.handle = function( e ) {
          // Discard the second event of a jQuery.event.trigger() and
          // when an event is called after a page has unloaded
          return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
            jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
            undefined;
        };
        // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
        eventHandle.elem = elem;
      }

      // Handle multiple events separated by a space
      types = ( types || "" ).match( core_rnotwhite ) || [""];
      t = types.length;
      while ( t-- ) {
        tmp = rtypenamespace.exec( types[t] ) || [];
        type = origType = tmp[1];
        namespaces = ( tmp[2] || "" ).split( "." ).sort();

        // There *must* be a type, no attaching namespace-only handlers
        if ( !type ) {
          continue;
        }

        // If event changes its type, use the special event handlers for the changed type
        special = jQuery.event.special[ type ] || {};

        // If selector defined, determine special event api type, otherwise given type
        type = ( selector ? special.delegateType : special.bindType ) || type;

        // Update special based on newly reset type
        special = jQuery.event.special[ type ] || {};

        // handleObj is passed to all event handlers
        handleObj = jQuery.extend({
          type: type,
          origType: origType,
          data: data,
          handler: handler,
          guid: handler.guid,
          selector: selector,
          needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
          namespace: namespaces.join(".")
        }, handleObjIn );

        // Init the event handler queue if we're the first
        if ( !(handlers = events[ type ]) ) {
          handlers = events[ type ] = [];
          handlers.delegateCount = 0;

          // Only use addEventListener/attachEvent if the special events handler returns false
          if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
            // Bind the global event handler to the element
            if ( elem.addEventListener ) {
              elem.addEventListener( type, eventHandle, false );

            } else if ( elem.attachEvent ) {
              elem.attachEvent( "on" + type, eventHandle );
            }
          }
        }

        if ( special.add ) {
          special.add.call( elem, handleObj );

          if ( !handleObj.handler.guid ) {
            handleObj.handler.guid = handler.guid;
          }
        }

        // Add to the element's handler list, delegates in front
        if ( selector ) {
          handlers.splice( handlers.delegateCount++, 0, handleObj );
        } else {
          handlers.push( handleObj );
        }

        // Keep track of which events have ever been used, for event optimization
        jQuery.event.global[ type ] = true;
      }

      // Nullify elem to prevent memory leaks in IE
      elem = null;
    },

    // Detach an event or set of events from an element
    remove: function( elem, types, handler, selector, mappedTypes ) {
      var j, handleObj, tmp,
        origCount, t, events,
        special, handlers, type,
        namespaces, origType,
        elemData = jQuery.hasData( elem ) && jQuery._data( elem );

      if ( !elemData || !(events = elemData.events) ) {
        return;
      }

      // Once for each type.namespace in types; type may be omitted
      types = ( types || "" ).match( core_rnotwhite ) || [""];
      t = types.length;
      while ( t-- ) {
        tmp = rtypenamespace.exec( types[t] ) || [];
        type = origType = tmp[1];
        namespaces = ( tmp[2] || "" ).split( "." ).sort();

        // Unbind all events (on this namespace, if provided) for the element
        if ( !type ) {
          for ( type in events ) {
            jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
          }
          continue;
        }

        special = jQuery.event.special[ type ] || {};
        type = ( selector ? special.delegateType : special.bindType ) || type;
        handlers = events[ type ] || [];
        tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

        // Remove matching events
        origCount = j = handlers.length;
        while ( j-- ) {
          handleObj = handlers[ j ];

          if ( ( mappedTypes || origType === handleObj.origType ) &&
            ( !handler || handler.guid === handleObj.guid ) &&
            ( !tmp || tmp.test( handleObj.namespace ) ) &&
            ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
            handlers.splice( j, 1 );

            if ( handleObj.selector ) {
              handlers.delegateCount--;
            }
            if ( special.remove ) {
              special.remove.call( elem, handleObj );
            }
          }
        }

        // Remove generic event handler if we removed something and no more handlers exist
        // (avoids potential for endless recursion during removal of special event handlers)
        if ( origCount && !handlers.length ) {
          if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
            jQuery.removeEvent( elem, type, elemData.handle );
          }

          delete events[ type ];
        }
      }

      // Remove the expando if it's no longer used
      if ( jQuery.isEmptyObject( events ) ) {
        delete elemData.handle;

        // removeData also checks for emptiness and clears the expando if empty
        // so use it instead of delete
        jQuery._removeData( elem, "events" );
      }
    },

    trigger: function( event, data, elem, onlyHandlers ) {
      var handle, ontype, cur,
        bubbleType, special, tmp, i,
        eventPath = [ elem || document ],
        type = core_hasOwn.call( event, "type" ) ? event.type : event,
        namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

      cur = tmp = elem = elem || document;

      // Don't do events on text and comment nodes
      if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
        return;
      }

      // focus/blur morphs to focusin/out; ensure we're not firing them right now
      if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
        return;
      }

      if ( type.indexOf(".") >= 0 ) {
        // Namespaced trigger; create a regexp to match event type in handle()
        namespaces = type.split(".");
        type = namespaces.shift();
        namespaces.sort();
      }
      ontype = type.indexOf(":") < 0 && "on" + type;

      // Caller can pass in a jQuery.Event object, Object, or just an event type string
      event = event[ jQuery.expando ] ?
        event :
        new jQuery.Event( type, typeof event === "object" && event );

      // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
      event.isTrigger = onlyHandlers ? 2 : 3;
      event.namespace = namespaces.join(".");
      event.namespace_re = event.namespace ?
        new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
        null;

      // Clean up the event in case it is being reused
      event.result = undefined;
      if ( !event.target ) {
        event.target = elem;
      }

      // Clone any incoming data and prepend the event, creating the handler arg list
      data = data == null ?
        [ event ] :
        jQuery.makeArray( data, [ event ] );

      // Allow special events to draw outside the lines
      special = jQuery.event.special[ type ] || {};
      if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
        return;
      }

      // Determine event propagation path in advance, per W3C events spec (#9951)
      // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
      if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

        bubbleType = special.delegateType || type;
        if ( !rfocusMorph.test( bubbleType + type ) ) {
          cur = cur.parentNode;
        }
        for ( ; cur; cur = cur.parentNode ) {
          eventPath.push( cur );
          tmp = cur;
        }

        // Only add window if we got to document (e.g., not plain obj or detached DOM)
        if ( tmp === (elem.ownerDocument || document) ) {
          eventPath.push( tmp.defaultView || tmp.parentWindow || window );
        }
      }

      // Fire handlers on the event path
      i = 0;
      while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

        event.type = i > 1 ?
          bubbleType :
          special.bindType || type;

        // jQuery handler
        handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
        if ( handle ) {
          handle.apply( cur, data );
        }

        // Native handler
        handle = ontype && cur[ ontype ];
        if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
          event.preventDefault();
        }
      }
      event.type = type;

      // If nobody prevented the default action, do it now
      if ( !onlyHandlers && !event.isDefaultPrevented() ) {

        if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
          jQuery.acceptData( elem ) ) {

          // Call a native DOM method on the target with the same name name as the event.
          // Can't use an .isFunction() check here because IE6/7 fails that test.
          // Don't do default actions on window, that's where global variables be (#6170)
          if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

            // Don't re-trigger an onFOO event when we call its FOO() method
            tmp = elem[ ontype ];

            if ( tmp ) {
              elem[ ontype ] = null;
            }

            // Prevent re-triggering of the same event, since we already bubbled it above
            jQuery.event.triggered = type;
            try {
              elem[ type ]();
            } catch ( e ) {
              // IE<9 dies on focus/blur to hidden element (#1486,#12518)
              // only reproducible on winXP IE8 native, not IE9 in IE8 mode
            }
            jQuery.event.triggered = undefined;

            if ( tmp ) {
              elem[ ontype ] = tmp;
            }
          }
        }
      }

      return event.result;
    },

    dispatch: function( event ) {

      // Make a writable jQuery.Event from the native event object
      event = jQuery.event.fix( event );

      var i, ret, handleObj, matched, j,
        handlerQueue = [],
        args = core_slice.call( arguments ),
        handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
        special = jQuery.event.special[ event.type ] || {};

      // Use the fix-ed jQuery.Event rather than the (read-only) native event
      args[0] = event;
      event.delegateTarget = this;

      // Call the preDispatch hook for the mapped type, and let it bail if desired
      if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
        return;
      }

      // Determine handlers
      handlerQueue = jQuery.event.handlers.call( this, event, handlers );

      // Run delegates first; they may want to stop propagation beneath us
      i = 0;
      while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
        event.currentTarget = matched.elem;

        j = 0;
        while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

          // Triggered event must either 1) have no namespace, or
          // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
          if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

            event.handleObj = handleObj;
            event.data = handleObj.data;

            ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
              .apply( matched.elem, args );

            if ( ret !== undefined ) {
              if ( (event.result = ret) === false ) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      }

      // Call the postDispatch hook for the mapped type
      if ( special.postDispatch ) {
        special.postDispatch.call( this, event );
      }

      return event.result;
    },

    handlers: function( event, handlers ) {
      var sel, handleObj, matches, i,
        handlerQueue = [],
        delegateCount = handlers.delegateCount,
        cur = event.target;

      // Find delegate handlers
      // Black-hole SVG <use> instance trees (#13180)
      // Avoid non-left-click bubbling in Firefox (#3861)
      if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

        /* jshint eqeqeq: false */
        for ( ; cur != this; cur = cur.parentNode || this ) {
          /* jshint eqeqeq: true */

          // Don't check non-elements (#13208)
          // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
          if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
            matches = [];
            for ( i = 0; i < delegateCount; i++ ) {
              handleObj = handlers[ i ];

              // Don't conflict with Object.prototype properties (#13203)
              sel = handleObj.selector + " ";

              if ( matches[ sel ] === undefined ) {
                matches[ sel ] = handleObj.needsContext ?
                  jQuery( sel, this ).index( cur ) >= 0 :
                  jQuery.find( sel, this, null, [ cur ] ).length;
              }
              if ( matches[ sel ] ) {
                matches.push( handleObj );
              }
            }
            if ( matches.length ) {
              handlerQueue.push({ elem: cur, handlers: matches });
            }
          }
        }
      }

      // Add the remaining (directly-bound) handlers
      if ( delegateCount < handlers.length ) {
        handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
      }

      return handlerQueue;
    },

    fix: function( event ) {
      if ( event[ jQuery.expando ] ) {
        return event;
      }

      // Create a writable copy of the event object and normalize some properties
      var i, prop, copy,
        type = event.type,
        originalEvent = event,
        fixHook = this.fixHooks[ type ];

      if ( !fixHook ) {
        this.fixHooks[ type ] = fixHook =
          rmouseEvent.test( type ) ? this.mouseHooks :
            rkeyEvent.test( type ) ? this.keyHooks :
            {};
      }
      copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

      event = new jQuery.Event( originalEvent );

      i = copy.length;
      while ( i-- ) {
        prop = copy[ i ];
        event[ prop ] = originalEvent[ prop ];
      }

      // Support: IE<9
      // Fix target property (#1925)
      if ( !event.target ) {
        event.target = originalEvent.srcElement || document;
      }

      // Support: Chrome 23+, Safari?
      // Target should not be a text node (#504, #13143)
      if ( event.target.nodeType === 3 ) {
        event.target = event.target.parentNode;
      }

      // Support: IE<9
      // For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
      event.metaKey = !!event.metaKey;

      return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
    },

    // Includes some event props shared by KeyEvent and MouseEvent
    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

    fixHooks: {},

    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function( event, original ) {

        // Add which for key events
        if ( event.which == null ) {
          event.which = original.charCode != null ? original.charCode : original.keyCode;
        }

        return event;
      }
    },

    mouseHooks: {
      props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
      filter: function( event, original ) {
        var body, eventDoc, doc,
          button = original.button,
          fromElement = original.fromElement;

        // Calculate pageX/Y if missing and clientX/Y available
        if ( event.pageX == null && original.clientX != null ) {
          eventDoc = event.target.ownerDocument || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;

          event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
          event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        // Add relatedTarget, if necessary
        if ( !event.relatedTarget && fromElement ) {
          event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
        }

        // Add which for click: 1 === left; 2 === middle; 3 === right
        // Note: button is not normalized, so don't use it
        if ( !event.which && button !== undefined ) {
          event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
        }

        return event;
      }
    },

    special: {
      load: {
        // Prevent triggered image.load events from bubbling to window.load
        noBubble: true
      },
      focus: {
        // Fire native event if possible so blur/focus sequence is correct
        trigger: function() {
          if ( this !== safeActiveElement() && this.focus ) {
            try {
              this.focus();
              return false;
            } catch ( e ) {
              // Support: IE<9
              // If we error on focus to hidden element (#1486, #12518),
              // let .trigger() run the handlers
            }
          }
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function() {
          if ( this === safeActiveElement() && this.blur ) {
            this.blur();
            return false;
          }
        },
        delegateType: "focusout"
      },
      click: {
        // For checkbox, fire native event so checked state will be right
        trigger: function() {
          if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
            this.click();
            return false;
          }
        },

        // For cross-browser consistency, don't fire native .click() on links
        _default: function( event ) {
          return jQuery.nodeName( event.target, "a" );
        }
      },

      beforeunload: {
        postDispatch: function( event ) {

          // Even when returnValue equals to undefined Firefox will still show alert
          if ( event.result !== undefined ) {
            event.originalEvent.returnValue = event.result;
          }
        }
      }
    },

    simulate: function( type, elem, event, bubble ) {
      // Piggyback on a donor event to simulate a different one.
      // Fake originalEvent to avoid donor's stopPropagation, but if the
      // simulated event prevents default then we do the same on the donor.
      var e = jQuery.extend(
        new jQuery.Event(),
        event,
        {
          type: type,
          isSimulated: true,
          originalEvent: {}
        }
      );
      if ( bubble ) {
        jQuery.event.trigger( e, null, elem );
      } else {
        jQuery.event.dispatch.call( elem, e );
      }
      if ( e.isDefaultPrevented() ) {
        event.preventDefault();
      }
    }
  };

  jQuery.removeEvent = document.removeEventListener ?
    function( elem, type, handle ) {
      if ( elem.removeEventListener ) {
        elem.removeEventListener( type, handle, false );
      }
    } :
    function( elem, type, handle ) {
      var name = "on" + type;

      if ( elem.detachEvent ) {

        // #8545, #7054, preventing memory leaks for custom events in IE6-8
        // detachEvent needed property on element, by name of that event, to properly expose it to GC
        if ( typeof elem[ name ] === core_strundefined ) {
          elem[ name ] = null;
        }

        elem.detachEvent( name, handle );
      }
    };

  jQuery.Event = function( src, props ) {
    // Allow instantiation without the 'new' keyword
    if ( !(this instanceof jQuery.Event) ) {
      return new jQuery.Event( src, props );
    }

    // Event object
    if ( src && src.type ) {
      this.originalEvent = src;
      this.type = src.type;

      // Events bubbling up the document may have been marked as prevented
      // by a handler lower down the tree; reflect the correct value.
      this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
        src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

      // Event type
    } else {
      this.type = src;
    }

    // Put explicitly provided properties onto the event object
    if ( props ) {
      jQuery.extend( this, props );
    }

    // Create a timestamp if incoming event doesn't have one
    this.timeStamp = src && src.timeStamp || jQuery.now();

    // Mark it as fixed
    this[ jQuery.expando ] = true;
  };

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
  jQuery.Event.prototype = {
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,

    preventDefault: function() {
      var e = this.originalEvent;

      this.isDefaultPrevented = returnTrue;
      if ( !e ) {
        return;
      }

      // If preventDefault exists, run it on the original event
      if ( e.preventDefault ) {
        e.preventDefault();

        // Support: IE
        // Otherwise set the returnValue property of the original event to false
      } else {
        e.returnValue = false;
      }
    },
    stopPropagation: function() {
      var e = this.originalEvent;

      this.isPropagationStopped = returnTrue;
      if ( !e ) {
        return;
      }
      // If stopPropagation exists, run it on the original event
      if ( e.stopPropagation ) {
        e.stopPropagation();
      }

      // Support: IE
      // Set the cancelBubble property of the original event to true
      e.cancelBubble = true;
    },
    stopImmediatePropagation: function() {
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    }
  };

// Create mouseenter/leave events using mouseover/out and event-time checks
  jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  }, function( orig, fix ) {
    jQuery.event.special[ orig ] = {
      delegateType: fix,
      bindType: fix,

      handle: function( event ) {
        var ret,
          target = this,
          related = event.relatedTarget,
          handleObj = event.handleObj;

        // For mousenter/leave call the handler if related is outside the target.
        // NB: No relatedTarget if the mouse left/entered the browser window
        if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
          event.type = handleObj.origType;
          ret = handleObj.handler.apply( this, arguments );
          event.type = fix;
        }
        return ret;
      }
    };
  });

// IE submit delegation
  if ( !jQuery.support.submitBubbles ) {

    jQuery.event.special.submit = {
      setup: function() {
        // Only need this for delegated form submit events
        if ( jQuery.nodeName( this, "form" ) ) {
          return false;
        }

        // Lazy-add a submit handler when a descendant form may potentially be submitted
        jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
          // Node name check avoids a VML-related crash in IE (#9807)
          var elem = e.target,
            form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
          if ( form && !jQuery._data( form, "submitBubbles" ) ) {
            jQuery.event.add( form, "submit._submit", function( event ) {
              event._submit_bubble = true;
            });
            jQuery._data( form, "submitBubbles", true );
          }
        });
        // return undefined since we don't need an event listener
      },

      postDispatch: function( event ) {
        // If form was submitted by the user, bubble the event up the tree
        if ( event._submit_bubble ) {
          delete event._submit_bubble;
          if ( this.parentNode && !event.isTrigger ) {
            jQuery.event.simulate( "submit", this.parentNode, event, true );
          }
        }
      },

      teardown: function() {
        // Only need this for delegated form submit events
        if ( jQuery.nodeName( this, "form" ) ) {
          return false;
        }

        // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
        jQuery.event.remove( this, "._submit" );
      }
    };
  }

// IE change delegation and checkbox/radio fix
  if ( !jQuery.support.changeBubbles ) {

    jQuery.event.special.change = {

      setup: function() {

        if ( rformElems.test( this.nodeName ) ) {
          // IE doesn't fire change on a check/radio until blur; trigger it on click
          // after a propertychange. Eat the blur-change in special.change.handle.
          // This still fires onchange a second time for check/radio after blur.
          if ( this.type === "checkbox" || this.type === "radio" ) {
            jQuery.event.add( this, "propertychange._change", function( event ) {
              if ( event.originalEvent.propertyName === "checked" ) {
                this._just_changed = true;
              }
            });
            jQuery.event.add( this, "click._change", function( event ) {
              if ( this._just_changed && !event.isTrigger ) {
                this._just_changed = false;
              }
              // Allow triggered, simulated change events (#11500)
              jQuery.event.simulate( "change", this, event, true );
            });
          }
          return false;
        }
        // Delegated event; lazy-add a change handler on descendant inputs
        jQuery.event.add( this, "beforeactivate._change", function( e ) {
          var elem = e.target;

          if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
            jQuery.event.add( elem, "change._change", function( event ) {
              if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
                jQuery.event.simulate( "change", this.parentNode, event, true );
              }
            });
            jQuery._data( elem, "changeBubbles", true );
          }
        });
      },

      handle: function( event ) {
        var elem = event.target;

        // Swallow native change events from checkbox/radio, we already triggered them above
        if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
          return event.handleObj.handler.apply( this, arguments );
        }
      },

      teardown: function() {
        jQuery.event.remove( this, "._change" );

        return !rformElems.test( this.nodeName );
      }
    };
  }

// Create "bubbling" focus and blur events
  if ( !jQuery.support.focusinBubbles ) {
    jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

      // Attach a single capturing handler while someone wants focusin/focusout
      var attaches = 0,
        handler = function( event ) {
          jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
        };

      jQuery.event.special[ fix ] = {
        setup: function() {
          if ( attaches++ === 0 ) {
            document.addEventListener( orig, handler, true );
          }
        },
        teardown: function() {
          if ( --attaches === 0 ) {
            document.removeEventListener( orig, handler, true );
          }
        }
      };
    });
  }

  jQuery.fn.extend({

    on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
      var type, origFn;

      // Types can be a map of types/handlers
      if ( typeof types === "object" ) {
        // ( types-Object, selector, data )
        if ( typeof selector !== "string" ) {
          // ( types-Object, data )
          data = data || selector;
          selector = undefined;
        }
        for ( type in types ) {
          this.on( type, selector, data, types[ type ], one );
        }
        return this;
      }

      if ( data == null && fn == null ) {
        // ( types, fn )
        fn = selector;
        data = selector = undefined;
      } else if ( fn == null ) {
        if ( typeof selector === "string" ) {
          // ( types, selector, fn )
          fn = data;
          data = undefined;
        } else {
          // ( types, data, fn )
          fn = data;
          data = selector;
          selector = undefined;
        }
      }
      if ( fn === false ) {
        fn = returnFalse;
      } else if ( !fn ) {
        return this;
      }

      if ( one === 1 ) {
        origFn = fn;
        fn = function( event ) {
          // Can use an empty set, since event contains the info
          jQuery().off( event );
          return origFn.apply( this, arguments );
        };
        // Use same guid so caller can remove using origFn
        fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
      }
      return this.each( function() {
        jQuery.event.add( this, types, fn, data, selector );
      });
    },
    one: function( types, selector, data, fn ) {
      return this.on( types, selector, data, fn, 1 );
    },
    off: function( types, selector, fn ) {
      var handleObj, type;
      if ( types && types.preventDefault && types.handleObj ) {
        // ( event )  dispatched jQuery.Event
        handleObj = types.handleObj;
        jQuery( types.delegateTarget ).off(
          handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
          handleObj.selector,
          handleObj.handler
        );
        return this;
      }
      if ( typeof types === "object" ) {
        // ( types-object [, selector] )
        for ( type in types ) {
          this.off( type, selector, types[ type ] );
        }
        return this;
      }
      if ( selector === false || typeof selector === "function" ) {
        // ( types [, fn] )
        fn = selector;
        selector = undefined;
      }
      if ( fn === false ) {
        fn = returnFalse;
      }
      return this.each(function() {
        jQuery.event.remove( this, types, fn, selector );
      });
    },

    trigger: function( type, data ) {
      return this.each(function() {
        jQuery.event.trigger( type, data, this );
      });
    },
    triggerHandler: function( type, data ) {
      var elem = this[0];
      if ( elem ) {
        return jQuery.event.trigger( type, data, elem, true );
      }
    }
  });
  var isSimple = /^.[^:#\[\.,]*$/,
    rparentsprev = /^(?:parents|prev(?:Until|All))/,
    rneedsContext = jQuery.expr.match.needsContext,
  // methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
      children: true,
      contents: true,
      next: true,
      prev: true
    };

  jQuery.fn.extend({
    find: function( selector ) {
      var i,
        ret = [],
        self = this,
        len = self.length;

      if ( typeof selector !== "string" ) {
        return this.pushStack( jQuery( selector ).filter(function() {
          for ( i = 0; i < len; i++ ) {
            if ( jQuery.contains( self[ i ], this ) ) {
              return true;
            }
          }
        }) );
      }

      for ( i = 0; i < len; i++ ) {
        jQuery.find( selector, self[ i ], ret );
      }

      // Needed because $( selector, context ) becomes $( context ).find( selector )
      ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
      ret.selector = this.selector ? this.selector + " " + selector : selector;
      return ret;
    },

    has: function( target ) {
      var i,
        targets = jQuery( target, this ),
        len = targets.length;

      return this.filter(function() {
        for ( i = 0; i < len; i++ ) {
          if ( jQuery.contains( this, targets[i] ) ) {
            return true;
          }
        }
      });
    },

    not: function( selector ) {
      return this.pushStack( winnow(this, selector || [], true) );
    },

    filter: function( selector ) {
      return this.pushStack( winnow(this, selector || [], false) );
    },

    is: function( selector ) {
      return !!winnow(
        this,

        // If this is a positional/relative selector, check membership in the returned set
        // so $("p:first").is("p:last") won't return true for a doc with two "p".
        typeof selector === "string" && rneedsContext.test( selector ) ?
          jQuery( selector ) :
          selector || [],
        false
      ).length;
    },

    closest: function( selectors, context ) {
      var cur,
        i = 0,
        l = this.length,
        ret = [],
        pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
          jQuery( selectors, context || this.context ) :
          0;

      for ( ; i < l; i++ ) {
        for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
          // Always skip document fragments
          if ( cur.nodeType < 11 && (pos ?
            pos.index(cur) > -1 :

            // Don't pass non-elements to Sizzle
            cur.nodeType === 1 &&
              jQuery.find.matchesSelector(cur, selectors)) ) {

            cur = ret.push( cur );
            break;
          }
        }
      }

      return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
    },

    // Determine the position of an element within
    // the matched set of elements
    index: function( elem ) {

      // No argument, return index in parent
      if ( !elem ) {
        return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
      }

      // index in selector
      if ( typeof elem === "string" ) {
        return jQuery.inArray( this[0], jQuery( elem ) );
      }

      // Locate the position of the desired element
      return jQuery.inArray(
        // If it receives a jQuery object, the first element is used
        elem.jquery ? elem[0] : elem, this );
    },

    add: function( selector, context ) {
      var set = typeof selector === "string" ?
          jQuery( selector, context ) :
          jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
        all = jQuery.merge( this.get(), set );

      return this.pushStack( jQuery.unique(all) );
    },

    addBack: function( selector ) {
      return this.add( selector == null ?
        this.prevObject : this.prevObject.filter(selector)
      );
    }
  });

  function sibling( cur, dir ) {
    do {
      cur = cur[ dir ];
    } while ( cur && cur.nodeType !== 1 );

    return cur;
  }

  jQuery.each({
    parent: function( elem ) {
      var parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function( elem ) {
      return jQuery.dir( elem, "parentNode" );
    },
    parentsUntil: function( elem, i, until ) {
      return jQuery.dir( elem, "parentNode", until );
    },
    next: function( elem ) {
      return sibling( elem, "nextSibling" );
    },
    prev: function( elem ) {
      return sibling( elem, "previousSibling" );
    },
    nextAll: function( elem ) {
      return jQuery.dir( elem, "nextSibling" );
    },
    prevAll: function( elem ) {
      return jQuery.dir( elem, "previousSibling" );
    },
    nextUntil: function( elem, i, until ) {
      return jQuery.dir( elem, "nextSibling", until );
    },
    prevUntil: function( elem, i, until ) {
      return jQuery.dir( elem, "previousSibling", until );
    },
    siblings: function( elem ) {
      return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
    },
    children: function( elem ) {
      return jQuery.sibling( elem.firstChild );
    },
    contents: function( elem ) {
      return jQuery.nodeName( elem, "iframe" ) ?
        elem.contentDocument || elem.contentWindow.document :
        jQuery.merge( [], elem.childNodes );
    }
  }, function( name, fn ) {
    jQuery.fn[ name ] = function( until, selector ) {
      var ret = jQuery.map( this, fn, until );

      if ( name.slice( -5 ) !== "Until" ) {
        selector = until;
      }

      if ( selector && typeof selector === "string" ) {
        ret = jQuery.filter( selector, ret );
      }

      if ( this.length > 1 ) {
        // Remove duplicates
        if ( !guaranteedUnique[ name ] ) {
          ret = jQuery.unique( ret );
        }

        // Reverse order for parents* and prev-derivatives
        if ( rparentsprev.test( name ) ) {
          ret = ret.reverse();
        }
      }

      return this.pushStack( ret );
    };
  });

  jQuery.extend({
    filter: function( expr, elems, not ) {
      var elem = elems[ 0 ];

      if ( not ) {
        expr = ":not(" + expr + ")";
      }

      return elems.length === 1 && elem.nodeType === 1 ?
        jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
        jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
          return elem.nodeType === 1;
        }));
    },

    dir: function( elem, dir, until ) {
      var matched = [],
        cur = elem[ dir ];

      while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
        if ( cur.nodeType === 1 ) {
          matched.push( cur );
        }
        cur = cur[dir];
      }
      return matched;
    },

    sibling: function( n, elem ) {
      var r = [];

      for ( ; n; n = n.nextSibling ) {
        if ( n.nodeType === 1 && n !== elem ) {
          r.push( n );
        }
      }

      return r;
    }
  });

// Implement the identical functionality for filter and not
  function winnow( elements, qualifier, not ) {
    if ( jQuery.isFunction( qualifier ) ) {
      return jQuery.grep( elements, function( elem, i ) {
        /* jshint -W018 */
        return !!qualifier.call( elem, i, elem ) !== not;
      });

    }

    if ( qualifier.nodeType ) {
      return jQuery.grep( elements, function( elem ) {
        return ( elem === qualifier ) !== not;
      });

    }

    if ( typeof qualifier === "string" ) {
      if ( isSimple.test( qualifier ) ) {
        return jQuery.filter( qualifier, elements, not );
      }

      qualifier = jQuery.filter( qualifier, elements );
    }

    return jQuery.grep( elements, function( elem ) {
      return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
    });
  }
  function createSafeFragment( document ) {
    var list = nodeNames.split( "|" ),
      safeFrag = document.createDocumentFragment();

    if ( safeFrag.createElement ) {
      while ( list.length ) {
        safeFrag.createElement(
          list.pop()
        );
      }
    }
    return safeFrag;
  }

  var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
      "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
    rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
    rleadingWhitespace = /^\s+/,
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    rtagName = /<([\w:]+)/,
    rtbody = /<tbody/i,
    rhtml = /<|&#?\w+;/,
    rnoInnerhtml = /<(?:script|style|link)/i,
    manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
  // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptType = /^$|\/(?:java|ecma)script/i,
    rscriptTypeMasked = /^true\/(.*)/,
    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

  // We have to close these tags to support XHTML (#13200)
    wrapMap = {
      option: [ 1, "<select multiple='multiple'>", "</select>" ],
      legend: [ 1, "<fieldset>", "</fieldset>" ],
      area: [ 1, "<map>", "</map>" ],
      param: [ 1, "<object>", "</object>" ],
      thead: [ 1, "<table>", "</table>" ],
      tr: [ 2, "<table><tbody>", "</tbody></table>" ],
      col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
      td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

      // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
      // unless wrapped in a div with non-breaking characters in front of it.
      _default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
    },
    safeFragment = createSafeFragment( document ),
    fragmentDiv = safeFragment.appendChild( document.createElement("div") );

  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;

  jQuery.fn.extend({
    text: function( value ) {
      return jQuery.access( this, function( value ) {
        return value === undefined ?
          jQuery.text( this ) :
          this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
      }, null, value, arguments.length );
    },

    append: function() {
      return this.domManip( arguments, function( elem ) {
        if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
          var target = manipulationTarget( this, elem );
          target.appendChild( elem );
        }
      });
    },

    prepend: function() {
      return this.domManip( arguments, function( elem ) {
        if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
          var target = manipulationTarget( this, elem );
          target.insertBefore( elem, target.firstChild );
        }
      });
    },

    before: function() {
      return this.domManip( arguments, function( elem ) {
        if ( this.parentNode ) {
          this.parentNode.insertBefore( elem, this );
        }
      });
    },

    after: function() {
      return this.domManip( arguments, function( elem ) {
        if ( this.parentNode ) {
          this.parentNode.insertBefore( elem, this.nextSibling );
        }
      });
    },

    // keepData is for internal use only--do not document
    remove: function( selector, keepData ) {
      var elem,
        elems = selector ? jQuery.filter( selector, this ) : this,
        i = 0;

      for ( ; (elem = elems[i]) != null; i++ ) {

        if ( !keepData && elem.nodeType === 1 ) {
          jQuery.cleanData( getAll( elem ) );
        }

        if ( elem.parentNode ) {
          if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
            setGlobalEval( getAll( elem, "script" ) );
          }
          elem.parentNode.removeChild( elem );
        }
      }

      return this;
    },

    empty: function() {
      var elem,
        i = 0;

      for ( ; (elem = this[i]) != null; i++ ) {
        // Remove element nodes and prevent memory leaks
        if ( elem.nodeType === 1 ) {
          jQuery.cleanData( getAll( elem, false ) );
        }

        // Remove any remaining nodes
        while ( elem.firstChild ) {
          elem.removeChild( elem.firstChild );
        }

        // If this is a select, ensure that it displays empty (#12336)
        // Support: IE<9
        if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
          elem.options.length = 0;
        }
      }

      return this;
    },

    clone: function( dataAndEvents, deepDataAndEvents ) {
      dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

      return this.map( function () {
        return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
      });
    },

    html: function( value ) {
      return jQuery.access( this, function( value ) {
        var elem = this[0] || {},
          i = 0,
          l = this.length;

        if ( value === undefined ) {
          return elem.nodeType === 1 ?
            elem.innerHTML.replace( rinlinejQuery, "" ) :
            undefined;
        }

        // See if we can take a shortcut and just use innerHTML
        if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
          ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
          ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
          !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

          value = value.replace( rxhtmlTag, "<$1></$2>" );

          try {
            for (; i < l; i++ ) {
              // Remove element nodes and prevent memory leaks
              elem = this[i] || {};
              if ( elem.nodeType === 1 ) {
                jQuery.cleanData( getAll( elem, false ) );
                elem.innerHTML = value;
              }
            }

            elem = 0;

            // If using innerHTML throws an exception, use the fallback method
          } catch(e) {}
        }

        if ( elem ) {
          this.empty().append( value );
        }
      }, null, value, arguments.length );
    },

    replaceWith: function() {
      var
      // Snapshot the DOM in case .domManip sweeps something relevant into its fragment
        args = jQuery.map( this, function( elem ) {
          return [ elem.nextSibling, elem.parentNode ];
        }),
        i = 0;

      // Make the changes, replacing each context element with the new content
      this.domManip( arguments, function( elem ) {
        var next = args[ i++ ],
          parent = args[ i++ ];

        if ( parent ) {
          // Don't use the snapshot next if it has moved (#13810)
          if ( next && next.parentNode !== parent ) {
            next = this.nextSibling;
          }
          jQuery( this ).remove();
          parent.insertBefore( elem, next );
        }
        // Allow new content to include elements from the context set
      }, true );

      // Force removal if there was no new content (e.g., from empty arguments)
      return i ? this : this.remove();
    },

    detach: function( selector ) {
      return this.remove( selector, true );
    },

    domManip: function( args, callback, allowIntersection ) {

      // Flatten any nested arrays
      args = core_concat.apply( [], args );

      var first, node, hasScripts,
        scripts, doc, fragment,
        i = 0,
        l = this.length,
        set = this,
        iNoClone = l - 1,
        value = args[0],
        isFunction = jQuery.isFunction( value );

      // We can't cloneNode fragments that contain checked, in WebKit
      if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
        return this.each(function( index ) {
          var self = set.eq( index );
          if ( isFunction ) {
            args[0] = value.call( this, index, self.html() );
          }
          self.domManip( args, callback, allowIntersection );
        });
      }

      if ( l ) {
        fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
        first = fragment.firstChild;

        if ( fragment.childNodes.length === 1 ) {
          fragment = first;
        }

        if ( first ) {
          scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
          hasScripts = scripts.length;

          // Use the original fragment for the last item instead of the first because it can end up
          // being emptied incorrectly in certain situations (#8070).
          for ( ; i < l; i++ ) {
            node = fragment;

            if ( i !== iNoClone ) {
              node = jQuery.clone( node, true, true );

              // Keep references to cloned scripts for later restoration
              if ( hasScripts ) {
                jQuery.merge( scripts, getAll( node, "script" ) );
              }
            }

            callback.call( this[i], node, i );
          }

          if ( hasScripts ) {
            doc = scripts[ scripts.length - 1 ].ownerDocument;

            // Reenable scripts
            jQuery.map( scripts, restoreScript );

            // Evaluate executable scripts on first document insertion
            for ( i = 0; i < hasScripts; i++ ) {
              node = scripts[ i ];
              if ( rscriptType.test( node.type || "" ) &&
                !jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

                if ( node.src ) {
                  // Hope ajax is available...
                  jQuery._evalUrl( node.src );
                } else {
                  jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
                }
              }
            }
          }

          // Fix #11809: Avoid leaking memory
          fragment = first = null;
        }
      }

      return this;
    }
  });

// Support: IE<8
// Manipulating tables requires a tbody
  function manipulationTarget( elem, content ) {
    return jQuery.nodeName( elem, "table" ) &&
      jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

      elem.getElementsByTagName("tbody")[0] ||
        elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
      elem;
  }

// Replace/restore the type attribute of script elements for safe DOM manipulation
  function disableScript( elem ) {
    elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
    return elem;
  }
  function restoreScript( elem ) {
    var match = rscriptTypeMasked.exec( elem.type );
    if ( match ) {
      elem.type = match[1];
    } else {
      elem.removeAttribute("type");
    }
    return elem;
  }

// Mark scripts as having already been evaluated
  function setGlobalEval( elems, refElements ) {
    var elem,
      i = 0;
    for ( ; (elem = elems[i]) != null; i++ ) {
      jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
    }
  }

  function cloneCopyEvent( src, dest ) {

    if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
      return;
    }

    var type, i, l,
      oldData = jQuery._data( src ),
      curData = jQuery._data( dest, oldData ),
      events = oldData.events;

    if ( events ) {
      delete curData.handle;
      curData.events = {};

      for ( type in events ) {
        for ( i = 0, l = events[ type ].length; i < l; i++ ) {
          jQuery.event.add( dest, type, events[ type ][ i ] );
        }
      }
    }

    // make the cloned public data object a copy from the original
    if ( curData.data ) {
      curData.data = jQuery.extend( {}, curData.data );
    }
  }

  function fixCloneNodeIssues( src, dest ) {
    var nodeName, e, data;

    // We do not need to do anything for non-Elements
    if ( dest.nodeType !== 1 ) {
      return;
    }

    nodeName = dest.nodeName.toLowerCase();

    // IE6-8 copies events bound via attachEvent when using cloneNode.
    if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
      data = jQuery._data( dest );

      for ( e in data.events ) {
        jQuery.removeEvent( dest, e, data.handle );
      }

      // Event data gets referenced instead of copied if the expando gets copied too
      dest.removeAttribute( jQuery.expando );
    }

    // IE blanks contents when cloning scripts, and tries to evaluate newly-set text
    if ( nodeName === "script" && dest.text !== src.text ) {
      disableScript( dest ).text = src.text;
      restoreScript( dest );

      // IE6-10 improperly clones children of object elements using classid.
      // IE10 throws NoModificationAllowedError if parent is null, #12132.
    } else if ( nodeName === "object" ) {
      if ( dest.parentNode ) {
        dest.outerHTML = src.outerHTML;
      }

      // This path appears unavoidable for IE9. When cloning an object
      // element in IE9, the outerHTML strategy above is not sufficient.
      // If the src has innerHTML and the destination does not,
      // copy the src.innerHTML into the dest.innerHTML. #10324
      if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
        dest.innerHTML = src.innerHTML;
      }

    } else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
      // IE6-8 fails to persist the checked state of a cloned checkbox
      // or radio button. Worse, IE6-7 fail to give the cloned element
      // a checked appearance if the defaultChecked value isn't also set

      dest.defaultChecked = dest.checked = src.checked;

      // IE6-7 get confused and end up setting the value of a cloned
      // checkbox/radio button to an empty string instead of "on"
      if ( dest.value !== src.value ) {
        dest.value = src.value;
      }

      // IE6-8 fails to return the selected option to the default selected
      // state when cloning options
    } else if ( nodeName === "option" ) {
      dest.defaultSelected = dest.selected = src.defaultSelected;

      // IE6-8 fails to set the defaultValue to the correct value when
      // cloning other types of input fields
    } else if ( nodeName === "input" || nodeName === "textarea" ) {
      dest.defaultValue = src.defaultValue;
    }
  }

  jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function( name, original ) {
    jQuery.fn[ name ] = function( selector ) {
      var elems,
        i = 0,
        ret = [],
        insert = jQuery( selector ),
        last = insert.length - 1;

      for ( ; i <= last; i++ ) {
        elems = i === last ? this : this.clone(true);
        jQuery( insert[i] )[ original ]( elems );

        // Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
        core_push.apply( ret, elems.get() );
      }

      return this.pushStack( ret );
    };
  });

  function getAll( context, tag ) {
    var elems, elem,
      i = 0,
      found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
        typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
          undefined;

    if ( !found ) {
      for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
        if ( !tag || jQuery.nodeName( elem, tag ) ) {
          found.push( elem );
        } else {
          jQuery.merge( found, getAll( elem, tag ) );
        }
      }
    }

    return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
      jQuery.merge( [ context ], found ) :
      found;
  }

// Used in buildFragment, fixes the defaultChecked property
  function fixDefaultChecked( elem ) {
    if ( manipulation_rcheckableType.test( elem.type ) ) {
      elem.defaultChecked = elem.checked;
    }
  }

  jQuery.extend({
    clone: function( elem, dataAndEvents, deepDataAndEvents ) {
      var destElements, node, clone, i, srcElements,
        inPage = jQuery.contains( elem.ownerDocument, elem );

      if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
        clone = elem.cloneNode( true );

        // IE<=8 does not properly clone detached, unknown element nodes
      } else {
        fragmentDiv.innerHTML = elem.outerHTML;
        fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
      }

      if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
        (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

        // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
        destElements = getAll( clone );
        srcElements = getAll( elem );

        // Fix all IE cloning issues
        for ( i = 0; (node = srcElements[i]) != null; ++i ) {
          // Ensure that the destination node is not null; Fixes #9587
          if ( destElements[i] ) {
            fixCloneNodeIssues( node, destElements[i] );
          }
        }
      }

      // Copy the events from the original to the clone
      if ( dataAndEvents ) {
        if ( deepDataAndEvents ) {
          srcElements = srcElements || getAll( elem );
          destElements = destElements || getAll( clone );

          for ( i = 0; (node = srcElements[i]) != null; i++ ) {
            cloneCopyEvent( node, destElements[i] );
          }
        } else {
          cloneCopyEvent( elem, clone );
        }
      }

      // Preserve script evaluation history
      destElements = getAll( clone, "script" );
      if ( destElements.length > 0 ) {
        setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
      }

      destElements = srcElements = node = null;

      // Return the cloned set
      return clone;
    },

    buildFragment: function( elems, context, scripts, selection ) {
      var j, elem, contains,
        tmp, tag, tbody, wrap,
        l = elems.length,

      // Ensure a safe fragment
        safe = createSafeFragment( context ),

        nodes = [],
        i = 0;

      for ( ; i < l; i++ ) {
        elem = elems[ i ];

        if ( elem || elem === 0 ) {

          // Add nodes directly
          if ( jQuery.type( elem ) === "object" ) {
            jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

            // Convert non-html into a text node
          } else if ( !rhtml.test( elem ) ) {
            nodes.push( context.createTextNode( elem ) );

            // Convert html into DOM nodes
          } else {
            tmp = tmp || safe.appendChild( context.createElement("div") );

            // Deserialize a standard representation
            tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
            wrap = wrapMap[ tag ] || wrapMap._default;

            tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

            // Descend through wrappers to the right content
            j = wrap[0];
            while ( j-- ) {
              tmp = tmp.lastChild;
            }

            // Manually add leading whitespace removed by IE
            if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
              nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
            }

            // Remove IE's autoinserted <tbody> from table fragments
            if ( !jQuery.support.tbody ) {

              // String was a <table>, *may* have spurious <tbody>
              elem = tag === "table" && !rtbody.test( elem ) ?
                tmp.firstChild :

                // String was a bare <thead> or <tfoot>
                wrap[1] === "<table>" && !rtbody.test( elem ) ?
                  tmp :
                  0;

              j = elem && elem.childNodes.length;
              while ( j-- ) {
                if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
                  elem.removeChild( tbody );
                }
              }
            }

            jQuery.merge( nodes, tmp.childNodes );

            // Fix #12392 for WebKit and IE > 9
            tmp.textContent = "";

            // Fix #12392 for oldIE
            while ( tmp.firstChild ) {
              tmp.removeChild( tmp.firstChild );
            }

            // Remember the top-level container for proper cleanup
            tmp = safe.lastChild;
          }
        }
      }

      // Fix #11356: Clear elements from fragment
      if ( tmp ) {
        safe.removeChild( tmp );
      }

      // Reset defaultChecked for any radios and checkboxes
      // about to be appended to the DOM in IE 6/7 (#8060)
      if ( !jQuery.support.appendChecked ) {
        jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
      }

      i = 0;
      while ( (elem = nodes[ i++ ]) ) {

        // #4087 - If origin and destination elements are the same, and this is
        // that element, do not do anything
        if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
          continue;
        }

        contains = jQuery.contains( elem.ownerDocument, elem );

        // Append to fragment
        tmp = getAll( safe.appendChild( elem ), "script" );

        // Preserve script evaluation history
        if ( contains ) {
          setGlobalEval( tmp );
        }

        // Capture executables
        if ( scripts ) {
          j = 0;
          while ( (elem = tmp[ j++ ]) ) {
            if ( rscriptType.test( elem.type || "" ) ) {
              scripts.push( elem );
            }
          }
        }
      }

      tmp = null;

      return safe;
    },

    cleanData: function( elems, /* internal */ acceptData ) {
      var elem, type, id, data,
        i = 0,
        internalKey = jQuery.expando,
        cache = jQuery.cache,
        deleteExpando = jQuery.support.deleteExpando,
        special = jQuery.event.special;

      for ( ; (elem = elems[i]) != null; i++ ) {

        if ( acceptData || jQuery.acceptData( elem ) ) {

          id = elem[ internalKey ];
          data = id && cache[ id ];

          if ( data ) {
            if ( data.events ) {
              for ( type in data.events ) {
                if ( special[ type ] ) {
                  jQuery.event.remove( elem, type );

                  // This is a shortcut to avoid jQuery.event.remove's overhead
                } else {
                  jQuery.removeEvent( elem, type, data.handle );
                }
              }
            }

            // Remove cache only if it was not already removed by jQuery.event.remove
            if ( cache[ id ] ) {

              delete cache[ id ];

              // IE does not allow us to delete expando properties from nodes,
              // nor does it have a removeAttribute function on Document nodes;
              // we must handle all of these cases
              if ( deleteExpando ) {
                delete elem[ internalKey ];

              } else if ( typeof elem.removeAttribute !== core_strundefined ) {
                elem.removeAttribute( internalKey );

              } else {
                elem[ internalKey ] = null;
              }

              core_deletedIds.push( id );
            }
          }
        }
      }
    },

    _evalUrl: function( url ) {
      return jQuery.ajax({
        url: url,
        type: "GET",
        dataType: "script",
        async: false,
        global: false,
        "throws": true
      });
    }
  });
  jQuery.fn.extend({
    wrapAll: function( html ) {
      if ( jQuery.isFunction( html ) ) {
        return this.each(function(i) {
          jQuery(this).wrapAll( html.call(this, i) );
        });
      }

      if ( this[0] ) {
        // The elements to wrap the target around
        var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

        if ( this[0].parentNode ) {
          wrap.insertBefore( this[0] );
        }

        wrap.map(function() {
          var elem = this;

          while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
            elem = elem.firstChild;
          }

          return elem;
        }).append( this );
      }

      return this;
    },

    wrapInner: function( html ) {
      if ( jQuery.isFunction( html ) ) {
        return this.each(function(i) {
          jQuery(this).wrapInner( html.call(this, i) );
        });
      }

      return this.each(function() {
        var self = jQuery( this ),
          contents = self.contents();

        if ( contents.length ) {
          contents.wrapAll( html );

        } else {
          self.append( html );
        }
      });
    },

    wrap: function( html ) {
      var isFunction = jQuery.isFunction( html );

      return this.each(function(i) {
        jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
      });
    },

    unwrap: function() {
      return this.parent().each(function() {
        if ( !jQuery.nodeName( this, "body" ) ) {
          jQuery( this ).replaceWith( this.childNodes );
        }
      }).end();
    }
  });
  var iframe, getStyles, curCSS,
    ralpha = /alpha\([^)]*\)/i,
    ropacity = /opacity\s*=\s*([^)]*)/,
    rposition = /^(top|right|bottom|left)$/,
  // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
  // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    rdisplayswap = /^(none|table(?!-c[ea]).+)/,
    rmargin = /^margin/,
    rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
    rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
    rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
    elemdisplay = { BODY: "block" },

    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    cssNormalTransform = {
      letterSpacing: 0,
      fontWeight: 400
    },

    cssExpand = [ "Top", "Right", "Bottom", "Left" ],
    cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
  function vendorPropName( style, name ) {

    // shortcut for names that are not vendor prefixed
    if ( name in style ) {
      return name;
    }

    // check for vendor prefixed names
    var capName = name.charAt(0).toUpperCase() + name.slice(1),
      origName = name,
      i = cssPrefixes.length;

    while ( i-- ) {
      name = cssPrefixes[ i ] + capName;
      if ( name in style ) {
        return name;
      }
    }

    return origName;
  }

  function isHidden( elem, el ) {
    // isHidden might be called from jQuery#filter function;
    // in that case, element will be second argument
    elem = el || elem;
    return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
  }

  function showHide( elements, show ) {
    var display, elem, hidden,
      values = [],
      index = 0,
      length = elements.length;

    for ( ; index < length; index++ ) {
      elem = elements[ index ];
      if ( !elem.style ) {
        continue;
      }

      values[ index ] = jQuery._data( elem, "olddisplay" );
      display = elem.style.display;
      if ( show ) {
        // Reset the inline display of this element to learn if it is
        // being hidden by cascaded rules or not
        if ( !values[ index ] && display === "none" ) {
          elem.style.display = "";
        }

        // Set elements which have been overridden with display: none
        // in a stylesheet to whatever the default browser style is
        // for such an element
        if ( elem.style.display === "" && isHidden( elem ) ) {
          values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
        }
      } else {

        if ( !values[ index ] ) {
          hidden = isHidden( elem );

          if ( display && display !== "none" || !hidden ) {
            jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
          }
        }
      }
    }

    // Set the display of most of the elements in a second loop
    // to avoid the constant reflow
    for ( index = 0; index < length; index++ ) {
      elem = elements[ index ];
      if ( !elem.style ) {
        continue;
      }
      if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
        elem.style.display = show ? values[ index ] || "" : "none";
      }
    }

    return elements;
  }

  jQuery.fn.extend({
    css: function( name, value ) {
      return jQuery.access( this, function( elem, name, value ) {
        var len, styles,
          map = {},
          i = 0;

        if ( jQuery.isArray( name ) ) {
          styles = getStyles( elem );
          len = name.length;

          for ( ; i < len; i++ ) {
            map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
          }

          return map;
        }

        return value !== undefined ?
          jQuery.style( elem, name, value ) :
          jQuery.css( elem, name );
      }, name, value, arguments.length > 1 );
    },
    show: function() {
      return showHide( this, true );
    },
    hide: function() {
      return showHide( this );
    },
    toggle: function( state ) {
      if ( typeof state === "boolean" ) {
        return state ? this.show() : this.hide();
      }

      return this.each(function() {
        if ( isHidden( this ) ) {
          jQuery( this ).show();
        } else {
          jQuery( this ).hide();
        }
      });
    }
  });

  jQuery.extend({
    // Add in style property hooks for overriding the default
    // behavior of getting and setting a style property
    cssHooks: {
      opacity: {
        get: function( elem, computed ) {
          if ( computed ) {
            // We should always get a number back from opacity
            var ret = curCSS( elem, "opacity" );
            return ret === "" ? "1" : ret;
          }
        }
      }
    },

    // Don't automatically add "px" to these possibly-unitless properties
    cssNumber: {
      "columnCount": true,
      "fillOpacity": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "order": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
    },

    // Add in properties whose names you wish to fix before
    // setting or getting the value
    cssProps: {
      // normalize float css property
      "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
    },

    // Get and set the style property on a DOM Node
    style: function( elem, name, value, extra ) {
      // Don't set styles on text and comment nodes
      if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
        return;
      }

      // Make sure that we're working with the right name
      var ret, type, hooks,
        origName = jQuery.camelCase( name ),
        style = elem.style;

      name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

      // gets hook for the prefixed version
      // followed by the unprefixed version
      hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

      // Check if we're setting a value
      if ( value !== undefined ) {
        type = typeof value;

        // convert relative number strings (+= or -=) to relative numbers. #7345
        if ( type === "string" && (ret = rrelNum.exec( value )) ) {
          value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
          // Fixes bug #9237
          type = "number";
        }

        // Make sure that NaN and null values aren't set. See: #7116
        if ( value == null || type === "number" && isNaN( value ) ) {
          return;
        }

        // If a number was passed in, add 'px' to the (except for certain CSS properties)
        if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
          value += "px";
        }

        // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
        // but it would mean to define eight (for every problematic property) identical functions
        if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
          style[ name ] = "inherit";
        }

        // If a hook was provided, use that value, otherwise just set the specified value
        if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

          // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
          // Fixes bug #5509
          try {
            style[ name ] = value;
          } catch(e) {}
        }

      } else {
        // If a hook was provided get the non-computed value from there
        if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
          return ret;
        }

        // Otherwise just get the value from the style object
        return style[ name ];
      }
    },

    css: function( elem, name, extra, styles ) {
      var num, val, hooks,
        origName = jQuery.camelCase( name );

      // Make sure that we're working with the right name
      name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

      // gets hook for the prefixed version
      // followed by the unprefixed version
      hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

      // If a hook was provided get the computed value from there
      if ( hooks && "get" in hooks ) {
        val = hooks.get( elem, true, extra );
      }

      // Otherwise, if a way to get the computed value exists, use that
      if ( val === undefined ) {
        val = curCSS( elem, name, styles );
      }

      //convert "normal" to computed value
      if ( val === "normal" && name in cssNormalTransform ) {
        val = cssNormalTransform[ name ];
      }

      // Return, converting to number if forced or a qualifier was provided and val looks numeric
      if ( extra === "" || extra ) {
        num = parseFloat( val );
        return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
      }
      return val;
    }
  });

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
  if ( window.getComputedStyle ) {
    getStyles = function( elem ) {
      return window.getComputedStyle( elem, null );
    };

    curCSS = function( elem, name, _computed ) {
      var width, minWidth, maxWidth,
        computed = _computed || getStyles( elem ),

      // getPropertyValue is only needed for .css('filter') in IE9, see #12537
        ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
        style = elem.style;

      if ( computed ) {

        if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
          ret = jQuery.style( elem, name );
        }

        // A tribute to the "awesome hack by Dean Edwards"
        // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
        // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
        // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
        if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

          // Remember the original values
          width = style.width;
          minWidth = style.minWidth;
          maxWidth = style.maxWidth;

          // Put in the new values to get a computed value out
          style.minWidth = style.maxWidth = style.width = ret;
          ret = computed.width;

          // Revert the changed values
          style.width = width;
          style.minWidth = minWidth;
          style.maxWidth = maxWidth;
        }
      }

      return ret;
    };
  } else if ( document.documentElement.currentStyle ) {
    getStyles = function( elem ) {
      return elem.currentStyle;
    };

    curCSS = function( elem, name, _computed ) {
      var left, rs, rsLeft,
        computed = _computed || getStyles( elem ),
        ret = computed ? computed[ name ] : undefined,
        style = elem.style;

      // Avoid setting ret to empty string here
      // so we don't default to auto
      if ( ret == null && style && style[ name ] ) {
        ret = style[ name ];
      }

      // From the awesome hack by Dean Edwards
      // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

      // If we're not dealing with a regular pixel number
      // but a number that has a weird ending, we need to convert it to pixels
      // but not position css attributes, as those are proportional to the parent element instead
      // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
      if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

        // Remember the original values
        left = style.left;
        rs = elem.runtimeStyle;
        rsLeft = rs && rs.left;

        // Put in the new values to get a computed value out
        if ( rsLeft ) {
          rs.left = elem.currentStyle.left;
        }
        style.left = name === "fontSize" ? "1em" : ret;
        ret = style.pixelLeft + "px";

        // Revert the changed values
        style.left = left;
        if ( rsLeft ) {
          rs.left = rsLeft;
        }
      }

      return ret === "" ? "auto" : ret;
    };
  }

  function setPositiveNumber( elem, value, subtract ) {
    var matches = rnumsplit.exec( value );
    return matches ?
      // Guard against undefined "subtract", e.g., when used as in cssHooks
      Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
      value;
  }

  function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
    var i = extra === ( isBorderBox ? "border" : "content" ) ?
        // If we already have the right measurement, avoid augmentation
        4 :
        // Otherwise initialize for horizontal or vertical properties
        name === "width" ? 1 : 0,

      val = 0;

    for ( ; i < 4; i += 2 ) {
      // both box models exclude margin, so add it if we want it
      if ( extra === "margin" ) {
        val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
      }

      if ( isBorderBox ) {
        // border-box includes padding, so remove it if we want content
        if ( extra === "content" ) {
          val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
        }

        // at this point, extra isn't border nor margin, so remove border
        if ( extra !== "margin" ) {
          val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
        }
      } else {
        // at this point, extra isn't content, so add padding
        val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

        // at this point, extra isn't content nor padding, so add border
        if ( extra !== "padding" ) {
          val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
        }
      }
    }

    return val;
  }

  function getWidthOrHeight( elem, name, extra ) {

    // Start with offset property, which is equivalent to the border-box value
    var valueIsBorderBox = true,
      val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
      styles = getStyles( elem ),
      isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

    // some non-html elements return undefined for offsetWidth, so check for null/undefined
    // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
    // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
    if ( val <= 0 || val == null ) {
      // Fall back to computed then uncomputed css if necessary
      val = curCSS( elem, name, styles );
      if ( val < 0 || val == null ) {
        val = elem.style[ name ];
      }

      // Computed unit is not pixels. Stop here and return.
      if ( rnumnonpx.test(val) ) {
        return val;
      }

      // we need the check for style in case a browser which returns unreliable values
      // for getComputedStyle silently falls back to the reliable elem.style
      valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

      // Normalize "", auto, and prepare for extra
      val = parseFloat( val ) || 0;
    }

    // use the active box-sizing model to add/subtract irrelevant styles
    return ( val +
      augmentWidthOrHeight(
        elem,
        name,
        extra || ( isBorderBox ? "border" : "content" ),
        valueIsBorderBox,
        styles
      )
      ) + "px";
  }

// Try to determine the default display value of an element
  function css_defaultDisplay( nodeName ) {
    var doc = document,
      display = elemdisplay[ nodeName ];

    if ( !display ) {
      display = actualDisplay( nodeName, doc );

      // If the simple way fails, read from inside an iframe
      if ( display === "none" || !display ) {
        // Use the already-created iframe if possible
        iframe = ( iframe ||
          jQuery("<iframe frameborder='0' width='0' height='0'/>")
            .css( "cssText", "display:block !important" )
          ).appendTo( doc.documentElement );

        // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
        doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
        doc.write("<!doctype html><html><body>");
        doc.close();

        display = actualDisplay( nodeName, doc );
        iframe.detach();
      }

      // Store the correct default display
      elemdisplay[ nodeName ] = display;
    }

    return display;
  }

// Called ONLY from within css_defaultDisplay
  function actualDisplay( name, doc ) {
    var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
      display = jQuery.css( elem[0], "display" );
    elem.remove();
    return display;
  }

  jQuery.each([ "height", "width" ], function( i, name ) {
    jQuery.cssHooks[ name ] = {
      get: function( elem, computed, extra ) {
        if ( computed ) {
          // certain elements can have dimension info if we invisibly show them
          // however, it must have a current display style that would benefit from this
          return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
            jQuery.swap( elem, cssShow, function() {
              return getWidthOrHeight( elem, name, extra );
            }) :
            getWidthOrHeight( elem, name, extra );
        }
      },

      set: function( elem, value, extra ) {
        var styles = extra && getStyles( elem );
        return setPositiveNumber( elem, value, extra ?
          augmentWidthOrHeight(
            elem,
            name,
            extra,
            jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
            styles
          ) : 0
        );
      }
    };
  });

  if ( !jQuery.support.opacity ) {
    jQuery.cssHooks.opacity = {
      get: function( elem, computed ) {
        // IE uses filters for opacity
        return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
          ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
          computed ? "1" : "";
      },

      set: function( elem, value ) {
        var style = elem.style,
          currentStyle = elem.currentStyle,
          opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
          filter = currentStyle && currentStyle.filter || style.filter || "";

        // IE has trouble with opacity if it does not have layout
        // Force it by setting the zoom level
        style.zoom = 1;

        // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
        // if value === "", then remove inline opacity #12685
        if ( ( value >= 1 || value === "" ) &&
          jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
          style.removeAttribute ) {

          // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
          // if "filter:" is present at all, clearType is disabled, we want to avoid this
          // style.removeAttribute is IE Only, but so apparently is this code path...
          style.removeAttribute( "filter" );

          // if there is no filter style applied in a css rule or unset inline opacity, we are done
          if ( value === "" || currentStyle && !currentStyle.filter ) {
            return;
          }
        }

        // otherwise, set new filter values
        style.filter = ralpha.test( filter ) ?
          filter.replace( ralpha, opacity ) :
          filter + " " + opacity;
      }
    };
  }

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
  jQuery(function() {
    if ( !jQuery.support.reliableMarginRight ) {
      jQuery.cssHooks.marginRight = {
        get: function( elem, computed ) {
          if ( computed ) {
            // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
            // Work around by temporarily setting element display to inline-block
            return jQuery.swap( elem, { "display": "inline-block" },
              curCSS, [ elem, "marginRight" ] );
          }
        }
      };
    }

    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // getComputedStyle returns percent when specified for top/left/bottom/right
    // rather than make the css module depend on the offset module, we just check for it here
    if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
      jQuery.each( [ "top", "left" ], function( i, prop ) {
        jQuery.cssHooks[ prop ] = {
          get: function( elem, computed ) {
            if ( computed ) {
              computed = curCSS( elem, prop );
              // if curCSS returns percentage, fallback to offset
              return rnumnonpx.test( computed ) ?
                jQuery( elem ).position()[ prop ] + "px" :
                computed;
            }
          }
        };
      });
    }

  });

  if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.hidden = function( elem ) {
      // Support: Opera <= 12.12
      // Opera reports offsetWidths and offsetHeights less than zero on some elements
      return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
        (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
    };

    jQuery.expr.filters.visible = function( elem ) {
      return !jQuery.expr.filters.hidden( elem );
    };
  }

// These hooks are used by animate to expand properties
  jQuery.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function( prefix, suffix ) {
    jQuery.cssHooks[ prefix + suffix ] = {
      expand: function( value ) {
        var i = 0,
          expanded = {},

        // assumes a single number if not a string
          parts = typeof value === "string" ? value.split(" ") : [ value ];

        for ( ; i < 4; i++ ) {
          expanded[ prefix + cssExpand[ i ] + suffix ] =
            parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
        }

        return expanded;
      }
    };

    if ( !rmargin.test( prefix ) ) {
      jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
    }
  });
  var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i;

  jQuery.fn.extend({
    serialize: function() {
      return jQuery.param( this.serializeArray() );
    },
    serializeArray: function() {
      return this.map(function(){
        // Can add propHook for "elements" to filter or add form elements
        var elements = jQuery.prop( this, "elements" );
        return elements ? jQuery.makeArray( elements ) : this;
      })
        .filter(function(){
          var type = this.type;
          // Use .is(":disabled") so that fieldset[disabled] works
          return this.name && !jQuery( this ).is( ":disabled" ) &&
            rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
            ( this.checked || !manipulation_rcheckableType.test( type ) );
        })
        .map(function( i, elem ){
          var val = jQuery( this ).val();

          return val == null ?
            null :
            jQuery.isArray( val ) ?
              jQuery.map( val, function( val ){
                return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
              }) :
            { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
        }).get();
    }
  });

//Serialize an array of form elements or a set of
//key/values into a query string
  jQuery.param = function( a, traditional ) {
    var prefix,
      s = [],
      add = function( key, value ) {
        // If value is a function, invoke it and return its value
        value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
        s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
      };

    // Set traditional to true for jQuery <= 1.3.2 behavior.
    if ( traditional === undefined ) {
      traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
    }

    // If an array was passed in, assume that it is an array of form elements.
    if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
      // Serialize the form elements
      jQuery.each( a, function() {
        add( this.name, this.value );
      });

    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for ( prefix in a ) {
        buildParams( prefix, a[ prefix ], traditional, add );
      }
    }

    // Return the resulting serialization
    return s.join( "&" ).replace( r20, "+" );
  };

  function buildParams( prefix, obj, traditional, add ) {
    var name;

    if ( jQuery.isArray( obj ) ) {
      // Serialize array item.
      jQuery.each( obj, function( i, v ) {
        if ( traditional || rbracket.test( prefix ) ) {
          // Treat each array item as a scalar.
          add( prefix, v );

        } else {
          // Item is non-scalar (array or object), encode its numeric index.
          buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
        }
      });

    } else if ( !traditional && jQuery.type( obj ) === "object" ) {
      // Serialize object item.
      for ( name in obj ) {
        buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
      }

    } else {
      // Serialize scalar item.
      add( prefix, obj );
    }
  }
  jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

    // Handle event binding
    jQuery.fn[ name ] = function( data, fn ) {
      return arguments.length > 0 ?
        this.on( name, null, data, fn ) :
        this.trigger( name );
    };
  });

  jQuery.fn.extend({
    hover: function( fnOver, fnOut ) {
      return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    },

    bind: function( types, data, fn ) {
      return this.on( types, null, data, fn );
    },
    unbind: function( types, fn ) {
      return this.off( types, null, fn );
    },

    delegate: function( selector, types, data, fn ) {
      return this.on( types, selector, data, fn );
    },
    undelegate: function( selector, types, fn ) {
      // ( namespace ) or ( selector, types [, fn] )
      return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
    }
  });
  var
  // Document location
    ajaxLocParts,
    ajaxLocation,
    ajax_nonce = jQuery.now(),

    ajax_rquery = /\?/,
    rhash = /#.*$/,
    rts = /([?&])_=[^&]*/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
  // #7653, #8125, #8152: local protocol detection
    rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

  // Keep a copy of the old load method
    _load = jQuery.fn.load,

  /* Prefilters
   * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
   * 2) These are called:
   *    - BEFORE asking for a transport
   *    - AFTER param serialization (s.data is a string if s.processData is true)
   * 3) key is the dataType
   * 4) the catchall symbol "*" can be used
   * 5) execution will start with transport dataType and THEN continue down to "*" if needed
   */
    prefilters = {},

  /* Transports bindings
   * 1) key is the dataType
   * 2) the catchall symbol "*" can be used
   * 3) selection will start with transport dataType and THEN go to "*" if needed
   */
    transports = {},

  // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
  try {
    ajaxLocation = location.href;
  } catch( e ) {
    // Use the href attribute of an A element
    // since IE will modify it given document.location
    ajaxLocation = document.createElement( "a" );
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
  }

// Segment location into parts
  ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
  function addToPrefiltersOrTransports( structure ) {

    // dataTypeExpression is optional and defaults to "*"
    return function( dataTypeExpression, func ) {

      if ( typeof dataTypeExpression !== "string" ) {
        func = dataTypeExpression;
        dataTypeExpression = "*";
      }

      var dataType,
        i = 0,
        dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

      if ( jQuery.isFunction( func ) ) {
        // For each dataType in the dataTypeExpression
        while ( (dataType = dataTypes[i++]) ) {
          // Prepend if requested
          if ( dataType[0] === "+" ) {
            dataType = dataType.slice( 1 ) || "*";
            (structure[ dataType ] = structure[ dataType ] || []).unshift( func );

            // Otherwise append
          } else {
            (structure[ dataType ] = structure[ dataType ] || []).push( func );
          }
        }
      }
    };
  }

// Base inspection function for prefilters and transports
  function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

    var inspected = {},
      seekingTransport = ( structure === transports );

    function inspect( dataType ) {
      var selected;
      inspected[ dataType ] = true;
      jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
        var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
        if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
          options.dataTypes.unshift( dataTypeOrTransport );
          inspect( dataTypeOrTransport );
          return false;
        } else if ( seekingTransport ) {
          return !( selected = dataTypeOrTransport );
        }
      });
      return selected;
    }

    return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
  }

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
  function ajaxExtend( target, src ) {
    var deep, key,
      flatOptions = jQuery.ajaxSettings.flatOptions || {};

    for ( key in src ) {
      if ( src[ key ] !== undefined ) {
        ( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
      }
    }
    if ( deep ) {
      jQuery.extend( true, target, deep );
    }

    return target;
  }

  jQuery.fn.load = function( url, params, callback ) {
    if ( typeof url !== "string" && _load ) {
      return _load.apply( this, arguments );
    }

    var selector, response, type,
      self = this,
      off = url.indexOf(" ");

    if ( off >= 0 ) {
      selector = url.slice( off, url.length );
      url = url.slice( 0, off );
    }

    // If it's a function
    if ( jQuery.isFunction( params ) ) {

      // We assume that it's the callback
      callback = params;
      params = undefined;

      // Otherwise, build a param string
    } else if ( params && typeof params === "object" ) {
      type = "POST";
    }

    // If we have elements to modify, make the request
    if ( self.length > 0 ) {
      jQuery.ajax({
        url: url,

        // if "type" variable is undefined, then "GET" method will be used
        type: type,
        dataType: "html",
        data: params
      }).done(function( responseText ) {

          // Save response for use in complete callback
          response = arguments;

          self.html( selector ?

            // If a selector was specified, locate the right elements in a dummy div
            // Exclude scripts to avoid IE 'Permission Denied' errors
            jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

            // Otherwise use the full result
            responseText );

        }).complete( callback && function( jqXHR, status ) {
          self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
        });
    }

    return this;
  };

// Attach a bunch of functions for handling common AJAX events
  jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
    jQuery.fn[ type ] = function( fn ){
      return this.on( type, fn );
    };
  });

  jQuery.extend({

    // Counter for holding the number of active queries
    active: 0,

    // Last-Modified header cache for next request
    lastModified: {},
    etag: {},

    ajaxSettings: {
      url: ajaxLocation,
      type: "GET",
      isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
      global: true,
      processData: true,
      async: true,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      /*
       timeout: 0,
       data: null,
       dataType: null,
       username: null,
       password: null,
       cache: null,
       throws: false,
       traditional: false,
       headers: {},
       */

      accepts: {
        "*": allTypes,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },

      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },

      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },

      // Data converters
      // Keys separate source (or catchall "*") and destination types with a single space
      converters: {

        // Convert anything to text
        "* text": String,

        // Text to html (true = no transformation)
        "text html": true,

        // Evaluate text as a json expression
        "text json": jQuery.parseJSON,

        // Parse text as xml
        "text xml": jQuery.parseXML
      },

      // For options that shouldn't be deep extended:
      // you can add your own custom options here if
      // and when you create one that shouldn't be
      // deep extended (see ajaxExtend)
      flatOptions: {
        url: true,
        context: true
      }
    },

    // Creates a full fledged settings object into target
    // with both ajaxSettings and settings fields.
    // If target is omitted, writes into ajaxSettings.
    ajaxSetup: function( target, settings ) {
      return settings ?

        // Building a settings object
        ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

        // Extending ajaxSettings
        ajaxExtend( jQuery.ajaxSettings, target );
    },

    ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    ajaxTransport: addToPrefiltersOrTransports( transports ),

    // Main method
    ajax: function( url, options ) {

      // If url is an object, simulate pre-1.5 signature
      if ( typeof url === "object" ) {
        options = url;
        url = undefined;
      }

      // Force options to be an object
      options = options || {};

      var // Cross-domain detection vars
        parts,
      // Loop variable
        i,
      // URL without anti-cache param
        cacheURL,
      // Response headers as string
        responseHeadersString,
      // timeout handle
        timeoutTimer,

      // To know if global events are to be dispatched
        fireGlobals,

        transport,
      // Response headers
        responseHeaders,
      // Create the final options object
        s = jQuery.ajaxSetup( {}, options ),
      // Callbacks context
        callbackContext = s.context || s,
      // Context for global events is callbackContext if it is a DOM node or jQuery collection
        globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
          jQuery( callbackContext ) :
          jQuery.event,
      // Deferreds
        deferred = jQuery.Deferred(),
        completeDeferred = jQuery.Callbacks("once memory"),
      // Status-dependent callbacks
        statusCode = s.statusCode || {},
      // Headers (they are sent all at once)
        requestHeaders = {},
        requestHeadersNames = {},
      // The jqXHR state
        state = 0,
      // Default abort message
        strAbort = "canceled",
      // Fake xhr
        jqXHR = {
          readyState: 0,

          // Builds headers hashtable if needed
          getResponseHeader: function( key ) {
            var match;
            if ( state === 2 ) {
              if ( !responseHeaders ) {
                responseHeaders = {};
                while ( (match = rheaders.exec( responseHeadersString )) ) {
                  responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                }
              }
              match = responseHeaders[ key.toLowerCase() ];
            }
            return match == null ? null : match;
          },

          // Raw string
          getAllResponseHeaders: function() {
            return state === 2 ? responseHeadersString : null;
          },

          // Caches the header
          setRequestHeader: function( name, value ) {
            var lname = name.toLowerCase();
            if ( !state ) {
              name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
              requestHeaders[ name ] = value;
            }
            return this;
          },

          // Overrides response content-type header
          overrideMimeType: function( type ) {
            if ( !state ) {
              s.mimeType = type;
            }
            return this;
          },

          // Status-dependent callbacks
          statusCode: function( map ) {
            var code;
            if ( map ) {
              if ( state < 2 ) {
                for ( code in map ) {
                  // Lazy-add the new callback in a way that preserves old ones
                  statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
                }
              } else {
                // Execute the appropriate callbacks
                jqXHR.always( map[ jqXHR.status ] );
              }
            }
            return this;
          },

          // Cancel the request
          abort: function( statusText ) {
            var finalText = statusText || strAbort;
            if ( transport ) {
              transport.abort( finalText );
            }
            done( 0, finalText );
            return this;
          }
        };

      // Attach deferreds
      deferred.promise( jqXHR ).complete = completeDeferred.add;
      jqXHR.success = jqXHR.done;
      jqXHR.error = jqXHR.fail;

      // Remove hash character (#7531: and string promotion)
      // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
      // Handle falsy url in the settings object (#10093: consistency with old signature)
      // We also use the url parameter if available
      s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

      // Alias method option to type as per ticket #12004
      s.type = options.method || options.type || s.method || s.type;

      // Extract dataTypes list
      s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

      // A cross-domain request is in order when we have a protocol:host:port mismatch
      if ( s.crossDomain == null ) {
        parts = rurl.exec( s.url.toLowerCase() );
        s.crossDomain = !!( parts &&
          ( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
            ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
              ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
          );
      }

      // Convert data if not already a string
      if ( s.data && s.processData && typeof s.data !== "string" ) {
        s.data = jQuery.param( s.data, s.traditional );
      }

      // Apply prefilters
      inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

      // If request was aborted inside a prefilter, stop there
      if ( state === 2 ) {
        return jqXHR;
      }

      // We can fire global events as of now if asked to
      fireGlobals = s.global;

      // Watch for a new set of requests
      if ( fireGlobals && jQuery.active++ === 0 ) {
        jQuery.event.trigger("ajaxStart");
      }

      // Uppercase the type
      s.type = s.type.toUpperCase();

      // Determine if request has content
      s.hasContent = !rnoContent.test( s.type );

      // Save the URL in case we're toying with the If-Modified-Since
      // and/or If-None-Match header later on
      cacheURL = s.url;

      // More options handling for requests with no content
      if ( !s.hasContent ) {

        // If data is available, append data to url
        if ( s.data ) {
          cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
          // #9682: remove data so that it's not used in an eventual retry
          delete s.data;
        }

        // Add anti-cache in url if needed
        if ( s.cache === false ) {
          s.url = rts.test( cacheURL ) ?

            // If there is already a '_' parameter, set its value
            cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

            // Otherwise add one to the end
            cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
        }
      }

      // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
      if ( s.ifModified ) {
        if ( jQuery.lastModified[ cacheURL ] ) {
          jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
        }
        if ( jQuery.etag[ cacheURL ] ) {
          jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
        }
      }

      // Set the correct header, if data is being sent
      if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
        jqXHR.setRequestHeader( "Content-Type", s.contentType );
      }

      // Set the Accepts header for the server, depending on the dataType
      jqXHR.setRequestHeader(
        "Accept",
        s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
          s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
          s.accepts[ "*" ]
      );

      // Check for headers option
      for ( i in s.headers ) {
        jqXHR.setRequestHeader( i, s.headers[ i ] );
      }

      // Allow custom headers/mimetypes and early abort
      if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
        // Abort if not done already and return
        return jqXHR.abort();
      }

      // aborting is no longer a cancellation
      strAbort = "abort";

      // Install callbacks on deferreds
      for ( i in { success: 1, error: 1, complete: 1 } ) {
        jqXHR[ i ]( s[ i ] );
      }

      // Get transport
      transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

      // If no transport, we auto-abort
      if ( !transport ) {
        done( -1, "No Transport" );
      } else {
        jqXHR.readyState = 1;

        // Send global event
        if ( fireGlobals ) {
          globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
        }
        // Timeout
        if ( s.async && s.timeout > 0 ) {
          timeoutTimer = setTimeout(function() {
            jqXHR.abort("timeout");
          }, s.timeout );
        }

        try {
          state = 1;
          transport.send( requestHeaders, done );
        } catch ( e ) {
          // Propagate exception as error if not done
          if ( state < 2 ) {
            done( -1, e );
            // Simply rethrow otherwise
          } else {
            throw e;
          }
        }
      }

      // Callback for when everything is done
      function done( status, nativeStatusText, responses, headers ) {
        var isSuccess, success, error, response, modified,
          statusText = nativeStatusText;

        // Called once
        if ( state === 2 ) {
          return;
        }

        // State is "done" now
        state = 2;

        // Clear timeout if it exists
        if ( timeoutTimer ) {
          clearTimeout( timeoutTimer );
        }

        // Dereference transport for early garbage collection
        // (no matter how long the jqXHR object will be used)
        transport = undefined;

        // Cache response headers
        responseHeadersString = headers || "";

        // Set readyState
        jqXHR.readyState = status > 0 ? 4 : 0;

        // Determine if successful
        isSuccess = status >= 200 && status < 300 || status === 304;

        // Get response data
        if ( responses ) {
          response = ajaxHandleResponses( s, jqXHR, responses );
        }

        // Convert no matter what (that way responseXXX fields are always set)
        response = ajaxConvert( s, response, jqXHR, isSuccess );

        // If successful, handle type chaining
        if ( isSuccess ) {

          // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
          if ( s.ifModified ) {
            modified = jqXHR.getResponseHeader("Last-Modified");
            if ( modified ) {
              jQuery.lastModified[ cacheURL ] = modified;
            }
            modified = jqXHR.getResponseHeader("etag");
            if ( modified ) {
              jQuery.etag[ cacheURL ] = modified;
            }
          }

          // if no content
          if ( status === 204 || s.type === "HEAD" ) {
            statusText = "nocontent";

            // if not modified
          } else if ( status === 304 ) {
            statusText = "notmodified";

            // If we have data, let's convert it
          } else {
            statusText = response.state;
            success = response.data;
            error = response.error;
            isSuccess = !error;
          }
        } else {
          // We extract error from statusText
          // then normalize statusText and status for non-aborts
          error = statusText;
          if ( status || !statusText ) {
            statusText = "error";
            if ( status < 0 ) {
              status = 0;
            }
          }
        }

        // Set data for the fake xhr object
        jqXHR.status = status;
        jqXHR.statusText = ( nativeStatusText || statusText ) + "";

        // Success/Error
        if ( isSuccess ) {
          deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
        } else {
          deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
        }

        // Status-dependent callbacks
        jqXHR.statusCode( statusCode );
        statusCode = undefined;

        if ( fireGlobals ) {
          globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
            [ jqXHR, s, isSuccess ? success : error ] );
        }

        // Complete
        completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

        if ( fireGlobals ) {
          globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
          // Handle the global AJAX counter
          if ( !( --jQuery.active ) ) {
            jQuery.event.trigger("ajaxStop");
          }
        }
      }

      return jqXHR;
    },

    getJSON: function( url, data, callback ) {
      return jQuery.get( url, data, callback, "json" );
    },

    getScript: function( url, callback ) {
      return jQuery.get( url, undefined, callback, "script" );
    }
  });

  jQuery.each( [ "get", "post" ], function( i, method ) {
    jQuery[ method ] = function( url, data, callback, type ) {
      // shift arguments if data argument was omitted
      if ( jQuery.isFunction( data ) ) {
        type = type || callback;
        callback = data;
        data = undefined;
      }

      return jQuery.ajax({
        url: url,
        type: method,
        dataType: type,
        data: data,
        success: callback
      });
    };
  });

  /* Handles responses to an ajax request:
   * - finds the right dataType (mediates between content-type and expected dataType)
   * - returns the corresponding response
   */
  function ajaxHandleResponses( s, jqXHR, responses ) {
    var firstDataType, ct, finalDataType, type,
      contents = s.contents,
      dataTypes = s.dataTypes;

    // Remove auto dataType and get content-type in the process
    while( dataTypes[ 0 ] === "*" ) {
      dataTypes.shift();
      if ( ct === undefined ) {
        ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
      }
    }

    // Check if we're dealing with a known content-type
    if ( ct ) {
      for ( type in contents ) {
        if ( contents[ type ] && contents[ type ].test( ct ) ) {
          dataTypes.unshift( type );
          break;
        }
      }
    }

    // Check to see if we have a response for the expected dataType
    if ( dataTypes[ 0 ] in responses ) {
      finalDataType = dataTypes[ 0 ];
    } else {
      // Try convertible dataTypes
      for ( type in responses ) {
        if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
          finalDataType = type;
          break;
        }
        if ( !firstDataType ) {
          firstDataType = type;
        }
      }
      // Or just use first one
      finalDataType = finalDataType || firstDataType;
    }

    // If we found a dataType
    // We add the dataType to the list if needed
    // and return the corresponding response
    if ( finalDataType ) {
      if ( finalDataType !== dataTypes[ 0 ] ) {
        dataTypes.unshift( finalDataType );
      }
      return responses[ finalDataType ];
    }
  }

  /* Chain conversions given the request and the original response
   * Also sets the responseXXX fields on the jqXHR instance
   */
  function ajaxConvert( s, response, jqXHR, isSuccess ) {
    var conv2, current, conv, tmp, prev,
      converters = {},
    // Work with a copy of dataTypes in case we need to modify it for conversion
      dataTypes = s.dataTypes.slice();

    // Create converters map with lowercased keys
    if ( dataTypes[ 1 ] ) {
      for ( conv in s.converters ) {
        converters[ conv.toLowerCase() ] = s.converters[ conv ];
      }
    }

    current = dataTypes.shift();

    // Convert to each sequential dataType
    while ( current ) {

      if ( s.responseFields[ current ] ) {
        jqXHR[ s.responseFields[ current ] ] = response;
      }

      // Apply the dataFilter if provided
      if ( !prev && isSuccess && s.dataFilter ) {
        response = s.dataFilter( response, s.dataType );
      }

      prev = current;
      current = dataTypes.shift();

      if ( current ) {

        // There's only work to do if current dataType is non-auto
        if ( current === "*" ) {

          current = prev;

          // Convert response if prev dataType is non-auto and differs from current
        } else if ( prev !== "*" && prev !== current ) {

          // Seek a direct converter
          conv = converters[ prev + " " + current ] || converters[ "* " + current ];

          // If none found, seek a pair
          if ( !conv ) {
            for ( conv2 in converters ) {

              // If conv2 outputs current
              tmp = conv2.split( " " );
              if ( tmp[ 1 ] === current ) {

                // If prev can be converted to accepted input
                conv = converters[ prev + " " + tmp[ 0 ] ] ||
                  converters[ "* " + tmp[ 0 ] ];
                if ( conv ) {
                  // Condense equivalence converters
                  if ( conv === true ) {
                    conv = converters[ conv2 ];

                    // Otherwise, insert the intermediate dataType
                  } else if ( converters[ conv2 ] !== true ) {
                    current = tmp[ 0 ];
                    dataTypes.unshift( tmp[ 1 ] );
                  }
                  break;
                }
              }
            }
          }

          // Apply converter (if not an equivalence)
          if ( conv !== true ) {

            // Unless errors are allowed to bubble, catch and return them
            if ( conv && s[ "throws" ] ) {
              response = conv( response );
            } else {
              try {
                response = conv( response );
              } catch ( e ) {
                return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
              }
            }
          }
        }
      }
    }

    return { state: "success", data: response };
  }
// Install script dataType
  jQuery.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /(?:java|ecma)script/
    },
    converters: {
      "text script": function( text ) {
        jQuery.globalEval( text );
        return text;
      }
    }
  });

// Handle cache's special case and global
  jQuery.ajaxPrefilter( "script", function( s ) {
    if ( s.cache === undefined ) {
      s.cache = false;
    }
    if ( s.crossDomain ) {
      s.type = "GET";
      s.global = false;
    }
  });

// Bind script tag hack transport
  jQuery.ajaxTransport( "script", function(s) {

    // This transport only deals with cross domain requests
    if ( s.crossDomain ) {

      var script,
        head = document.head || jQuery("head")[0] || document.documentElement;

      return {

        send: function( _, callback ) {

          script = document.createElement("script");

          script.async = true;

          if ( s.scriptCharset ) {
            script.charset = s.scriptCharset;
          }

          script.src = s.url;

          // Attach handlers for all browsers
          script.onload = script.onreadystatechange = function( _, isAbort ) {

            if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

              // Handle memory leak in IE
              script.onload = script.onreadystatechange = null;

              // Remove the script
              if ( script.parentNode ) {
                script.parentNode.removeChild( script );
              }

              // Dereference the script
              script = null;

              // Callback if not abort
              if ( !isAbort ) {
                callback( 200, "success" );
              }
            }
          };

          // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
          // Use native DOM manipulation to avoid our domManip AJAX trickery
          head.insertBefore( script, head.firstChild );
        },

        abort: function() {
          if ( script ) {
            script.onload( undefined, true );
          }
        }
      };
    }
  });
  var oldCallbacks = [],
    rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
  jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
      this[ callback ] = true;
      return callback;
    }
  });

// Detect, normalize options and install callbacks for jsonp requests
  jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    var callbackName, overwritten, responseContainer,
      jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
        "url" :
        typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
        );

    // Handle iff the expected data type is "jsonp" or we have a parameter to set
    if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

      // Get callback name, remembering preexisting value associated with it
      callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
        s.jsonpCallback() :
        s.jsonpCallback;

      // Insert callback into url or form data
      if ( jsonProp ) {
        s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
      } else if ( s.jsonp !== false ) {
        s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
      }

      // Use data converter to retrieve json after script execution
      s.converters["script json"] = function() {
        if ( !responseContainer ) {
          jQuery.error( callbackName + " was not called" );
        }
        return responseContainer[ 0 ];
      };

      // force json dataType
      s.dataTypes[ 0 ] = "json";

      // Install callback
      overwritten = window[ callbackName ];
      window[ callbackName ] = function() {
        responseContainer = arguments;
      };

      // Clean-up function (fires after converters)
      jqXHR.always(function() {
        // Restore preexisting value
        window[ callbackName ] = overwritten;

        // Save back as free
        if ( s[ callbackName ] ) {
          // make sure that re-using the options doesn't screw things around
          s.jsonpCallback = originalSettings.jsonpCallback;

          // save the callback name for future use
          oldCallbacks.push( callbackName );
        }

        // Call if it was a function and we have a response
        if ( responseContainer && jQuery.isFunction( overwritten ) ) {
          overwritten( responseContainer[ 0 ] );
        }

        responseContainer = overwritten = undefined;
      });

      // Delegate to script
      return "script";
    }
  });
  var xhrCallbacks, xhrSupported,
    xhrId = 0,
  // #5280: Internet Explorer will keep connections alive if we don't abort on unload
    xhrOnUnloadAbort = window.ActiveXObject && function() {
      // Abort all pending requests
      var key;
      for ( key in xhrCallbacks ) {
        xhrCallbacks[ key ]( undefined, true );
      }
    };

// Functions to create xhrs
  function createStandardXHR() {
    try {
      return new window.XMLHttpRequest();
    } catch( e ) {}
  }

  function createActiveXHR() {
    try {
      return new window.ActiveXObject("Microsoft.XMLHTTP");
    } catch( e ) {}
  }

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
  jQuery.ajaxSettings.xhr = window.ActiveXObject ?
    /* Microsoft failed to properly
     * implement the XMLHttpRequest in IE7 (can't request local files),
     * so we use the ActiveXObject when it is available
     * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
     * we need a fallback.
     */
    function() {
      return !this.isLocal && createStandardXHR() || createActiveXHR();
    } :
    // For all other browsers, use the standard XMLHttpRequest object
    createStandardXHR;

// Determine support properties
  xhrSupported = jQuery.ajaxSettings.xhr();
  jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
  xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
  if ( xhrSupported ) {

    jQuery.ajaxTransport(function( s ) {
      // Cross domain only allowed if supported through XMLHttpRequest
      if ( !s.crossDomain || jQuery.support.cors ) {

        var callback;

        return {
          send: function( headers, complete ) {

            // Get a new xhr
            var handle, i,
              xhr = s.xhr();

            // Open the socket
            // Passing null username, generates a login popup on Opera (#2865)
            if ( s.username ) {
              xhr.open( s.type, s.url, s.async, s.username, s.password );
            } else {
              xhr.open( s.type, s.url, s.async );
            }

            // Apply custom fields if provided
            if ( s.xhrFields ) {
              for ( i in s.xhrFields ) {
                xhr[ i ] = s.xhrFields[ i ];
              }
            }

            // Override mime type if needed
            if ( s.mimeType && xhr.overrideMimeType ) {
              xhr.overrideMimeType( s.mimeType );
            }

            // X-Requested-With header
            // For cross-domain requests, seeing as conditions for a preflight are
            // akin to a jigsaw puzzle, we simply never set it to be sure.
            // (it can always be set on a per-request basis or even using ajaxSetup)
            // For same-domain requests, won't change header if already provided.
            if ( !s.crossDomain && !headers["X-Requested-With"] ) {
              headers["X-Requested-With"] = "XMLHttpRequest";
            }

            // Need an extra try/catch for cross domain requests in Firefox 3
            try {
              for ( i in headers ) {
                xhr.setRequestHeader( i, headers[ i ] );
              }
            } catch( err ) {}

            // Do send the request
            // This may raise an exception which is actually
            // handled in jQuery.ajax (so no try/catch here)
            xhr.send( ( s.hasContent && s.data ) || null );

            // Listener
            callback = function( _, isAbort ) {
              var status, responseHeaders, statusText, responses;

              // Firefox throws exceptions when accessing properties
              // of an xhr when a network error occurred
              // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
              try {

                // Was never called and is aborted or complete
                if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                  // Only called once
                  callback = undefined;

                  // Do not keep as active anymore
                  if ( handle ) {
                    xhr.onreadystatechange = jQuery.noop;
                    if ( xhrOnUnloadAbort ) {
                      delete xhrCallbacks[ handle ];
                    }
                  }

                  // If it's an abort
                  if ( isAbort ) {
                    // Abort it manually if needed
                    if ( xhr.readyState !== 4 ) {
                      xhr.abort();
                    }
                  } else {
                    responses = {};
                    status = xhr.status;
                    responseHeaders = xhr.getAllResponseHeaders();

                    // When requesting binary data, IE6-9 will throw an exception
                    // on any attempt to access responseText (#11426)
                    if ( typeof xhr.responseText === "string" ) {
                      responses.text = xhr.responseText;
                    }

                    // Firefox throws an exception when accessing
                    // statusText for faulty cross-domain requests
                    try {
                      statusText = xhr.statusText;
                    } catch( e ) {
                      // We normalize with Webkit giving an empty statusText
                      statusText = "";
                    }

                    // Filter status for non standard behaviors

                    // If the request is local and we have data: assume a success
                    // (success with no data won't get notified, that's the best we
                    // can do given current implementations)
                    if ( !status && s.isLocal && !s.crossDomain ) {
                      status = responses.text ? 200 : 404;
                      // IE - #1450: sometimes returns 1223 when it should be 204
                    } else if ( status === 1223 ) {
                      status = 204;
                    }
                  }
                }
              } catch( firefoxAccessException ) {
                if ( !isAbort ) {
                  complete( -1, firefoxAccessException );
                }
              }

              // Call complete if needed
              if ( responses ) {
                complete( status, statusText, responses, responseHeaders );
              }
            };

            if ( !s.async ) {
              // if we're in sync mode we fire the callback
              callback();
            } else if ( xhr.readyState === 4 ) {
              // (IE6 & IE7) if it's in cache and has been
              // retrieved directly we need to fire the callback
              setTimeout( callback );
            } else {
              handle = ++xhrId;
              if ( xhrOnUnloadAbort ) {
                // Create the active xhrs callbacks list if needed
                // and attach the unload handler
                if ( !xhrCallbacks ) {
                  xhrCallbacks = {};
                  jQuery( window ).unload( xhrOnUnloadAbort );
                }
                // Add to list of active xhrs callbacks
                xhrCallbacks[ handle ] = callback;
              }
              xhr.onreadystatechange = callback;
            }
          },

          abort: function() {
            if ( callback ) {
              callback( undefined, true );
            }
          }
        };
      }
    });
  }
  var fxNow, timerId,
    rfxtypes = /^(?:toggle|show|hide)$/,
    rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
    rrun = /queueHooks$/,
    animationPrefilters = [ defaultPrefilter ],
    tweeners = {
      "*": [function( prop, value ) {
        var tween = this.createTween( prop, value ),
          target = tween.cur(),
          parts = rfxnum.exec( value ),
          unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

        // Starting value computation is required for potential unit mismatches
          start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
            rfxnum.exec( jQuery.css( tween.elem, prop ) ),
          scale = 1,
          maxIterations = 20;

        if ( start && start[ 3 ] !== unit ) {
          // Trust units reported by jQuery.css
          unit = unit || start[ 3 ];

          // Make sure we update the tween properties later on
          parts = parts || [];

          // Iteratively approximate from a nonzero starting point
          start = +target || 1;

          do {
            // If previous iteration zeroed out, double until we get *something*
            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
            scale = scale || ".5";

            // Adjust and apply
            start = start / scale;
            jQuery.style( tween.elem, prop, start + unit );

            // Update scale, tolerating zero or NaN from tween.cur()
            // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
          } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
        }

        // Update tween properties
        if ( parts ) {
          start = tween.start = +start || +target || 0;
          tween.unit = unit;
          // If a +=/-= token was provided, we're doing a relative animation
          tween.end = parts[ 1 ] ?
            start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
            +parts[ 2 ];
        }

        return tween;
      }]
    };

// Animations created synchronously will run synchronously
  function createFxNow() {
    setTimeout(function() {
      fxNow = undefined;
    });
    return ( fxNow = jQuery.now() );
  }

  function createTween( value, prop, animation ) {
    var tween,
      collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
      index = 0,
      length = collection.length;
    for ( ; index < length; index++ ) {
      if ( (tween = collection[ index ].call( animation, prop, value )) ) {

        // we're done with this property
        return tween;
      }
    }
  }

  function Animation( elem, properties, options ) {
    var result,
      stopped,
      index = 0,
      length = animationPrefilters.length,
      deferred = jQuery.Deferred().always( function() {
        // don't match elem in the :animated selector
        delete tick.elem;
      }),
      tick = function() {
        if ( stopped ) {
          return false;
        }
        var currentTime = fxNow || createFxNow(),
          remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
        // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
          temp = remaining / animation.duration || 0,
          percent = 1 - temp,
          index = 0,
          length = animation.tweens.length;

        for ( ; index < length ; index++ ) {
          animation.tweens[ index ].run( percent );
        }

        deferred.notifyWith( elem, [ animation, percent, remaining ]);

        if ( percent < 1 && length ) {
          return remaining;
        } else {
          deferred.resolveWith( elem, [ animation ] );
          return false;
        }
      },
      animation = deferred.promise({
        elem: elem,
        props: jQuery.extend( {}, properties ),
        opts: jQuery.extend( true, { specialEasing: {} }, options ),
        originalProperties: properties,
        originalOptions: options,
        startTime: fxNow || createFxNow(),
        duration: options.duration,
        tweens: [],
        createTween: function( prop, end ) {
          var tween = jQuery.Tween( elem, animation.opts, prop, end,
            animation.opts.specialEasing[ prop ] || animation.opts.easing );
          animation.tweens.push( tween );
          return tween;
        },
        stop: function( gotoEnd ) {
          var index = 0,
          // if we are going to the end, we want to run all the tweens
          // otherwise we skip this part
            length = gotoEnd ? animation.tweens.length : 0;
          if ( stopped ) {
            return this;
          }
          stopped = true;
          for ( ; index < length ; index++ ) {
            animation.tweens[ index ].run( 1 );
          }

          // resolve when we played the last frame
          // otherwise, reject
          if ( gotoEnd ) {
            deferred.resolveWith( elem, [ animation, gotoEnd ] );
          } else {
            deferred.rejectWith( elem, [ animation, gotoEnd ] );
          }
          return this;
        }
      }),
      props = animation.props;

    propFilter( props, animation.opts.specialEasing );

    for ( ; index < length ; index++ ) {
      result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
      if ( result ) {
        return result;
      }
    }

    jQuery.map( props, createTween, animation );

    if ( jQuery.isFunction( animation.opts.start ) ) {
      animation.opts.start.call( elem, animation );
    }

    jQuery.fx.timer(
      jQuery.extend( tick, {
        elem: elem,
        anim: animation,
        queue: animation.opts.queue
      })
    );

    // attach callbacks from options
    return animation.progress( animation.opts.progress )
      .done( animation.opts.done, animation.opts.complete )
      .fail( animation.opts.fail )
      .always( animation.opts.always );
  }

  function propFilter( props, specialEasing ) {
    var index, name, easing, value, hooks;

    // camelCase, specialEasing and expand cssHook pass
    for ( index in props ) {
      name = jQuery.camelCase( index );
      easing = specialEasing[ name ];
      value = props[ index ];
      if ( jQuery.isArray( value ) ) {
        easing = value[ 1 ];
        value = props[ index ] = value[ 0 ];
      }

      if ( index !== name ) {
        props[ name ] = value;
        delete props[ index ];
      }

      hooks = jQuery.cssHooks[ name ];
      if ( hooks && "expand" in hooks ) {
        value = hooks.expand( value );
        delete props[ name ];

        // not quite $.extend, this wont overwrite keys already present.
        // also - reusing 'index' from above because we have the correct "name"
        for ( index in value ) {
          if ( !( index in props ) ) {
            props[ index ] = value[ index ];
            specialEasing[ index ] = easing;
          }
        }
      } else {
        specialEasing[ name ] = easing;
      }
    }
  }

  jQuery.Animation = jQuery.extend( Animation, {

    tweener: function( props, callback ) {
      if ( jQuery.isFunction( props ) ) {
        callback = props;
        props = [ "*" ];
      } else {
        props = props.split(" ");
      }

      var prop,
        index = 0,
        length = props.length;

      for ( ; index < length ; index++ ) {
        prop = props[ index ];
        tweeners[ prop ] = tweeners[ prop ] || [];
        tweeners[ prop ].unshift( callback );
      }
    },

    prefilter: function( callback, prepend ) {
      if ( prepend ) {
        animationPrefilters.unshift( callback );
      } else {
        animationPrefilters.push( callback );
      }
    }
  });

  function defaultPrefilter( elem, props, opts ) {
    /* jshint validthis: true */
    var prop, value, toggle, tween, hooks, oldfire,
      anim = this,
      orig = {},
      style = elem.style,
      hidden = elem.nodeType && isHidden( elem ),
      dataShow = jQuery._data( elem, "fxshow" );

    // handle queue: false promises
    if ( !opts.queue ) {
      hooks = jQuery._queueHooks( elem, "fx" );
      if ( hooks.unqueued == null ) {
        hooks.unqueued = 0;
        oldfire = hooks.empty.fire;
        hooks.empty.fire = function() {
          if ( !hooks.unqueued ) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;

      anim.always(function() {
        // doing this makes sure that the complete handler will be called
        // before this completes
        anim.always(function() {
          hooks.unqueued--;
          if ( !jQuery.queue( elem, "fx" ).length ) {
            hooks.empty.fire();
          }
        });
      });
    }

    // height/width overflow pass
    if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
      // Make sure that nothing sneaks out
      // Record all 3 overflow attributes because IE does not
      // change the overflow attribute when overflowX and
      // overflowY are set to the same value
      opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

      // Set display property to inline-block for height/width
      // animations on inline elements that are having width/height animated
      if ( jQuery.css( elem, "display" ) === "inline" &&
        jQuery.css( elem, "float" ) === "none" ) {

        // inline-level elements accept inline-block;
        // block-level elements need to be inline with layout
        if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
          style.display = "inline-block";

        } else {
          style.zoom = 1;
        }
      }
    }

    if ( opts.overflow ) {
      style.overflow = "hidden";
      if ( !jQuery.support.shrinkWrapBlocks ) {
        anim.always(function() {
          style.overflow = opts.overflow[ 0 ];
          style.overflowX = opts.overflow[ 1 ];
          style.overflowY = opts.overflow[ 2 ];
        });
      }
    }


    // show/hide pass
    for ( prop in props ) {
      value = props[ prop ];
      if ( rfxtypes.exec( value ) ) {
        delete props[ prop ];
        toggle = toggle || value === "toggle";
        if ( value === ( hidden ? "hide" : "show" ) ) {
          continue;
        }
        orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
      }
    }

    if ( !jQuery.isEmptyObject( orig ) ) {
      if ( dataShow ) {
        if ( "hidden" in dataShow ) {
          hidden = dataShow.hidden;
        }
      } else {
        dataShow = jQuery._data( elem, "fxshow", {} );
      }

      // store state if its toggle - enables .stop().toggle() to "reverse"
      if ( toggle ) {
        dataShow.hidden = !hidden;
      }
      if ( hidden ) {
        jQuery( elem ).show();
      } else {
        anim.done(function() {
          jQuery( elem ).hide();
        });
      }
      anim.done(function() {
        var prop;
        jQuery._removeData( elem, "fxshow" );
        for ( prop in orig ) {
          jQuery.style( elem, prop, orig[ prop ] );
        }
      });
      for ( prop in orig ) {
        tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

        if ( !( prop in dataShow ) ) {
          dataShow[ prop ] = tween.start;
          if ( hidden ) {
            tween.end = tween.start;
            tween.start = prop === "width" || prop === "height" ? 1 : 0;
          }
        }
      }
    }
  }

  function Tween( elem, options, prop, end, easing ) {
    return new Tween.prototype.init( elem, options, prop, end, easing );
  }
  jQuery.Tween = Tween;

  Tween.prototype = {
    constructor: Tween,
    init: function( elem, options, prop, end, easing, unit ) {
      this.elem = elem;
      this.prop = prop;
      this.easing = easing || "swing";
      this.options = options;
      this.start = this.now = this.cur();
      this.end = end;
      this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
    },
    cur: function() {
      var hooks = Tween.propHooks[ this.prop ];

      return hooks && hooks.get ?
        hooks.get( this ) :
        Tween.propHooks._default.get( this );
    },
    run: function( percent ) {
      var eased,
        hooks = Tween.propHooks[ this.prop ];

      if ( this.options.duration ) {
        this.pos = eased = jQuery.easing[ this.easing ](
          percent, this.options.duration * percent, 0, 1, this.options.duration
        );
      } else {
        this.pos = eased = percent;
      }
      this.now = ( this.end - this.start ) * eased + this.start;

      if ( this.options.step ) {
        this.options.step.call( this.elem, this.now, this );
      }

      if ( hooks && hooks.set ) {
        hooks.set( this );
      } else {
        Tween.propHooks._default.set( this );
      }
      return this;
    }
  };

  Tween.prototype.init.prototype = Tween.prototype;

  Tween.propHooks = {
    _default: {
      get: function( tween ) {
        var result;

        if ( tween.elem[ tween.prop ] != null &&
          (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
          return tween.elem[ tween.prop ];
        }

        // passing an empty string as a 3rd parameter to .css will automatically
        // attempt a parseFloat and fallback to a string if the parse fails
        // so, simple values such as "10px" are parsed to Float.
        // complex values such as "rotate(1rad)" are returned as is.
        result = jQuery.css( tween.elem, tween.prop, "" );
        // Empty strings, null, undefined and "auto" are converted to 0.
        return !result || result === "auto" ? 0 : result;
      },
      set: function( tween ) {
        // use step hook for back compat - use cssHook if its there - use .style if its
        // available and use plain properties where available
        if ( jQuery.fx.step[ tween.prop ] ) {
          jQuery.fx.step[ tween.prop ]( tween );
        } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
          jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
        } else {
          tween.elem[ tween.prop ] = tween.now;
        }
      }
    }
  };

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    set: function( tween ) {
      if ( tween.elem.nodeType && tween.elem.parentNode ) {
        tween.elem[ tween.prop ] = tween.now;
      }
    }
  };

  jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
    var cssFn = jQuery.fn[ name ];
    jQuery.fn[ name ] = function( speed, easing, callback ) {
      return speed == null || typeof speed === "boolean" ?
        cssFn.apply( this, arguments ) :
        this.animate( genFx( name, true ), speed, easing, callback );
    };
  });

  jQuery.fn.extend({
    fadeTo: function( speed, to, easing, callback ) {

      // show any hidden elements after setting opacity to 0
      return this.filter( isHidden ).css( "opacity", 0 ).show()

        // animate to the value specified
        .end().animate({ opacity: to }, speed, easing, callback );
    },
    animate: function( prop, speed, easing, callback ) {
      var empty = jQuery.isEmptyObject( prop ),
        optall = jQuery.speed( speed, easing, callback ),
        doAnimation = function() {
          // Operate on a copy of prop so per-property easing won't be lost
          var anim = Animation( this, jQuery.extend( {}, prop ), optall );

          // Empty animations, or finishing resolves immediately
          if ( empty || jQuery._data( this, "finish" ) ) {
            anim.stop( true );
          }
        };
      doAnimation.finish = doAnimation;

      return empty || optall.queue === false ?
        this.each( doAnimation ) :
        this.queue( optall.queue, doAnimation );
    },
    stop: function( type, clearQueue, gotoEnd ) {
      var stopQueue = function( hooks ) {
        var stop = hooks.stop;
        delete hooks.stop;
        stop( gotoEnd );
      };

      if ( typeof type !== "string" ) {
        gotoEnd = clearQueue;
        clearQueue = type;
        type = undefined;
      }
      if ( clearQueue && type !== false ) {
        this.queue( type || "fx", [] );
      }

      return this.each(function() {
        var dequeue = true,
          index = type != null && type + "queueHooks",
          timers = jQuery.timers,
          data = jQuery._data( this );

        if ( index ) {
          if ( data[ index ] && data[ index ].stop ) {
            stopQueue( data[ index ] );
          }
        } else {
          for ( index in data ) {
            if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
              stopQueue( data[ index ] );
            }
          }
        }

        for ( index = timers.length; index--; ) {
          if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
            timers[ index ].anim.stop( gotoEnd );
            dequeue = false;
            timers.splice( index, 1 );
          }
        }

        // start the next in the queue if the last step wasn't forced
        // timers currently will call their complete callbacks, which will dequeue
        // but only if they were gotoEnd
        if ( dequeue || !gotoEnd ) {
          jQuery.dequeue( this, type );
        }
      });
    },
    finish: function( type ) {
      if ( type !== false ) {
        type = type || "fx";
      }
      return this.each(function() {
        var index,
          data = jQuery._data( this ),
          queue = data[ type + "queue" ],
          hooks = data[ type + "queueHooks" ],
          timers = jQuery.timers,
          length = queue ? queue.length : 0;

        // enable finishing flag on private data
        data.finish = true;

        // empty the queue first
        jQuery.queue( this, type, [] );

        if ( hooks && hooks.stop ) {
          hooks.stop.call( this, true );
        }

        // look for any active animations, and finish them
        for ( index = timers.length; index--; ) {
          if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
            timers[ index ].anim.stop( true );
            timers.splice( index, 1 );
          }
        }

        // look for any animations in the old queue and finish them
        for ( index = 0; index < length; index++ ) {
          if ( queue[ index ] && queue[ index ].finish ) {
            queue[ index ].finish.call( this );
          }
        }

        // turn off finishing flag
        delete data.finish;
      });
    }
  });

// Generate parameters to create a standard animation
  function genFx( type, includeWidth ) {
    var which,
      attrs = { height: type },
      i = 0;

    // if we include width, step value is 1 to do all cssExpand values,
    // if we don't include width, step value is 2 to skip over Left and Right
    includeWidth = includeWidth? 1 : 0;
    for( ; i < 4 ; i += 2 - includeWidth ) {
      which = cssExpand[ i ];
      attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
    }

    if ( includeWidth ) {
      attrs.opacity = attrs.width = type;
    }

    return attrs;
  }

// Generate shortcuts for custom animations
  jQuery.each({
    slideDown: genFx("show"),
    slideUp: genFx("hide"),
    slideToggle: genFx("toggle"),
    fadeIn: { opacity: "show" },
    fadeOut: { opacity: "hide" },
    fadeToggle: { opacity: "toggle" }
  }, function( name, props ) {
    jQuery.fn[ name ] = function( speed, easing, callback ) {
      return this.animate( props, speed, easing, callback );
    };
  });

  jQuery.speed = function( speed, easing, fn ) {
    var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
      complete: fn || !fn && easing ||
        jQuery.isFunction( speed ) && speed,
      duration: speed,
      easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
    };

    opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
      opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

    // normalize opt.queue - true/undefined/null -> "fx"
    if ( opt.queue == null || opt.queue === true ) {
      opt.queue = "fx";
    }

    // Queueing
    opt.old = opt.complete;

    opt.complete = function() {
      if ( jQuery.isFunction( opt.old ) ) {
        opt.old.call( this );
      }

      if ( opt.queue ) {
        jQuery.dequeue( this, opt.queue );
      }
    };

    return opt;
  };

  jQuery.easing = {
    linear: function( p ) {
      return p;
    },
    swing: function( p ) {
      return 0.5 - Math.cos( p*Math.PI ) / 2;
    }
  };

  jQuery.timers = [];
  jQuery.fx = Tween.prototype.init;
  jQuery.fx.tick = function() {
    var timer,
      timers = jQuery.timers,
      i = 0;

    fxNow = jQuery.now();

    for ( ; i < timers.length; i++ ) {
      timer = timers[ i ];
      // Checks the timer has not already been removed
      if ( !timer() && timers[ i ] === timer ) {
        timers.splice( i--, 1 );
      }
    }

    if ( !timers.length ) {
      jQuery.fx.stop();
    }
    fxNow = undefined;
  };

  jQuery.fx.timer = function( timer ) {
    if ( timer() && jQuery.timers.push( timer ) ) {
      jQuery.fx.start();
    }
  };

  jQuery.fx.interval = 13;

  jQuery.fx.start = function() {
    if ( !timerId ) {
      timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
    }
  };

  jQuery.fx.stop = function() {
    clearInterval( timerId );
    timerId = null;
  };

  jQuery.fx.speeds = {
    slow: 600,
    fast: 200,
    // Default speed
    _default: 400
  };

// Back Compat <1.8 extension point
  jQuery.fx.step = {};

  if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.animated = function( elem ) {
      return jQuery.grep(jQuery.timers, function( fn ) {
        return elem === fn.elem;
      }).length;
    };
  }
  jQuery.fn.offset = function( options ) {
    if ( arguments.length ) {
      return options === undefined ?
        this :
        this.each(function( i ) {
          jQuery.offset.setOffset( this, options, i );
        });
    }

    var docElem, win,
      box = { top: 0, left: 0 },
      elem = this[ 0 ],
      doc = elem && elem.ownerDocument;

    if ( !doc ) {
      return;
    }

    docElem = doc.documentElement;

    // Make sure it's not a disconnected DOM node
    if ( !jQuery.contains( docElem, elem ) ) {
      return box;
    }

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
      box = elem.getBoundingClientRect();
    }
    win = getWindow( doc );
    return {
      top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
      left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
    };
  };

  jQuery.offset = {

    setOffset: function( elem, options, i ) {
      var position = jQuery.css( elem, "position" );

      // set position first, in-case top/left are set even on static elem
      if ( position === "static" ) {
        elem.style.position = "relative";
      }

      var curElem = jQuery( elem ),
        curOffset = curElem.offset(),
        curCSSTop = jQuery.css( elem, "top" ),
        curCSSLeft = jQuery.css( elem, "left" ),
        calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
        props = {}, curPosition = {}, curTop, curLeft;

      // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
      if ( calculatePosition ) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;
      } else {
        curTop = parseFloat( curCSSTop ) || 0;
        curLeft = parseFloat( curCSSLeft ) || 0;
      }

      if ( jQuery.isFunction( options ) ) {
        options = options.call( elem, i, curOffset );
      }

      if ( options.top != null ) {
        props.top = ( options.top - curOffset.top ) + curTop;
      }
      if ( options.left != null ) {
        props.left = ( options.left - curOffset.left ) + curLeft;
      }

      if ( "using" in options ) {
        options.using.call( elem, props );
      } else {
        curElem.css( props );
      }
    }
  };


  jQuery.fn.extend({

    position: function() {
      if ( !this[ 0 ] ) {
        return;
      }

      var offsetParent, offset,
        parentOffset = { top: 0, left: 0 },
        elem = this[ 0 ];

      // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
      if ( jQuery.css( elem, "position" ) === "fixed" ) {
        // we assume that getBoundingClientRect is available when computed position is fixed
        offset = elem.getBoundingClientRect();
      } else {
        // Get *real* offsetParent
        offsetParent = this.offsetParent();

        // Get correct offsets
        offset = this.offset();
        if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
          parentOffset = offsetParent.offset();
        }

        // Add offsetParent borders
        parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
        parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
      }

      // Subtract parent offsets and element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      return {
        top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
        left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
      };
    },

    offsetParent: function() {
      return this.map(function() {
        var offsetParent = this.offsetParent || docElem;
        while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
          offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || docElem;
      });
    }
  });


// Create scrollLeft and scrollTop methods
  jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
    var top = /Y/.test( prop );

    jQuery.fn[ method ] = function( val ) {
      return jQuery.access( this, function( elem, method, val ) {
        var win = getWindow( elem );

        if ( val === undefined ) {
          return win ? (prop in win) ? win[ prop ] :
            win.document.documentElement[ method ] :
            elem[ method ];
        }

        if ( win ) {
          win.scrollTo(
            !top ? val : jQuery( win ).scrollLeft(),
            top ? val : jQuery( win ).scrollTop()
          );

        } else {
          elem[ method ] = val;
        }
      }, method, val, arguments.length, null );
    };
  });

  function getWindow( elem ) {
    return jQuery.isWindow( elem ) ?
      elem :
      elem.nodeType === 9 ?
        elem.defaultView || elem.parentWindow :
        false;
  }
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
  jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
    jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
      // margin is only for outerHeight, outerWidth
      jQuery.fn[ funcName ] = function( margin, value ) {
        var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
          extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

        return jQuery.access( this, function( elem, type, value ) {
          var doc;

          if ( jQuery.isWindow( elem ) ) {
            // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
            // isn't a whole lot we can do. See pull request at this URL for discussion:
            // https://github.com/jquery/jquery/pull/764
            return elem.document.documentElement[ "client" + name ];
          }

          // Get document width or height
          if ( elem.nodeType === 9 ) {
            doc = elem.documentElement;

            // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
            // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
            return Math.max(
              elem.body[ "scroll" + name ], doc[ "scroll" + name ],
              elem.body[ "offset" + name ], doc[ "offset" + name ],
              doc[ "client" + name ]
            );
          }

          return value === undefined ?
            // Get width or height on the element, requesting but not forcing parseFloat
            jQuery.css( elem, type, extra ) :

            // Set width or height on the element
            jQuery.style( elem, type, value, extra );
        }, type, chainable ? margin : undefined, chainable, null );
      };
    });
  });
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
  jQuery.fn.size = function() {
    return this.length;
  };

  jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
  if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    // Expose jQuery as module.exports in loaders that implement the Node
    // module pattern (including browserify). Do not create the global, since
    // the user will be storing it themselves locally, and globals are frowned
    // upon in the Node module world.
    module.exports = jQuery;
  } else {
    // Otherwise expose jQuery to the global object as usual
    window.jQuery = window.$ = jQuery;

    // Register as a named AMD module, since jQuery can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase jquery is used because AMD module names are
    // derived from file names, and jQuery is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of jQuery, it will work.
    if ( typeof define === "function" && define.amd ) {
      define( "jquery", [], function () { return jQuery; } );
    }
  }

})( window );;(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,j=i.bind,w=function(n){return n instanceof w?n:this instanceof w?(this._wrapped=n,void 0):new w(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=w),exports._=w):n._=w,w.VERSION="1.4.4";var A=w.each=w.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(w.has(n,a)&&t.call(e,n[a],a,n)===r)return};w.map=w.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e[e.length]=t.call(r,n,u,i)}),e)};var O="Reduce of empty array with no initial value";w.reduce=w.foldl=w.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=w.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},w.reduceRight=w.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=w.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=w.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},w.find=w.detect=function(n,t,r){var e;return E(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},w.filter=w.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&(e[e.length]=n)}),e)},w.reject=function(n,t,r){return w.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},w.every=w.all=function(n,t,e){t||(t=w.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var E=w.some=w.any=function(n,t,e){t||(t=w.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};w.contains=w.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:E(n,function(n){return n===t})},w.invoke=function(n,t){var r=o.call(arguments,2),e=w.isFunction(t);return w.map(n,function(n){return(e?t:n[t]).apply(n,r)})},w.pluck=function(n,t){return w.map(n,function(n){return n[t]})},w.where=function(n,t,r){return w.isEmpty(t)?r?null:[]:w[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},w.findWhere=function(n,t){return w.where(n,t,!0)},w.max=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.max.apply(Math,n);if(!t&&w.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>=e.computed&&(e={value:n,computed:a})}),e.value},w.min=function(n,t,r){if(!t&&w.isArray(n)&&n[0]===+n[0]&&65535>n.length)return Math.min.apply(Math,n);if(!t&&w.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;e.computed>a&&(e={value:n,computed:a})}),e.value},w.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=w.random(r++),e[r-1]=e[t],e[t]=n}),e};var k=function(n){return w.isFunction(n)?n:function(t){return t[n]}};w.sortBy=function(n,t,r){var e=k(t);return w.pluck(w.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var F=function(n,t,r,e){var u={},i=k(t||w.identity);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};w.groupBy=function(n,t,r){return F(n,t,r,function(n,t,r){(w.has(n,t)?n[t]:n[t]=[]).push(r)})},w.countBy=function(n,t,r){return F(n,t,r,function(n,t){w.has(n,t)||(n[t]=0),n[t]++})},w.sortedIndex=function(n,t,r,e){r=null==r?w.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;u>r.call(e,n[o])?i=o+1:a=o}return i},w.toArray=function(n){return n?w.isArray(n)?o.call(n):n.length===+n.length?w.map(n,w.identity):w.values(n):[]},w.size=function(n){return null==n?0:n.length===+n.length?n.length:w.keys(n).length},w.first=w.head=w.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},w.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},w.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},w.rest=w.tail=w.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},w.compact=function(n){return w.filter(n,w.identity)};var R=function(n,t,r){return A(n,function(n){w.isArray(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r};w.flatten=function(n,t){return R(n,t,[])},w.without=function(n){return w.difference(n,o.call(arguments,1))},w.uniq=w.unique=function(n,t,r,e){w.isFunction(t)&&(e=r,r=t,t=!1);var u=r?w.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:w.contains(a,r))||(a.push(r),i.push(n[e]))}),i},w.union=function(){return w.uniq(c.apply(e,arguments))},w.intersection=function(n){var t=o.call(arguments,1);return w.filter(w.uniq(n),function(n){return w.every(t,function(t){return w.indexOf(t,n)>=0})})},w.difference=function(n){var t=c.apply(e,o.call(arguments,1));return w.filter(n,function(n){return!w.contains(t,n)})},w.zip=function(){for(var n=o.call(arguments),t=w.max(w.pluck(n,"length")),r=Array(t),e=0;t>e;e++)r[e]=w.pluck(n,""+e);return r},w.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},w.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=w.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},w.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},w.range=function(n,t,r){1>=arguments.length&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=Array(e);e>u;)i[u++]=n,n+=r;return i},w.bind=function(n,t){if(n.bind===j&&j)return j.apply(n,o.call(arguments,1));var r=o.call(arguments,2);return function(){return n.apply(t,r.concat(o.call(arguments)))}},w.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},w.bindAll=function(n){var t=o.call(arguments,1);return 0===t.length&&(t=w.functions(n)),A(t,function(t){n[t]=w.bind(n[t],n)}),n},w.memoize=function(n,t){var r={};return t||(t=w.identity),function(){var e=t.apply(this,arguments);return w.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},w.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},w.defer=function(n){return w.delay.apply(w,[n,1].concat(o.call(arguments,1)))},w.throttle=function(n,t){var r,e,u,i,a=0,o=function(){a=new Date,u=null,i=n.apply(r,e)};return function(){var c=new Date,l=t-(c-a);return r=this,e=arguments,0>=l?(clearTimeout(u),u=null,a=c,i=n.apply(r,e)):u||(u=setTimeout(o,l)),i}},w.debounce=function(n,t,r){var e,u;return function(){var i=this,a=arguments,o=function(){e=null,r||(u=n.apply(i,a))},c=r&&!e;return clearTimeout(e),e=setTimeout(o,t),c&&(u=n.apply(i,a)),u}},w.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},w.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},w.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},w.after=function(n,t){return 0>=n?t():function(){return 1>--n?t.apply(this,arguments):void 0}},w.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)w.has(n,r)&&(t[t.length]=r);return t},w.values=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push(n[r]);return t},w.pairs=function(n){var t=[];for(var r in n)w.has(n,r)&&t.push([r,n[r]]);return t},w.invert=function(n){var t={};for(var r in n)w.has(n,r)&&(t[n[r]]=r);return t},w.functions=w.methods=function(n){var t=[];for(var r in n)w.isFunction(n[r])&&t.push(r);return t.sort()},w.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},w.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},w.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)w.contains(r,u)||(t[u]=n[u]);return t},w.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)null==n[r]&&(n[r]=t[r])}),n},w.clone=function(n){return w.isObject(n)?w.isArray(n)?n.slice():w.extend({},n):n},w.tap=function(n,t){return t(n),n};var I=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof w&&(n=n._wrapped),t instanceof w&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==t+"";case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;r.push(n),e.push(t);var a=0,o=!0;if("[object Array]"==u){if(a=n.length,o=a==t.length)for(;a--&&(o=I(n[a],t[a],r,e)););}else{var c=n.constructor,f=t.constructor;if(c!==f&&!(w.isFunction(c)&&c instanceof c&&w.isFunction(f)&&f instanceof f))return!1;for(var s in n)if(w.has(n,s)&&(a++,!(o=w.has(t,s)&&I(n[s],t[s],r,e))))break;if(o){for(s in t)if(w.has(t,s)&&!a--)break;o=!a}}return r.pop(),e.pop(),o};w.isEqual=function(n,t){return I(n,t,[],[])},w.isEmpty=function(n){if(null==n)return!0;if(w.isArray(n)||w.isString(n))return 0===n.length;for(var t in n)if(w.has(n,t))return!1;return!0},w.isElement=function(n){return!(!n||1!==n.nodeType)},w.isArray=x||function(n){return"[object Array]"==l.call(n)},w.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){w["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),w.isArguments(arguments)||(w.isArguments=function(n){return!(!n||!w.has(n,"callee"))}),"function"!=typeof/./&&(w.isFunction=function(n){return"function"==typeof n}),w.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},w.isNaN=function(n){return w.isNumber(n)&&n!=+n},w.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},w.isNull=function(n){return null===n},w.isUndefined=function(n){return n===void 0},w.has=function(n,t){return f.call(n,t)},w.noConflict=function(){return n._=t,this},w.identity=function(n){return n},w.times=function(n,t,r){for(var e=Array(n),u=0;n>u;u++)e[u]=t.call(r,u);return e},w.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var M={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};M.unescape=w.invert(M.escape);var S={escape:RegExp("["+w.keys(M.escape).join("")+"]","g"),unescape:RegExp("("+w.keys(M.unescape).join("|")+")","g")};w.each(["escape","unescape"],function(n){w[n]=function(t){return null==t?"":(""+t).replace(S[n],function(t){return M[n][t]})}}),w.result=function(n,t){if(null==n)return null;var r=n[t];return w.isFunction(r)?r.call(n):r},w.mixin=function(n){A(w.functions(n),function(t){var r=w[t]=n[t];w.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),D.call(this,r.apply(w,n))}})};var N=0;w.uniqueId=function(n){var t=++N+"";return n?n+t:t},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var T=/(.)^/,q={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},B=/\\|'|\r|\n|\t|\u2028|\u2029/g;w.template=function(n,t,r){var e;r=w.defaults({},r,w.templateSettings);var u=RegExp([(r.escape||T).source,(r.interpolate||T).source,(r.evaluate||T).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(B,function(n){return"\\"+q[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,w);var c=function(n){return e.call(this,n,w)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},w.chain=function(n){return w(n).chain()};var D=function(n){return this._chain?w(n).chain():n};w.mixin(w),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];w.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],D.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];w.prototype[n]=function(){return D.call(this,t.apply(this._wrapped,arguments))}}),w.extend(w.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);;//     Backbone.js 1.0.0

//     (c) 2010-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.0.0';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = root.jQuery || root.Zepto || root.ender || root.$;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeners = this._listeners;
      if (!listeners) return this;
      var deleteListener = !name && !callback;
      if (typeof name === 'object') callback = this;
      if (obj) (listeners = {})[obj._listenerId] = obj;
      for (var id in listeners) {
        listeners[id].off(name, callback, this);
        if (deleteListener) delete this._listeners[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeners = this._listeners || (this._listeners = {});
      var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
      listeners[id] = obj;
      if (typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    _.extend(this, _.pick(options, modelOptions));
    if (options.parse) attrs = this.parse(attrs, options) || {};
    if (defaults = _.result(this, 'defaults')) {
      attrs = _.defaults({}, attrs, defaults);
    }
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // A list of options to be attached directly to the model, if provided.
  var modelOptions = ['url', 'urlRoot', 'collection'];

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      // If we're not waiting and attributes exist, save acts as `set(attr).save(null, opts)`.
      if (attrs && (!options || !options.wait) && !this.set(attrs, options)) return false;

      options = _.extend({validate: true}, options);

      // Do not persist invalid models.
      if (!this._validate(attrs, options)) return false;

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options || {}, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.url) this.url = options.url;
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, merge: false, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.defaults(options || {}, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      models = _.isArray(models) ? models.slice() : [models];
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults(options || {}, setOptions);
      if (options.parse) models = this.parse(models, options);
      if (!_.isArray(models)) models = models ? [models] : [];
      var i, l, model, attrs, existing, sort;
      var at = options.at;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        if (!(model = this._prepareModel(models[i], options))) continue;

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(model)) {
          if (options.remove) modelMap[existing.cid] = true;
          if (options.merge) {
            existing.set(model.attributes, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }

        // This is a new model, push it to the `toAdd` list.
        } else if (options.add) {
          toAdd.push(model);

          // Listen to added models' events, and index models for lookup by
          // `id` and by `cid`.
          model.on('all', this._onModelEvent, this);
          this._byId[model.cid] = model;
          if (model.id != null) this._byId[model.id] = model;
        }
      }

      // Remove nonexistent models if appropriate.
      if (options.remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          splice.apply(this.models, [at, 0].concat(toAdd));
        } else {
          push.apply(this.models, toAdd);
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      if (options.silent) return this;

      // Trigger `add` events.
      for (i = 0, l = toAdd.length; i < l; i++) {
        (model = toAdd[i]).trigger('add', model, this, options);
      }

      // Trigger `sort` if the collection was sorted.
      if (sort) this.trigger('sort', this, options);
      return this;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      options.previousModels = this.models;
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: this.length}, options));
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function(begin, end) {
      return this.models.slice(begin, end);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj.id != null ? obj.id : obj.cid || obj];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Figure out the smallest index at which a model should be inserted so as
    // to maintain order.
    sortedIndex: function(model, value, context) {
      value || (value = this.comparator);
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _.sortedIndex(this.models, model, iterator, context);
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options || (options = {});
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model._validate(attrs, options)) {
        this.trigger('invalid', this, attrs, options);
        return false;
      }
      return model;
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
    'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(e.g. model, collection, id, className)* are
    // attached directly to the view.  See `viewOptions` for an exhaustive
    // list.
    _configure: function(options) {
      if (this.options) options = _.extend({}, _.result(this, 'options'), options);
      _.extend(this, _.pick(options, viewOptions));
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && window.ActiveXObject &&
          !(window.external && window.external.msActiveXFilteringEnabled)) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        callback && callback.apply(router, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      fragment = this.getFragment(fragment || '');
      if (this.fragment === fragment) return;
      this.fragment = fragment;
      var url = this.root + fragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function (model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

}).call(this);;/*! Backbone.Rpc - v0.1.1
 ------------------------------
 Build @ 2012-11-15
 Documentation and Full License Available at:
 http://asciidisco.github.com/Backbone.Rpc/index.html
 git://github.com/asciidisco/Backbone.Rpc.git
 Copyright (c) 2012 Sebastian Golasch <public@asciidisco.com>

 Permission is hereby granted, free of charge, to any person obtaining a
 copy of this software and associated documentation files (the "Software"),
 to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the

 Software is furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 IN THE SOFTWARE.*/

// Backbone.Rpc
// Plugin for using the backbone js library with a remote json-rpc handler
// instead of the default REST one
(function (root, define, require, exports, module, factory, undef) {
  'use strict';
  if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('underscore'), require('backbone'), require('jquery'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['../', 'backbone', 'jquery'], function (_, Backbone, $) {
      // Check if
      _ = _ === undef ? root._ : _;
      Backbone = Backbone === undef ? root.Backbone : Backbone;
      $ = $ === undef ? root.$ : $;
      return (root.Backbone = factory(_, Backbone, $));
    });
  } else {
    // Browser globals
    root.returnExportsGlobal = factory(root._, root.Backbone, root.$);
  }
}(this, this.define, this.require, this.exports, this.module, function (_, Backbone, $, undef) {
  'use strict';
  var Rpc = function (options) {
      // merge the users options
      this.options = options !== undef ? options : {};
      // check if we have a non std. namespace delimter
      this.namespaceDelimiter = options !== undef && options.namespaceDelimiter !== undef ? options.namespaceDelimiter : this.namespaceDelimiter;
      // check if we have a non std. content-type
      this.contentType = options !== undef && options.contentType !== undef ? options.contentType : this.contentType;
      // fix issue with the loss of this
      _.bindAll(this);
    },
  // store the old Backbone.Model constructor for later use
    oldConst = Backbone.Model.prototype.constructor,
  // store the old Backbone.sync method for later use
    oldSync = Backbone.sync,
  // storage object to keep track of changes from the loaded objects
    storage = {};

  // TODO: Document
  Rpc.prototype = {
    // User defined options placeholder
    options: {},

    // Default charset
    charset: 'iso-8859-1',

    // Default namespace
    namespace: '',

    // Default namespace delimiter
    namespaceDelimiter: '/',

    // Default content type
    contentType: 'application/json',

    // User set url placeholder
    url: null,

    // Server response id
    responseID: null,

    // TODO: Document
    exceptions: {
      404: {code: -1, message: '404'},
      500: {code: -2, message: '500'},
      typeMissmatch: {code: -3, message: 'Type missmatch'},
      badResponseId: {code: -4, message: 'Bad response ID'},
      noResponse: {code: -5, message: 'No response'},
      noDefError: {code: -6, message: 'No error defined'},
      renderError: function (message, code) {
        return {code: (code !== undef ? -7 : code), message: (message ? 'No error defined' : message)};
      }
    },

    // TODO: Document
    onSuccess: function (callback, id, data) {
      // check if callback variable is a function
      if (_.isFunction(callback) === true) {
        // check if we have valid response data
        if (data === null || data === undef) {
          this.handleExceptions(this.exceptions.noResponse);
          return this;
        }

        // always only one parameter has value and second is null
        if (data !== null && id !== String(data.id)) {
          this.handleExceptions(this.exceptions.badResponseId);
        }

        // call the callback function with the result data
        callback.apply(this, [data.result, data.error]);
      } else {
        // fire an error
        this.onError(data);
      }
    },

    // TODO: Document
    onError: function (callback, data) {
      // check if we have valid response data
      if (data === null || data === undef) {
        this.handleExceptions(this.exceptions.noResponse);
        return this;
      }

      // check if we have an error object
      if (null !== data.error && undef !== data.error) {
        this.handleExceptions(data.error);
      } else {
        this.handleExceptions(this.exceptions.noDefError);
      }
    },

    // TODO: Document
    query: function (fn, params, callback) {
      var id = String((new Date()).getTime()),
        ret = null;
      this.responseID = id;
      // generate unique request id (timestamp)
      // check if params and the function name are ok, then...
      if (_.isArray(params) && _.isString(fn)) {
        // send query
        ret = $.ajax({
          contentType : this.contentType + '; charset=' + this.charset,
          type        : 'POST',
          dataType    : 'json',
          url         : this.url,
          data        : JSON.stringify({
            jsonrpc : '2.0',
            method  : this.namespace + this.namespaceDelimiter + fn,
            id      : id,
            params  : params
          }),
          statusCode  : {
            404: _.bind(function () { this.handleExceptions(this.exceptions['404']); }, this),
            500: _.bind(function () { this.handleExceptions(this.exceptions['500']); }, this)
          },
          success: _.bind(function (data, status, response) {
            if (data !== null && data.error !== undef) {
              this.onError(callback, data, status, response);
            } else {
              this.onSuccess(callback, id, data, status, response);
            }
          }, this),
          error: _.bind(function (jXhr, status, response) {
            if (jXhr.status !== 404 && jXhr.status !== 500) {
              this.onError(callback, jXhr, status, response);
            }
          }, this)
        });
      } else {
        ret = this.handleExceptions(this.exceptions.typeMissmatch);
      }

      return ret;
    },

    // TODO: Document
    checkMethods: function (cb, params, model, method, options, scb, ecb) {
      var definition          = null,
        deeperNested        = false,
        exec                = null,
        valuableDefinition  = [],
        changedAttributes   = {},
        def                 = null;

      // rewrite method if name is delete
      method = method === 'delete' ? 'remove' : method;

      // check if we have a proper method for the model
      if (!_.isArray(model.methods[method]) && !_.isFunction(model.methods[method])) {
        return this.handleExceptions(this.exceptions.typeMissmatch);
      }

      // execute function if it´s one, else, assign array
      if (_.isFunction(model.methods[method])) {
        if (!_.isString(storage[model.get('_rpcId')])) {
          _.each(storage[model.get('_rpcId')], function (value, key) {
            if (model.get(key) !== value) {
              changedAttributes[key] = true;
            }
          });
        }
        storage[model.get('_rpcId')] = model.toJSON();
        definition = _.bind(model.methods[method], model)(changedAttributes, options);
      } else {
        definition = model.methods[method];
      }

      // check if array is deeper nested
      if (_.isArray(definition[0])) {
        deeperNested = true;
      }

      // execute a single call
      if (deeperNested !== true) {
        def = _.clone(definition);
        exec = def.shift();
        if (def.length > 0) {
          _.each(def, function (param) {
            if (param === '') {
              valuableDefinition.push('');
            } else {
              if (model instanceof Backbone.Collection) {
                if (model[param] !== undef) {
                  if (_.isFunction(model[param])) {
                    valuableDefinition.push(model[param]());
                  } else {
                    valuableDefinition.push(model[param]);
                  }
                } else {
                  if (options[param] !== undef) {
                    valuableDefinition.push(options[param]);
                  }
                }
              } else {
                if (model.get(param) !== undef) {
                  valuableDefinition.push(model.get(param));
                } else {
                  if (options[param] !== undef) {
                    valuableDefinition.push(options[param]);
                  }
                  console.log(param);
                }
              }
            }
          });

        } else {
          valuableDefinition = [];
        }

        return cb(exec, valuableDefinition, scb, ecb);
      }

      // execute nested calls
      _.each(definition, function (localdef) {
        var def = _.clone(localdef);
        exec = null;
        valuableDefinition = [];
        exec = def.shift();
        _.each(def, function (param) {
          valuableDefinition.push(model.get(param));
        });
        return cb(exec, valuableDefinition, scb, ecb);
      });

      return null;
    },

    // TODO: Document
    invoke: function (method, model, options) {
      var defOpts = {
        success: function (result) {
          model.trigger('called:' + method, model, result);
          // check for a manually success callback
          if (options !== undef && _.isFunction(options.success)) {
            options.success(model, result);
          }
        },
        error: function (model, error) {
          model.trigger('error', model, error);
          model.trigger('error:' + method, model, error);
          // check for a manually success callback
          if (options !== undef && _.isFunction(options.error)) {
            options.error(model, error);
          }
        }
      };

      // sync the model
      Backbone.sync(method, model, defOpts);
      return this;
    },

    // Default exception handler
    defaultExceptionHandler: function (exception) {
      throw 'Error code: ' + exception.code + ' - message: ' + exception.message;
    },

    // Exception handler
    handleExceptions: function (exception) {
      var exceptionHandler = _.isFunction(this.options.exceptionHandler) ? this.options.exceptionHandler : this.defaultExceptionHandler;
      exceptionHandler.call(this, exception);
      return this;
    }
  };

  // assign rpc to backbone itself
  Backbone.Rpc = Rpc;

  // overwrite backbones model constructor
  Backbone.Model = Backbone.Model.extend({
    // TODO: Document
    constructor: function (model) {
      // check if the model has the rpc property and methods defined
      if (this.rpc !== undef && _.isFunction(this.rpc.invoke) === true && this.methods !== undef) {
        // walk through the methods
        _.each(this.methods, _.bind(function (method, signature) {
          // check if we have a 'non standard' signature
          if ({'read': 1, 'create': 1, 'remove': 1, 'update': 1}[signature] !== 1) {
            // generate the method for the signature
            this[signature] = _.bind(function (options) {
              // invoke the dynamicly created method
              this.rpc.invoke(signature, this, options);
              return this;
            }, this);
          }
        }, this));
      }

      // call the original constructor
      oldConst.apply(this, arguments);
    }
  });

  // overwrite backbones sync
  Backbone.sync = (function (Rpc) {
    // Generate a new Sync Method for JSON RPC Queuing
    var rpc = null,
      sync = function (method, model, options) {
        // Default success model callback
        var successCb = function (data, error) {
            // check if we have an error object
            if (error !== null && error !== undef) {
              options.error(model, error);
              return this;
            }

            // check if the rpc is used in a Backbone.Collection instance
            if (model instanceof Backbone.Collection) {
              // check if we have valid response data
              if (data !== undef && data !== null) {
                // clone the data and tag it to track changes
                if (typeof data[0] === 'object') {
                  _.each(data, function (item, key) {
                    item._rpcId = _.uniqueId('rpc_');
                    data[key] = item;
                    storage[item._rpcId] = item;
                  });
                } else {
                  _.each(data, function (item, key) {
                    storage[key] = item;
                  });
                }
              }
            }

            // clone and tag the data to track changes if we have a Backbone.Model instance
            if (model instanceof Backbone.Model && data !== undef && data !== null) {
              data._rpcId = _.uniqueId('rpc_');
              storage[data._rpcId] = data;
            }

            // change data attr to be an empty array, if it´s null or undefined
            if (data === undef || data === null) {
              data = [];
            }

            // invoke special return callback parser if defined
            if (model.parsers !== undef && model.parsers[method] !== undef && _.isFunction(model.parsers[method])) {
              model.parsers[method].apply(model, [data]);
            }

            // fire the 'real' backbone success callback
            options.success(data);
          },

        // define a local error callback that will hand over the data to the backbone error handler
          errorCb = function (data) {
            options.error(model, data);
          };

        // check if we have a correct (e.g. Backbone.Rpc) model instance
        if (model.rpc instanceof Rpc) {
          // assign the models JsonRpc instance locally
          rpc = model.rpc;

          // First, set the api url
          rpc.url = _.isFunction(model.url) ? model.url() : model.url;

          // Second, set the namespace
          if (_.isString(model.namespace) === true) {
            rpc.namespace = model.namespace;
          }

          // Third, check the remote method parameter
          if (model.methods === undef) {
            throw 'Backbone.Rpc Error: No Method(s) given!';
          } else {
            // If we have a proper method
            // assign the given paramters (if exist)
            // else an empty object
            if (typeof model.params !== 'object') {
              model.params = {};
            }
          }

          // go on and check the rpc methods
          return rpc.checkMethods(rpc.query, model.params, model, method, options, successCb, errorCb);
        } else {
          return sync.previous.apply(model, arguments);
        }

        return null;
      };

    // Expose the previous Backbone.sync as Backbone.sync.previous in case
    // the caller wishes to switch provider
    sync.previous = oldSync;

    return sync;
  }(Rpc));

  return Backbone;
}));;/**
* Bootstrap.js by @fat & @mdo
* plugins: bootstrap-transition.js, bootstrap-modal.js, bootstrap-dropdown.js, bootstrap-scrollspy.js, bootstrap-tab.js, bootstrap-tooltip.js, bootstrap-popover.js, bootstrap-affix.js, bootstrap-alert.js, bootstrap-button.js, bootstrap-collapse.js, bootstrap-carousel.js, bootstrap-typeahead.js
* Copyright 2012 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/
!function(a){a(function(){a.support.transition=function(){var a=function(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},c;for(c in b)if(a.style[c]!==undefined)return b[c]}();return a&&{end:a}}()})}(window.jQuery),!function(a){var b=function(b,c){this.options=c,this.$element=a(b).delegate('[data-dismiss="modal"]',"click.dismiss.modal",a.proxy(this.hide,this)),this.options.remote&&this.$element.find(".modal-body").load(this.options.remote)};b.prototype={constructor:b,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var b=this,c=a.Event("show");this.$element.trigger(c);if(this.isShown||c.isDefaultPrevented())return;this.isShown=!0,this.escape(),this.backdrop(function(){var c=a.support.transition&&b.$element.hasClass("fade");b.$element.parent().length||b.$element.appendTo(document.body),b.$element.show(),c&&b.$element[0].offsetWidth,b.$element.addClass("in").attr("aria-hidden",!1),b.enforceFocus(),c?b.$element.one(a.support.transition.end,function(){b.$element.focus().trigger("shown")}):b.$element.focus().trigger("shown")})},hide:function(b){b&&b.preventDefault();var c=this;b=a.Event("hide"),this.$element.trigger(b);if(!this.isShown||b.isDefaultPrevented())return;this.isShown=!1,this.escape(),a(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),a.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},enforceFocus:function(){var b=this;a(document).on("focusin.modal",function(a){b.$element[0]!==a.target&&!b.$element.has(a.target).length&&b.$element.focus()})},escape:function(){var a=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(b){b.which==27&&a.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var b=this,c=setTimeout(function(){b.$element.off(a.support.transition.end),b.hideModal()},500);this.$element.one(a.support.transition.end,function(){clearTimeout(c),b.hideModal()})},hideModal:function(){var a=this;this.$element.hide(),this.backdrop(function(){a.removeBackdrop(),a.$element.trigger("hidden")})},removeBackdrop:function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},backdrop:function(b){var c=this,d=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var e=a.support.transition&&d;this.$backdrop=a('<div class="modal-backdrop '+d+'" />').appendTo(document.body),this.$backdrop.click(this.options.backdrop=="static"?a.proxy(this.$element[0].focus,this.$element[0]):a.proxy(this.hide,this)),e&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in");if(!b)return;e?this.$backdrop.one(a.support.transition.end,b):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,b):b()):b&&b()}};var c=a.fn.modal;a.fn.modal=function(c){return this.each(function(){var d=a(this),e=d.data("modal"),f=a.extend({},a.fn.modal.defaults,d.data(),typeof c=="object"&&c);e||d.data("modal",e=new b(this,f)),typeof c=="string"?e[c]():f.show&&e.show()})},a.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},a.fn.modal.Constructor=b,a.fn.modal.noConflict=function(){return a.fn.modal=c,this},a(document).on("click.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d=c.attr("href"),e=a(c.attr("data-target")||d&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("modal")?"toggle":a.extend({remote:!/#/.test(d)&&d},e.data(),c.data());b.preventDefault(),e.modal(f).one("hide",function(){c.focus()})})}(window.jQuery),!function(a){function d(){a(".dropdown-backdrop").remove(),a(b).each(function(){e(a(this)).removeClass("open")})}function e(b){var c=b.attr("data-target"),d;c||(c=b.attr("href"),c=c&&/#/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,"")),d=c&&a(c);if(!d||!d.length)d=b.parent();return d}var b="[data-toggle=dropdown]",c=function(b){var c=a(b).on("click.dropdown.data-api",this.toggle);a("html").on("click.dropdown.data-api",function(){c.parent().removeClass("open")})};c.prototype={constructor:c,toggle:function(b){var c=a(this),f,g;if(c.is(".disabled, :disabled"))return;return f=e(c),g=f.hasClass("open"),d(),g||("ontouchstart"in document.documentElement&&a('<div class="dropdown-backdrop"/>').insertBefore(a(this)).on("click",d),f.toggleClass("open")),c.focus(),!1},keydown:function(c){var d,f,g,h,i,j;if(!/(38|40|27)/.test(c.keyCode))return;d=a(this),c.preventDefault(),c.stopPropagation();if(d.is(".disabled, :disabled"))return;h=e(d),i=h.hasClass("open");if(!i||i&&c.keyCode==27)return c.which==27&&h.find(b).focus(),d.click();f=a("[role=menu] li:not(.divider):visible a",h);if(!f.length)return;j=f.index(f.filter(":focus")),c.keyCode==38&&j>0&&j--,c.keyCode==40&&j<f.length-1&&j++,~j||(j=0),f.eq(j).focus()}};var f=a.fn.dropdown;a.fn.dropdown=function(b){return this.each(function(){var d=a(this),e=d.data("dropdown");e||d.data("dropdown",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.dropdown.Constructor=c,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=f,this},a(document).on("click.dropdown.data-api",d).on("click.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.dropdown.data-api",b,c.prototype.toggle).on("keydown.dropdown.data-api",b+", [role=menu]",c.prototype.keydown)}(window.jQuery),!function(a){function b(b,c){var d=a.proxy(this.process,this),e=a(b).is("body")?a(window):a(b),f;this.options=a.extend({},a.fn.scrollspy.defaults,c),this.$scrollElement=e.on("scroll.scroll-spy.data-api",d),this.selector=(this.options.target||(f=a(b).attr("href"))&&f.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=a("body"),this.refresh(),this.process()}b.prototype={constructor:b,refresh:function(){var b=this,c;this.offsets=a([]),this.targets=a([]),c=this.$body.find(this.selector).map(function(){var c=a(this),d=c.data("target")||c.attr("href"),e=/^#\w/.test(d)&&a(d);return e&&e.length&&[[e.position().top+(!a.isWindow(b.$scrollElement.get(0))&&b.$scrollElement.scrollTop()),d]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},process:function(){var a=this.$scrollElement.scrollTop()+this.options.offset,b=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,c=b-this.$scrollElement.height(),d=this.offsets,e=this.targets,f=this.activeTarget,g;if(a>=c)return f!=(g=e.last()[0])&&this.activate(g);for(g=d.length;g--;)f!=e[g]&&a>=d[g]&&(!d[g+1]||a<=d[g+1])&&this.activate(e[g])},activate:function(b){var c,d;this.activeTarget=b,a(this.selector).parent(".active").removeClass("active"),d=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',c=a(d).parent("li").addClass("active"),c.parent(".dropdown-menu").length&&(c=c.closest("li.dropdown").addClass("active")),c.trigger("activate")}};var c=a.fn.scrollspy;a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("scrollspy"),f=typeof c=="object"&&c;e||d.data("scrollspy",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.defaults={offset:10},a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=c,this},a(window).on("load",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(window.jQuery),!function(a){var b=function(b){this.element=a(b)};b.prototype={constructor:b,show:function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.attr("data-target"),e,f,g;d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,""));if(b.parent("li").hasClass("active"))return;e=c.find(".active:last a")[0],g=a.Event("show",{relatedTarget:e}),b.trigger(g);if(g.isDefaultPrevented())return;f=a(d),this.activate(b.parent("li"),c),this.activate(f,f.parent(),function(){b.trigger({type:"shown",relatedTarget:e})})},activate:function(b,c,d){function g(){e.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),f?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var e=c.find("> .active"),f=d&&a.support.transition&&e.hasClass("fade");f?e.one(a.support.transition.end,g):g(),e.removeClass("in")}};var c=a.fn.tab;a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("tab");e||d.data("tab",e=new b(this)),typeof c=="string"&&e[c]()})},a.fn.tab.Constructor=b,a.fn.tab.noConflict=function(){return a.fn.tab=c,this},a(document).on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})}(window.jQuery),!function(a){var b=function(a,b){this.init("tooltip",a,b)};b.prototype={constructor:b,init:function(b,c,d){var e,f,g,h,i;this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.enabled=!0,g=this.options.trigger.split(" ");for(i=g.length;i--;)h=g[i],h=="click"?this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this)):h!="manual"&&(e=h=="hover"?"mouseenter":"focus",f=h=="hover"?"mouseleave":"blur",this.$element.on(e+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(f+"."+this.type,this.options.selector,a.proxy(this.leave,this)));this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(b){return b=a.extend({},a.fn[this.type].defaults,this.$element.data(),b),b.delay&&typeof b.delay=="number"&&(b.delay={show:b.delay,hide:b.delay}),b},enter:function(b){var c=a.fn[this.type].defaults,d={},e;this._options&&a.each(this._options,function(a,b){c[a]!=b&&(d[a]=b)},this),e=a(b.currentTarget)[this.type](d).data(this.type);if(!e.options.delay||!e.options.delay.show)return e.show();clearTimeout(this.timeout),e.hoverState="in",this.timeout=setTimeout(function(){e.hoverState=="in"&&e.show()},e.options.delay.show)},leave:function(b){var c=a(b.currentTarget)[this.type](this._options).data(this.type);this.timeout&&clearTimeout(this.timeout);if(!c.options.delay||!c.options.delay.hide)return c.hide();c.hoverState="out",this.timeout=setTimeout(function(){c.hoverState=="out"&&c.hide()},c.options.delay.hide)},show:function(){var b,c,d,e,f,g,h=a.Event("show");if(this.hasContent()&&this.enabled){this.$element.trigger(h);if(h.isDefaultPrevented())return;b=this.tip(),this.setContent(),this.options.animation&&b.addClass("fade"),f=typeof this.options.placement=="function"?this.options.placement.call(this,b[0],this.$element[0]):this.options.placement,b.detach().css({top:0,left:0,display:"block"}),this.options.container?b.appendTo(this.options.container):b.insertAfter(this.$element),c=this.getPosition(),d=b[0].offsetWidth,e=b[0].offsetHeight;switch(f){case"bottom":g={top:c.top+c.height,left:c.left+c.width/2-d/2};break;case"top":g={top:c.top-e,left:c.left+c.width/2-d/2};break;case"left":g={top:c.top+c.height/2-e/2,left:c.left-d};break;case"right":g={top:c.top+c.height/2-e/2,left:c.left+c.width}}this.applyPlacement(g,f),this.$element.trigger("shown")}},applyPlacement:function(a,b){var c=this.tip(),d=c[0].offsetWidth,e=c[0].offsetHeight,f,g,h,i;c.offset(a).addClass(b).addClass("in"),f=c[0].offsetWidth,g=c[0].offsetHeight,b=="top"&&g!=e&&(a.top=a.top+e-g,i=!0),b=="bottom"||b=="top"?(h=0,a.left<0&&(h=a.left*-2,a.left=0,c.offset(a),f=c[0].offsetWidth,g=c[0].offsetHeight),this.replaceArrow(h-d+f,f,"left")):this.replaceArrow(g-e,g,"top"),i&&c.offset(a)},replaceArrow:function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},setContent:function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},hide:function(){function e(){var b=setTimeout(function(){c.off(a.support.transition.end).detach()},500);c.one(a.support.transition.end,function(){clearTimeout(b),c.detach()})}var b=this,c=this.tip(),d=a.Event("hide");this.$element.trigger(d);if(d.isDefaultPrevented())return;return c.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?e():c.detach(),this.$element.trigger("hidden"),this},fixTitle:function(){var a=this.$element;(a.attr("title")||typeof a.attr("data-original-title")!="string")&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},hasContent:function(){return this.getTitle()},getPosition:function(){var b=this.$element[0];return a.extend({},typeof b.getBoundingClientRect=="function"?b.getBoundingClientRect():{width:b.offsetWidth,height:b.offsetHeight},this.$element.offset())},getTitle:function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||(typeof c.title=="function"?c.title.call(b[0]):c.title),a},tip:function(){return this.$tip=this.$tip||a(this.options.template)},arrow:function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(b){var c=b?a(b.currentTarget)[this.type](this._options).data(this.type):this;c.tip().hasClass("in")?c.hide():c.show()},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}};var c=a.fn.tooltip;a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("tooltip"),f=typeof c=="object"&&c;e||d.data("tooltip",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.tooltip.Constructor=b,a.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},a.fn.tooltip.noConflict=function(){return a.fn.tooltip=c,this}}(window.jQuery),!function(a){var b=function(a,b){this.init("popover",a,b)};b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype,{constructor:b,setContent:function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content")[this.options.html?"html":"text"](c),a.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var a,b=this.$element,c=this.options;return a=(typeof c.content=="function"?c.content.call(b[0]):c.content)||b.attr("data-content"),a},tip:function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}});var c=a.fn.popover;a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("popover"),f=typeof c=="object"&&c;e||d.data("popover",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.popover.Constructor=b,a.fn.popover.defaults=a.extend({},a.fn.tooltip.defaults,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),a.fn.popover.noConflict=function(){return a.fn.popover=c,this}}(window.jQuery),!function(a){var b=function(b,c){this.options=a.extend({},a.fn.affix.defaults,c),this.$window=a(window).on("scroll.affix.data-api",a.proxy(this.checkPosition,this)).on("click.affix.data-api",a.proxy(function(){setTimeout(a.proxy(this.checkPosition,this),1)},this)),this.$element=a(b),this.checkPosition()};b.prototype.checkPosition=function(){if(!this.$element.is(":visible"))return;var b=a(document).height(),c=this.$window.scrollTop(),d=this.$element.offset(),e=this.options.offset,f=e.bottom,g=e.top,h="affix affix-top affix-bottom",i;typeof e!="object"&&(f=g=e),typeof g=="function"&&(g=e.top()),typeof f=="function"&&(f=e.bottom()),i=this.unpin!=null&&c+this.unpin<=d.top?!1:f!=null&&d.top+this.$element.height()>=b-f?"bottom":g!=null&&c<=g?"top":!1;if(this.affixed===i)return;this.affixed=i,this.unpin=i=="bottom"?d.top-c:null,this.$element.removeClass(h).addClass("affix"+(i?"-"+i:""))};var c=a.fn.affix;a.fn.affix=function(c){return this.each(function(){var d=a(this),e=d.data("affix"),f=typeof c=="object"&&c;e||d.data("affix",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.affix.Constructor=b,a.fn.affix.defaults={offset:0},a.fn.affix.noConflict=function(){return a.fn.affix=c,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var b=a(this),c=b.data();c.offset=c.offset||{},c.offsetBottom&&(c.offset.bottom=c.offsetBottom),c.offsetTop&&(c.offset.top=c.offsetTop),b.affix(c)})})}(window.jQuery),!function(a){var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function f(){e.trigger("closed").remove()}var c=a(this),d=c.attr("data-target"),e;d||(d=c.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),e=a(d),b&&b.preventDefault(),e.length||(e=c.hasClass("alert")?c:c.parent()),e.trigger(b=a.Event("close"));if(b.isDefaultPrevented())return;e.removeClass("in"),a.support.transition&&e.hasClass("fade")?e.on(a.support.transition.end,f):f()};var d=a.fn.alert;a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("alert");e||d.data("alert",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.alert.Constructor=c,a.fn.alert.noConflict=function(){return a.fn.alert=d,this},a(document).on("click.alert.data-api",b,c.prototype.close)}(window.jQuery),!function(a){var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.button.defaults,c)};b.prototype.setState=function(a){var b="disabled",c=this.$element,d=c.data(),e=c.is("input")?"val":"html";a+="Text",d.resetText||c.data("resetText",c[e]()),c[e](d[a]||this.options[a]),setTimeout(function(){a=="loadingText"?c.addClass(b).attr(b,b):c.removeClass(b).removeAttr(b)},0)},b.prototype.toggle=function(){var a=this.$element.closest('[data-toggle="buttons-radio"]');a&&a.find(".active").removeClass("active"),this.$element.toggleClass("active")};var c=a.fn.button;a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("button"),f=typeof c=="object"&&c;e||d.data("button",e=new b(this,f)),c=="toggle"?e.toggle():c&&e.setState(c)})},a.fn.button.defaults={loadingText:"loading..."},a.fn.button.Constructor=b,a.fn.button.noConflict=function(){return a.fn.button=c,this},a(document).on("click.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle")})}(window.jQuery),!function(a){var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.collapse.defaults,c),this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.prototype={constructor:b,dimension:function(){var a=this.$element.hasClass("width");return a?"width":"height"},show:function(){var b,c,d,e;if(this.transitioning||this.$element.hasClass("in"))return;b=this.dimension(),c=a.camelCase(["scroll",b].join("-")),d=this.$parent&&this.$parent.find("> .accordion-group > .in");if(d&&d.length){e=d.data("collapse");if(e&&e.transitioning)return;d.collapse("hide"),e||d.data("collapse",null)}this.$element[b](0),this.transition("addClass",a.Event("show"),"shown"),a.support.transition&&this.$element[b](this.$element[0][c])},hide:function(){var b;if(this.transitioning||!this.$element.hasClass("in"))return;b=this.dimension(),this.reset(this.$element[b]()),this.transition("removeClass",a.Event("hide"),"hidden"),this.$element[b](0)},reset:function(a){var b=this.dimension();return this.$element.removeClass("collapse")[b](a||"auto")[0].offsetWidth,this.$element[a!==null?"addClass":"removeClass"]("collapse"),this},transition:function(b,c,d){var e=this,f=function(){c.type=="show"&&e.reset(),e.transitioning=0,e.$element.trigger(d)};this.$element.trigger(c);if(c.isDefaultPrevented())return;this.transitioning=1,this.$element[b]("in"),a.support.transition&&this.$element.hasClass("collapse")?this.$element.one(a.support.transition.end,f):f()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}};var c=a.fn.collapse;a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("collapse"),f=a.extend({},a.fn.collapse.defaults,d.data(),typeof c=="object"&&c);e||d.data("collapse",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.collapse.defaults={toggle:!0},a.fn.collapse.Constructor=b,a.fn.collapse.noConflict=function(){return a.fn.collapse=c,this},a(document).on("click.collapse.data-api","[data-toggle=collapse]",function(b){var c=a(this),d,e=c.attr("data-target")||b.preventDefault()||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""),f=a(e).data("collapse")?"toggle":c.data();c[a(e).hasClass("in")?"addClass":"removeClass"]("collapsed"),a(e).collapse(f)})}(window.jQuery),!function(a){var b=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.options.pause=="hover"&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.prototype={cycle:function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},getActiveIndex:function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},to:function(b){var c=this.getActiveIndex(),d=this;if(b>this.$items.length-1||b<0)return;return this.sliding?this.$element.one("slid",function(){d.to(b)}):c==b?this.pause().cycle():this.slide(b>c?"next":"prev",a(this.$items[b]))},pause:function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition.end&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),clearInterval(this.interval),this.interval=null,this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(b,c){var d=this.$element.find(".item.active"),e=c||d[b](),f=this.interval,g=b=="next"?"left":"right",h=b=="next"?"first":"last",i=this,j;this.sliding=!0,f&&this.pause(),e=e.length?e:this.$element.find(".item")[h](),j=a.Event("slide",{relatedTarget:e[0],direction:g});if(e.hasClass("active"))return;this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid",function(){var b=a(i.$indicators.children()[i.getActiveIndex()]);b&&b.addClass("active")}));if(a.support.transition&&this.$element.hasClass("slide")){this.$element.trigger(j);if(j.isDefaultPrevented())return;e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),this.$element.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid")},0)})}else{this.$element.trigger(j);if(j.isDefaultPrevented())return;d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return f&&this.cycle(),this}};var c=a.fn.carousel;a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("carousel"),f=a.extend({},a.fn.carousel.defaults,typeof c=="object"&&c),g=typeof c=="string"?c:f.slide;e||d.data("carousel",e=new b(this,f)),typeof c=="number"?e.to(c):g?e[g]():f.interval&&e.pause().cycle()})},a.fn.carousel.defaults={interval:5e3,pause:"hover"},a.fn.carousel.Constructor=b,a.fn.carousel.noConflict=function(){return a.fn.carousel=c,this},a(document).on("click.carousel.data-api","[data-slide], [data-slide-to]",function(b){var c=a(this),d,e=a(c.attr("data-target")||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,"")),f=a.extend({},e.data(),c.data()),g;e.carousel(f),(g=c.attr("data-slide-to"))&&e.data("carousel").pause().to(g).cycle(),b.preventDefault()})}(window.jQuery),!function(a){var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.typeahead.defaults,c),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.source=this.options.source,this.$menu=a(this.options.menu),this.shown=!1,this.listen()};b.prototype={constructor:b,select:function(){var a=this.$menu.find(".active").attr("data-value");return this.$element.val(this.updater(a)).change(),this.hide()},updater:function(a){return a},show:function(){var b=a.extend({},this.$element.position(),{height:this.$element[0].offsetHeight});return this.$menu.insertAfter(this.$element).css({top:b.top+b.height,left:b.left}).show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(b){var c;return this.query=this.$element.val(),!this.query||this.query.length<this.options.minLength?this.shown?this.hide():this:(c=a.isFunction(this.source)?this.source(this.query,a.proxy(this.process,this)):this.source,c?this.process(c):this)},process:function(b){var c=this;return b=a.grep(b,function(a){return c.matcher(a)}),b=this.sorter(b),b.length?this.render(b.slice(0,this.options.items)).show():this.shown?this.hide():this},matcher:function(a){return~a.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(a){var b=[],c=[],d=[],e;while(e=a.shift())e.toLowerCase().indexOf(this.query.toLowerCase())?~e.indexOf(this.query)?c.push(e):d.push(e):b.push(e);return b.concat(c,d)},highlighter:function(a){var b=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return a.replace(new RegExp("("+b+")","ig"),function(a,b){return"<strong>"+b+"</strong>"})},render:function(b){var c=this;return b=a(b).map(function(b,d){return b=a(c.options.item).attr("data-value",d),b.find("a").html(c.highlighter(d)),b[0]}),b.first().addClass("active"),this.$menu.html(b),this},next:function(b){var c=this.$menu.find(".active").removeClass("active"),d=c.next();d.length||(d=a(this.$menu.find("li")[0])),d.addClass("active")},prev:function(a){var b=this.$menu.find(".active").removeClass("active"),c=b.prev();c.length||(c=this.$menu.find("li").last()),c.addClass("active")},listen:function(){this.$element.on("focus",a.proxy(this.focus,this)).on("blur",a.proxy(this.blur,this)).on("keypress",a.proxy(this.keypress,this)).on("keyup",a.proxy(this.keyup,this)),this.eventSupported("keydown")&&this.$element.on("keydown",a.proxy(this.keydown,this)),this.$menu.on("click",a.proxy(this.click,this)).on("mouseenter","li",a.proxy(this.mouseenter,this)).on("mouseleave","li",a.proxy(this.mouseleave,this))},eventSupported:function(a){var b=a in this.$element;return b||(this.$element.setAttribute(a,"return;"),b=typeof this.$element[a]=="function"),b},move:function(a){if(!this.shown)return;switch(a.keyCode){case 9:case 13:case 27:a.preventDefault();break;case 38:a.preventDefault(),this.prev();break;case 40:a.preventDefault(),this.next()}a.stopPropagation()},keydown:function(b){this.suppressKeyPressRepeat=~a.inArray(b.keyCode,[40,38,9,13,27]),this.move(b)},keypress:function(a){if(this.suppressKeyPressRepeat)return;this.move(a)},keyup:function(a){switch(a.keyCode){case 40:case 38:case 16:case 17:case 18:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}a.stopPropagation(),a.preventDefault()},focus:function(a){this.focused=!0},blur:function(a){this.focused=!1,!this.mousedover&&this.shown&&this.hide()},click:function(a){a.stopPropagation(),a.preventDefault(),this.select(),this.$element.focus()},mouseenter:function(b){this.mousedover=!0,this.$menu.find(".active").removeClass("active"),a(b.currentTarget).addClass("active")},mouseleave:function(a){this.mousedover=!1,!this.focused&&this.shown&&this.hide()}};var c=a.fn.typeahead;a.fn.typeahead=function(c){return this.each(function(){var d=a(this),e=d.data("typeahead"),f=typeof c=="object"&&c;e||d.data("typeahead",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1},a.fn.typeahead.Constructor=b,a.fn.typeahead.noConflict=function(){return a.fn.typeahead=c,this},a(document).on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(b){var c=a(this);if(c.data("typeahead"))return;c.typeahead(c.data())})}(window.jQuery);/* Chosen v1.0.0 | (c) 2011-2013 by Harvest | MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md */
!function(){var a,AbstractChosen,Chosen,SelectParser,b,c={}.hasOwnProperty,d=function(a,b){function d(){this.constructor=a}for(var e in b)c.call(b,e)&&(a[e]=b[e]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a};SelectParser=function(){function SelectParser(){this.options_index=0,this.parsed=[]}return SelectParser.prototype.add_node=function(a){return"OPTGROUP"===a.nodeName.toUpperCase()?this.add_group(a):this.add_option(a)},SelectParser.prototype.add_group=function(a){var b,c,d,e,f,g;for(b=this.parsed.length,this.parsed.push({array_index:b,group:!0,label:this.escapeExpression(a.label),children:0,disabled:a.disabled}),f=a.childNodes,g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(this.add_option(c,b,a.disabled));return g},SelectParser.prototype.add_option=function(a,b,c){return"OPTION"===a.nodeName.toUpperCase()?(""!==a.text?(null!=b&&(this.parsed[b].children+=1),this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:a.value,text:a.text,html:a.innerHTML,selected:a.selected,disabled:c===!0?c:a.disabled,group_array_index:b,classes:a.className,style:a.style.cssText})):this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,empty:!0}),this.options_index+=1):void 0},SelectParser.prototype.escapeExpression=function(a){var b,c;return null==a||a===!1?"":/[\&\<\>\"\'\`]/.test(a)?(b={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},c=/&(?!\w+;)|[\<\>\"\'\`]/g,a.replace(c,function(a){return b[a]||"&amp;"})):a},SelectParser}(),SelectParser.select_to_array=function(a){var b,c,d,e,f;for(c=new SelectParser,f=a.childNodes,d=0,e=f.length;e>d;d++)b=f[d],c.add_node(b);return c.parsed},AbstractChosen=function(){function AbstractChosen(a,b){this.form_field=a,this.options=null!=b?b:{},AbstractChosen.browser_is_supported()&&(this.is_multiple=this.form_field.multiple,this.set_default_text(),this.set_default_values(),this.setup(),this.set_up_html(),this.register_observers())}return AbstractChosen.prototype.set_default_values=function(){var a=this;return this.click_test_action=function(b){return a.test_active_click(b)},this.activate_action=function(b){return a.activate_field(b)},this.active_field=!1,this.mouse_on_container=!1,this.results_showing=!1,this.result_highlighted=null,this.result_single_selected=null,this.allow_single_deselect=null!=this.options.allow_single_deselect&&null!=this.form_field.options[0]&&""===this.form_field.options[0].text?this.options.allow_single_deselect:!1,this.disable_search_threshold=this.options.disable_search_threshold||0,this.disable_search=this.options.disable_search||!1,this.enable_split_word_search=null!=this.options.enable_split_word_search?this.options.enable_split_word_search:!0,this.group_search=null!=this.options.group_search?this.options.group_search:!0,this.search_contains=this.options.search_contains||!1,this.single_backstroke_delete=null!=this.options.single_backstroke_delete?this.options.single_backstroke_delete:!0,this.max_selected_options=this.options.max_selected_options||1/0,this.inherit_select_classes=this.options.inherit_select_classes||!1,this.display_selected_options=null!=this.options.display_selected_options?this.options.display_selected_options:!0,this.display_disabled_options=null!=this.options.display_disabled_options?this.options.display_disabled_options:!0},AbstractChosen.prototype.set_default_text=function(){return this.default_text=this.form_field.getAttribute("data-placeholder")?this.form_field.getAttribute("data-placeholder"):this.is_multiple?this.options.placeholder_text_multiple||this.options.placeholder_text||AbstractChosen.default_multiple_text:this.options.placeholder_text_single||this.options.placeholder_text||AbstractChosen.default_single_text,this.results_none_found=this.form_field.getAttribute("data-no_results_text")||this.options.no_results_text||AbstractChosen.default_no_result_text},AbstractChosen.prototype.mouse_enter=function(){return this.mouse_on_container=!0},AbstractChosen.prototype.mouse_leave=function(){return this.mouse_on_container=!1},AbstractChosen.prototype.input_focus=function(){var a=this;if(this.is_multiple){if(!this.active_field)return setTimeout(function(){return a.container_mousedown()},50)}else if(!this.active_field)return this.activate_field()},AbstractChosen.prototype.input_blur=function(){var a=this;return this.mouse_on_container?void 0:(this.active_field=!1,setTimeout(function(){return a.blur_test()},100))},AbstractChosen.prototype.results_option_build=function(a){var b,c,d,e,f;for(b="",f=this.results_data,d=0,e=f.length;e>d;d++)c=f[d],b+=c.group?this.result_add_group(c):this.result_add_option(c),(null!=a?a.first:void 0)&&(c.selected&&this.is_multiple?this.choice_build(c):c.selected&&!this.is_multiple&&this.single_set_selected_text(c.text));return b},AbstractChosen.prototype.result_add_option=function(a){var b,c;return a.search_match?this.include_option_in_results(a)?(b=[],a.disabled||a.selected&&this.is_multiple||b.push("active-result"),!a.disabled||a.selected&&this.is_multiple||b.push("disabled-result"),a.selected&&b.push("result-selected"),null!=a.group_array_index&&b.push("group-option"),""!==a.classes&&b.push(a.classes),c=""!==a.style.cssText?' style="'+a.style+'"':"",'<li class="'+b.join(" ")+'"'+c+' data-option-array-index="'+a.array_index+'">'+a.search_text+"</li>"):"":""},AbstractChosen.prototype.result_add_group=function(a){return a.search_match||a.group_match?a.active_options>0?'<li class="group-result">'+a.search_text+"</li>":"":""},AbstractChosen.prototype.results_update_field=function(){return this.set_default_text(),this.is_multiple||this.results_reset_cleanup(),this.result_clear_highlight(),this.result_single_selected=null,this.results_build(),this.results_showing?this.winnow_results():void 0},AbstractChosen.prototype.results_toggle=function(){return this.results_showing?this.results_hide():this.results_show()},AbstractChosen.prototype.results_search=function(){return this.results_showing?this.winnow_results():this.results_show()},AbstractChosen.prototype.winnow_results=function(){var a,b,c,d,e,f,g,h,i,j,k,l,m;for(this.no_results_clear(),e=0,g=this.get_search_text(),a=g.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),d=this.search_contains?"":"^",c=new RegExp(d+a,"i"),j=new RegExp(a,"i"),m=this.results_data,k=0,l=m.length;l>k;k++)b=m[k],b.search_match=!1,f=null,this.include_option_in_results(b)&&(b.group&&(b.group_match=!1,b.active_options=0),null!=b.group_array_index&&this.results_data[b.group_array_index]&&(f=this.results_data[b.group_array_index],0===f.active_options&&f.search_match&&(e+=1),f.active_options+=1),(!b.group||this.group_search)&&(b.search_text=b.group?b.label:b.html,b.search_match=this.search_string_match(b.search_text,c),b.search_match&&!b.group&&(e+=1),b.search_match?(g.length&&(h=b.search_text.search(j),i=b.search_text.substr(0,h+g.length)+"</em>"+b.search_text.substr(h+g.length),b.search_text=i.substr(0,h)+"<em>"+i.substr(h)),null!=f&&(f.group_match=!0)):null!=b.group_array_index&&this.results_data[b.group_array_index].search_match&&(b.search_match=!0)));return this.result_clear_highlight(),1>e&&g.length?(this.update_results_content(""),this.no_results(g)):(this.update_results_content(this.results_option_build()),this.winnow_results_set_highlight())},AbstractChosen.prototype.search_string_match=function(a,b){var c,d,e,f;if(b.test(a))return!0;if(this.enable_split_word_search&&(a.indexOf(" ")>=0||0===a.indexOf("["))&&(d=a.replace(/\[|\]/g,"").split(" "),d.length))for(e=0,f=d.length;f>e;e++)if(c=d[e],b.test(c))return!0},AbstractChosen.prototype.choices_count=function(){var a,b,c,d;if(null!=this.selected_option_count)return this.selected_option_count;for(this.selected_option_count=0,d=this.form_field.options,b=0,c=d.length;c>b;b++)a=d[b],a.selected&&(this.selected_option_count+=1);return this.selected_option_count},AbstractChosen.prototype.choices_click=function(a){return a.preventDefault(),this.results_showing||this.is_disabled?void 0:this.results_show()},AbstractChosen.prototype.keyup_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),b){case 8:if(this.is_multiple&&this.backstroke_length<1&&this.choices_count()>0)return this.keydown_backstroke();if(!this.pending_backstroke)return this.result_clear_highlight(),this.results_search();break;case 13:if(a.preventDefault(),this.results_showing)return this.result_select(a);break;case 27:return this.results_showing&&this.results_hide(),!0;case 9:case 38:case 40:case 16:case 91:case 17:break;default:return this.results_search()}},AbstractChosen.prototype.container_width=function(){return null!=this.options.width?this.options.width:""+this.form_field.offsetWidth+"px"},AbstractChosen.prototype.include_option_in_results=function(a){return this.is_multiple&&!this.display_selected_options&&a.selected?!1:!this.display_disabled_options&&a.disabled?!1:a.empty?!1:!0},AbstractChosen.browser_is_supported=function(){return"Microsoft Internet Explorer"===window.navigator.appName?document.documentMode>=8:/iP(od|hone)/i.test(window.navigator.userAgent)?!1:/Android/i.test(window.navigator.userAgent)&&/Mobile/i.test(window.navigator.userAgent)?!1:!0},AbstractChosen.default_multiple_text="Select Some Options",AbstractChosen.default_single_text="Select an Option",AbstractChosen.default_no_result_text="No results match",AbstractChosen}(),a=jQuery,a.fn.extend({chosen:function(b){return AbstractChosen.browser_is_supported()?this.each(function(){var c,d;c=a(this),d=c.data("chosen"),"destroy"===b&&d?d.destroy():d||c.data("chosen",new Chosen(this,b))}):this}}),Chosen=function(c){function Chosen(){return b=Chosen.__super__.constructor.apply(this,arguments)}return d(Chosen,c),Chosen.prototype.setup=function(){return this.form_field_jq=a(this.form_field),this.current_selectedIndex=this.form_field.selectedIndex,this.is_rtl=this.form_field_jq.hasClass("chosen-rtl")},Chosen.prototype.set_up_html=function(){var b,c;return b=["chosen-container"],b.push("chosen-container-"+(this.is_multiple?"multi":"single")),this.inherit_select_classes&&this.form_field.className&&b.push(this.form_field.className),this.is_rtl&&b.push("chosen-rtl"),c={"class":b.join(" "),style:"width: "+this.container_width()+";",title:this.form_field.title},this.form_field.id.length&&(c.id=this.form_field.id.replace(/[^\w]/g,"_")+"_chosen"),this.container=a("<div />",c),this.is_multiple?this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="'+this.default_text+'" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>'):this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>'+this.default_text+'</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>'),this.form_field_jq.hide().after(this.container),this.dropdown=this.container.find("div.chosen-drop").first(),this.search_field=this.container.find("input").first(),this.search_results=this.container.find("ul.chosen-results").first(),this.search_field_scale(),this.search_no_results=this.container.find("li.no-results").first(),this.is_multiple?(this.search_choices=this.container.find("ul.chosen-choices").first(),this.search_container=this.container.find("li.search-field").first()):(this.search_container=this.container.find("div.chosen-search").first(),this.selected_item=this.container.find(".chosen-single").first()),this.results_build(),this.set_tab_index(),this.set_label_behavior(),this.form_field_jq.trigger("chosen:ready",{chosen:this})},Chosen.prototype.register_observers=function(){var a=this;return this.container.bind("mousedown.chosen",function(b){a.container_mousedown(b)}),this.container.bind("mouseup.chosen",function(b){a.container_mouseup(b)}),this.container.bind("mouseenter.chosen",function(b){a.mouse_enter(b)}),this.container.bind("mouseleave.chosen",function(b){a.mouse_leave(b)}),this.search_results.bind("mouseup.chosen",function(b){a.search_results_mouseup(b)}),this.search_results.bind("mouseover.chosen",function(b){a.search_results_mouseover(b)}),this.search_results.bind("mouseout.chosen",function(b){a.search_results_mouseout(b)}),this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen",function(b){a.search_results_mousewheel(b)}),this.form_field_jq.bind("chosen:updated.chosen",function(b){a.results_update_field(b)}),this.form_field_jq.bind("chosen:activate.chosen",function(b){a.activate_field(b)}),this.form_field_jq.bind("chosen:open.chosen",function(b){a.container_mousedown(b)}),this.search_field.bind("blur.chosen",function(b){a.input_blur(b)}),this.search_field.bind("keyup.chosen",function(b){a.keyup_checker(b)}),this.search_field.bind("keydown.chosen",function(b){a.keydown_checker(b)}),this.search_field.bind("focus.chosen",function(b){a.input_focus(b)}),this.is_multiple?this.search_choices.bind("click.chosen",function(b){a.choices_click(b)}):this.container.bind("click.chosen",function(a){a.preventDefault()})},Chosen.prototype.destroy=function(){return a(document).unbind("click.chosen",this.click_test_action),this.search_field[0].tabIndex&&(this.form_field_jq[0].tabIndex=this.search_field[0].tabIndex),this.container.remove(),this.form_field_jq.removeData("chosen"),this.form_field_jq.show()},Chosen.prototype.search_field_disabled=function(){return this.is_disabled=this.form_field_jq[0].disabled,this.is_disabled?(this.container.addClass("chosen-disabled"),this.search_field[0].disabled=!0,this.is_multiple||this.selected_item.unbind("focus.chosen",this.activate_action),this.close_field()):(this.container.removeClass("chosen-disabled"),this.search_field[0].disabled=!1,this.is_multiple?void 0:this.selected_item.bind("focus.chosen",this.activate_action))},Chosen.prototype.container_mousedown=function(b){return this.is_disabled||(b&&"mousedown"===b.type&&!this.results_showing&&b.preventDefault(),null!=b&&a(b.target).hasClass("search-choice-close"))?void 0:(this.active_field?this.is_multiple||!b||a(b.target)[0]!==this.selected_item[0]&&!a(b.target).parents("a.chosen-single").length||(b.preventDefault(),this.results_toggle()):(this.is_multiple&&this.search_field.val(""),a(document).bind("click.chosen",this.click_test_action),this.results_show()),this.activate_field())},Chosen.prototype.container_mouseup=function(a){return"ABBR"!==a.target.nodeName||this.is_disabled?void 0:this.results_reset(a)},Chosen.prototype.search_results_mousewheel=function(a){var b,c,d;return b=-(null!=(c=a.originalEvent)?c.wheelDelta:void 0)||(null!=(d=a.originialEvent)?d.detail:void 0),null!=b?(a.preventDefault(),"DOMMouseScroll"===a.type&&(b=40*b),this.search_results.scrollTop(b+this.search_results.scrollTop())):void 0},Chosen.prototype.blur_test=function(){return!this.active_field&&this.container.hasClass("chosen-container-active")?this.close_field():void 0},Chosen.prototype.close_field=function(){return a(document).unbind("click.chosen",this.click_test_action),this.active_field=!1,this.results_hide(),this.container.removeClass("chosen-container-active"),this.clear_backstroke(),this.show_search_field_default(),this.search_field_scale()},Chosen.prototype.activate_field=function(){return this.container.addClass("chosen-container-active"),this.active_field=!0,this.search_field.val(this.search_field.val()),this.search_field.focus()},Chosen.prototype.test_active_click=function(b){return this.container.is(a(b.target).closest(".chosen-container"))?this.active_field=!0:this.close_field()},Chosen.prototype.results_build=function(){return this.parsing=!0,this.selected_option_count=null,this.results_data=SelectParser.select_to_array(this.form_field),this.is_multiple?this.search_choices.find("li.search-choice").remove():this.is_multiple||(this.single_set_selected_text(),this.disable_search||this.form_field.options.length<=this.disable_search_threshold?(this.search_field[0].readOnly=!0,this.container.addClass("chosen-container-single-nosearch")):(this.search_field[0].readOnly=!1,this.container.removeClass("chosen-container-single-nosearch"))),this.update_results_content(this.results_option_build({first:!0})),this.search_field_disabled(),this.show_search_field_default(),this.search_field_scale(),this.parsing=!1},Chosen.prototype.result_do_highlight=function(a){var b,c,d,e,f;if(a.length){if(this.result_clear_highlight(),this.result_highlight=a,this.result_highlight.addClass("highlighted"),d=parseInt(this.search_results.css("maxHeight"),10),f=this.search_results.scrollTop(),e=d+f,c=this.result_highlight.position().top+this.search_results.scrollTop(),b=c+this.result_highlight.outerHeight(),b>=e)return this.search_results.scrollTop(b-d>0?b-d:0);if(f>c)return this.search_results.scrollTop(c)}},Chosen.prototype.result_clear_highlight=function(){return this.result_highlight&&this.result_highlight.removeClass("highlighted"),this.result_highlight=null},Chosen.prototype.results_show=function(){return this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.container.addClass("chosen-with-drop"),this.form_field_jq.trigger("chosen:showing_dropdown",{chosen:this}),this.results_showing=!0,this.search_field.focus(),this.search_field.val(this.search_field.val()),this.winnow_results())},Chosen.prototype.update_results_content=function(a){return this.search_results.html(a)},Chosen.prototype.results_hide=function(){return this.results_showing&&(this.result_clear_highlight(),this.container.removeClass("chosen-with-drop"),this.form_field_jq.trigger("chosen:hiding_dropdown",{chosen:this})),this.results_showing=!1},Chosen.prototype.set_tab_index=function(){var a;return this.form_field.tabIndex?(a=this.form_field.tabIndex,this.form_field.tabIndex=-1,this.search_field[0].tabIndex=a):void 0},Chosen.prototype.set_label_behavior=function(){var b=this;return this.form_field_label=this.form_field_jq.parents("label"),!this.form_field_label.length&&this.form_field.id.length&&(this.form_field_label=a("label[for='"+this.form_field.id+"']")),this.form_field_label.length>0?this.form_field_label.bind("click.chosen",function(a){return b.is_multiple?b.container_mousedown(a):b.activate_field()}):void 0},Chosen.prototype.show_search_field_default=function(){return this.is_multiple&&this.choices_count()<1&&!this.active_field?(this.search_field.val(this.default_text),this.search_field.addClass("default")):(this.search_field.val(""),this.search_field.removeClass("default"))},Chosen.prototype.search_results_mouseup=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c.length?(this.result_highlight=c,this.result_select(b),this.search_field.focus()):void 0},Chosen.prototype.search_results_mouseover=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c?this.result_do_highlight(c):void 0},Chosen.prototype.search_results_mouseout=function(b){return a(b.target).hasClass("active-result")?this.result_clear_highlight():void 0},Chosen.prototype.choice_build=function(b){var c,d,e=this;return c=a("<li />",{"class":"search-choice"}).html("<span>"+b.html+"</span>"),b.disabled?c.addClass("search-choice-disabled"):(d=a("<a />",{"class":"search-choice-close","data-option-array-index":b.array_index}),d.bind("click.chosen",function(a){return e.choice_destroy_link_click(a)}),c.append(d)),this.search_container.before(c)},Chosen.prototype.choice_destroy_link_click=function(b){return b.preventDefault(),b.stopPropagation(),this.is_disabled?void 0:this.choice_destroy(a(b.target))},Chosen.prototype.choice_destroy=function(a){return this.result_deselect(a[0].getAttribute("data-option-array-index"))?(this.show_search_field_default(),this.is_multiple&&this.choices_count()>0&&this.search_field.val().length<1&&this.results_hide(),a.parents("li").first().remove(),this.search_field_scale()):void 0},Chosen.prototype.results_reset=function(){return this.form_field.options[0].selected=!0,this.selected_option_count=null,this.single_set_selected_text(),this.show_search_field_default(),this.results_reset_cleanup(),this.form_field_jq.trigger("change"),this.active_field?this.results_hide():void 0},Chosen.prototype.results_reset_cleanup=function(){return this.current_selectedIndex=this.form_field.selectedIndex,this.selected_item.find("abbr").remove()},Chosen.prototype.result_select=function(a){var b,c,d;return this.result_highlight?(b=this.result_highlight,this.result_clear_highlight(),this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.is_multiple?b.removeClass("active-result"):(this.result_single_selected&&(this.result_single_selected.removeClass("result-selected"),d=this.result_single_selected[0].getAttribute("data-option-array-index"),this.results_data[d].selected=!1),this.result_single_selected=b),b.addClass("result-selected"),c=this.results_data[b[0].getAttribute("data-option-array-index")],c.selected=!0,this.form_field.options[c.options_index].selected=!0,this.selected_option_count=null,this.is_multiple?this.choice_build(c):this.single_set_selected_text(c.text),(a.metaKey||a.ctrlKey)&&this.is_multiple||this.results_hide(),this.search_field.val(""),(this.is_multiple||this.form_field.selectedIndex!==this.current_selectedIndex)&&this.form_field_jq.trigger("change",{selected:this.form_field.options[c.options_index].value}),this.current_selectedIndex=this.form_field.selectedIndex,this.search_field_scale())):void 0},Chosen.prototype.single_set_selected_text=function(a){return null==a&&(a=this.default_text),a===this.default_text?this.selected_item.addClass("chosen-default"):(this.single_deselect_control_build(),this.selected_item.removeClass("chosen-default")),this.selected_item.find("span").text(a)},Chosen.prototype.result_deselect=function(a){var b;return b=this.results_data[a],this.form_field.options[b.options_index].disabled?!1:(b.selected=!1,this.form_field.options[b.options_index].selected=!1,this.selected_option_count=null,this.result_clear_highlight(),this.results_showing&&this.winnow_results(),this.form_field_jq.trigger("change",{deselected:this.form_field.options[b.options_index].value}),this.search_field_scale(),!0)},Chosen.prototype.single_deselect_control_build=function(){return this.allow_single_deselect?(this.selected_item.find("abbr").length||this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>'),this.selected_item.addClass("chosen-single-with-deselect")):void 0},Chosen.prototype.get_search_text=function(){return this.search_field.val()===this.default_text?"":a("<div/>").text(a.trim(this.search_field.val())).html()},Chosen.prototype.winnow_results_set_highlight=function(){var a,b;return b=this.is_multiple?[]:this.search_results.find(".result-selected.active-result"),a=b.length?b.first():this.search_results.find(".active-result").first(),null!=a?this.result_do_highlight(a):void 0},Chosen.prototype.no_results=function(b){var c;return c=a('<li class="no-results">'+this.results_none_found+' "<span></span>"</li>'),c.find("span").first().html(b),this.search_results.append(c)},Chosen.prototype.no_results_clear=function(){return this.search_results.find(".no-results").remove()},Chosen.prototype.keydown_arrow=function(){var a;return this.results_showing&&this.result_highlight?(a=this.result_highlight.nextAll("li.active-result").first())?this.result_do_highlight(a):void 0:this.results_show()},Chosen.prototype.keyup_arrow=function(){var a;return this.results_showing||this.is_multiple?this.result_highlight?(a=this.result_highlight.prevAll("li.active-result"),a.length?this.result_do_highlight(a.first()):(this.choices_count()>0&&this.results_hide(),this.result_clear_highlight())):void 0:this.results_show()},Chosen.prototype.keydown_backstroke=function(){var a;return this.pending_backstroke?(this.choice_destroy(this.pending_backstroke.find("a").first()),this.clear_backstroke()):(a=this.search_container.siblings("li.search-choice").last(),a.length&&!a.hasClass("search-choice-disabled")?(this.pending_backstroke=a,this.single_backstroke_delete?this.keydown_backstroke():this.pending_backstroke.addClass("search-choice-focus")):void 0)},Chosen.prototype.clear_backstroke=function(){return this.pending_backstroke&&this.pending_backstroke.removeClass("search-choice-focus"),this.pending_backstroke=null},Chosen.prototype.keydown_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),8!==b&&this.pending_backstroke&&this.clear_backstroke(),b){case 8:this.backstroke_length=this.search_field.val().length;break;case 9:this.results_showing&&!this.is_multiple&&this.result_select(a),this.mouse_on_container=!1;break;case 13:a.preventDefault();break;case 38:a.preventDefault(),this.keyup_arrow();break;case 40:a.preventDefault(),this.keydown_arrow()}},Chosen.prototype.search_field_scale=function(){var b,c,d,e,f,g,h,i,j;if(this.is_multiple){for(d=0,h=0,f="position:absolute; left: -1000px; top: -1000px; display:none;",g=["font-size","font-style","font-weight","font-family","line-height","text-transform","letter-spacing"],i=0,j=g.length;j>i;i++)e=g[i],f+=e+":"+this.search_field.css(e)+";";return b=a("<div />",{style:f}),b.text(this.search_field.val()),a("body").append(b),h=b.width()+25,b.remove(),c=this.container.outerWidth(),h>c-10&&(h=c-10),this.search_field.css({width:h+"px"})}},Chosen}(AbstractChosen)}.call(this);;/*! jQuery UI - v1.10.3 - 2013-12-27
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.ui.button.js, jquery.ui.dialog.js, jquery.ui.progressbar.js, jquery.ui.slider.js, jquery.ui.tabs.js
* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */

(function(e,t){function i(t,i){var s,n,r,o=t.nodeName.toLowerCase();return"area"===o?(s=t.parentNode,n=s.name,t.href&&n&&"map"===s.nodeName.toLowerCase()?(r=e("img[usemap=#"+n+"]")[0],!!r&&a(r)):!1):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&a(t)}function a(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var s=0,n=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,a){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),a&&a.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var a,s,n=e(this[0]);n.length&&n[0]!==document;){if(a=n.css("position"),("absolute"===a||"relative"===a||"fixed"===a)&&(s=parseInt(n.css("zIndex"),10),!isNaN(s)&&0!==s))return s;n=n.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++s)})},removeUniqueId:function(){return this.each(function(){n.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,a){return!!e.data(t,a[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var a=e.attr(t,"tabindex"),s=isNaN(a);return(s||a>=0)&&i(t,!s)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,a){function s(t,i,a,s){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,a&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===a?["Left","Right"]:["Top","Bottom"],r=a.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+a]=function(i){return i===t?o["inner"+a].call(this):this.each(function(){e(this).css(r,s(this,i)+"px")})},e.fn["outer"+a]=function(t,i){return"number"!=typeof t?o["outer"+a].call(this,t):this.each(function(){e(this).css(r,s(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,a){var s,n=e.ui[t].prototype;for(s in a)n.plugins[s]=n.plugins[s]||[],n.plugins[s].push([i,a[s]])},call:function(e,t,i){var a,s=e.plugins[t];if(s&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(a=0;s.length>a;a++)e.options[s[a][0]]&&s[a][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var a=i&&"left"===i?"scrollLeft":"scrollTop",s=!1;return t[a]>0?!0:(t[a]=1,s=t[a]>0,t[a]=0,s)}})})(jQuery);(function(e,t){var i=0,s=Array.prototype.slice,a=e.cleanData;e.cleanData=function(t){for(var i,s=0;null!=(i=t[s]);s++)try{e(i).triggerHandler("remove")}catch(n){}a(t)},e.widget=function(i,s,a){var n,r,o,h,l={},u=i.split(".")[0];i=i.split(".")[1],n=u+"-"+i,a||(a=s,s=e.Widget),e.expr[":"][n.toLowerCase()]=function(t){return!!e.data(t,n)},e[u]=e[u]||{},r=e[u][i],o=e[u][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new o(e,i)},e.extend(o,r,{version:a.version,_proto:e.extend({},a),_childConstructors:[]}),h=new s,h.options=e.widget.extend({},h.options),e.each(a,function(i,a){return e.isFunction(a)?(l[i]=function(){var e=function(){return s.prototype[i].apply(this,arguments)},t=function(e){return s.prototype[i].apply(this,e)};return function(){var i,s=this._super,n=this._superApply;return this._super=e,this._superApply=t,i=a.apply(this,arguments),this._super=s,this._superApply=n,i}}(),t):(l[i]=a,t)}),o.prototype=e.widget.extend(h,{widgetEventPrefix:r?h.widgetEventPrefix:i},l,{constructor:o,namespace:u,widgetName:i,widgetFullName:n}),r?(e.each(r._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete r._childConstructors):s._childConstructors.push(o),e.widget.bridge(i,o)},e.widget.extend=function(i){for(var a,n,r=s.call(arguments,1),o=0,h=r.length;h>o;o++)for(a in r[o])n=r[o][a],r[o].hasOwnProperty(a)&&n!==t&&(i[a]=e.isPlainObject(n)?e.isPlainObject(i[a])?e.widget.extend({},i[a],n):e.widget.extend({},n):n);return i},e.widget.bridge=function(i,a){var n=a.prototype.widgetFullName||i;e.fn[i]=function(r){var o="string"==typeof r,h=s.call(arguments,1),l=this;return r=!o&&h.length?e.widget.extend.apply(null,[r].concat(h)):r,o?this.each(function(){var s,a=e.data(this,n);return a?e.isFunction(a[r])&&"_"!==r.charAt(0)?(s=a[r].apply(a,h),s!==a&&s!==t?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):t):e.error("no such method '"+r+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+r+"'")}):this.each(function(){var t=e.data(this,n);t?t.option(r||{})._init():e.data(this,n,new a(r,this))}),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,s){var a,n,r,o=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(o={},a=i.split("."),i=a.shift(),a.length){for(n=o[i]=e.widget.extend({},this.options[i]),r=0;a.length-1>r;r++)n[a[r]]=n[a[r]]||{},n=n[a[r]];if(i=a.pop(),s===t)return n[i]===t?null:n[i];n[i]=s}else{if(s===t)return this.options[i]===t?null:this.options[i];o[i]=s}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,a){var n,r=this;"boolean"!=typeof i&&(a=s,s=i,i=!1),a?(s=n=e(s),this.bindings=this.bindings.add(s)):(a=s,s=this.element,n=this.widget()),e.each(a,function(a,o){function h(){return i||r.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?r[o]:o).apply(r,arguments):t}"string"!=typeof o&&(h.guid=o.guid=o.guid||h.guid||e.guid++);var l=a.match(/^(\w+)\s*(.*)$/),u=l[1]+r.eventNamespace,c=l[2];c?n.delegate(c,u,h):s.bind(u,h)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var a,n,r=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],n=i.originalEvent)for(a in n)a in i||(i[a]=n[a]);return this.element.trigger(i,s),!(e.isFunction(r)&&r.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,a,n){"string"==typeof a&&(a={effect:a});var r,o=a?a===!0||"number"==typeof a?i:a.effect||i:t;a=a||{},"number"==typeof a&&(a={duration:a}),r=!e.isEmptyObject(a),a.complete=n,a.delay&&s.delay(a.delay),r&&e.effects&&e.effects.effect[o]?s[t](a):o!==t&&s[o]?s[o](a.duration,a.easing,n):s.queue(function(i){e(this)[t](),n&&n.call(s[0]),i()})}})})(jQuery);(function(e){var t=!1;e(document).mouseup(function(){t=!1}),e.widget("ui.mouse",{version:"1.10.3",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!t){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,a=1===i.which,n="string"==typeof this.options.cancel&&i.target.nodeName?e(i.target).closest(this.options.cancel).length:!1;return a&&!n&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===e.data(i.target,this.widgetName+".preventClickEvent")&&e.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return s._mouseMove(e)},this._mouseUpDelegate=function(e){return s._mouseUp(e)},e(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),t=!0,!0)):!0}},_mouseMove:function(t){return e.ui.ie&&(!document.documentMode||9>document.documentMode)&&!t.button?this._mouseUp(t):this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted)},_mouseUp:function(t){return e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})})(jQuery);(function(e,t){function i(e,t,i){return[parseFloat(e[0])*(p.test(e[0])?t/100:1),parseFloat(e[1])*(p.test(e[1])?i/100:1)]}function s(t,i){return parseInt(e.css(t,i),10)||0}function a(t){var i=t[0];return 9===i.nodeType?{width:t.width(),height:t.height(),offset:{top:0,left:0}}:e.isWindow(i)?{width:t.width(),height:t.height(),offset:{top:t.scrollTop(),left:t.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:t.outerWidth(),height:t.outerHeight(),offset:t.offset()}}e.ui=e.ui||{};var n,r=Math.max,o=Math.abs,h=Math.round,l=/left|center|right/,u=/top|center|bottom/,c=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=e.fn.position;e.position={scrollbarWidth:function(){if(n!==t)return n;var i,s,a=e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),r=a.children()[0];return e("body").append(a),i=r.offsetWidth,a.css("overflow","scroll"),s=r.offsetWidth,i===s&&(s=a[0].clientWidth),a.remove(),n=i-s},getScrollInfo:function(t){var i=t.isWindow?"":t.element.css("overflow-x"),s=t.isWindow?"":t.element.css("overflow-y"),a="scroll"===i||"auto"===i&&t.width<t.element[0].scrollWidth,n="scroll"===s||"auto"===s&&t.height<t.element[0].scrollHeight;return{width:n?e.position.scrollbarWidth():0,height:a?e.position.scrollbarWidth():0}},getWithinInfo:function(t){var i=e(t||window),s=e.isWindow(i[0]);return{element:i,isWindow:s,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},e.fn.position=function(t){if(!t||!t.of)return f.apply(this,arguments);t=e.extend({},t);var n,p,m,g,v,y,b=e(t.of),_=e.position.getWithinInfo(t.within),x=e.position.getScrollInfo(_),k=(t.collision||"flip").split(" "),w={};return y=a(b),b[0].preventDefault&&(t.at="left top"),p=y.width,m=y.height,g=y.offset,v=e.extend({},g),e.each(["my","at"],function(){var e,i,s=(t[this]||"").split(" ");1===s.length&&(s=l.test(s[0])?s.concat(["center"]):u.test(s[0])?["center"].concat(s):["center","center"]),s[0]=l.test(s[0])?s[0]:"center",s[1]=u.test(s[1])?s[1]:"center",e=c.exec(s[0]),i=c.exec(s[1]),w[this]=[e?e[0]:0,i?i[0]:0],t[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===k.length&&(k[1]=k[0]),"right"===t.at[0]?v.left+=p:"center"===t.at[0]&&(v.left+=p/2),"bottom"===t.at[1]?v.top+=m:"center"===t.at[1]&&(v.top+=m/2),n=i(w.at,p,m),v.left+=n[0],v.top+=n[1],this.each(function(){var a,l,u=e(this),c=u.outerWidth(),d=u.outerHeight(),f=s(this,"marginLeft"),y=s(this,"marginTop"),D=c+f+s(this,"marginRight")+x.width,T=d+y+s(this,"marginBottom")+x.height,M=e.extend({},v),S=i(w.my,u.outerWidth(),u.outerHeight());"right"===t.my[0]?M.left-=c:"center"===t.my[0]&&(M.left-=c/2),"bottom"===t.my[1]?M.top-=d:"center"===t.my[1]&&(M.top-=d/2),M.left+=S[0],M.top+=S[1],e.support.offsetFractions||(M.left=h(M.left),M.top=h(M.top)),a={marginLeft:f,marginTop:y},e.each(["left","top"],function(i,s){e.ui.position[k[i]]&&e.ui.position[k[i]][s](M,{targetWidth:p,targetHeight:m,elemWidth:c,elemHeight:d,collisionPosition:a,collisionWidth:D,collisionHeight:T,offset:[n[0]+S[0],n[1]+S[1]],my:t.my,at:t.at,within:_,elem:u})}),t.using&&(l=function(e){var i=g.left-M.left,s=i+p-c,a=g.top-M.top,n=a+m-d,h={target:{element:b,left:g.left,top:g.top,width:p,height:m},element:{element:u,left:M.left,top:M.top,width:c,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>n?"top":a>0?"bottom":"middle"};c>p&&p>o(i+s)&&(h.horizontal="center"),d>m&&m>o(a+n)&&(h.vertical="middle"),h.important=r(o(i),o(s))>r(o(a),o(n))?"horizontal":"vertical",t.using.call(this,e,h)}),u.offset(e.extend(M,{using:l}))})},e.ui.position={fit:{left:function(e,t){var i,s=t.within,a=s.isWindow?s.scrollLeft:s.offset.left,n=s.width,o=e.left-t.collisionPosition.marginLeft,h=a-o,l=o+t.collisionWidth-n-a;t.collisionWidth>n?h>0&&0>=l?(i=e.left+h+t.collisionWidth-n-a,e.left+=h-i):e.left=l>0&&0>=h?a:h>l?a+n-t.collisionWidth:a:h>0?e.left+=h:l>0?e.left-=l:e.left=r(e.left-o,e.left)},top:function(e,t){var i,s=t.within,a=s.isWindow?s.scrollTop:s.offset.top,n=t.within.height,o=e.top-t.collisionPosition.marginTop,h=a-o,l=o+t.collisionHeight-n-a;t.collisionHeight>n?h>0&&0>=l?(i=e.top+h+t.collisionHeight-n-a,e.top+=h-i):e.top=l>0&&0>=h?a:h>l?a+n-t.collisionHeight:a:h>0?e.top+=h:l>0?e.top-=l:e.top=r(e.top-o,e.top)}},flip:{left:function(e,t){var i,s,a=t.within,n=a.offset.left+a.scrollLeft,r=a.width,h=a.isWindow?a.scrollLeft:a.offset.left,l=e.left-t.collisionPosition.marginLeft,u=l-h,c=l+t.collisionWidth-r-h,d="left"===t.my[0]?-t.elemWidth:"right"===t.my[0]?t.elemWidth:0,p="left"===t.at[0]?t.targetWidth:"right"===t.at[0]?-t.targetWidth:0,f=-2*t.offset[0];0>u?(i=e.left+d+p+f+t.collisionWidth-r-n,(0>i||o(u)>i)&&(e.left+=d+p+f)):c>0&&(s=e.left-t.collisionPosition.marginLeft+d+p+f-h,(s>0||c>o(s))&&(e.left+=d+p+f))},top:function(e,t){var i,s,a=t.within,n=a.offset.top+a.scrollTop,r=a.height,h=a.isWindow?a.scrollTop:a.offset.top,l=e.top-t.collisionPosition.marginTop,u=l-h,c=l+t.collisionHeight-r-h,d="top"===t.my[1],p=d?-t.elemHeight:"bottom"===t.my[1]?t.elemHeight:0,f="top"===t.at[1]?t.targetHeight:"bottom"===t.at[1]?-t.targetHeight:0,m=-2*t.offset[1];0>u?(s=e.top+p+f+m+t.collisionHeight-r-n,e.top+p+f+m>u&&(0>s||o(u)>s)&&(e.top+=p+f+m)):c>0&&(i=e.top-t.collisionPosition.marginTop+p+f+m-h,e.top+p+f+m>c&&(i>0||c>o(i))&&(e.top+=p+f+m))}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments)},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments)}}},function(){var t,i,s,a,n,r=document.getElementsByTagName("body")[0],o=document.createElement("div");t=document.createElement(r?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},r&&e.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(n in s)t.style[n]=s[n];t.appendChild(o),i=r||document.documentElement,i.insertBefore(t,i.firstChild),o.style.cssText="position: absolute; left: 10.7432222px;",a=e(o).offset().left,e.support.offsetFractions=a>10&&11>a,t.innerHTML="",i.removeChild(t)}()})(jQuery);(function(e){e.widget("ui.draggable",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"!==this.options.helper||/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy()},_mouseCapture:function(t){var i=this.options;return this.helper||i.disabled||e(t.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(t),this.handle?(e(i.iframeFix===!0?"iframe":i.iframeFix).each(function(){e("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(e(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(t){var i=this.options;return this.helper=this._createHelper(t),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),e.ui.ddmanager&&(e.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offsetParent=this.helper.offsetParent(),this.offsetParentCssPosition=this.offsetParent.css("position"),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},this.offset.scroll=!1,e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",t)===!1?(this._clear(),!1):(this._cacheHelperProportions(),e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this._mouseDrag(t,!0),e.ui.ddmanager&&e.ui.ddmanager.dragStart(this,t),!0)},_mouseDrag:function(t,i){if("fixed"===this.offsetParentCssPosition&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),!i){var a=this._uiHash();if(this._trigger("drag",t,a)===!1)return this._mouseUp({}),!1;this.position=a.position}return this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),!1},_mouseStop:function(t){var i=this,a=!1;return e.ui.ddmanager&&!this.options.dropBehaviour&&(a=e.ui.ddmanager.drop(this,t)),this.dropped&&(a=this.dropped,this.dropped=!1),"original"!==this.options.helper||e.contains(this.element[0].ownerDocument,this.element[0])?("invalid"===this.options.revert&&!a||"valid"===this.options.revert&&a||this.options.revert===!0||e.isFunction(this.options.revert)&&this.options.revert.call(this.element,a)?e(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",t)!==!1&&i._clear()}):this._trigger("stop",t)!==!1&&this._clear(),!1):!1},_mouseUp:function(t){return e("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),e.ui.ddmanager&&e.ui.ddmanager.dragStop(this,t),e.ui.mouse.prototype._mouseUp.call(this,t)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(t){return this.options.handle?!!e(t.target).closest(this.element.find(this.options.handle)).length:!0},_createHelper:function(t){var i=this.options,a=e.isFunction(i.helper)?e(i.helper.apply(this.element[0],[t])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return a.parents("body").length||a.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),a[0]===this.element[0]||/(fixed|absolute)/.test(a.css("position"))||a.css("position","absolute"),a},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){var t=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&e.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var e=this.element.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,a,s=this.options;return s.containment?"window"===s.containment?(this.containment=[e(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,e(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,e(window).scrollLeft()+e(window).width()-this.helperProportions.width-this.margins.left,e(window).scrollTop()+(e(window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):"document"===s.containment?(this.containment=[0,0,e(document).width()-this.helperProportions.width-this.margins.left,(e(document).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):s.containment.constructor===Array?(this.containment=s.containment,undefined):("parent"===s.containment&&(s.containment=this.helper[0].parentNode),i=e(s.containment),a=i[0],a&&(t="hidden"!==i.css("overflow"),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(t?Math.max(a.scrollWidth,a.offsetWidth):a.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(t?Math.max(a.scrollHeight,a.offsetHeight):a.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=i),undefined):(this.containment=null,undefined)},_convertPositionTo:function(t,i){i||(i=this.position);var a="absolute"===t?1:-1,s="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent;return this.offset.scroll||(this.offset.scroll={top:s.scrollTop(),left:s.scrollLeft()}),{top:i.top+this.offset.relative.top*a+this.offset.parent.top*a-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top)*a,left:i.left+this.offset.relative.left*a+this.offset.parent.left*a-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)*a}},_generatePosition:function(t){var i,a,s,n,r=this.options,o="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,l=t.pageX,h=t.pageY;return this.offset.scroll||(this.offset.scroll={top:o.scrollTop(),left:o.scrollLeft()}),this.originalPosition&&(this.containment&&(this.relative_container?(a=this.relative_container.offset(),i=[this.containment[0]+a.left,this.containment[1]+a.top,this.containment[2]+a.left,this.containment[3]+a.top]):i=this.containment,t.pageX-this.offset.click.left<i[0]&&(l=i[0]+this.offset.click.left),t.pageY-this.offset.click.top<i[1]&&(h=i[1]+this.offset.click.top),t.pageX-this.offset.click.left>i[2]&&(l=i[2]+this.offset.click.left),t.pageY-this.offset.click.top>i[3]&&(h=i[3]+this.offset.click.top)),r.grid&&(s=r.grid[1]?this.originalPageY+Math.round((h-this.originalPageY)/r.grid[1])*r.grid[1]:this.originalPageY,h=i?s-this.offset.click.top>=i[1]||s-this.offset.click.top>i[3]?s:s-this.offset.click.top>=i[1]?s-r.grid[1]:s+r.grid[1]:s,n=r.grid[0]?this.originalPageX+Math.round((l-this.originalPageX)/r.grid[0])*r.grid[0]:this.originalPageX,l=i?n-this.offset.click.left>=i[0]||n-this.offset.click.left>i[2]?n:n-this.offset.click.left>=i[0]?n-r.grid[0]:n+r.grid[0]:n)),{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top),left:l-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(t,i,a){return a=a||this._uiHash(),e.ui.plugin.call(this,t,[i,a]),"drag"===t&&(this.positionAbs=this._convertPositionTo("absolute")),e.Widget.prototype._trigger.call(this,t,i,a)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),e.ui.plugin.add("draggable","connectToSortable",{start:function(t,i){var a=e(this).data("ui-draggable"),s=a.options,n=e.extend({},i,{item:a.element});a.sortables=[],e(s.connectToSortable).each(function(){var i=e.data(this,"ui-sortable");i&&!i.options.disabled&&(a.sortables.push({instance:i,shouldRevert:i.options.revert}),i.refreshPositions(),i._trigger("activate",t,n))})},stop:function(t,i){var a=e(this).data("ui-draggable"),s=e.extend({},i,{item:a.element});e.each(a.sortables,function(){this.instance.isOver?(this.instance.isOver=0,a.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=this.shouldRevert),this.instance._mouseStop(t),this.instance.options.helper=this.instance.options._helper,"original"===a.options.helper&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",t,s))})},drag:function(t,i){var a=e(this).data("ui-draggable"),s=this;e.each(a.sortables,function(){var n=!1,r=this;this.instance.positionAbs=a.positionAbs,this.instance.helperProportions=a.helperProportions,this.instance.offset.click=a.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(n=!0,e.each(a.sortables,function(){return this.instance.positionAbs=a.positionAbs,this.instance.helperProportions=a.helperProportions,this.instance.offset.click=a.offset.click,this!==r&&this.instance._intersectsWith(this.instance.containerCache)&&e.contains(r.instance.element[0],this.instance.element[0])&&(n=!1),n})),n?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=e(s).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return i.helper[0]},t.target=this.instance.currentItem[0],this.instance._mouseCapture(t,!0),this.instance._mouseStart(t,!0,!0),this.instance.offset.click.top=a.offset.click.top,this.instance.offset.click.left=a.offset.click.left,this.instance.offset.parent.left-=a.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=a.offset.parent.top-this.instance.offset.parent.top,a._trigger("toSortable",t),a.dropped=this.instance.element,a.currentItem=a.element,this.instance.fromOutside=a),this.instance.currentItem&&this.instance._mouseDrag(t)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",t,this.instance._uiHash(this.instance)),this.instance._mouseStop(t,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),a._trigger("fromSortable",t),a.dropped=!1)})}}),e.ui.plugin.add("draggable","cursor",{start:function(){var t=e("body"),i=e(this).data("ui-draggable").options;t.css("cursor")&&(i._cursor=t.css("cursor")),t.css("cursor",i.cursor)},stop:function(){var t=e(this).data("ui-draggable").options;t._cursor&&e("body").css("cursor",t._cursor)}}),e.ui.plugin.add("draggable","opacity",{start:function(t,i){var a=e(i.helper),s=e(this).data("ui-draggable").options;a.css("opacity")&&(s._opacity=a.css("opacity")),a.css("opacity",s.opacity)},stop:function(t,i){var a=e(this).data("ui-draggable").options;a._opacity&&e(i.helper).css("opacity",a._opacity)}}),e.ui.plugin.add("draggable","scroll",{start:function(){var t=e(this).data("ui-draggable");t.scrollParent[0]!==document&&"HTML"!==t.scrollParent[0].tagName&&(t.overflowOffset=t.scrollParent.offset())},drag:function(t){var i=e(this).data("ui-draggable"),a=i.options,s=!1;i.scrollParent[0]!==document&&"HTML"!==i.scrollParent[0].tagName?(a.axis&&"x"===a.axis||(i.overflowOffset.top+i.scrollParent[0].offsetHeight-t.pageY<a.scrollSensitivity?i.scrollParent[0].scrollTop=s=i.scrollParent[0].scrollTop+a.scrollSpeed:t.pageY-i.overflowOffset.top<a.scrollSensitivity&&(i.scrollParent[0].scrollTop=s=i.scrollParent[0].scrollTop-a.scrollSpeed)),a.axis&&"y"===a.axis||(i.overflowOffset.left+i.scrollParent[0].offsetWidth-t.pageX<a.scrollSensitivity?i.scrollParent[0].scrollLeft=s=i.scrollParent[0].scrollLeft+a.scrollSpeed:t.pageX-i.overflowOffset.left<a.scrollSensitivity&&(i.scrollParent[0].scrollLeft=s=i.scrollParent[0].scrollLeft-a.scrollSpeed))):(a.axis&&"x"===a.axis||(t.pageY-e(document).scrollTop()<a.scrollSensitivity?s=e(document).scrollTop(e(document).scrollTop()-a.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<a.scrollSensitivity&&(s=e(document).scrollTop(e(document).scrollTop()+a.scrollSpeed))),a.axis&&"y"===a.axis||(t.pageX-e(document).scrollLeft()<a.scrollSensitivity?s=e(document).scrollLeft(e(document).scrollLeft()-a.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<a.scrollSensitivity&&(s=e(document).scrollLeft(e(document).scrollLeft()+a.scrollSpeed)))),s!==!1&&e.ui.ddmanager&&!a.dropBehaviour&&e.ui.ddmanager.prepareOffsets(i,t)}}),e.ui.plugin.add("draggable","snap",{start:function(){var t=e(this).data("ui-draggable"),i=t.options;t.snapElements=[],e(i.snap.constructor!==String?i.snap.items||":data(ui-draggable)":i.snap).each(function(){var i=e(this),a=i.offset();this!==t.element[0]&&t.snapElements.push({item:this,width:i.outerWidth(),height:i.outerHeight(),top:a.top,left:a.left})})},drag:function(t,i){var a,s,n,r,o,l,h,u,d,c,p=e(this).data("ui-draggable"),f=p.options,m=f.snapTolerance,g=i.offset.left,v=g+p.helperProportions.width,y=i.offset.top,b=y+p.helperProportions.height;for(d=p.snapElements.length-1;d>=0;d--)o=p.snapElements[d].left,l=o+p.snapElements[d].width,h=p.snapElements[d].top,u=h+p.snapElements[d].height,o-m>v||g>l+m||h-m>b||y>u+m||!e.contains(p.snapElements[d].item.ownerDocument,p.snapElements[d].item)?(p.snapElements[d].snapping&&p.options.snap.release&&p.options.snap.release.call(p.element,t,e.extend(p._uiHash(),{snapItem:p.snapElements[d].item})),p.snapElements[d].snapping=!1):("inner"!==f.snapMode&&(a=m>=Math.abs(h-b),s=m>=Math.abs(u-y),n=m>=Math.abs(o-v),r=m>=Math.abs(l-g),a&&(i.position.top=p._convertPositionTo("relative",{top:h-p.helperProportions.height,left:0}).top-p.margins.top),s&&(i.position.top=p._convertPositionTo("relative",{top:u,left:0}).top-p.margins.top),n&&(i.position.left=p._convertPositionTo("relative",{top:0,left:o-p.helperProportions.width}).left-p.margins.left),r&&(i.position.left=p._convertPositionTo("relative",{top:0,left:l}).left-p.margins.left)),c=a||s||n||r,"outer"!==f.snapMode&&(a=m>=Math.abs(h-y),s=m>=Math.abs(u-b),n=m>=Math.abs(o-g),r=m>=Math.abs(l-v),a&&(i.position.top=p._convertPositionTo("relative",{top:h,left:0}).top-p.margins.top),s&&(i.position.top=p._convertPositionTo("relative",{top:u-p.helperProportions.height,left:0}).top-p.margins.top),n&&(i.position.left=p._convertPositionTo("relative",{top:0,left:o}).left-p.margins.left),r&&(i.position.left=p._convertPositionTo("relative",{top:0,left:l-p.helperProportions.width}).left-p.margins.left)),!p.snapElements[d].snapping&&(a||s||n||r||c)&&p.options.snap.snap&&p.options.snap.snap.call(p.element,t,e.extend(p._uiHash(),{snapItem:p.snapElements[d].item})),p.snapElements[d].snapping=a||s||n||r||c)}}),e.ui.plugin.add("draggable","stack",{start:function(){var t,i=this.data("ui-draggable").options,a=e.makeArray(e(i.stack)).sort(function(t,i){return(parseInt(e(t).css("zIndex"),10)||0)-(parseInt(e(i).css("zIndex"),10)||0)});a.length&&(t=parseInt(e(a[0]).css("zIndex"),10)||0,e(a).each(function(i){e(this).css("zIndex",t+i)}),this.css("zIndex",t+a.length))}}),e.ui.plugin.add("draggable","zIndex",{start:function(t,i){var a=e(i.helper),s=e(this).data("ui-draggable").options;a.css("zIndex")&&(s._zIndex=a.css("zIndex")),a.css("zIndex",s.zIndex)},stop:function(t,i){var a=e(this).data("ui-draggable").options;a._zIndex&&e(i.helper).css("zIndex",a._zIndex)}})})(jQuery);(function(e){function t(e,t,i){return e>t&&t+i>e}e.widget("ui.droppable",{version:"1.10.3",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var t=this.options,i=t.accept;this.isover=!1,this.isout=!0,this.accept=e.isFunction(i)?i:function(e){return e.is(i)},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},e.ui.ddmanager.droppables[t.scope]=e.ui.ddmanager.droppables[t.scope]||[],e.ui.ddmanager.droppables[t.scope].push(this),t.addClasses&&this.element.addClass("ui-droppable")},_destroy:function(){for(var t=0,i=e.ui.ddmanager.droppables[this.options.scope];i.length>t;t++)i[t]===this&&i.splice(t,1);this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(t,i){"accept"===t&&(this.accept=e.isFunction(i)?i:function(e){return e.is(i)}),e.Widget.prototype._setOption.apply(this,arguments)},_activate:function(t){var i=e.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),i&&this._trigger("activate",t,this.ui(i))},_deactivate:function(t){var i=e.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),i&&this._trigger("deactivate",t,this.ui(i))},_over:function(t){var i=e.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",t,this.ui(i)))},_out:function(t){var i=e.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",t,this.ui(i)))},_drop:function(t,i){var a=i||e.ui.ddmanager.current,s=!1;return a&&(a.currentItem||a.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var t=e.data(this,"ui-droppable");return t.options.greedy&&!t.options.disabled&&t.options.scope===a.options.scope&&t.accept.call(t.element[0],a.currentItem||a.element)&&e.ui.intersect(a,e.extend(t,{offset:t.element.offset()}),t.options.tolerance)?(s=!0,!1):undefined}),s?!1:this.accept.call(this.element[0],a.currentItem||a.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",t,this.ui(a)),this.element):!1):!1},ui:function(e){return{draggable:e.currentItem||e.element,helper:e.helper,position:e.position,offset:e.positionAbs}}}),e.ui.intersect=function(e,i,a){if(!i.offset)return!1;var s,n,r=(e.positionAbs||e.position.absolute).left,o=r+e.helperProportions.width,l=(e.positionAbs||e.position.absolute).top,h=l+e.helperProportions.height,u=i.offset.left,d=u+i.proportions.width,c=i.offset.top,p=c+i.proportions.height;switch(a){case"fit":return r>=u&&d>=o&&l>=c&&p>=h;case"intersect":return r+e.helperProportions.width/2>u&&d>o-e.helperProportions.width/2&&l+e.helperProportions.height/2>c&&p>h-e.helperProportions.height/2;case"pointer":return s=(e.positionAbs||e.position.absolute).left+(e.clickOffset||e.offset.click).left,n=(e.positionAbs||e.position.absolute).top+(e.clickOffset||e.offset.click).top,t(n,c,i.proportions.height)&&t(s,u,i.proportions.width);case"touch":return(l>=c&&p>=l||h>=c&&p>=h||c>l&&h>p)&&(r>=u&&d>=r||o>=u&&d>=o||u>r&&o>d);default:return!1}},e.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(t,i){var a,s,n=e.ui.ddmanager.droppables[t.options.scope]||[],r=i?i.type:null,o=(t.currentItem||t.element).find(":data(ui-droppable)").addBack();e:for(a=0;n.length>a;a++)if(!(n[a].options.disabled||t&&!n[a].accept.call(n[a].element[0],t.currentItem||t.element))){for(s=0;o.length>s;s++)if(o[s]===n[a].element[0]){n[a].proportions.height=0;continue e}n[a].visible="none"!==n[a].element.css("display"),n[a].visible&&("mousedown"===r&&n[a]._activate.call(n[a],i),n[a].offset=n[a].element.offset(),n[a].proportions={width:n[a].element[0].offsetWidth,height:n[a].element[0].offsetHeight})}},drop:function(t,i){var a=!1;return e.each((e.ui.ddmanager.droppables[t.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&e.ui.intersect(t,this,this.options.tolerance)&&(a=this._drop.call(this,i)||a),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],t.currentItem||t.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),a},dragStart:function(t,i){t.element.parentsUntil("body").bind("scroll.droppable",function(){t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,i)})},drag:function(t,i){t.options.refreshPositions&&e.ui.ddmanager.prepareOffsets(t,i),e.each(e.ui.ddmanager.droppables[t.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var a,s,n,r=e.ui.intersect(t,this,this.options.tolerance),o=!r&&this.isover?"isout":r&&!this.isover?"isover":null;o&&(this.options.greedy&&(s=this.options.scope,n=this.element.parents(":data(ui-droppable)").filter(function(){return e.data(this,"ui-droppable").options.scope===s}),n.length&&(a=e.data(n[0],"ui-droppable"),a.greedyChild="isover"===o)),a&&"isover"===o&&(a.isover=!1,a.isout=!0,a._out.call(a,i)),this[o]=!0,this["isout"===o?"isover":"isout"]=!1,this["isover"===o?"_over":"_out"].call(this,i),a&&"isout"===o&&(a.isout=!1,a.isover=!0,a._over.call(a,i)))}})},dragStop:function(t,i){t.element.parentsUntil("body").unbind("scroll.droppable"),t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,i)}}})(jQuery);(function(e){function t(e){return parseInt(e,10)||0}function i(e){return!isNaN(parseInt(e,10))}e.widget("ui.resizable",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_create:function(){var t,i,s,a,n,r=this,o=this.options;if(this.element.addClass("ui-resizable"),e.extend(this,{_aspectRatio:!!o.aspectRatio,aspectRatio:o.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:o.helper||o.ghost||o.animate?o.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(e("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.data("ui-resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=o.handles||(e(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),t=this.handles.split(","),this.handles={},i=0;t.length>i;i++)s=e.trim(t[i]),n="ui-resizable-"+s,a=e("<div class='ui-resizable-handle "+n+"'></div>"),a.css({zIndex:o.zIndex}),"se"===s&&a.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[s]=".ui-resizable-"+s,this.element.append(a);this._renderAxis=function(t){var i,s,a,n;t=t||this.element;for(i in this.handles)this.handles[i].constructor===String&&(this.handles[i]=e(this.handles[i],this.element).show()),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)&&(s=e(this.handles[i],this.element),n=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),a=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),t.css(a,n),this._proportionallyResize()),e(this.handles[i]).length},this._renderAxis(this.element),this._handles=e(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){r.resizing||(this.className&&(a=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),r.axis=a&&a[1]?a[1]:"se")}),o.autoHide&&(this._handles.hide(),e(this.element).addClass("ui-resizable-autohide").mouseenter(function(){o.disabled||(e(this).removeClass("ui-resizable-autohide"),r._handles.show())}).mouseleave(function(){o.disabled||r.resizing||(e(this).addClass("ui-resizable-autohide"),r._handles.hide())})),this._mouseInit()},_destroy:function(){this._mouseDestroy();var t,i=function(t){e(t).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),t=this.element,this.originalElement.css({position:t.css("position"),width:t.outerWidth(),height:t.outerHeight(),top:t.css("top"),left:t.css("left")}).insertAfter(t),t.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_mouseCapture:function(t){var i,s,a=!1;for(i in this.handles)s=e(this.handles[i])[0],(s===t.target||e.contains(s,t.target))&&(a=!0);return!this.options.disabled&&a},_mouseStart:function(i){var s,a,n,r=this.options,o=this.element.position(),h=this.element;return this.resizing=!0,/absolute/.test(h.css("position"))?h.css({position:"absolute",top:h.css("top"),left:h.css("left")}):h.is(".ui-draggable")&&h.css({position:"absolute",top:o.top,left:o.left}),this._renderProxy(),s=t(this.helper.css("left")),a=t(this.helper.css("top")),r.containment&&(s+=e(r.containment).scrollLeft()||0,a+=e(r.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:s,top:a},this.size=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalSize=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalPosition={left:s,top:a},this.sizeDiff={width:h.outerWidth()-h.width(),height:h.outerHeight()-h.height()},this.originalMousePosition={left:i.pageX,top:i.pageY},this.aspectRatio="number"==typeof r.aspectRatio?r.aspectRatio:this.originalSize.width/this.originalSize.height||1,n=e(".ui-resizable-"+this.axis).css("cursor"),e("body").css("cursor","auto"===n?this.axis+"-resize":n),h.addClass("ui-resizable-resizing"),this._propagate("start",i),!0},_mouseDrag:function(t){var i,s=this.helper,a={},n=this.originalMousePosition,r=this.axis,o=this.position.top,h=this.position.left,l=this.size.width,u=this.size.height,c=t.pageX-n.left||0,d=t.pageY-n.top||0,p=this._change[r];return p?(i=p.apply(this,[t,c,d]),this._updateVirtualBoundaries(t.shiftKey),(this._aspectRatio||t.shiftKey)&&(i=this._updateRatio(i,t)),i=this._respectSize(i,t),this._updateCache(i),this._propagate("resize",t),this.position.top!==o&&(a.top=this.position.top+"px"),this.position.left!==h&&(a.left=this.position.left+"px"),this.size.width!==l&&(a.width=this.size.width+"px"),this.size.height!==u&&(a.height=this.size.height+"px"),s.css(a),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),e.isEmptyObject(a)||this._trigger("resize",t,this.ui()),!1):!1},_mouseStop:function(t){this.resizing=!1;var i,s,a,n,r,o,h,l=this.options,u=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),a=s&&e.ui.hasScroll(i[0],"left")?0:u.sizeDiff.height,n=s?0:u.sizeDiff.width,r={width:u.helper.width()-n,height:u.helper.height()-a},o=parseInt(u.element.css("left"),10)+(u.position.left-u.originalPosition.left)||null,h=parseInt(u.element.css("top"),10)+(u.position.top-u.originalPosition.top)||null,l.animate||this.element.css(e.extend(r,{top:h,left:o})),u.helper.height(u.size.height),u.helper.width(u.size.width),this._helper&&!l.animate&&this._proportionallyResize()),e("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",t),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(e){var t,s,a,n,r,o=this.options;r={minWidth:i(o.minWidth)?o.minWidth:0,maxWidth:i(o.maxWidth)?o.maxWidth:1/0,minHeight:i(o.minHeight)?o.minHeight:0,maxHeight:i(o.maxHeight)?o.maxHeight:1/0},(this._aspectRatio||e)&&(t=r.minHeight*this.aspectRatio,a=r.minWidth/this.aspectRatio,s=r.maxHeight*this.aspectRatio,n=r.maxWidth/this.aspectRatio,t>r.minWidth&&(r.minWidth=t),a>r.minHeight&&(r.minHeight=a),r.maxWidth>s&&(r.maxWidth=s),r.maxHeight>n&&(r.maxHeight=n)),this._vBoundaries=r},_updateCache:function(e){this.offset=this.helper.offset(),i(e.left)&&(this.position.left=e.left),i(e.top)&&(this.position.top=e.top),i(e.height)&&(this.size.height=e.height),i(e.width)&&(this.size.width=e.width)},_updateRatio:function(e){var t=this.position,s=this.size,a=this.axis;return i(e.height)?e.width=e.height*this.aspectRatio:i(e.width)&&(e.height=e.width/this.aspectRatio),"sw"===a&&(e.left=t.left+(s.width-e.width),e.top=null),"nw"===a&&(e.top=t.top+(s.height-e.height),e.left=t.left+(s.width-e.width)),e},_respectSize:function(e){var t=this._vBoundaries,s=this.axis,a=i(e.width)&&t.maxWidth&&t.maxWidth<e.width,n=i(e.height)&&t.maxHeight&&t.maxHeight<e.height,r=i(e.width)&&t.minWidth&&t.minWidth>e.width,o=i(e.height)&&t.minHeight&&t.minHeight>e.height,h=this.originalPosition.left+this.originalSize.width,l=this.position.top+this.size.height,u=/sw|nw|w/.test(s),c=/nw|ne|n/.test(s);return r&&(e.width=t.minWidth),o&&(e.height=t.minHeight),a&&(e.width=t.maxWidth),n&&(e.height=t.maxHeight),r&&u&&(e.left=h-t.minWidth),a&&u&&(e.left=h-t.maxWidth),o&&c&&(e.top=l-t.minHeight),n&&c&&(e.top=l-t.maxHeight),e.width||e.height||e.left||!e.top?e.width||e.height||e.top||!e.left||(e.left=null):e.top=null,e},_proportionallyResize:function(){if(this._proportionallyResizeElements.length){var e,t,i,s,a,n=this.helper||this.element;for(e=0;this._proportionallyResizeElements.length>e;e++){if(a=this._proportionallyResizeElements[e],!this.borderDif)for(this.borderDif=[],i=[a.css("borderTopWidth"),a.css("borderRightWidth"),a.css("borderBottomWidth"),a.css("borderLeftWidth")],s=[a.css("paddingTop"),a.css("paddingRight"),a.css("paddingBottom"),a.css("paddingLeft")],t=0;i.length>t;t++)this.borderDif[t]=(parseInt(i[t],10)||0)+(parseInt(s[t],10)||0);a.css({height:n.height()-this.borderDif[0]-this.borderDif[2]||0,width:n.width()-this.borderDif[1]-this.borderDif[3]||0})}}},_renderProxy:function(){var t=this.element,i=this.options;this.elementOffset=t.offset(),this._helper?(this.helper=this.helper||e("<div style='overflow:hidden;'></div>"),this.helper.addClass(this._helper).css({width:this.element.outerWidth()-1,height:this.element.outerHeight()-1,position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(e,t){return{width:this.originalSize.width+t}},w:function(e,t){var i=this.originalSize,s=this.originalPosition;return{left:s.left+t,width:i.width-t}},n:function(e,t,i){var s=this.originalSize,a=this.originalPosition;return{top:a.top+i,height:s.height-i}},s:function(e,t,i){return{height:this.originalSize.height+i}},se:function(t,i,s){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[t,i,s]))},sw:function(t,i,s){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[t,i,s]))},ne:function(t,i,s){return e.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[t,i,s]))},nw:function(t,i,s){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[t,i,s]))}},_propagate:function(t,i){e.ui.plugin.call(this,t,[i,this.ui()]),"resize"!==t&&this._trigger(t,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),e.ui.plugin.add("resizable","animate",{stop:function(t){var i=e(this).data("ui-resizable"),s=i.options,a=i._proportionallyResizeElements,n=a.length&&/textarea/i.test(a[0].nodeName),r=n&&e.ui.hasScroll(a[0],"left")?0:i.sizeDiff.height,o=n?0:i.sizeDiff.width,h={width:i.size.width-o,height:i.size.height-r},l=parseInt(i.element.css("left"),10)+(i.position.left-i.originalPosition.left)||null,u=parseInt(i.element.css("top"),10)+(i.position.top-i.originalPosition.top)||null;i.element.animate(e.extend(h,u&&l?{top:u,left:l}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseInt(i.element.css("width"),10),height:parseInt(i.element.css("height"),10),top:parseInt(i.element.css("top"),10),left:parseInt(i.element.css("left"),10)};a&&a.length&&e(a[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",t)}})}}),e.ui.plugin.add("resizable","containment",{start:function(){var i,s,a,n,r,o,h,l=e(this).data("ui-resizable"),u=l.options,c=l.element,d=u.containment,p=d instanceof e?d.get(0):/parent/.test(d)?c.parent().get(0):d;p&&(l.containerElement=e(p),/document/.test(d)||d===document?(l.containerOffset={left:0,top:0},l.containerPosition={left:0,top:0},l.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight}):(i=e(p),s=[],e(["Top","Right","Left","Bottom"]).each(function(e,a){s[e]=t(i.css("padding"+a))}),l.containerOffset=i.offset(),l.containerPosition=i.position(),l.containerSize={height:i.innerHeight()-s[3],width:i.innerWidth()-s[1]},a=l.containerOffset,n=l.containerSize.height,r=l.containerSize.width,o=e.ui.hasScroll(p,"left")?p.scrollWidth:r,h=e.ui.hasScroll(p)?p.scrollHeight:n,l.parentData={element:p,left:a.left,top:a.top,width:o,height:h}))},resize:function(t){var i,s,a,n,r=e(this).data("ui-resizable"),o=r.options,h=r.containerOffset,l=r.position,u=r._aspectRatio||t.shiftKey,c={top:0,left:0},d=r.containerElement;d[0]!==document&&/static/.test(d.css("position"))&&(c=h),l.left<(r._helper?h.left:0)&&(r.size.width=r.size.width+(r._helper?r.position.left-h.left:r.position.left-c.left),u&&(r.size.height=r.size.width/r.aspectRatio),r.position.left=o.helper?h.left:0),l.top<(r._helper?h.top:0)&&(r.size.height=r.size.height+(r._helper?r.position.top-h.top:r.position.top),u&&(r.size.width=r.size.height*r.aspectRatio),r.position.top=r._helper?h.top:0),r.offset.left=r.parentData.left+r.position.left,r.offset.top=r.parentData.top+r.position.top,i=Math.abs((r._helper?r.offset.left-c.left:r.offset.left-c.left)+r.sizeDiff.width),s=Math.abs((r._helper?r.offset.top-c.top:r.offset.top-h.top)+r.sizeDiff.height),a=r.containerElement.get(0)===r.element.parent().get(0),n=/relative|absolute/.test(r.containerElement.css("position")),a&&n&&(i-=r.parentData.left),i+r.size.width>=r.parentData.width&&(r.size.width=r.parentData.width-i,u&&(r.size.height=r.size.width/r.aspectRatio)),s+r.size.height>=r.parentData.height&&(r.size.height=r.parentData.height-s,u&&(r.size.width=r.size.height*r.aspectRatio))},stop:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.containerOffset,a=t.containerPosition,n=t.containerElement,r=e(t.helper),o=r.offset(),h=r.outerWidth()-t.sizeDiff.width,l=r.outerHeight()-t.sizeDiff.height;t._helper&&!i.animate&&/relative/.test(n.css("position"))&&e(this).css({left:o.left-a.left-s.left,width:h,height:l}),t._helper&&!i.animate&&/static/.test(n.css("position"))&&e(this).css({left:o.left-a.left-s.left,width:h,height:l})}}),e.ui.plugin.add("resizable","alsoResize",{start:function(){var t=e(this).data("ui-resizable"),i=t.options,s=function(t){e(t).each(function(){var t=e(this);t.data("ui-resizable-alsoresize",{width:parseInt(t.width(),10),height:parseInt(t.height(),10),left:parseInt(t.css("left"),10),top:parseInt(t.css("top"),10)})})};"object"!=typeof i.alsoResize||i.alsoResize.parentNode?s(i.alsoResize):i.alsoResize.length?(i.alsoResize=i.alsoResize[0],s(i.alsoResize)):e.each(i.alsoResize,function(e){s(e)})},resize:function(t,i){var s=e(this).data("ui-resizable"),a=s.options,n=s.originalSize,r=s.originalPosition,o={height:s.size.height-n.height||0,width:s.size.width-n.width||0,top:s.position.top-r.top||0,left:s.position.left-r.left||0},h=function(t,s){e(t).each(function(){var t=e(this),a=e(this).data("ui-resizable-alsoresize"),n={},r=s&&s.length?s:t.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];e.each(r,function(e,t){var i=(a[t]||0)+(o[t]||0);i&&i>=0&&(n[t]=i||null)}),t.css(n)})};"object"!=typeof a.alsoResize||a.alsoResize.nodeType?h(a.alsoResize):e.each(a.alsoResize,function(e,t){h(e,t)})},stop:function(){e(this).removeData("resizable-alsoresize")}}),e.ui.plugin.add("resizable","ghost",{start:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.size;t.ghost=t.originalElement.clone(),t.ghost.css({opacity:.25,display:"block",position:"relative",height:s.height,width:s.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass("string"==typeof i.ghost?i.ghost:""),t.ghost.appendTo(t.helper)},resize:function(){var t=e(this).data("ui-resizable");t.ghost&&t.ghost.css({position:"relative",height:t.size.height,width:t.size.width})},stop:function(){var t=e(this).data("ui-resizable");t.ghost&&t.helper&&t.helper.get(0).removeChild(t.ghost.get(0))}}),e.ui.plugin.add("resizable","grid",{resize:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.size,a=t.originalSize,n=t.originalPosition,r=t.axis,o="number"==typeof i.grid?[i.grid,i.grid]:i.grid,h=o[0]||1,l=o[1]||1,u=Math.round((s.width-a.width)/h)*h,c=Math.round((s.height-a.height)/l)*l,d=a.width+u,p=a.height+c,f=i.maxWidth&&d>i.maxWidth,m=i.maxHeight&&p>i.maxHeight,g=i.minWidth&&i.minWidth>d,v=i.minHeight&&i.minHeight>p;i.grid=o,g&&(d+=h),v&&(p+=l),f&&(d-=h),m&&(p-=l),/^(se|s|e)$/.test(r)?(t.size.width=d,t.size.height=p):/^(ne)$/.test(r)?(t.size.width=d,t.size.height=p,t.position.top=n.top-c):/^(sw)$/.test(r)?(t.size.width=d,t.size.height=p,t.position.left=n.left-u):(t.size.width=d,t.size.height=p,t.position.top=n.top-c,t.position.left=n.left-u)}})})(jQuery);(function(e){e.widget("ui.selectable",e.ui.mouse,{version:"1.10.3",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var t,i=this;this.element.addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){t=e(i.options.filter,i.element[0]),t.addClass("ui-selectee"),t.each(function(){var t=e(this),i=t.offset();e.data(this,"selectable-item",{element:this,$element:t,left:i.left,top:i.top,right:i.left+t.outerWidth(),bottom:i.top+t.outerHeight(),startselected:!1,selected:t.hasClass("ui-selected"),selecting:t.hasClass("ui-selecting"),unselecting:t.hasClass("ui-unselecting")})})},this.refresh(),this.selectees=t.addClass("ui-selectee"),this._mouseInit(),this.helper=e("<div class='ui-selectable-helper'></div>")},_destroy:function(){this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled"),this._mouseDestroy()},_mouseStart:function(t){var i=this,s=this.options;this.opos=[t.pageX,t.pageY],this.options.disabled||(this.selectees=e(s.filter,this.element[0]),this._trigger("start",t),e(s.appendTo).append(this.helper),this.helper.css({left:t.pageX,top:t.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=e.data(this,"selectable-item");s.startselected=!0,t.metaKey||t.ctrlKey||(s.$element.removeClass("ui-selected"),s.selected=!1,s.$element.addClass("ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",t,{unselecting:s.element}))}),e(t.target).parents().addBack().each(function(){var s,a=e.data(this,"selectable-item");return a?(s=!t.metaKey&&!t.ctrlKey||!a.$element.hasClass("ui-selected"),a.$element.removeClass(s?"ui-unselecting":"ui-selected").addClass(s?"ui-selecting":"ui-unselecting"),a.unselecting=!s,a.selecting=s,a.selected=s,s?i._trigger("selecting",t,{selecting:a.element}):i._trigger("unselecting",t,{unselecting:a.element}),!1):undefined}))},_mouseDrag:function(t){if(this.dragged=!0,!this.options.disabled){var i,s=this,a=this.options,n=this.opos[0],r=this.opos[1],o=t.pageX,h=t.pageY;return n>o&&(i=o,o=n,n=i),r>h&&(i=h,h=r,r=i),this.helper.css({left:n,top:r,width:o-n,height:h-r}),this.selectees.each(function(){var i=e.data(this,"selectable-item"),l=!1;i&&i.element!==s.element[0]&&("touch"===a.tolerance?l=!(i.left>o||n>i.right||i.top>h||r>i.bottom):"fit"===a.tolerance&&(l=i.left>n&&o>i.right&&i.top>r&&h>i.bottom),l?(i.selected&&(i.$element.removeClass("ui-selected"),i.selected=!1),i.unselecting&&(i.$element.removeClass("ui-unselecting"),i.unselecting=!1),i.selecting||(i.$element.addClass("ui-selecting"),i.selecting=!0,s._trigger("selecting",t,{selecting:i.element}))):(i.selecting&&((t.metaKey||t.ctrlKey)&&i.startselected?(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.$element.addClass("ui-selected"),i.selected=!0):(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.startselected&&(i.$element.addClass("ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",t,{unselecting:i.element}))),i.selected&&(t.metaKey||t.ctrlKey||i.startselected||(i.$element.removeClass("ui-selected"),i.selected=!1,i.$element.addClass("ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",t,{unselecting:i.element})))))}),!1}},_mouseStop:function(t){var i=this;return this.dragged=!1,e(".ui-unselecting",this.element[0]).each(function(){var s=e.data(this,"selectable-item");s.$element.removeClass("ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",t,{unselected:s.element})}),e(".ui-selecting",this.element[0]).each(function(){var s=e.data(this,"selectable-item");s.$element.removeClass("ui-selecting").addClass("ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",t,{selected:s.element})}),this._trigger("stop",t),this.helper.remove(),!1}})})(jQuery);(function(e){function t(e,t,i){return e>t&&t+i>e}function i(e){return/left|right/.test(e.css("float"))||/inline|table-cell/.test(e.css("display"))}e.widget("ui.sortable",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_create:function(){var e=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?"x"===e.axis||i(this.items[0].item):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},_destroy:function(){this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var e=this.items.length-1;e>=0;e--)this.items[e].item.removeData(this.widgetName+"-item");return this},_setOption:function(t,i){"disabled"===t?(this.options[t]=i,this.widget().toggleClass("ui-sortable-disabled",!!i)):e.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(t,i){var s=null,a=!1,n=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(t),e(t.target).parents().each(function(){return e.data(this,n.widgetName+"-item")===n?(s=e(this),!1):undefined}),e.data(t.target,n.widgetName+"-item")===n&&(s=e(t.target)),s?!this.options.handle||i||(e(this.options.handle,s).find("*").addBack().each(function(){this===t.target&&(a=!0)}),a)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(t,i,s){var a,n,r=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(t),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,r.cursorAt&&this._adjustOffsetFromHelper(r.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),r.containment&&this._setContainment(),r.cursor&&"auto"!==r.cursor&&(n=this.document.find("body"),this.storedCursor=n.css("cursor"),n.css("cursor",r.cursor),this.storedStylesheet=e("<style>*{ cursor: "+r.cursor+" !important; }</style>").appendTo(n)),r.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",r.opacity)),r.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",r.zIndex)),this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",t,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(a=this.containers.length-1;a>=0;a--)this.containers[a]._trigger("activate",t,this._uiHash(this));return e.ui.ddmanager&&(e.ui.ddmanager.current=this),e.ui.ddmanager&&!r.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(t),!0},_mouseDrag:function(t){var i,s,a,n,r=this.options,o=!1;for(this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==document&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-t.pageY<r.scrollSensitivity?this.scrollParent[0].scrollTop=o=this.scrollParent[0].scrollTop+r.scrollSpeed:t.pageY-this.overflowOffset.top<r.scrollSensitivity&&(this.scrollParent[0].scrollTop=o=this.scrollParent[0].scrollTop-r.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-t.pageX<r.scrollSensitivity?this.scrollParent[0].scrollLeft=o=this.scrollParent[0].scrollLeft+r.scrollSpeed:t.pageX-this.overflowOffset.left<r.scrollSensitivity&&(this.scrollParent[0].scrollLeft=o=this.scrollParent[0].scrollLeft-r.scrollSpeed)):(t.pageY-e(document).scrollTop()<r.scrollSensitivity?o=e(document).scrollTop(e(document).scrollTop()-r.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<r.scrollSensitivity&&(o=e(document).scrollTop(e(document).scrollTop()+r.scrollSpeed)),t.pageX-e(document).scrollLeft()<r.scrollSensitivity?o=e(document).scrollLeft(e(document).scrollLeft()-r.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<r.scrollSensitivity&&(o=e(document).scrollLeft(e(document).scrollLeft()+r.scrollSpeed))),o!==!1&&e.ui.ddmanager&&!r.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],a=s.item[0],n=this._intersectsWithPointer(s),n&&s.instance===this.currentContainer&&a!==this.currentItem[0]&&this.placeholder[1===n?"next":"prev"]()[0]!==a&&!e.contains(this.placeholder[0],a)&&("semi-dynamic"===this.options.type?!e.contains(this.element[0],a):!0)){if(this.direction=1===n?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(t,s),this._trigger("change",t,this._uiHash());break}return this._contactContainers(t),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),this._trigger("sort",t,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(t,i){if(t){if(e.ui.ddmanager&&!this.options.dropBehaviour&&e.ui.ddmanager.drop(this,t),this.options.revert){var s=this,a=this.placeholder.offset(),n=this.options.axis,r={};n&&"x"!==n||(r.left=a.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollLeft)),n&&"y"!==n||(r.top=a.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===document.body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,e(this.helper).animate(r,parseInt(this.options.revert,10)||500,function(){s._clear(t)})}else this._clear(t,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp({target:null}),"original"===this.options.helper?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var t=this.containers.length-1;t>=0;t--)this.containers[t]._trigger("deactivate",null,this._uiHash(this)),this.containers[t].containerCache.over&&(this.containers[t]._trigger("out",null,this._uiHash(this)),this.containers[t].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),e.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?e(this.domPosition.prev).after(this.currentItem):e(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(t){var i=this._getItemsAsjQuery(t&&t.connected),s=[];return t=t||{},e(i).each(function(){var i=(e(t.item||this).attr(t.attribute||"id")||"").match(t.expression||/(.+)[\-=_](.+)/);i&&s.push((t.key||i[1]+"[]")+"="+(t.key&&t.expression?i[1]:i[2]))}),!s.length&&t.key&&s.push(t.key+"="),s.join("&")},toArray:function(t){var i=this._getItemsAsjQuery(t&&t.connected),s=[];return t=t||{},i.each(function(){s.push(e(t.item||this).attr(t.attribute||"id")||"")}),s},_intersectsWith:function(e){var t=this.positionAbs.left,i=t+this.helperProportions.width,s=this.positionAbs.top,a=s+this.helperProportions.height,n=e.left,r=n+e.width,o=e.top,h=o+e.height,l=this.offset.click.top,u=this.offset.click.left,c="x"===this.options.axis||s+l>o&&h>s+l,d="y"===this.options.axis||t+u>n&&r>t+u,p=c&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>e[this.floating?"width":"height"]?p:t+this.helperProportions.width/2>n&&r>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>o&&h>a-this.helperProportions.height/2},_intersectsWithPointer:function(e){var i="x"===this.options.axis||t(this.positionAbs.top+this.offset.click.top,e.top,e.height),s="y"===this.options.axis||t(this.positionAbs.left+this.offset.click.left,e.left,e.width),a=i&&s,n=this._getDragVerticalDirection(),r=this._getDragHorizontalDirection();return a?this.floating?r&&"right"===r||"down"===n?2:1:n&&("down"===n?2:1):!1},_intersectsWithSides:function(e){var i=t(this.positionAbs.top+this.offset.click.top,e.top+e.height/2,e.height),s=t(this.positionAbs.left+this.offset.click.left,e.left+e.width/2,e.width),a=this._getDragVerticalDirection(),n=this._getDragHorizontalDirection();return this.floating&&n?"right"===n&&s||"left"===n&&!s:a&&("down"===a&&i||"up"===a&&!i)},_getDragVerticalDirection:function(){var e=this.positionAbs.top-this.lastPositionAbs.top;return 0!==e&&(e>0?"down":"up")},_getDragHorizontalDirection:function(){var e=this.positionAbs.left-this.lastPositionAbs.left;return 0!==e&&(e>0?"right":"left")},refresh:function(e){return this._refreshItems(e),this.refreshPositions(),this},_connectWith:function(){var e=this.options;return e.connectWith.constructor===String?[e.connectWith]:e.connectWith},_getItemsAsjQuery:function(t){var i,s,a,n,r=[],o=[],h=this._connectWith();if(h&&t)for(i=h.length-1;i>=0;i--)for(a=e(h[i]),s=a.length-1;s>=0;s--)n=e.data(a[s],this.widgetFullName),n&&n!==this&&!n.options.disabled&&o.push([e.isFunction(n.options.items)?n.options.items.call(n.element):e(n.options.items,n.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),n]);for(o.push([e.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):e(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),i=o.length-1;i>=0;i--)o[i][0].each(function(){r.push(this)});return e(r)},_removeCurrentsFromItems:function(){var t=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=e.grep(this.items,function(e){for(var i=0;t.length>i;i++)if(t[i]===e.item[0])return!1;return!0})},_refreshItems:function(t){this.items=[],this.containers=[this];var i,s,a,n,r,o,h,l,u=this.items,c=[[e.isFunction(this.options.items)?this.options.items.call(this.element[0],t,{item:this.currentItem}):e(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(a=e(d[i]),s=a.length-1;s>=0;s--)n=e.data(a[s],this.widgetFullName),n&&n!==this&&!n.options.disabled&&(c.push([e.isFunction(n.options.items)?n.options.items.call(n.element[0],t,{item:this.currentItem}):e(n.options.items,n.element),n]),this.containers.push(n));for(i=c.length-1;i>=0;i--)for(r=c[i][1],o=c[i][0],s=0,l=o.length;l>s;s++)h=e(o[s]),h.data(this.widgetName+"-item",r),u.push({item:h,instance:r,width:0,height:0,left:0,top:0})},refreshPositions:function(t){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,a,n;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(a=this.options.toleranceElement?e(this.options.toleranceElement,s.item):s.item,t||(s.width=a.outerWidth(),s.height=a.outerHeight()),n=a.offset(),s.left=n.left,s.top=n.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)n=this.containers[i].element.offset(),this.containers[i].containerCache.left=n.left,this.containers[i].containerCache.top=n.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(t){t=t||this;var i,s=t.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=t.currentItem[0].nodeName.toLowerCase(),a=e("<"+s+">",t.document[0]).addClass(i||t.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper");return"tr"===s?t.currentItem.children().each(function(){e("<td>&#160;</td>",t.document[0]).attr("colspan",e(this).attr("colspan")||1).appendTo(a)}):"img"===s&&a.attr("src",t.currentItem.attr("src")),i||a.css("visibility","hidden"),a},update:function(e,a){(!i||s.forcePlaceholderSize)&&(a.height()||a.height(t.currentItem.innerHeight()-parseInt(t.currentItem.css("paddingTop")||0,10)-parseInt(t.currentItem.css("paddingBottom")||0,10)),a.width()||a.width(t.currentItem.innerWidth()-parseInt(t.currentItem.css("paddingLeft")||0,10)-parseInt(t.currentItem.css("paddingRight")||0,10)))}}),t.placeholder=e(s.placeholder.element.call(t.element,t.currentItem)),t.currentItem.after(t.placeholder),s.placeholder.update(t,t.placeholder)},_contactContainers:function(s){var a,n,r,o,h,l,u,c,d,p,f=null,m=null;for(a=this.containers.length-1;a>=0;a--)if(!e.contains(this.currentItem[0],this.containers[a].element[0]))if(this._intersectsWith(this.containers[a].containerCache)){if(f&&e.contains(this.containers[a].element[0],f.element[0]))continue;f=this.containers[a],m=a}else this.containers[a].containerCache.over&&(this.containers[a]._trigger("out",s,this._uiHash(this)),this.containers[a].containerCache.over=0);if(f)if(1===this.containers.length)this.containers[m].containerCache.over||(this.containers[m]._trigger("over",s,this._uiHash(this)),this.containers[m].containerCache.over=1);else{for(r=1e4,o=null,p=f.floating||i(this.currentItem),h=p?"left":"top",l=p?"width":"height",u=this.positionAbs[h]+this.offset.click[h],n=this.items.length-1;n>=0;n--)e.contains(this.containers[m].element[0],this.items[n].item[0])&&this.items[n].item[0]!==this.currentItem[0]&&(!p||t(this.positionAbs.top+this.offset.click.top,this.items[n].top,this.items[n].height))&&(c=this.items[n].item.offset()[h],d=!1,Math.abs(c-u)>Math.abs(c+this.items[n][l]-u)&&(d=!0,c+=this.items[n][l]),r>Math.abs(c-u)&&(r=Math.abs(c-u),o=this.items[n],this.direction=d?"up":"down"));if(!o&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[m])return;o?this._rearrange(s,o,null,!0):this._rearrange(s,null,this.containers[m].element,!0),this._trigger("change",s,this._uiHash()),this.containers[m]._trigger("change",s,this._uiHash(this)),this.currentContainer=this.containers[m],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[m]._trigger("over",s,this._uiHash(this)),this.containers[m].containerCache.over=1}},_createHelper:function(t){var i=this.options,s=e.isFunction(i.helper)?e(i.helper.apply(this.element[0],[t,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||e("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var t=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&e.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var e=this.currentItem.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,s,a=this.options;"parent"===a.containment&&(a.containment=this.helper[0].parentNode),("document"===a.containment||"window"===a.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,e("document"===a.containment?document:window).width()-this.helperProportions.width-this.margins.left,(e("document"===a.containment?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(a.containment)||(t=e(a.containment)[0],i=e(a.containment).offset(),s="hidden"!==e(t).css("overflow"),this.containment=[i.left+(parseInt(e(t).css("borderLeftWidth"),10)||0)+(parseInt(e(t).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(e(t).css("borderTopWidth"),10)||0)+(parseInt(e(t).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(t.scrollWidth,t.offsetWidth):t.offsetWidth)-(parseInt(e(t).css("borderLeftWidth"),10)||0)-(parseInt(e(t).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(t.scrollHeight,t.offsetHeight):t.offsetHeight)-(parseInt(e(t).css("borderTopWidth"),10)||0)-(parseInt(e(t).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(t,i){i||(i=this.position);var s="absolute"===t?1:-1,a="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,n=/(html|body)/i.test(a[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():n?0:a.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():n?0:a.scrollLeft())*s}},_generatePosition:function(t){var i,s,a=this.options,n=t.pageX,r=t.pageY,o="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,h=/(html|body)/i.test(o[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==document&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(t.pageX-this.offset.click.left<this.containment[0]&&(n=this.containment[0]+this.offset.click.left),t.pageY-this.offset.click.top<this.containment[1]&&(r=this.containment[1]+this.offset.click.top),t.pageX-this.offset.click.left>this.containment[2]&&(n=this.containment[2]+this.offset.click.left),t.pageY-this.offset.click.top>this.containment[3]&&(r=this.containment[3]+this.offset.click.top)),a.grid&&(i=this.originalPageY+Math.round((r-this.originalPageY)/a.grid[1])*a.grid[1],r=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-a.grid[1]:i+a.grid[1]:i,s=this.originalPageX+Math.round((n-this.originalPageX)/a.grid[0])*a.grid[0],n=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-a.grid[0]:s+a.grid[0]:s)),{top:r-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():h?0:o.scrollTop()),left:n-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():h?0:o.scrollLeft())}},_rearrange:function(e,t,i,s){i?i[0].appendChild(this.placeholder[0]):t.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?t.item[0]:t.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var a=this.counter;this._delay(function(){a===this.counter&&this.refreshPositions(!s)})},_clear:function(e,t){this.reverting=!1;var i,s=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(i in this._storedCSS)("auto"===this._storedCSS[i]||"static"===this._storedCSS[i])&&(this._storedCSS[i]="");this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!t&&s.push(function(e){this._trigger("receive",e,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||t||s.push(function(e){this._trigger("update",e,this._uiHash())}),this!==this.currentContainer&&(t||(s.push(function(e){this._trigger("remove",e,this._uiHash())}),s.push(function(e){return function(t){e._trigger("receive",t,this._uiHash(this))}}.call(this,this.currentContainer)),s.push(function(e){return function(t){e._trigger("update",t,this._uiHash(this))}}.call(this,this.currentContainer)))),i=this.containers.length-1;i>=0;i--)t||s.push(function(e){return function(t){e._trigger("deactivate",t,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over&&(s.push(function(e){return function(t){e._trigger("out",t,this._uiHash(this))}}.call(this,this.containers[i])),this.containers[i].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,this.cancelHelperRemoval){if(!t){for(this._trigger("beforeStop",e,this._uiHash()),i=0;s.length>i;i++)s[i].call(this,e);this._trigger("stop",e,this._uiHash())}return this.fromOutside=!1,!1}if(t||this._trigger("beforeStop",e,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null,!t){for(i=0;s.length>i;i++)s[i].call(this,e);this._trigger("stop",e,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){e.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(t){var i=t||this;return{helper:i.helper,placeholder:i.placeholder||e([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:t?t.element:null}}})})(jQuery);(function(e){var t,i,a,s,n="ui-button ui-widget ui-state-default ui-corner-all",r="ui-state-hover ui-state-active ",o="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",h=function(){var t=e(this);setTimeout(function(){t.find(":ui-button").button("refresh")},1)},l=function(t){var i=t.name,a=t.form,s=e([]);return i&&(i=i.replace(/'/g,"\\'"),s=a?e(a).find("[name='"+i+"']"):e("[name='"+i+"']",t.ownerDocument).filter(function(){return!this.form})),s};e.widget("ui.button",{version:"1.10.3",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,h),"boolean"!=typeof this.options.disabled?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var r=this,o=this.options,u="checkbox"===this.type||"radio"===this.type,d=u?"":"ui-state-active",c="ui-state-focus";null===o.label&&(o.label="input"===this.type?this.buttonElement.val():this.buttonElement.html()),this._hoverable(this.buttonElement),this.buttonElement.addClass(n).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){o.disabled||this===t&&e(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){o.disabled||e(this).removeClass(d)}).bind("click"+this.eventNamespace,function(e){o.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}),this.element.bind("focus"+this.eventNamespace,function(){r.buttonElement.addClass(c)}).bind("blur"+this.eventNamespace,function(){r.buttonElement.removeClass(c)}),u&&(this.element.bind("change"+this.eventNamespace,function(){s||r.refresh()}),this.buttonElement.bind("mousedown"+this.eventNamespace,function(e){o.disabled||(s=!1,i=e.pageX,a=e.pageY)}).bind("mouseup"+this.eventNamespace,function(e){o.disabled||(i!==e.pageX||a!==e.pageY)&&(s=!0)})),"checkbox"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){return o.disabled||s?!1:undefined}):"radio"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){if(o.disabled||s)return!1;e(this).addClass("ui-state-active"),r.buttonElement.attr("aria-pressed","true");var t=r.element[0];l(t).not(t).map(function(){return e(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){return o.disabled?!1:(e(this).addClass("ui-state-active"),t=this,r.document.one("mouseup",function(){t=null}),undefined)}).bind("mouseup"+this.eventNamespace,function(){return o.disabled?!1:(e(this).removeClass("ui-state-active"),undefined)}).bind("keydown"+this.eventNamespace,function(t){return o.disabled?!1:((t.keyCode===e.ui.keyCode.SPACE||t.keyCode===e.ui.keyCode.ENTER)&&e(this).addClass("ui-state-active"),undefined)}).bind("keyup"+this.eventNamespace+" blur"+this.eventNamespace,function(){e(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(t){t.keyCode===e.ui.keyCode.SPACE&&e(this).click()})),this._setOption("disabled",o.disabled),this._resetButton()},_determineButtonType:function(){var e,t,i;this.type=this.element.is("[type=checkbox]")?"checkbox":this.element.is("[type=radio]")?"radio":this.element.is("input")?"input":"button","checkbox"===this.type||"radio"===this.type?(e=this.element.parents().last(),t="label[for='"+this.element.attr("id")+"']",this.buttonElement=e.find(t),this.buttonElement.length||(e=e.length?e.siblings():this.element.siblings(),this.buttonElement=e.filter(t),this.buttonElement.length||(this.buttonElement=e.find(t))),this.element.addClass("ui-helper-hidden-accessible"),i=this.element.is(":checked"),i&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",i)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(n+" "+r+" "+o).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(e,t){return this._super(e,t),"disabled"===e?(t?this.element.prop("disabled",!0):this.element.prop("disabled",!1),undefined):(this._resetButton(),undefined)},refresh:function(){var t=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");t!==this.options.disabled&&this._setOption("disabled",t),"radio"===this.type?l(this.element[0]).each(function(){e(this).is(":checked")?e(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):e(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):"checkbox"===this.type&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if("input"===this.type)return this.options.label&&this.element.val(this.options.label),undefined;var t=this.buttonElement.removeClass(o),i=e("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(t.empty()).text(),a=this.options.icons,s=a.primary&&a.secondary,n=[];a.primary||a.secondary?(this.options.text&&n.push("ui-button-text-icon"+(s?"s":a.primary?"-primary":"-secondary")),a.primary&&t.prepend("<span class='ui-button-icon-primary ui-icon "+a.primary+"'></span>"),a.secondary&&t.append("<span class='ui-button-icon-secondary ui-icon "+a.secondary+"'></span>"),this.options.text||(n.push(s?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||t.attr("title",e.trim(i)))):n.push("ui-button-text-only"),t.addClass(n.join(" "))}}),e.widget("ui.buttonset",{version:"1.10.3",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(e,t){"disabled"===e&&this.buttons.button("option",e,t),this._super(e,t)},refresh:function(){var t="rtl"===this.element.css("direction");this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(t?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(t?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}})})(jQuery);(function(e){var t={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};e.widget("ui.dialog",{version:"1.10.3",options:{appendTo:"body",autoOpen:!0,buttons:[],closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(t){var i=e(this).css(t).offset().top;0>i&&e(this).css("top",t.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),this.options.title=this.options.title||this.originalTitle,this._createWrapper(),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&e.fn.draggable&&this._makeDraggable(),this.options.resizable&&e.fn.resizable&&this._makeResizable(),this._isOpen=!1},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var t=this.options.appendTo;return t&&(t.jquery||t.nodeType)?e(t):this.document.find(t||"body").eq(0)},_destroy:function(){var e,t=this.originalPosition;this._destroyOverlay(),this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach(),this.uiDialog.stop(!0,!0).remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),e=t.parent.children().eq(t.index),e.length&&e[0]!==this.element[0]?e.before(this.element):t.parent.append(this.element)},widget:function(){return this.uiDialog},disable:e.noop,enable:e.noop,close:function(t){var i=this;this._isOpen&&this._trigger("beforeClose",t)!==!1&&(this._isOpen=!1,this._destroyOverlay(),this.opener.filter(":focusable").focus().length||e(this.document[0].activeElement).blur(),this._hide(this.uiDialog,this.options.hide,function(){i._trigger("close",t)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(e,t){var i=!!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;return i&&!t&&this._trigger("focus",e),i},open:function(){var t=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),undefined):(this._isOpen=!0,this.opener=e(this.document[0].activeElement),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this._show(this.uiDialog,this.options.show,function(){t._focusTabbable(),t._trigger("focus")}),this._trigger("open"),undefined)},_focusTabbable:function(){var e=this.element.find("[autofocus]");e.length||(e=this.element.find(":tabbable")),e.length||(e=this.uiDialogButtonPane.find(":tabbable")),e.length||(e=this.uiDialogTitlebarClose.filter(":tabbable")),e.length||(e=this.uiDialog),e.eq(0).focus()},_keepFocus:function(t){function i(){var t=this.document[0].activeElement,i=this.uiDialog[0]===t||e.contains(this.uiDialog[0],t);i||this._focusTabbable()}t.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){this.uiDialog=e("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front "+this.options.dialogClass).hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._on(this.uiDialog,{keydown:function(t){if(this.options.closeOnEscape&&!t.isDefaultPrevented()&&t.keyCode&&t.keyCode===e.ui.keyCode.ESCAPE)return t.preventDefault(),this.close(t),undefined;if(t.keyCode===e.ui.keyCode.TAB){var i=this.uiDialog.find(":tabbable"),a=i.filter(":first"),s=i.filter(":last");t.target!==s[0]&&t.target!==this.uiDialog[0]||t.shiftKey?t.target!==a[0]&&t.target!==this.uiDialog[0]||!t.shiftKey||(s.focus(1),t.preventDefault()):(a.focus(1),t.preventDefault())}},mousedown:function(e){this._moveToTop(e)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var t;this.uiDialogTitlebar=e("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog),this._on(this.uiDialogTitlebar,{mousedown:function(t){e(t.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.focus()}}),this.uiDialogTitlebarClose=e("<button></button>").button({label:this.options.closeText,icons:{primary:"ui-icon-closethick"},text:!1}).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar),this._on(this.uiDialogTitlebarClose,{click:function(e){e.preventDefault(),this.close(e)}}),t=e("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar),this._title(t),this.uiDialog.attr({"aria-labelledby":t.attr("id")})},_title:function(e){this.options.title||e.html("&#160;"),e.text(this.options.title)},_createButtonPane:function(){this.uiDialogButtonPane=e("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),this.uiButtonSet=e("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane),this._createButtons()},_createButtons:function(){var t=this,i=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),e.isEmptyObject(i)||e.isArray(i)&&!i.length?(this.uiDialog.removeClass("ui-dialog-buttons"),undefined):(e.each(i,function(i,a){var s,n;a=e.isFunction(a)?{click:a,text:i}:a,a=e.extend({type:"button"},a),s=a.click,a.click=function(){s.apply(t.element[0],arguments)},n={icons:a.icons,text:a.showText},delete a.icons,delete a.showText,e("<button></button>",a).button(n).appendTo(t.uiButtonSet)}),this.uiDialog.addClass("ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog),undefined)},_makeDraggable:function(){function t(e){return{position:e.position,offset:e.offset}}var i=this,a=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(a,s){e(this).addClass("ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",a,t(s))},drag:function(e,a){i._trigger("drag",e,t(a))},stop:function(s,n){a.position=[n.position.left-i.document.scrollLeft(),n.position.top-i.document.scrollTop()],e(this).removeClass("ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",s,t(n))}})},_makeResizable:function(){function t(e){return{originalPosition:e.originalPosition,originalSize:e.originalSize,position:e.position,size:e.size}}var i=this,a=this.options,s=a.resizable,n=this.uiDialog.css("position"),r="string"==typeof s?s:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:a.maxWidth,maxHeight:a.maxHeight,minWidth:a.minWidth,minHeight:this._minHeight(),handles:r,start:function(a,s){e(this).addClass("ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",a,t(s))},resize:function(e,a){i._trigger("resize",e,t(a))},stop:function(s,n){a.height=e(this).height(),a.width=e(this).width(),e(this).removeClass("ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",s,t(n))}}).css("position",n)},_minHeight:function(){var e=this.options;return"auto"===e.height?e.minHeight:Math.min(e.minHeight,e.height)},_position:function(){var e=this.uiDialog.is(":visible");e||this.uiDialog.show(),this.uiDialog.position(this.options.position),e||this.uiDialog.hide()},_setOptions:function(a){var s=this,n=!1,r={};e.each(a,function(e,a){s._setOption(e,a),e in t&&(n=!0),e in i&&(r[e]=a)}),n&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",r)},_setOption:function(e,t){var i,a,s=this.uiDialog;"dialogClass"===e&&s.removeClass(this.options.dialogClass).addClass(t),"disabled"!==e&&(this._super(e,t),"appendTo"===e&&this.uiDialog.appendTo(this._appendTo()),"buttons"===e&&this._createButtons(),"closeText"===e&&this.uiDialogTitlebarClose.button({label:""+t}),"draggable"===e&&(i=s.is(":data(ui-draggable)"),i&&!t&&s.draggable("destroy"),!i&&t&&this._makeDraggable()),"position"===e&&this._position(),"resizable"===e&&(a=s.is(":data(ui-resizable)"),a&&!t&&s.resizable("destroy"),a&&"string"==typeof t&&s.resizable("option","handles",t),a||t===!1||this._makeResizable()),"title"===e&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var e,t,i,a=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),a.minWidth>a.width&&(a.width=a.minWidth),e=this.uiDialog.css({height:"auto",width:a.width}).outerHeight(),t=Math.max(0,a.minHeight-e),i="number"==typeof a.maxHeight?Math.max(0,a.maxHeight-e):"none","auto"===a.height?this.element.css({minHeight:t,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,a.height-e)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var t=e(this);return e("<div>").css({position:"absolute",width:t.outerWidth(),height:t.outerHeight()}).appendTo(t.parent()).offset(t.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(t){return e(t.target).closest(".ui-dialog").length?!0:!!e(t.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var t=this,i=this.widgetFullName;e.ui.dialog.overlayInstances||this._delay(function(){e.ui.dialog.overlayInstances&&this.document.bind("focusin.dialog",function(a){t._allowInteraction(a)||(a.preventDefault(),e(".ui-dialog:visible:last .ui-dialog-content").data(i)._focusTabbable())})}),this.overlay=e("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo()),this._on(this.overlay,{mousedown:"_keepFocus"}),e.ui.dialog.overlayInstances++}},_destroyOverlay:function(){this.options.modal&&this.overlay&&(e.ui.dialog.overlayInstances--,e.ui.dialog.overlayInstances||this.document.unbind("focusin.dialog"),this.overlay.remove(),this.overlay=null)}}),e.ui.dialog.overlayInstances=0,e.uiBackCompat!==!1&&e.widget("ui.dialog",e.ui.dialog,{_position:function(){var t,i=this.options.position,a=[],s=[0,0];i?(("string"==typeof i||"object"==typeof i&&"0"in i)&&(a=i.split?i.split(" "):[i[0],i[1]],1===a.length&&(a[1]=a[0]),e.each(["left","top"],function(e,t){+a[e]===a[e]&&(s[e]=a[e],a[e]=t)}),i={my:a[0]+(0>s[0]?s[0]:"+"+s[0])+" "+a[1]+(0>s[1]?s[1]:"+"+s[1]),at:a.join(" ")}),i=e.extend({},e.ui.dialog.prototype.options.position,i)):i=e.ui.dialog.prototype.options.position,t=this.uiDialog.is(":visible"),t||this.uiDialog.show(),this.uiDialog.position(i),t||this.uiDialog.hide()}})})(jQuery);(function(e,t){e.widget("ui.progressbar",{version:"1.10.3",options:{max:100,value:0,change:null,complete:null},min:0,_create:function(){this.oldValue=this.options.value=this._constrainedValue(),this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min}),this.valueDiv=e("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this._refreshValue()},_destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove()},value:function(e){return e===t?this.options.value:(this.options.value=this._constrainedValue(e),this._refreshValue(),t)},_constrainedValue:function(e){return e===t&&(e=this.options.value),this.indeterminate=e===!1,"number"!=typeof e&&(e=0),this.indeterminate?!1:Math.min(this.options.max,Math.max(this.min,e))},_setOptions:function(e){var t=e.value;delete e.value,this._super(e),this.options.value=this._constrainedValue(t),this._refreshValue()},_setOption:function(e,t){"max"===e&&(t=Math.max(this.min,t)),this._super(e,t)},_percentage:function(){return this.indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min)},_refreshValue:function(){var t=this.options.value,i=this._percentage();this.valueDiv.toggle(this.indeterminate||t>this.min).toggleClass("ui-corner-right",t===this.options.max).width(i.toFixed(0)+"%"),this.element.toggleClass("ui-progressbar-indeterminate",this.indeterminate),this.indeterminate?(this.element.removeAttr("aria-valuenow"),this.overlayDiv||(this.overlayDiv=e("<div class='ui-progressbar-overlay'></div>").appendTo(this.valueDiv))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":t}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)),this.oldValue!==t&&(this.oldValue=t,this._trigger("change")),t===this.options.max&&this._trigger("complete")}})})(jQuery);(function(e){var t=5;e.widget("ui.slider",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"),this._refresh(),this._setOption("disabled",this.options.disabled),this._animateOff=!1},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var t,i,s=this.options,a=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),n="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",r=[];for(i=s.values&&s.values.length||1,a.length>i&&(a.slice(i).remove(),a=a.slice(0,i)),t=a.length;i>t;t++)r.push(n);this.handles=a.add(e(r.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.each(function(t){e(this).data("ui-slider-handle-index",t)})},_createRange:function(){var t=this.options,i="";t.range?(t.range===!0&&(t.values?t.values.length&&2!==t.values.length?t.values=[t.values[0],t.values[0]]:e.isArray(t.values)&&(t.values=t.values.slice(0)):t.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({left:"",bottom:""}):(this.range=e("<div></div>").appendTo(this.element),i="ui-slider-range ui-widget-header ui-corner-all"),this.range.addClass(i+("min"===t.range||"max"===t.range?" ui-slider-range-"+t.range:""))):this.range=e([])},_setupEvents:function(){var e=this.handles.add(this.range).filter("a");this._off(e),this._on(e,this._handleEvents),this._hoverable(e),this._focusable(e)},_destroy:function(){this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(t){var i,s,a,n,r,o,h,l,u=this,c=this.options;return c.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:t.pageX,y:t.pageY},s=this._normValueFromMouse(i),a=this._valueMax()-this._valueMin()+1,this.handles.each(function(t){var i=Math.abs(s-u.values(t));(a>i||a===i&&(t===u._lastChangedValue||u.values(t)===c.min))&&(a=i,n=e(this),r=t)}),o=this._start(t,r),o===!1?!1:(this._mouseSliding=!0,this._handleIndex=r,n.addClass("ui-state-active").focus(),h=n.offset(),l=!e(t.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:t.pageX-h.left-n.width()/2,top:t.pageY-h.top-n.height()/2-(parseInt(n.css("borderTopWidth"),10)||0)-(parseInt(n.css("borderBottomWidth"),10)||0)+(parseInt(n.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(t,r,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(e){var t={x:e.pageX,y:e.pageY},i=this._normValueFromMouse(t);return this._slide(e,this._handleIndex,i),!1},_mouseStop:function(e){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(e,this._handleIndex),this._change(e,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(e){var t,i,s,a,n;return"horizontal"===this.orientation?(t=this.elementSize.width,i=e.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(t=this.elementSize.height,i=e.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/t,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),a=this._valueMax()-this._valueMin(),n=this._valueMin()+s*a,this._trimAlignValue(n)},_start:function(e,t){var i={handle:this.handles[t],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("start",e,i)},_slide:function(e,t,i){var s,a,n;this.options.values&&this.options.values.length?(s=this.values(t?0:1),2===this.options.values.length&&this.options.range===!0&&(0===t&&i>s||1===t&&s>i)&&(i=s),i!==this.values(t)&&(a=this.values(),a[t]=i,n=this._trigger("slide",e,{handle:this.handles[t],value:i,values:a}),s=this.values(t?0:1),n!==!1&&this.values(t,i,!0))):i!==this.value()&&(n=this._trigger("slide",e,{handle:this.handles[t],value:i}),n!==!1&&this.value(i))},_stop:function(e,t){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("stop",e,i)},_change:function(e,t){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._lastChangedValue=t,this._trigger("change",e,i)}},value:function(e){return arguments.length?(this.options.value=this._trimAlignValue(e),this._refreshValue(),this._change(null,0),undefined):this._value()},values:function(t,i){var s,a,n;if(arguments.length>1)return this.options.values[t]=this._trimAlignValue(i),this._refreshValue(),this._change(null,t),undefined;if(!arguments.length)return this._values();if(!e.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(t):this.value();for(s=this.options.values,a=arguments[0],n=0;s.length>n;n+=1)s[n]=this._trimAlignValue(a[n]),this._change(null,n);this._refreshValue()},_setOption:function(t,i){var s,a=0;switch("range"===t&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),e.isArray(this.options.values)&&(a=this.options.values.length),e.Widget.prototype._setOption.apply(this,arguments),t){case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=0;a>s;s+=1)this._change(null,s);this._animateOff=!1;break;case"min":case"max":this._animateOff=!0,this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_value:function(){var e=this.options.value;return e=this._trimAlignValue(e)},_values:function(e){var t,i,s;if(arguments.length)return t=this.options.values[e],t=this._trimAlignValue(t);if(this.options.values&&this.options.values.length){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(e){if(this._valueMin()>=e)return this._valueMin();if(e>=this._valueMax())return this._valueMax();var t=this.options.step>0?this.options.step:1,i=(e-this._valueMin())%t,s=e-i;return 2*Math.abs(i)>=t&&(s+=i>0?t:-t),parseFloat(s.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var t,i,s,a,n,r=this.options.range,o=this.options,h=this,l=this._animateOff?!1:o.animate,u={};this.options.values&&this.options.values.length?this.handles.each(function(s){i=100*((h.values(s)-h._valueMin())/(h._valueMax()-h._valueMin())),u["horizontal"===h.orientation?"left":"bottom"]=i+"%",e(this).stop(1,1)[l?"animate":"css"](u,o.animate),h.options.range===!0&&("horizontal"===h.orientation?(0===s&&h.range.stop(1,1)[l?"animate":"css"]({left:i+"%"},o.animate),1===s&&h.range[l?"animate":"css"]({width:i-t+"%"},{queue:!1,duration:o.animate})):(0===s&&h.range.stop(1,1)[l?"animate":"css"]({bottom:i+"%"},o.animate),1===s&&h.range[l?"animate":"css"]({height:i-t+"%"},{queue:!1,duration:o.animate}))),t=i}):(s=this.value(),a=this._valueMin(),n=this._valueMax(),i=n!==a?100*((s-a)/(n-a)):0,u["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[l?"animate":"css"](u,o.animate),"min"===r&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:i+"%"},o.animate),"max"===r&&"horizontal"===this.orientation&&this.range[l?"animate":"css"]({width:100-i+"%"},{queue:!1,duration:o.animate}),"min"===r&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:i+"%"},o.animate),"max"===r&&"vertical"===this.orientation&&this.range[l?"animate":"css"]({height:100-i+"%"},{queue:!1,duration:o.animate}))},_handleEvents:{keydown:function(i){var s,a,n,r,o=e(i.target).data("ui-slider-handle-index");switch(i.keyCode){case e.ui.keyCode.HOME:case e.ui.keyCode.END:case e.ui.keyCode.PAGE_UP:case e.ui.keyCode.PAGE_DOWN:case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(i.preventDefault(),!this._keySliding&&(this._keySliding=!0,e(i.target).addClass("ui-state-active"),s=this._start(i,o),s===!1))return}switch(r=this.options.step,a=n=this.options.values&&this.options.values.length?this.values(o):this.value(),i.keyCode){case e.ui.keyCode.HOME:n=this._valueMin();break;case e.ui.keyCode.END:n=this._valueMax();break;case e.ui.keyCode.PAGE_UP:n=this._trimAlignValue(a+(this._valueMax()-this._valueMin())/t);break;case e.ui.keyCode.PAGE_DOWN:n=this._trimAlignValue(a-(this._valueMax()-this._valueMin())/t);break;case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:if(a===this._valueMax())return;n=this._trimAlignValue(a+r);break;case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(a===this._valueMin())return;n=this._trimAlignValue(a-r)}this._slide(i,o,n)},click:function(e){e.preventDefault()},keyup:function(t){var i=e(t.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(t,i),this._change(t,i),e(t.target).removeClass("ui-state-active"))}}})})(jQuery);(function(e,t){function i(){return++a}function s(e){return e.hash.length>1&&decodeURIComponent(e.href.replace(n,""))===decodeURIComponent(location.href.replace(n,""))}var a=0,n=/#.*$/;e.widget("ui.tabs",{version:"1.10.3",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var t=this,i=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",i.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(t){e(this).is(".ui-state-disabled")&&t.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){e(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this._processTabs(),i.active=this._initialActive(),e.isArray(i.disabled)&&(i.disabled=e.unique(i.disabled.concat(e.map(this.tabs.filter(".ui-state-disabled"),function(e){return t.tabs.index(e)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):e(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var i=this.options.active,s=this.options.collapsible,a=location.hash.substring(1);return null===i&&(a&&this.tabs.each(function(s,n){return e(n).attr("aria-controls")===a?(i=s,!1):t}),null===i&&(i=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===i||-1===i)&&(i=this.tabs.length?0:!1)),i!==!1&&(i=this.tabs.index(this.tabs.eq(i)),-1===i&&(i=s?!1:0)),!s&&i===!1&&this.anchors.length&&(i=0),i},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):e()}},_tabKeydown:function(i){var s=e(this.document[0].activeElement).closest("li"),a=this.tabs.index(s),n=!0;if(!this._handlePageNav(i)){switch(i.keyCode){case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:a++;break;case e.ui.keyCode.UP:case e.ui.keyCode.LEFT:n=!1,a--;break;case e.ui.keyCode.END:a=this.anchors.length-1;break;case e.ui.keyCode.HOME:a=0;break;case e.ui.keyCode.SPACE:return i.preventDefault(),clearTimeout(this.activating),this._activate(a),t;case e.ui.keyCode.ENTER:return i.preventDefault(),clearTimeout(this.activating),this._activate(a===this.options.active?!1:a),t;default:return}i.preventDefault(),clearTimeout(this.activating),a=this._focusNextTab(a,n),i.ctrlKey||(s.attr("aria-selected","false"),this.tabs.eq(a).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",a)},this.delay))}},_panelKeydown:function(t){this._handlePageNav(t)||t.ctrlKey&&t.keyCode===e.ui.keyCode.UP&&(t.preventDefault(),this.active.focus())},_handlePageNav:function(i){return i.altKey&&i.keyCode===e.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):i.altKey&&i.keyCode===e.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):t},_findNextTab:function(t,i){function s(){return t>a&&(t=0),0>t&&(t=a),t}for(var a=this.tabs.length-1;-1!==e.inArray(s(),this.options.disabled);)t=i?t+1:t-1;return t},_focusNextTab:function(e,t){return e=this._findNextTab(e,t),this.tabs.eq(e).focus(),e},_setOption:function(e,i){return"active"===e?(this._activate(i),t):"disabled"===e?(this._setupDisabled(i),t):(this._super(e,i),"collapsible"===e&&(this.element.toggleClass("ui-tabs-collapsible",i),i||this.options.active!==!1||this._activate(0)),"event"===e&&this._setupEvents(i),"heightStyle"===e&&this._setupHeightStyle(i),t)},_tabId:function(e){return e.attr("aria-controls")||"ui-tabs-"+i()},_sanitizeSelector:function(e){return e?e.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var t=this.options,i=this.tablist.children(":has(a[href])");t.disabled=e.map(i.filter(".ui-state-disabled"),function(e){return i.index(e)}),this._processTabs(),t.active!==!1&&this.anchors.length?this.active.length&&!e.contains(this.tablist[0],this.active[0])?this.tabs.length===t.disabled.length?(t.active=!1,this.active=e()):this._activate(this._findNextTab(Math.max(0,t.active-1),!1)):t.active=this.tabs.index(this.active):(t.active=!1,this.active=e()),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var t=this;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist"),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return e("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=e(),this.anchors.each(function(i,a){var n,r,o,h=e(a).uniqueId().attr("id"),l=e(a).closest("li"),u=l.attr("aria-controls");s(a)?(n=a.hash,r=t.element.find(t._sanitizeSelector(n))):(o=t._tabId(l),n="#"+o,r=t.element.find(n),r.length||(r=t._createPanel(o),r.insertAfter(t.panels[i-1]||t.tablist)),r.attr("aria-live","polite")),r.length&&(t.panels=t.panels.add(r)),u&&l.data("ui-tabs-aria-controls",u),l.attr({"aria-controls":n.substring(1),"aria-labelledby":h}),r.attr("aria-labelledby",h)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel")},_getList:function(){return this.element.find("ol,ul").eq(0)},_createPanel:function(t){return e("<div>").attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(t){e.isArray(t)&&(t.length?t.length===this.anchors.length&&(t=!0):t=!1);for(var i,s=0;i=this.tabs[s];s++)t===!0||-1!==e.inArray(s,t)?e(i).addClass("ui-state-disabled").attr("aria-disabled","true"):e(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=t},_setupEvents:function(t){var i={click:function(e){e.preventDefault()}};t&&e.each(t.split(" "),function(e,t){i[t]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(t){var i,s=this.element.parent();"fill"===t?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var t=e(this),s=t.css("position");"absolute"!==s&&"fixed"!==s&&(i-=t.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=e(this).outerHeight(!0)}),this.panels.each(function(){e(this).height(Math.max(0,i-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):"auto"===t&&(i=0,this.panels.each(function(){i=Math.max(i,e(this).height("").height())}).height(i))},_eventHandler:function(t){var i=this.options,s=this.active,a=e(t.currentTarget),n=a.closest("li"),r=n[0]===s[0],o=r&&i.collapsible,h=o?e():this._getPanelForTab(n),l=s.length?this._getPanelForTab(s):e(),u={oldTab:s,oldPanel:l,newTab:o?e():n,newPanel:h};t.preventDefault(),n.hasClass("ui-state-disabled")||n.hasClass("ui-tabs-loading")||this.running||r&&!i.collapsible||this._trigger("beforeActivate",t,u)===!1||(i.active=o?!1:this.tabs.index(n),this.active=r?e():n,this.xhr&&this.xhr.abort(),l.length||h.length||e.error("jQuery UI Tabs: Mismatching fragment identifier."),h.length&&this.load(this.tabs.index(n),t),this._toggle(t,u))},_toggle:function(t,i){function s(){n.running=!1,n._trigger("activate",t,i)}function a(){i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),r.length&&n.options.show?n._show(r,n.options.show,s):(r.show(),s())}var n=this,r=i.newPanel,o=i.oldPanel;this.running=!0,o.length&&this.options.hide?this._hide(o,this.options.hide,function(){i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),a()}):(i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),o.hide(),a()),o.attr({"aria-expanded":"false","aria-hidden":"true"}),i.oldTab.attr("aria-selected","false"),r.length&&o.length?i.oldTab.attr("tabIndex",-1):r.length&&this.tabs.filter(function(){return 0===e(this).attr("tabIndex")}).attr("tabIndex",-1),r.attr({"aria-expanded":"true","aria-hidden":"false"}),i.newTab.attr({"aria-selected":"true",tabIndex:0})},_activate:function(t){var i,s=this._findActive(t);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:e.noop}))},_findActive:function(t){return t===!1?e():this.tabs.eq(t)},_getIndex:function(e){return"string"==typeof e&&(e=this.anchors.index(this.anchors.filter("[href$='"+e+"']"))),e},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tabs.add(this.panels).each(function(){e.data(this,"ui-tabs-destroy")?e(this).remove():e(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var t=e(this),i=t.data("ui-tabs-aria-controls");i?t.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):t.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(i){var s=this.options.disabled;s!==!1&&(i===t?s=!1:(i=this._getIndex(i),s=e.isArray(s)?e.map(s,function(e){return e!==i?e:null}):e.map(this.tabs,function(e,t){return t!==i?t:null})),this._setupDisabled(s))},disable:function(i){var s=this.options.disabled;if(s!==!0){if(i===t)s=!0;else{if(i=this._getIndex(i),-1!==e.inArray(i,s))return;s=e.isArray(s)?e.merge([i],s).sort():[i]}this._setupDisabled(s)}},load:function(t,i){t=this._getIndex(t);var a=this,n=this.tabs.eq(t),r=n.find(".ui-tabs-anchor"),o=this._getPanelForTab(n),h={tab:n,panel:o};s(r[0])||(this.xhr=e.ajax(this._ajaxSettings(r,i,h)),this.xhr&&"canceled"!==this.xhr.statusText&&(n.addClass("ui-tabs-loading"),o.attr("aria-busy","true"),this.xhr.success(function(e){setTimeout(function(){o.html(e),a._trigger("load",i,h)},1)}).complete(function(e,t){setTimeout(function(){"abort"===t&&a.panels.stop(!1,!0),n.removeClass("ui-tabs-loading"),o.removeAttr("aria-busy"),e===a.xhr&&delete a.xhr},1)})))},_ajaxSettings:function(t,i,s){var a=this;return{url:t.attr("href"),beforeSend:function(t,n){return a._trigger("beforeLoad",i,e.extend({jqXHR:t,ajaxSettings:n},s))}}},_getPanelForTab:function(t){var i=e(t).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}})})(jQuery);;/*! Backstretch - v2.0.4 - 2013-06-19
 * http://srobbin.com/jquery-plugins/backstretch/
 * Copyright (c) 2013 Scott Robbin; Licensed MIT */
(function(a,d,p){a.fn.backstretch=function(c,b){(c===p||0===c.length)&&a.error("No images were supplied for Backstretch");0===a(d).scrollTop()&&d.scrollTo(0,0);return this.each(function(){var d=a(this),g=d.data("backstretch");if(g){if("string"==typeof c&&"function"==typeof g[c]){g[c](b);return}b=a.extend(g.options,b);g.destroy(!0)}g=new q(this,c,b);d.data("backstretch",g)})};a.backstretch=function(c,b){return a("body").backstretch(c,b).data("backstretch")};a.expr[":"].backstretch=function(c){return a(c).data("backstretch")!==p};a.fn.backstretch.defaults={centeredX:!0,centeredY:!0,duration:5E3,fade:0};var r={left:0,top:0,overflow:"hidden",margin:0,padding:0,height:"100%",width:"100%",zIndex:-999999},s={position:"absolute",display:"none",margin:0,padding:0,border:"none",width:"auto",height:"auto",maxHeight:"none",maxWidth:"none",zIndex:-999999},q=function(c,b,e){this.options=a.extend({},a.fn.backstretch.defaults,e||{});this.images=a.isArray(b)?b:[b];a.each(this.images,function(){a("<img />")[0].src=this});this.isBody=c===document.body;this.$container=a(c);this.$root=this.isBody?l?a(d):a(document):this.$container;c=this.$container.children(".backstretch").first();this.$wrap=c.length?c:a('<div class="backstretch"></div>').css(r).appendTo(this.$container);this.isBody||(c=this.$container.css("position"),b=this.$container.css("zIndex"),this.$container.css({position:"static"===c?"relative":c,zIndex:"auto"===b?0:b,background:"none"}),this.$wrap.css({zIndex:-999998}));this.$wrap.css({position:this.isBody&&l?"fixed":"absolute"});this.index=0;this.show(this.index);a(d).on("resize.backstretch",a.proxy(this.resize,this)).on("orientationchange.backstretch",a.proxy(function(){this.isBody&&0===d.pageYOffset&&(d.scrollTo(0,1),this.resize())},this))};q.prototype={resize:function(){try{var a={left:0,top:0},b=this.isBody?this.$root.width():this.$root.innerWidth(),e=b,g=this.isBody?d.innerHeight?d.innerHeight:this.$root.height():this.$root.innerHeight(),j=e/this.$img.data("ratio"),f;j>=g?(f=(j-g)/2,this.options.centeredY&&(a.top="-"+f+"px")):(j=g,e=j*this.$img.data("ratio"),f=(e-b)/2,this.options.centeredX&&(a.left="-"+f+"px"));this.$wrap.css({width:b,height:g}).find("img:not(.deleteable)").css({width:e,height:j}).css(a)}catch(h){}return this},show:function(c){if(!(Math.abs(c)>this.images.length-1)){var b=this,e=b.$wrap.find("img").addClass("deleteable"),d={relatedTarget:b.$container[0]};b.$container.trigger(a.Event("backstretch.before",d),[b,c]);this.index=c;clearInterval(b.interval);b.$img=a("<img />").css(s).bind("load",function(f){var h=this.width||a(f.target).width();f=this.height||a(f.target).height();a(this).data("ratio",h/f);a(this).fadeIn(b.options.speed||b.options.fade,function(){e.remove();b.paused||b.cycle();a(["after","show"]).each(function(){b.$container.trigger(a.Event("backstretch."+this,d),[b,c])})});b.resize()}).appendTo(b.$wrap);b.$img.attr("src",b.images[c]);return b}},next:function(){return this.show(this.index<this.images.length-1?this.index+1:0)},prev:function(){return this.show(0===this.index?this.images.length-1:this.index-1)},pause:function(){this.paused=!0;return this},resume:function(){this.paused=!1;this.next();return this},cycle:function(){1<this.images.length&&(clearInterval(this.interval),this.interval=setInterval(a.proxy(function(){this.paused||this.next()},this),this.options.duration));return this},destroy:function(c){a(d).off("resize.backstretch orientationchange.backstretch");clearInterval(this.interval);c||this.$wrap.remove();this.$container.removeData("backstretch")}};var l,f=navigator.userAgent,m=navigator.platform,e=f.match(/AppleWebKit\/([0-9]+)/),e=!!e&&e[1],h=f.match(/Fennec\/([0-9]+)/),h=!!h&&h[1],n=f.match(/Opera Mobi\/([0-9]+)/),t=!!n&&n[1],k=f.match(/MSIE ([0-9]+)/),k=!!k&&k[1];l=!((-1<m.indexOf("iPhone")||-1<m.indexOf("iPad")||-1<m.indexOf("iPod"))&&e&&534>e||d.operamini&&"[object OperaMini]"==={}.toString.call(d.operamini)||n&&7458>t||-1<f.indexOf("Android")&&e&&533>e||h&&6>h||"palmGetResource"in d&&e&&534>e||-1<f.indexOf("MeeGo")&&-1<f.indexOf("NokiaBrowser/8.5.0")||k&&6>=k)})(jQuery,window);;(function($, undefined) {
  $.extend({
    jsonRPC: {
      // RPC Version Number
      version: '2.0',

      // End point URL, sets default in requests if not
      // specified with the request call
      endPoint: null,

      // Default namespace for methods
      namespace: null,

      /*
       * Provides the RPC client with an optional default endpoint and namespace
       *
       * @param {object} The params object which can contain
       *   endPoint {string} The default endpoint for RPC requests
       *   namespace {string} The default namespace for RPC requests
       *   cache {boolean} If set to false, it will force requested
       *       pages not to be cached by the browser. Setting cache
       *       to false also appends a query string parameter,
       *       "_=[TIMESTAMP]", to the URL. (Default: true)
       */
      setup: function(params) {
        this._validateConfigParams(params);
        this.endPoint = params.endPoint;
        this.namespace = params.namespace;
        this.cache = params.cache !== undefined ? cache : true;
        return this;
      },

      /*
       * Convenience wrapper method to allow you to temporarily set a config parameter
       * (endPoint or namespace) and ensure it gets set back to what it was before
       *
       * @param {object} The params object which can contains
       *   endPoint {string} The default endpoint for RPC requests
       *   namespace {string} The default namespace for RPC requests
       * @param {function} callback The function to call with the new params in place
       */
      withOptions: function(params, callback) {
        this._validateConfigParams(params);
        // No point in running if there isn't a callback received to run
        if(callback === undefined) throw("No callback specified");

        origParams = {endPoint: this.endPoint, namespace: this.namespace};
        this.setup(params);
        callback.call(this);
        this.setup(origParams);
      },

      /*
       * Performas a single RPC request
       *
       * @param {string} method The name of the rpc method to be called
       * @param {object} options A collection of object which can contains
       *  params {array} the params array to send along with the request
       *  success {function} a function that will be executed if the request succeeds
       *  error {function} a function that will be executed if the request fails
       *  url {string} the url to send the request to
       *  id {string} the provenance id for this request (defaults to 1)
       *  cache {boolean} If set to false, it will force requested
       *       pages not to be cached by the browser. Setting cache
       *       to false also appends a query string parameter,
       *       "_=[TIMESTAMP]", to the URL. (Default: cache value
       *       set with the setup method)
       * @return {undefined}
       */
      request: function(method, options) {
        if(options === undefined) {
          options = { id: 1 };
        }
        if (options.id === undefined) {
          options.id = 1;
        }
        if (options.cache === undefined) {
          options.cache = this.cache;
        }

        // Validate method arguments
        this._validateRequestMethod(method);
        this._validateRequestParams(options.params);
        this._validateRequestCallbacks(options.success, options.error);

        // Perform the actual request
        this._doRequest(JSON.stringify(this._requestDataObj(method, options.params, options.id)), options);

        return true;
      },

      /*
       * Submits multiple requests
       * Takes an array of objects that contain a method and params
       *
       * @params {array} requests an array of request object which can contain
       *  method {string} the name of the method
       *  param {object} the params object to be sent with the request
       *  id {string} the provenance id for the request (defaults to an incrementer starting at 1)
       * @param {object} options A collection of object which can contains
       *  success {function} a function that will be executed if the request succeeds
       *  error {function} a function that will be executed if the request fails
       *  url {string} the url to send the request to
       * @return {undefined}
       */
      batchRequest: function(requests, options) {
        if(options === undefined) {
          options = {};
        }

        // Ensure our requests come in as an array
        if(!$.isArray(requests) || requests.length === 0) throw("Invalid requests supplied for jsonRPC batchRequest. Must be an array object that contain at least a method attribute");

        // Make sure each of our request objects are valid
        var _that = this;
        $.each(requests, function(i, req) {
          _that._validateRequestMethod(req.method);
          _that._validateRequestParams(req.params);
          if (req.id === undefined) {
            req.id = i + 1;
          }
        });
        this._validateRequestCallbacks(options.success, options.error);

        var data = [],
            request;

        // Prepare our request object
        for(var i = 0; i<requests.length; i++) {
          request = requests[i];
          data.push(this._requestDataObj(request.method, request.params, request.id));
        }

        this._doRequest(JSON.stringify(data), options);
      },

      // Validate a params hash
      _validateConfigParams: function(params) {
        if(params === undefined) {
          throw("No params specified");
        }
        else {
          if(params.endPoint && typeof(params.endPoint) !== 'string'){
            throw("endPoint must be a string");
          }
          if(params.namespace && typeof(params.namespace) !== 'string'){
            throw("namespace must be a string");
          }
        }
      },

      // Request method must be a string
      _validateRequestMethod: function(method) {
        if(typeof(method) !== 'string') throw("Invalid method supplied for jsonRPC request")
        return true;
      },

      // Validate request params.  Must be a) empty, b) an object (e.g. {}), or c) an array
      _validateRequestParams: function(params) {
        if(!(params === null ||
             params === undefined ||
             typeof(params) === 'object' ||
             $.isArray(params))) {
          throw("Invalid params supplied for jsonRPC request. It must be empty, an object or an array.");
        }
        return true;
      },

      _validateRequestCallbacks: function(success, error) {
        // Make sure callbacks are either empty or a function
        if(success !== undefined &&
           typeof(success) !== 'function') throw("Invalid success callback supplied for jsonRPC request");
        if(error !== undefined &&
         typeof(error) !== 'function') throw("Invalid error callback supplied for jsonRPC request");
        return true;
      },

      // Internal method used for generic ajax requests
      _doRequest: function(data, options) {
        var _that = this;
        $.ajax({
          type: 'POST',
          async: false !== options.async,
          dataType: 'json',
          contentType: 'application/json',
          url: this._requestUrl((options.endPoint || options.url), options.cache),
          data: data,
          cache: options.cache,
          processData: false,
          error: function(json) {
            _that._requestError.call(_that, json, options.error);
          },
          success: function(json) {
            _that._requestSuccess.call(_that, json, options.success, options.error);
          }
        })
      },

      // Determines the appropriate request URL to call for a request
      _requestUrl: function(url, cache) {
        url = url || this.endPoint;
        if (!cache) {
            if (url.indexOf("?") < 0) {
              url += '?tm=' + new Date().getTime();
            }
            else {
              url += "&tm=" + new Date().getTime();
            }
        }
        return url;
      },

      // Creates an RPC suitable request object
      _requestDataObj: function(method, params, id) {
        var dataObj = {
          jsonrpc: this.version,
          method: this.namespace ? this.namespace +'.'+ method : method,
          id: id
        }
        if(params !== undefined) {
          dataObj.params = params;
        }
        return dataObj;
      },

      // Handles calling of error callback function
      _requestError: function(json, error) {
        if (error !== undefined && typeof(error) === 'function') {
          if(typeof(json.responseText) === 'string') {
            try {
              error(eval ( '(' + json.responseText + ')' ));
            }
            catch(e) {
              error(this._response());
            }
          }
          else {
            error(this._response());
          }
        }
      },

      // Handles calling of RPC success, calls error callback
      // if the response contains an error
      // TODO: Handle error checking for batch requests
      _requestSuccess: function(json, success, error) {
        var response = this._response(json);

        // If we've encountered an error in the response, trigger the error callback if it exists
        if(response.error && typeof(error) === 'function') {
          error(response);
          return;
        }

        // Otherwise, successful request, run the success request if it exists
        if(typeof(success) === 'function') {
          success(response);
        }
      },

      // Returns a generic RPC 2.0 compatible response object
      _response: function(json) {
        if (json === undefined) {
          return {
            error: 'Internal server error',
            version: '2.0'
          };
        }
        else {
          try {
            if(typeof(json) === 'string') {
              json = eval ( '(' + json + ')' );
            }

            if (($.isArray(json) && json.length > 0 && json[0].jsonrpc !== '2.0') ||
                (!$.isArray(json) && json.jsonrpc !== '2.0')) {
              throw 'Version error';
            }

            return json;
          }
          catch (e) {
            return {
              error: 'Internal server error: ' + e,
              version: '2.0'
            }
          }
        }
      }

    }
  });
})(jQuery);
;/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.8.4
 *
 */
(function(a,b,c,d){var e=a(b);a.fn.lazyload=function(c){function i(){var b=0;f.each(function(){var c=a(this);if(h.skip_invisible&&!c.is(":visible"))return;if(!a.abovethetop(this,h)&&!a.leftofbegin(this,h))if(!a.belowthefold(this,h)&&!a.rightoffold(this,h))c.trigger("appear"),b=0;else if(++b>h.failure_limit)return!1})}var f=this,g,h={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:!0,appear:null,load:null};return c&&(d!==c.failurelimit&&(c.failure_limit=c.failurelimit,delete c.failurelimit),d!==c.effectspeed&&(c.effect_speed=c.effectspeed,delete c.effectspeed),a.extend(h,c)),g=h.container===d||h.container===b?e:a(h.container),0===h.event.indexOf("scroll")&&g.bind(h.event,function(a){return i()}),this.each(function(){var b=this,c=a(b);b.loaded=!1,c.one("appear",function(){if(!this.loaded){if(h.appear){var d=f.length;h.appear.call(b,d,h)}a("<img />").bind("load",function(){c.hide().attr("src",c.data(h.data_attribute))[h.effect](h.effect_speed),b.loaded=!0;var d=a.grep(f,function(a){return!a.loaded});f=a(d);if(h.load){var e=f.length;h.load.call(b,e,h)}}).attr("src",c.data(h.data_attribute))}}),0!==h.event.indexOf("scroll")&&c.bind(h.event,function(a){b.loaded||c.trigger("appear")})}),e.bind("resize",function(a){i()}),/iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion)&&e.bind("pageshow",function(b){b.originalEvent.persisted&&f.each(function(){a(this).trigger("appear")})}),a(b).load(function(){i()}),this},a.belowthefold=function(c,f){var g;return f.container===d||f.container===b?g=e.height()+e.scrollTop():g=a(f.container).offset().top+a(f.container).height(),g<=a(c).offset().top-f.threshold},a.rightoffold=function(c,f){var g;return f.container===d||f.container===b?g=e.width()+e.scrollLeft():g=a(f.container).offset().left+a(f.container).width(),g<=a(c).offset().left-f.threshold},a.abovethetop=function(c,f){var g;return f.container===d||f.container===b?g=e.scrollTop():g=a(f.container).offset().top,g>=a(c).offset().top+f.threshold+a(c).height()},a.leftofbegin=function(c,f){var g;return f.container===d||f.container===b?g=e.scrollLeft():g=a(f.container).offset().left,g>=a(c).offset().left+f.threshold+a(c).width()},a.inviewport=function(b,c){return!a.rightoffold(b,c)&&!a.leftofbegin(b,c)&&!a.belowthefold(b,c)&&!a.abovethetop(b,c)},a.extend(a.expr[":"],{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-screen":function(b){return a.rightoffold(b,{threshold:0})},"left-of-screen":function(b){return!a.rightoffold(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})},"above-the-fold":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-fold":function(b){return a.rightoffold(b,{threshold:0})},"left-of-fold":function(b){return!a.rightoffold(b,{threshold:0})}})})(jQuery,window,document);/*! Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.1.3
 *
 * Requires: 1.2.2+
 */

(function (factory) {
  if ( typeof define === 'function' && define.amd ) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS style for Browserify
    module.exports = factory;
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
  var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
  var lowestDelta, lowestDeltaXY;

  if ( $.event.fixHooks ) {
    for ( var i = toFix.length; i; ) {
      $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
    }
  }

  $.event.special.mousewheel = {
    setup: function() {
      if ( this.addEventListener ) {
        for ( var i = toBind.length; i; ) {
          this.addEventListener( toBind[--i], handler, false );
        }
      } else {
        this.onmousewheel = handler;
      }
    },

    teardown: function() {
      if ( this.removeEventListener ) {
        for ( var i = toBind.length; i; ) {
          this.removeEventListener( toBind[--i], handler, false );
        }
      } else {
        this.onmousewheel = null;
      }
    }
  };

  $.fn.extend({
    mousewheel: function(fn) {
      return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },

    unmousewheel: function(fn) {
      return this.unbind("mousewheel", fn);
    }
  });


  function handler(event) {
    var orgEvent = event || window.event,
      args = [].slice.call(arguments, 1),
      delta = 0,
      deltaX = 0,
      deltaY = 0,
      absDelta = 0,
      absDeltaXY = 0,
      fn;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";

    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta; }
    if ( orgEvent.detail )     { delta = orgEvent.detail * -1; }

    // New school wheel delta (wheel event)
    if ( orgEvent.deltaY ) {
      deltaY = orgEvent.deltaY * -1;
      delta  = deltaY;
    }
    if ( orgEvent.deltaX ) {
      deltaX = orgEvent.deltaX;
      delta  = deltaX * -1;
    }

    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = orgEvent.wheelDeltaX * -1; }

    // Look for lowest delta to normalize the delta values
    absDelta = Math.abs(delta);
    if ( !lowestDelta || absDelta < lowestDelta ) { lowestDelta = absDelta; }
    absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
    if ( !lowestDeltaXY || absDeltaXY < lowestDeltaXY ) { lowestDeltaXY = absDeltaXY; }

    // Get a whole value for the deltas
    fn = delta > 0 ? 'floor' : 'ceil';
    delta  = Math[fn](delta / lowestDelta);
    deltaX = Math[fn](deltaX / lowestDeltaXY);
    deltaY = Math[fn](deltaY / lowestDeltaXY);

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return ($.event.dispatch || $.event.handle).apply(this, args);
  }

}));;/**
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.6
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,targ,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);;/*
 * TotalStorage
 *
 * Copyright (c) 2012 Jared Novack & Upstatement (upstatement.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Total Storage is the conceptual the love child of jStorage by Andris Reinman,
 * and Cookie by Klaus Hartl -- though this is not connected to either project.
 *
 * @name $.totalStorage
 * @cat Plugins/Cookie
 * @author Jared Novack/jared@upstatement.com
 * @version 1.1.2
 * @url http://upstatement.com/blog/2012/01/jquery-local-storage-done-right-and-easy/
 */

(function(c,h){var e,d;if("localStorage"in window)try{d="undefined"===typeof window.localStorage?h:window.localStorage,e="undefined"==typeof d||"undefined"==typeof window.JSON?!1:!0}catch(j){e=!1}c.totalStorage=function(b,a){return c.totalStorage.impl.init(b,a)};c.totalStorage.setItem=function(b,a){return c.totalStorage.impl.setItem(b,a)};c.totalStorage.getItem=function(b){return c.totalStorage.impl.getItem(b)};c.totalStorage.getAll=function(){return c.totalStorage.impl.getAll()};c.totalStorage.deleteItem=
  function(b){return c.totalStorage.impl.deleteItem(b)};c.totalStorage.impl={init:function(b,a){return"undefined"!=typeof a?this.setItem(b,a):this.getItem(b)},setItem:function(b,a){if(!e)try{return c.cookie(b,a),a}catch(g){console.log("Local Storage not supported by this browser. Install the cookie plugin on your site to take advantage of the same functionality. You can get it at https://github.com/carhartl/jquery-cookie")}var f=JSON.stringify(a);d.setItem(b,f);return this.parseResult(f)},getItem:function(b){if(!e)try{return this.parseResult(c.cookie(b))}catch(a){return null}b=
  d.getItem(b);return this.parseResult(b)},deleteItem:function(b){if(!e)try{return c.cookie(b,null),!0}catch(a){return!1}d.removeItem(b);return!0},getAll:function(){var b=[];if(e)for(var a in d)a.length&&b.push({key:a,value:this.parseResult(d.getItem(a))});else try{var g=document.cookie.split(";");for(a=0;a<g.length;a++){var f=g[a].split("=")[0];b.push({key:f,value:this.parseResult(c.cookie(f))})}}catch(h){return null}return b},parseResult:function(b){var a;try{a=JSON.parse(b),"undefined"==typeof a&&
  (a=b),"true"==a&&(a=!0),"false"==a&&(a=!1),parseFloat(a)==a&&"object"!=typeof a&&(a=parseFloat(a))}catch(c){a=b}return a}}})(jQuery);;/**
 *
 *  This is bunch of generic helper utils to keep basic logic out of the main app
 *  @TODO cleanup and move stuff to better locations
 *
 */


/**
 * what our setTimeout is attached to
 */
var notificationTimoutObj = {};


/**
 * Dom ready
 */
$(document).ready(function(){


  /********************************************************************************
   * vars/definitions
   ********************************************************************************/

  /**
   * Generic vars
   */
  app.helpers = {};
  app.helpers.scroller = {};

  /**
   * A wrapper for getting the main selectors
   * @param name
   * @returns {*}
   */
  app.helpers.getSelector = function(name){

    var selectors = {
      content: '#content',
      title: '#title',
      dialog: '#dialog',
      sidebar1: '#sidebar-first',
      sidebar2: '#sidebar-second'
    };

    return selectors[name];
  };


  /********************************************************************************
   * Error logging helpers
   ********************************************************************************/

  /**
  * Error handler
  * @param type
  *  type of error, any kind of string
  * @param error
   * error object
  */
  app.helpers.errorHandler = function(type, error){
    console.log('%c Bam! Error occurred (' + type + ')', app.helpers.consoleStyle(4), error);
  };


  /**
   * Debug styles
   * @param args
   */
  app.helpers.consoleStyle = function(style){

    var defaults = {
      background: '#ccc',
      padding: '0 5px',
      color: '#444',
      'font-weight': 'bold',
      'font-size': '110%'
    }, styles = [];

    var mods = [
      {background: '#D8FEFE'},
      {background: '#CCFECD'},
      {background: '#FFFDD9'},
      {background: '#FAE9F1'},
      {background: '#FFCECD'}
    ];

    if(typeof style != undefined){
      defaults = $.extend(defaults, mods[style]);
    }

    for(prop in defaults){
      styles.push(prop + ': ' + defaults[prop]);
    }

    return styles.join('; ');
  };


  /********************************************************************************
   * Global helpers
   ********************************************************************************/


  /**
   * Variables all variables are for use in a single page load, not for persistent storage.
   *
   * Set a variable
   * @param name
   * @param val
   */
  app.helpers.varSet = function(name, val){
    app.vars[name] = val;
  };


  /**
   * Get a variable
   * @param name
   * @param fallback
   * @returns {*}
   */
  app.helpers.varGet = function(name, fallback){
    return (typeof app.vars[name] != undefined ? app.vars[name] : fallback);
  };


  /**
   * like arg() in drupal
   */
  app.helpers.arg = function(n){

    var hash = location.hash,
      args = hash.substring(1).split('/');

    // if n set return string
    if(typeof n != 'undefined'){
      if(typeof args[n] == 'undefined'){
        return '';
      }
      return args[n];
    }

    // return array
    return args;
  };


  /**
   * like shuffle() in php
   */
  app.helpers.shuffle = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };


  /**
   *  Alphabetical sort callback
   */
  app.helpers.aphabeticalSort = function(a,b){
    var nameA=a.toLowerCase(), nameB=b.toLowerCase();
    if (nameA < nameB){ //sort string ascending
      return -1;
    }
    if (nameA > nameB){
      return 1;
    }
    return 0; //default return value (no sorting)
  };


  /**
   *  is a value an int
   */
  app.helpers.isInt = function(value){
    if(app.helpers.exists(value)){
      return ((parseFloat(value) == parseInt(value)) && !isNaN(value));
    }
    return false;
  };


  /**
   * get a random int
   * @param min
   * @param max
   * @returns {number|string}
   */
  app.helpers.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };


  /**
   * Convert seconds to time
   */
  app.helpers.secToTime = function(totalSec){
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;

    // return a string with zeros only when we need em
    return (hours > 0 ? hours + ":" : "") + //hours
      (minutes > 0 ? (hours > 0 && minutes < 10 ? "0" + minutes : minutes) + ":" : (hours > 0 ? "00:" : "")) + //mins
      (seconds  < 10 ? "0" + seconds : seconds); //seconds
  };


  /**
   * wrapper for if ! undefined (seem to use it a bit)
   */
  app.helpers.exists = function(data){
    return (typeof data != 'undefined');
  };


  /********************************************************************************
   * First Sidebar
   ********************************************************************************/


  /**
   * Populate the first sidebar
   * @param content
   * @param append
   */
  app.helpers.setFirstSidebarContent = function(content, append){
    append = (typeof append != 'undefined' && append === true);

    var $container = app.helpers.getFirstSidebarContent();

    // add the content
    if(append){
      $container.append(content);
    } else {
      $container.html(content);
    }

    // trigger binds
    app.helpers.firstSidebarBinds();
  };


  /**
   * Get the first sidebar
   */
  app.helpers.getFirstSidebarContent = function(){

    // ensure sidebar is visible
    app.helpers.toggleSidebar('open');

    var $sidebarFirst = $(app.helpers.getSelector('sidebar1'));
    return $(".sidebar-content", $sidebarFirst);

  };


  /**
   * first sidebar binds
   */
  app.helpers.firstSidebarBinds = function(){

    var $container = app.helpers.getFirstSidebarContent();

    // ensure sidebar is visible
    app.helpers.toggleSidebar('open');

    // trigger lazyload
    $("img.lazy").lazyload({
      effect : "fadeIn",
      container: $container
    });

    // let others hook in
    $container.trigger('scroll');

  };


  /**
   * Toggle sidebar
   * @param state
   *  optional: if not set will toggle, else 'open' or 'close'
   */
  app.helpers.toggleSidebar = function(state){
    var addc = 'sidebar', rmc = 'no-sidebar', $body = $('body');
    if(typeof state == undefined){
      $body.toggleClass(addc).toggleClass(rmc);
    } else {
      if(state == 'open'){
        $body.addClass(addc).removeClass(rmc);
      }
      if(state == 'close'){
        $body.addClass(rmc).removeClass(addc);
      }
    }
  };


  /********************************************************************************
   * Image helpers
   ********************************************************************************/


  /**
   * Get default image
   */
  app.helpers.getDefaultImage = function(type){

    // @TODO move elsewhere
    var files = [
        'wallpaper-443657.jpg',
        'wallpaper-45040.jpg',
        'wallpaper-765190.jpg',
        'wallpaper-84050.jpg'
      ],
      random = files[app.helpers.getRandomInt(0, (files.length - 1))];

    // return random
    return 'theme/images/fanart_default/' + random;

  };


  /********************************************************************************
   * Song/Artist helpers
   ********************************************************************************/


  /**
   * For a given song returns the type and id to use when dealing with the player
   * @param song
   *  assumes songid is file
   * @return {type, id}
   */
  app.helpers.getSongKey = function(song){
    var o = {
      type: (song.songid == 'file' || typeof song.songid == 'undefined' ? 'file' : 'songid')
    };
    o.id = (o.type == 'file' ? song.file : song.songid);
    return o;
  };


  /**
   * A song has artists and artist ids as an array, this parses them into links
   * @param item
   * assumes artist and artistid are properties and arrays
   */
  app.helpers.parseArtistsArray = function(item){
    var meta = [], str;
    for(i in item.artist){ //each artist in item

      if(item.artistid != undefined){ //artist id found
        str = '<a href="#artist/' + item.artistid[i] + '">' + item.artist[i] + '</a>';
      } else { //if no artist ids found
        str = item.artist[i];
      }
      meta.push(str);
    }
    return meta.join(', '); //out as a string
  };


  app.helpers.parseArtistSummary = function(data){
    var totals = {songs:0,albums:0,time:0};
    for(i in data.models){
      totals.albums++;
      for(s in data.models[i].attributes.songs){
        totals.songs++;
        totals.time = totals.time + parseInt(data.models[i].attributes.songs[s].attributes.duration);
      }
    }

    var meta = [];
    meta.push( totals.songs + ' Songs' );
    meta.push( totals.albums + ' Albums' );
    meta.push( Math.floor( (totals.time / 60) ) + ' Mins' );

    return meta.join('<br />');
  };


  /********************************************************************************
   * Title
   ********************************************************************************/


  /**
   * Wrapper for setting page title
   * @param value
   * @param options
   * @returns {boolean}
   */
  app.helpers.setTitle = function(value, options){
    var defaults = {
      addATag: false
    };

    var settings = $.extend(defaults,options),
      $title = $('#title');

    if(settings.addATag){
      value = '<a>' + value + '</a>'
    }

    // default
    $title.html(value);
  };

  /**
   * Wrapper for getting page title
   */
  app.helpers.getTitle = function(){
    return $('#title');
  };


  /********************************************************************************
   * Dialogs
   ********************************************************************************/


  /**
   * Wrapper for dialog box init
   * @param options
   *  http://jqueryui.com/demos/dialog/
   */
  app.helpers.dialogInit = function( options ){

    var settings = {
      autoOpen: false,
      height: "auto",
      width: 350,
      modal: true ,
      resizable: false
    };

    settings = jQuery.extend(settings, options);

    $( app.helpers.getSelector('dialog') ).dialog( settings );

  };


  /**
   * Open a Dialog window
   */
  app.helpers.dialog = function(content, options){

    $dialog = $( app.helpers.getSelector('dialog') );

    // init dialog if required
    if(!$dialog.hasClass('ui-dialog-content')){
      app.helpers.dialogInit();
    }

    $dialog.dialog( "option", "height", "auto");
    $dialog.dialog( "option", "title", " ");
    $dialog.dialog( "option", "buttons", {});

    //set content and options
    $dialog.html(content);
    $dialog.dialog( "option", options );

    //fix scrollTo issue with dialog
    $dialog.bind( "dialogopen", function(event, ui) {
      $('.ui-widget-overlay, .ui-dialog').css('position', 'fixed');
      $('.dialog-menu a:last').addClass('last');

      // bind to enter
      $dialog.keypress(function(e) {
        if (e.keyCode == $.ui.keyCode.ENTER) {
          // look for a button with class "bind-enter" first, fallback to OK btn, fallback to none.
          var $parent = $(this).parent(),
            $enterButton = $parent.find('.bind-enter'),
            $btn = ($enterButton.length == 0 ? $parent.find('.ui-dialog-buttonpane button:first') : $enterButton);
          $btn.trigger("click");
        }
      });
    });

    //open
    $dialog.dialog( "open" );

  };


  /**
   * Close the dialog
   */
  app.helpers.dialogClose = function(){
    $( app.helpers.getSelector('dialog') ).dialog( "close" );
  };


  /**
   * Emulates confirm() but using our dialog
   * @param msg
   *  string message to display
   * @param success
   *  function callback
   */
  app.helpers.confirm = function(msg, success){

    var opts = {
      title: 'Are you sure?',
      buttons: {
        "OK": function(){
          success();
          $( this ).dialog( "close" );
        },
        "Cancel": function() {
          $( this ).dialog( "close" );
        }
      }
    };

    app.helpers.dialog(msg, opts);
  };


  /**
   * Emulates prompt() but using our dialog
   * @param msg
   *  string message to display
   * @param success
   *  function callback
   */
  app.helpers.prompt = function(msg, success){

    var opts = {
      title: 'Prompt',
      buttons: {
        "OK": function(){
          var text = $('#promptText').val();
          if(text != ''){
            success(text);
            $( this ).dialog( "close" );
          }
        },
        "Cancel": function() {
          $( this ).dialog( "close" );
        }
      }
    };

    msg += '<div class="form-item"><input type="text" class="form-text" id="promptText" /></div>';

    app.helpers.dialog(msg, opts);
  };


  /**
   * About Dialog
   */
  app.helpers.aboutDialog = function(){

    var opts = {
      title: 'About this thing',
      buttons: {
        "Cool!": function(){
          $( this ).dialog( "close" );
        },
        "ChangeLog": function(){
          document.location = '#xbmc/changelog';
          $( this ).dialog( "close" );
        }
      }
    };

    // load template and show dialog
    app.helpers.applyTemplate('About', app.addonData, function(msg){
      app.helpers.dialog(msg, opts);
    });

  };



  /********************************************************************************
   * Dropdowns
   ********************************************************************************/


  /**
   * Build a dropdown menu html with some given settings
   * @todo move to template file
   *
   * @param options
   * @returns {string}
   */
  app.helpers.makeDropdown = function(options){

    // get defaults
    var defaults = {
        key: 'untitled',
        items: [],
        pull: 'left',
        omitwrapper: false
      },
      tpl = '',
      settings = $.extend(defaults, options);

    // start build output
    if(!settings.omitwrapper){
      tpl += '<div class="' + settings.key + '-actions list-actions">';
    }
    tpl += '<button class="' + settings.key + '-menu btn dropdown-toggle" data-toggle="dropdown"><i class="icon-ellipsis-vertical"></i></button>';
    tpl += '<ul class="dropdown-menu pull-' + settings.pull + '">';
    for(i in settings.items){
      var item = settings.items[i];
      tpl += '<li><a href="' + item.url + '" class="' + item.class + '">' + item.title + '</a></li>';
    }
    tpl += '</ul>';
    if(!settings.omitwrapper){
      tpl += '</div>';
    }

    // return html
    return tpl;
  };


  /**
   * Dropdown menu structures
   * @param type
   *  song, playlistShell
   * @returns {{}}
   */
  app.helpers.dropdownTemplates = function(type){
    var opts = {};
    switch (type){

      case 'song':
        opts = {
          key: 'song',
          omitwrapper: true,
          items: [
            {url: '#', class: 'song-download', title: 'Download song'},
            {url: '#', class: 'song-custom-playlist', title: 'Add to custom playlist'}
          ]
        };
        break;
      case 'playlistShell':
        opts = {
          key: 'playlist',
          pull: 'right',
          items: [
            {url: '#', class: 'save-playlist', title: 'Save XBMC Playlist'},
            {url: '#', class: 'clear-playlist', title: 'Clear Playlist'},
            {url: '#', class: 'refresh-playlist', title: 'Refresh Playlist'},
            {url: '#', class: 'new-custom-playlist', title: 'New Browser Playlist'}
          ]
        };
        break;

    }
    return opts;
  };


  /********************************************************************************
   * Templates
   ********************************************************************************/


  /**
   * load html templates (called @ dom ready)
   *
   * @param views
   * @param callback
   */
  app.helpers.loadTemplates = function(views, callback) {

    var deferreds = [];

    $.each(views, function(index, view) {
      if (app[view]) {
        deferreds.push($.get('tpl/' + view + '.html', function(data) {
          app[view].prototype.template = _.template(data);
        }, 'html'));
      } else {
        alert(view + " not found");
      }
    });

    $.when.apply(null, deferreds).done(callback);
  };


  /**
   * Load a single template on the fly
   *
   * @param tpl
   * @param callback
   *  callback returns the template object
   */
  app.helpers.loadTemplate = function(tpl, callback) {
    $.get('tpl/' + tpl + '.html', function(data) {
      app.tpl[tpl] = data;
      if(callback){
        callback(app.tpl[tpl]);
      }
    });
  };


  /**
   * Apply a template to data
   *
   * @param tpl
   * @param callback
   *  callback returns the template
   */
  app.helpers.applyTemplate = function(tplname, data, callback) {

    var html = '';
    if(typeof app.tpl[tplname] != 'undefined'){
      html = _.template(app.tpl[tplname],data);
      callback(html);
    } else {
      app.helpers.loadTemplate(tplname, function(tpl){
        html = _.template(tpl,data);
        callback(html);
      })
    }

  };


  /********************************************************************************
   * No namespace @todo move/rename
   ********************************************************************************/


  /**
   * returns a url to the image
   */
  app.parseImage = function(rawPath, type){
    type = (typeof type == 'undefined' ? 'default' : type);
    //no image, return placeholder
    if(typeof(rawPath) == "undefined" || rawPath == ''){
      if(type == 'fanart'){
        return app.helpers.getDefaultImage(type);
      }
      return app.helpers.varGet('defaultImage');
    }
    return '/image/' + encodeURIComponent(rawPath);
  };


  /**
   *  nl2br
   */
  app.nl2br = function(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  };


  /**
   * notification handler
   */
 app.notification = function(msg){
    var $notify = $('#notify');
    if(msg !== false && msg != ''){

      $notify.find('.content').html(msg);
      $notify.removeClass('hidden');
      clearTimeout(notificationTimoutObj);
      notificationTimoutObj = setTimeout(app.notificationHide, 6000); // 8 secs?*/
    }
  };
  app.notificationHide = function(){
    $notify = $('#notify').addClass('hidden');
  };


  /********************************************************************************
   * DEPRECATED @todo safe remove
   ********************************************************************************/


  /**
   * Apply a js scroll bar with default settings
   */
  app.helpers.addScrollBar = function(selector, options){

    //$('.nicescroll-rails').remove();

    scrollbarSettings = {
      cursorwidth: 8,
      cursorminheight: 37,
      touchbehavior: false,
      cursorcolor: '#606768'
    };

    settings = $.extend(scrollbarSettings, options);

  };


  app.helpers.addFreewall = function(selector){
    // removed
  };


  /********************************************************************************
   * Storage
   ********************************************************************************/


  /**
   * Deal with app local storage
   * @type {{nameSpace: string, set: Function, get: Function}}
   */
  app.storage = {


    //Vars
    nameSpace: 'chorus::',

    /**
     * Save data in local storage
     * @param key
     * @param data
     */
    set:function(key, data){
      $.totalStorage( this.nameSpace + key, data );
    },

    /**
     * Get a value from local storage
     * @param key
     * @param defaultData
     * @returns (*)
     */
    get:function(key, defaultData){
      var t = $.totalStorage( this.nameSpace + key );
      if(t != undefined && t != ''){
        return t;
      } else {
        return defaultData;
      }
    }

  };

});


/********************************************************************************
 * jQuery extends
 ********************************************************************************/


/**
 * enhance jquery.attr() to return obj on empty
 * @see http://stackoverflow.com/questions/14645806/get-all-attributes-of-an-element-using-jquery
 */
(function(old) {
  $.fn.attr = function() {
    if(arguments.length === 0) {
      if(this.length === 0) {
        return null;
      }

      var obj = {};
      $.each(this[0].attributes, function() {
        if(this.specified) {
          obj[this.name] = this.value;
        }
      });
      return obj;
    }

    return old.apply(this, arguments);
  };
})($.fn.attr);;var app = {

  views: {},

  models: {},

  cached: {}, //for caching views and collections

  jsonRpcUrl: '/jsonrpc',

  // variables (settings defaults)
  vars: {
    lastHash: '#',
    defaultImage: 'theme/images/default.png'
  },

  // fields to grab from xbmc
  artistFields: [
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
  albumFields: [
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
    //"musicbrainzalbumid",
    //"musicbrainzalbumartistid",
    "fanart",
    "thumbnail",
    "playcount",
    "genreid",
    "artistid",
    "displayartist"
  ],
  songFields: ["title",
    "artist",
    "albumartist",
    "genre",
    "year",
    "rating",
    "album",
    "track",
    "duration",
    //"comment",
    //"lyrics",
    //"musicbrainztrackid",
    //"musicbrainzartistid",
    //"musicbrainzalbumid",
    //"musicbrainzalbumartistid",
    "playcount",
    //"fanart",
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

  fileFields: [
    'title', 'size', 'mimetype', 'file', 'dateadded', 'thumbnail', 'artistid', 'albumid', 'uniqueid'
  ],

  // filters
  albumFilters: [],
  songFilters: [],

  // html templates
  templates: [
    "HomeView",
    "ContactView",
    "ShellView",
    "ArtistView",
    "ArtistSummaryView",
    "ArtistListItemView",
    "ArtistsView",
    "AlbumView",
    "AlbumItemView",
    "SongView",
    "AristsRandView",
    "ArtistLargeItemView",
    "AlbumItemSmallView",
    "AlbumArtistView",
    "PlaylistItemView",
    "PlaylistCustomListItemView",
    "CustomPlaylistSongView",
    "FilesView",
    "FileView"
  ],

  tpl: {} // for templates that are lazy loaded

};



app.Router = Backbone.Router.extend({

  routes: {
    "":                     "home",
    "contact":              "contact",
    "artist/:id":           "artist",
    "artist/:id/:task":     "artist",
    "artists":              "artists",
    "album/:id":            "album",
    "albums":               "albums",
    "playlist/:id":         "playlist",
    "search/:q":            "search",
    "scan/:type":           "scan",
    "thumbsup":             "thumbsup",
    "files":                "files",
    "xbmc/:op":             "xbmc"
  },


  /**
   * Setup shell (main page layout and controls)
   */
  initialize: function () {

    // create main layout
    app.shellView = new app.ShellView();
    $('body').html(app.shellView.render().el);

    // cache thumbs up
    app.playlists.getThumbsUp();

    // get version
    $.get('addon.xml',function(data){
      app.addonData = $(data).find('addon').attr();
    });

    this.$content = $("#content");
    this.$title = $('#title');
  },


  /**
   * Homepage
   */
  home: function () { //Not in use atm

    var self = this;
    app.AudioController.getNowPlaying(function(data){

      if(data.status == 'notPlaying'){

        // get a default fanart
        var fa = app.parseImage('', 'fanart');
        $.backstretch(fa);
        self.$content.html('');

      } else {
        // Something is playing

        // add backstretch
        if($('.backstretch').length == 0){
          var fa = app.parseImage(data.item.fanart, 'fanart');
          $.backstretch(fa);
        }

        // render
        app.homelView = new app.HomeView({model:data.item});
        app.homelView.render();
        self.$content.html(app.homelView.el);
      }

      // title
      app.helpers.setTitle('');

      // menu
      app.shellView.selectMenuItem('home', 'no-sidebar');

      //show now playing
      app.playlists.changePlaylistView('xbmc');
    });
  },


  /**
   * Do a search
   * @param q
   */
  search: function (q) {

   $('#search').val(q);
   app.shellView.search(q);
  },


  /**
   * A single artist page
   * @param id
   * @param task
   *  defaults to viw
   */
  artist: function (id, task) {

    if(typeof task == "undefined"){
      task = 'view';
    }

    app.artistsView = new app.ArtistsView();
    app.artistsView.render();

    var artist = new app.Artist({"id": parseInt(id), "fields":app.artistFields}),
          self = this;

    artist.fetch({
      success: function (data) {

        self.$content.html(new app.ArtistView({model: data}).render().el);
        app.helpers.setTitle('<a href="#/artists">Artists</a><b></b>' + data.attributes.artist);

        // set menu
        app.shellView.selectMenuItem('artists', 'sidebar');
      }
    });

  },


  /**
   * Artists landing page
   */
  artists: function(){

    // render
    app.artistsView = new app.ArtistsView();
    $('#content').html(app.artistsView.render().el);

    // title
    app.helpers.setTitle('Artists', {addATag:true});

    // set menu
    app.shellView.selectMenuItem('artists', 'sidebar');
  },


  /**
   * A single album page
   * @param id
   */
  album: function (id) {

    // get album
    var model = {'attributes': {"albumid" : id}};
    app.cached.albumView = new app.AlbumView({"model": model, "type":"album"});

    // only render if not on album page already
    if($('.album-page').length == 0){
    $('#content').html(app.cached.albumView.render().el);
    } else {
      //just call render, don't update content
      app.cached.albumView.render();
    }

    // set menu
    app.shellView.selectMenuItem('albums', 'sidebar');

  },


  /**
   * Albums page
   */
  albums: function(){

    app.shellView.selectMenuItem('album', 'no-sidebar');
    var self = this;
    app.cached.recentlyAddedAlbums = new app.AlbumRecentlyAddedXbmcCollection();
    app.cached.recentlyAddedAlbums.fetch({"success": function(albums){

      // render
      app.cached.recentAlbumsView = new app.SmallAlbumsList({model: albums, className:'album-list-landing'});
      self.$content.html(app.cached.recentAlbumsView.render().el);

      // set title
      app.helpers.setTitle('Recently Added', {addATag:true});

      // set menu
      app.shellView.selectMenuItem('albums', 'no-sidebar');

      // add isotope (disabled)
      app.helpers.addFreewall('ul.album-list-landing');

    }});

  },

  /**
   * Files page
   */
  files: function(){


    app.cached.fileCollection = new app.FileCollection();
    app.cached.fileCollection.fetch({"name":'sources', "success": function(sources){

      app.cached.fileAddonCollection = new app.FileCollection();
      app.cached.fileAddonCollection.fetch({"name":'addons', "success": function(addons){

        // set menu
        app.shellView.selectMenuItem('files', 'sidebar');

        // render page
        app.cached.filesView = new app.FilesView({"model":sources});
        var el = app.cached.filesView.render().$el;

        // append addons
        app.cached.filesAddonsView = new app.FilesView({"model":addons});
        if(addons.length > 0){
          el.append('<h3 class="sidebar-title">Addons</h3>');
          el.append(app.cached.filesAddonsView.render().$el);
        }


        app.helpers.setFirstSidebarContent(el);

        app.helpers.setTitle('<a href="#files">Files</a><span id="folder-name"></span>');

      }});

    }});



  },

  /**
   * playlist
   * @param type
   */
  playlist: function(id){

    app.cached.playlistCustomListSongCollection = new app.PlaylistCustomListSongCollection();
    app.cached.playlistCustomListSongCollection.fetch({"name":id, "success": function(res){

      // render page
      app.cached.customPlaylistSongListView = new app.CustomPlaylistSongListView({"model":res});
      $('#content').html(app.cached.customPlaylistSongListView.render().el);

      // set title
      var list = app.playlists.getCustomPlaylist(id);
      app.helpers.setTitle('<a href="#playlist/' + list.id + '">' + list.name + '</a>');

      // set menu
      app.shellView.selectMenuItem('playlist', 'no-sidebar');

    }});

  },



  thumbsup: function(){

    var $content = $('#content')
      $sidebar = app.helpers.getFirstSidebarContent();

    // so we get things in the correct order, we have lots of sub wrappers for the different lists
    $content.html('<div id="thumbs-up-page"><div id="tu-songs"></div></div>');
    app.helpers.setFirstSidebarContent('<div id="tu-artists"></div><div id="tu-albums"></div>');

    // set title
    app.helpers.setTitle('<a href="#artists">Artists</a>Thumbs Up');

    // set menu
    app.shellView.selectMenuItem('thumbsup', 'sidebar');

    // Song
    app.cached.thumbsUpCollection = new app.ThumbsUpCollection();
    app.cached.thumbsUpCollection.fetch({"name": 'song', "success": function(res){

      // render
      app.cached.customPlaylistSongListView = new app.CustomPlaylistSongListView({"model":res});
      $('#tu-songs', $content).html(app.cached.customPlaylistSongListView.render().el);

    }});

    // Artist
    app.cached.thumbsUpCollection = new app.ThumbsUpCollection();
    app.cached.thumbsUpCollection.fetch({"name": 'artist', "success": function(res){

      // add the sidebar view
      app.cached.thumbsupArtists = new app.AristsListView({model: res, className: 'artist-thumbs-up'});
      $('#tu-artists',$sidebar).html(app.cached.thumbsupArtists.render().el);
      app.helpers.firstSidebarBinds();
    }});

    // Album
    app.cached.thumbsUpCollection = new app.ThumbsUpCollection();
    app.cached.thumbsUpCollection.fetch({"name": 'album', "success": function(res){

      // render
      app.cached.thumbsupAlbums = new app.SmallAlbumsList({model: res});
      $('#tu-albums',$sidebar).html(app.cached.thumbsupAlbums.render().el)
        .prepend('<h2 class="sidebar-title"><a href="#albums">Albums</a></h2>');
      app.helpers.firstSidebarBinds();
    }});



  },


  /**
   * Scan for music
   * @param type
   *  audio
   */
  scan: function(type){

    //start music scan
    if(type == 'audio'){
      app.xbmcController.command('AudioLibrary.Scan', {}, function(d){
        app.notification('Started Audio Scan');
      });
    }

  },


  /**
   * Used mainly for dev and stats, see xbmc view
   * @param op
   */
  xbmc: function(op){

    app.cached.xbmcView = new app.XbmcView({model: op});
    $('#content').html(app.cached.xbmcView.render().$el);

    // set title
    app.helpers.setTitle('<a href="#xbmc/home">XBMC</a>');

    // set menu
    app.shellView.selectMenuItem('xbmc', 'no-sidebar');
  }



});

//DOM Ready
$(document).on("ready", function () {

  app.helpers.loadTemplates(app.templates,
    function () {
      app.router = new app.Router();
      Backbone.history.start();
  });

  app.store.libraryCall(function(){
    $('body').addClass('artists-ready');
    app.notification('Artists loaded');
  },'artistsReady');


  app.store.libraryCall(function(){
    $('body').addClass('audio-library-ready');
    app.notification('Library loaded');
  },'songsReady');

});
;
/**
 * Artist
 * @type {extend|*}
 */
app.Artist = Backbone.Model.extend({

  initialize:function () {},
  defaults: {artistid: 1, thumbnail: '', fanart: '', artist: '', label: '', description: '', born: '', died: ''},

  sync: function(method, model, options) {
    if (method === "read") {
      app.store.getArtist(parseInt(this.id), function (data) {
          data.attributes.thumbsup = app.playlists.isThumbsUp('artist', data.attributes.artistid);
          options.success(data.attributes);
      });
    }
  }

});


/**
 * Album
 * @type {extend|*}
 */
app.Album = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'album': '', 'albumid': '', 'thumbnail': '', 'artist': '', 'artistid': '', 'songs': [], 'albumsitems': []},

  sync: function(method, model, options) {
    if (method === "read") {
      // options.success(data);
    }
  }

});


/**
 * Song
 * @type {extend|*}
 */
app.Song = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'label':'', 'thumbnail':'', 'albumid':0, artistid: [0]},

  sync: function(method, model, options) {
    if (method === "read") {
      // options.success(data);
    }
  }

});


/**
 * playlist song
 * @type {extend|*}
 */
app.PlaylistItem= Backbone.Model.extend({

  initialize:function () {},
  defaults: {'label':'', 'thumbnail':'', 'albumid':0, artistid: [0], songid: 'file', file: ''}

});


/**
 * Custom playlist
 * @type {extend|*}
 */
app.PlaylistCustomListItem= Backbone.Model.extend({

  initialize:function () {},
  defaults: {'name':'', 'items':[], 'id': 0}

});


/**
 * Custom playlist song
 * @type {extend|*}
 */
app.PlaylistCustomListItemSong = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'label':'', 'thumbnail':'', 'albumid':0, artistid: [0]}

});;

/**
 * Album
 * @type {extend|*}
 */
app.File = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'filetype': '', 'size': '', 'mimetype': '', 'file': '', 'lastmodified': '', id: 0},

  sync: function(method, model, options) {
    if (method === "read") {
      // options.success(data);
    }
  }

});
;/**
 * Framework for including functionality for addons
 * eg. soundcloud
 * @type {{}}
 */

app.addOns = {addon: {}};

app.addOns.getSources = function(callback){

  app.xbmcController.command('Addons.GetAddons', ['xbmc.addon.audio', 'unknown', 'all', ["name", "thumbnail", "enabled"]], function(res){
    // add a title before return
    var sources = res.result.addons,
      addons = [];

    // parse
    for(i in sources){
      var item = sources[i];
      if(item.enabled){
        item.file = 'plugin://' + item.addonid + '/';
        item.title = item.name;
        item.filetype = 'directory';
        item.id = item.addonid;
        addons.push(item);
      }
    }

    app.cached.addonSources = addons;

    if(callback){
      callback(addons);
    }
  })

};

/**
 * Execute a addon callback when sources are ready
 * @param callback
 */
app.addOns.ready = function(callback){
  if(typeof app.cached.addonSources != 'undefined'){
    callback(app.cached.addonSources);
  } else {
    app.addOns.getSources(callback);
  }
};


/**
 * Gets a specific addon from cache
 * @param addonKey
 * @returns {*}
 */
app.addOns.getAddon = function(addonKey){
  if(typeof app.cached.addonSources != 'undefined'){
    for(i in app.cached.addonSources){
      var item = app.cached.addonSources[i],
        itemAddonKey = app.addOns.slug(item);
      if(itemAddonKey == addonKey){
        return item;
      }
    }
  }
  return {};
};


/**
 * Invokes a function on a record, looks for available addon code, if found checks if function before executing
 * @param record
 * @param functionName
 * @returns {*}
 */
app.addOns.invokeAll = function(functionName, record, arg1, arg2){

  // this invokes other modules
  if(typeof app.cached.addonSources != 'undefined'){
    for(i in app.cached.addonSources){
      var item = app.cached.addonSources[i],
        addonKey = app.addOns.slug(item);

      record = app.addOns.invoke(addonKey, functionName, record, arg1, arg2);
    }
  } else {
    // this doesnt give us an instant result but hopefully ready for next use
    app.addOns.getSources();
  }
  return record;

};


/**
 * Invokes a single addon hook
 * @param addonKey
 * @param functionName
 * @param record
 * @returns {*}
 */
app.addOns.invoke = function(addonKey, functionName, record, arg1, arg2){

  if(typeof app.addOns.addon[addonKey] != 'undefined' && typeof app.addOns.addon[addonKey][functionName] == 'function'){
    // addon code found, execute
    var func = app.addOns.addon[addonKey][functionName];
    record = func(record, arg1, arg2);
  }
  return record;

};


/**
 * Makes a slug that we use for addonKey, could be alot better but it works for now
 * @param addonObj
 * @returns {string}
 */
app.addOns.slug = function(addonObj){
 return addonObj.addonid.split('.').join('');
};








/*****************************************************************************
 * ADDONS BELOW
 * @TODO move to files
 ****************************************************************************/






/***********************************************
 * Soundcloud
 ***********************************************/
app.addOns.addon.pluginaudiosoundcloud = {

  // the time to wait before sending keyboard commands
  waitTime: 4000,

  getAddon: function(){
    return app.addOns.getAddon('pluginaudiosoundcloud');
  },

  getSearchPath: function(){
    return 'plugin://plugin.audio.soundcloud/SearchTracks?url=plugin%3A%2F%2Fmusic%2FSoundCloud%2Ftracks%2Fsearch&oauth_token=&mode=13';
  },

  /**
   * Parses a file record
   * @param record
   * @returns {*}
   */
  parseFileRecord: function(record){
    // is a soundcloud url
    if(app.addOns.addon.pluginaudiosoundcloud.isSoundCloud(record)){
      // rewrite the url to contain the label
      record.file = record.file.replace(
        'plugin://plugin.audio.soundcloud/',
        'plugin://plugin.audio.soundcloud/' + encodeURIComponent(record.label)
      );

      /* // add an icon if none - doesn't look much better than default icons
      if(typeof record.thumbnail == 'undefined' || record.thumbnail == ''){
        var sc = app.addOns.getAddon('pluginaudiosoundcloud');
        record.thumbnail = sc.thumbnail;
      } */

    }

    return record;
  },

  /**
   * Hook into file dir click
   * @param record
   * @returns {*}
   */
  clickDir: function(record){
    if(app.addOns.addon.pluginaudiosoundcloud.isSoundCloud(record)){
      if(record.title == 'Search'){
        console.log(record);
        app.addOns.addon.pluginaudiosoundcloud.doSearchDialog();
      }
    }
    return record;
  },


  /**
   * Hook into post file row creation
   * @param $el
   * @param file
   * @returns {*}
   */
  postProcessFileView: function($el, file){
    if(app.addOns.addon.pluginaudiosoundcloud.isSoundCloud(file)){
      var sc = app.addOns.addon.pluginaudiosoundcloud.getAddon();

      // if root item for addon
      if(file.file == sc.file){
        var $actions = $('.file-actions', $el);

        // replace play and add with search
        $actions.html('<button class="btn" id="soundcloudSearch"><i class="icon-search"></i></button>');

        // Bind
        $('#soundcloudSearch', $actions).on('click', function(e){
          e.stopPropagation();

          // trigger search
          app.addOns.addon.pluginaudiosoundcloud.doSearchDialog();
          var dir = app.addOns.addon.pluginaudiosoundcloud.getSearchPath();

          app.cached.fileCollection = new app.FileCollection();
          app.cached.fileCollection.fetch({"name":dir, "success": function(res){
            // render page
            console.log(res);
            app.cached.filesSearchView = new app.FilesView({"model":res}).render();
            //$('#files-container').html(app.cached.filesSearchView.$el);
          }});

        });

        // add class to show actions
        $el.find('.file-item').addClass('show-actions');

      }
    }
    return $el;
  },

  /**
   * This adds soundcloud to the search page
   * @param $el
   * @param key
   * @returns {*}
   */
  searchAddons: function($el, key){

    var $nores = $('<div>', {class: 'addon-box', id: 'sc-search'}),
      sc = app.addOns.addon.pluginaudiosoundcloud.getAddon(),
      logo = '<img src="' + app.parseImage(sc.thumbnail) + '">',
      $heading = $('<h3 class="search-heading">' + logo + 'SoundCloud search for: <span>' + key + '</span></h3>'),
      cache = app.addOns.addon.pluginaudiosoundcloud.cache('get', key, false);

    // add logo to heading

    // if cache
    if(cache !== false){
      // just set results from cached view
      $el.html(cache.render().$el);
      $el.prepend($heading);
    } else {
      // no cache, do the search
      $nores.append(logo + '<span>search soundcloud for: <strong>' + key + '</strong></span>');
      $el.append($nores);

      // click/search action
      $('#sc-search', $el).on('click', function(){
        // Loading
        $el.html($('<strong>', {class: 'addon-box', text: 'Searching SoundCloud for ' + key}).prepend($(logo)));
        // Callback
        app.addOns.addon.pluginaudiosoundcloud.getSearchResults(key, function(view){
          $el.html(view.render().$el);
          // add heading
          $el.prepend($heading);
          // set cache
          app.addOns.addon.pluginaudiosoundcloud.cache('set', key, view);
        });
      });
    }

    return $el;
  },

  /**
   * Get and set cache, when get, data is default
   * @param op
   * @param key
   * @param data
   * @returns {*}
   */
  cache:function(op, key, data){
    if(typeof app.cached.soundCloudSearch == 'undefined'){
      app.cached.soundCloudSearch = {};
    }
    switch (op){
      case 'get':
        return (typeof app.cached.soundCloudSearch[key] == 'undefined' ? data : app.cached.soundCloudSearch[key]);
      case 'set':
        app.cached.soundCloudSearch[key] = data;
        return app.cached.soundCloudSearch[key];
    }
  },


  /**
   * Search dialog
   */
  doSearchDialog: function(){
    app.helpers.prompt('What do you want to search for?', function(text){
      app.xbmcController.command('Input.SendText', [text], function(res){
        // set title and notify
        $('#folder-name').html('Search for "' + text + '"');
        var msg = 'Searching for ' + text;
        // set content while loading
        $('#files-container').html('<div class="loading-box">'+msg+'</div>');
      });
    });
  },


  /**
   * Get a soundcloud search result view
   * @param query
   */
  getSearchResults: function(query, callback){

    // get search directory
    var dir = app.addOns.addon.pluginaudiosoundcloud.getSearchPath();
    app.cached.fileCollection = new app.FileCollection();
    app.cached.fileCollection.fetch({"name":dir, "success": function(result){
      // success only after text input complete which is flaky!
      // return view
      app.cached.fileListView = new app.FilesListView({model: result});
      callback(app.cached.fileListView);
    }});

    // yuk hack - it seems to need a bit of time to init the search dialog and cannot be in the dir callback
    window.setTimeout(function(){
      app.xbmcController.command('Input.SendText', [query], function(res){
        console.log(res);
      });
    }, app.addOns.addon.pluginaudiosoundcloud.waitTime);

  },


  /**
   * If soundcloud file record
   * @param record
   * @returns {*}
   */
  isSoundCloud: function(record){
    return (record.file.indexOf('plugin.audio.soundcloud') != -1);
  }


};;
app.AudioController = {

  // playlist defaults
  playlistId: 0, // 0 = audio

  currentPlaylist: {
    'items': [],
    'status': 'none'
  }

};


/**
 * Refresh the playlist
 * @param callback
 */
app.AudioController.playlistRefresh = function(callback){

  // xbmc playlist
  app.AudioController.getPlaylistItems(function(result){

    //cache
    app.cached.xbmcPlaylist = result.items;

    //create a new playlist view and render
    app.playlistView = new app.PlaylistView({model:{models:result.items}});
    $('.sidebar-items').html(app.playlistView.render().el);

    app.AudioController.getNowPlaying(function(data){

      //update shell to now playing info
      app.shellView.updateState(data);
      //rebind controls to playlist after refresh
      app.playlistView.playlistBinds(this);
    });

    if(app.helpers.exists(callback)){
      callback(result);
    }

  });

};




/**
 * Adds an artist/album/song to the playlist
 * @param type
 *  eg. artistid, albumid, songid
 * @param id
 *  value of type
 *
 */
app.AudioController.playlistAdd = function(type, id, callback){

  var filter = {};
  filter[type] = id;

  //add the album to the playlist
  app.xbmcController.command('Playlist.Add', [app.AudioController.playlistId,filter], function(data){

    //get playlist items
    app.AudioController.getPlaylistItems(function(result){

      //update cache
      app.AudioController.currentPlaylist = result;

      callback(result);

    })
  });

};


/**
 * Adds multiple artist/album/song to the playlist
 * @param type
 *  eg. artistid, albumid, songid
 * @param id
 *  value of type
 *
 */
app.AudioController.playlistAddMultiple = function(type, ids, callback){

  var commands = [],  id;
  for(n in ids){
    param = {};
    id = ids[n];
    // used only for songs, switches between file and id depending on var type
    if(type == 'mixed'){
      type = (typeof id == 'number' ? 'songid' : 'file');
    }
    param[type] = id;
    commands.push({method: 'Playlist.Add', params: [app.AudioController.playlistId,param]});
  }

  //add the album to the playlist
  app.xbmcController.multipleCommand(commands, function(data){

    //get playlist items
    app.AudioController.getPlaylistItems(function(result){

      //update cache
      app.AudioController.currentPlaylist = result;

      callback(result);

    })
  });

};


/**
 * Swap the position of an item in the playlist
 *
 * This moves an item from one position to another
 * It does this by cloning pos1, remove original pos, insert pos1 clone into pos2
 * Not to be confused with xbmc playlist.swap which is fairly useless IMO
 *
 * @param pos1
 *  current playlist position
 * @param pos2
 *  new playlist position
 */
app.AudioController.playlistSwap = function(pos1, pos2, callback){
  console.log(pos1, pos2);
  //get playlist items
  app.AudioController.getPlaylistItems(function(result){
    //clone for insert
    var clone = result.items[pos1],
      insert = {};
    //if songid found use that as a preference
    console.log(clone);
    if(clone.id != undefined && typeof clone.id == 'number'){
      insert.songid = clone.id;
    } else { //use filepath if no songid
      insert.file = clone.file;
    }
    //remove the original
    app.AudioController.removePlaylistPosition(pos1, function(result){
      //insert the clone
      app.xbmcController.command('Playlist.Insert', [app.AudioController.playlistId,pos2,insert], function(data){
        //get playlist items
        app.AudioController.getPlaylistItems(function(result){
          //update cache
          app.AudioController.currentPlaylist = result;
          callback(result);

        })
      });
    });

  })
};



/**
 * Clear then adds an artist/album/song to the playlist
 * @param type
 *  eg. artistid, albumid, songid
 * @param id
 *  value of type
 *
 */
app.AudioController.playlistClearAdd = function(type, id, callback){

  // clear playlist
  app.xbmcController.command('Playlist.Clear', [app.AudioController.playlistId], function(data){
    app.notification('Playlist Cleared');
    app.AudioController.playlistAdd(type, id, callback);
  });

};


/**
 * Clear the playlist
 */
app.AudioController.playlistClear = function(callback){
  // clear playlist
  app.xbmcController.command('Playlist.Clear', [app.AudioController.playlistId], function(data){
    if(callback){
      callback(data);
    }
  });
};


/**
 * Adds an an artist/album/song to the playlist then starts playing
 * @param playSongId
 *  song to play
 * @param type
 *  eg. artistid, albumid, songid
 * @param id
 *  value of type
 *
 */
app.AudioController.playlistPlaySongId = function(playSongId, callback){

    //@TODO: fix below to be nicer

    //find the song and play it
    var playing = false;
    $.each(app.AudioController.currentPlaylist.items, function(i,d){
      //matching song!
      if(d.id == playSongId && playing === false){
        app.AudioController.playPlaylistPosition(i, function(data){
          //update playlist
          app.AudioController.playlistRefresh();
          //notify
          app.notification('Now playing "' + d.label + '"');
        });
        playing = true;
      }
    });

};





/**
 * Play Song
 */
app.AudioController.playSongById = function(songid, type, id, clearList){

  if(app.helpers.exists(clearList) && clearList === true){
    // clear playlist first
    app.AudioController.playlistClearAdd( type, id, function(result){
      app.AudioController.playlistPlaySongId(songid);
    });
  } else {
    //just add
    app.AudioController.playlistAdd( type, id, function(result){
      app.AudioController.playlistPlaySongId(songid);
    });
  }

};


/**
 * Inserts a song in the playlist next and starts playing that song
 */
app.AudioController.insertAndPlaySong = function(type, id, callback){

  var player = app.cached.nowPlaying.player,
      playingPos = (typeof player.position != 'undefined' ? player.position : 0),
      pos = playingPos + 1,
      insert = {};

  insert[type] = id;

  // if nothing is playing, we will clear the playlist first
  if(app.cached.nowPlaying.status == 'notPlaying'){
    // clear
    app.AudioController.playlistClear(function(){
      // insert
      app.xbmcController.command('Playlist.Insert', [app.AudioController.playlistId,pos,insert], function(data){
        // play
        app.AudioController.playPlaylistPosition(pos, function(){
          if(callback){
            callback(data);
          }
        });
      });
    })
  } else {
    // playing, insert
    app.xbmcController.command('Playlist.Insert', [app.AudioController.playlistId,pos,insert], function(data){
      // play
      app.AudioController.playPlaylistPosition(pos, function(){
        if(callback){
          callback(data);
        }
      });
    });
  }

};



app.AudioController.songLoadMultiple = function(songids, callback){

    // vars
    var commands = [];

    // create commands
    for(n in songids){
      var sid = songids[n];
      if(typeof sid == 'number'){
        // it is a song and sid should be a songid
        commands.push({
          method: 'AudioLibrary.GetSongDetails',
          params: [sid, app.songFields ]
        });
      } else {

        // for a file add defaults
        var defaults = {
            position: n,
            songid: 'file',
            album: '',
            artist: '',
            duration: 0
          },
          item = $.extend(defaults, songids[n]);
        item.id = songids[n].file;

        songids[n] = item;
      }

    }

    //if songs to get
    if(commands.length > 0){

      // load all song data
      app.xbmcController.multipleCommand(commands, function(res){

        // parse each result into an array of song objects (models)
        var dict = {}, payload = [];
        _.each(res, function(r){
          if(typeof r.result != 'undefined'){
            dict[r.result.songdetails.songid] = r.result.songdetails;
          }
        });

        // add songs back in their correct order using a dictionary
        for(n in songids){
          var sid = songids[n];
          if(typeof sid == 'number' && typeof dict[sid] != 'undefined'){
            songids[n] = dict[sid];
          }
        }

        // lastly, we clean up the output and ensure every item is an object
        // we also assign final position in the list
        var p = 0;
        for(n in songids){
          var item = songids[n];
          if(typeof item == 'object'){
            item.position = p;
            payload.push(item);
            p++;
          }
        }

        // callback
        callback(payload);
      });

    } else {
      // all files
      callback(songids);
    }


};

/**
 * Gets a download url for a file
 * @param file
 * @param callback
 */
app.AudioController.downloadFile = function(file, callback){
  app.xbmcController.command('Files.PrepareDownload', [ file ], function(result){
    if(callback){
      callback(result.result.details.path);
    }
  });
};



/**
 * Adds an album to the playlist and starts playing the given songid
 * @param songid
 * @param albumid
 */
/*app.AudioController.playSongInAlbum = function(songid, albumid){


  app.AudioController.playlistAdd('albumid', albumid, function(result){

    //find the song and play it
    var playing = false;
    $.each(app.AudioController.currentPlaylist.items, function(i,d){
      //matching song!
      if(d.id == songid && playing === false){
        app.AudioController.playPlaylistPosition(i, function(data){
          //update playlist
          app.AudioController.playlistRefresh();
          //notify
          app.notification('Now playing "' + d.label + '"');
        });
        playing = true;
      }
    });

  });

};*/


/**
 * Generic player command with to callback required
 */
app.AudioController.sendPlayerCommand = function(command, param){
  app.xbmcController.command(command, [ app.cached.nowPlaying.activePlayer, param], function(result){
    app.AudioController.updatePlayerState();
  });
};

/**
 * Play something from playlist
 */
app.AudioController.playPlaylistPosition = function(position, callback ){
  app.xbmcController.command('Player.Open', [{"playlistid": app.AudioController.playlistId,"position":position}], function(result){
    callback(result.result); // return items
  });
};


/**
 * Remove something from playlist
 */
app.AudioController.removePlaylistPosition = function(position, callback ){
  app.xbmcController.command('Playlist.Remove', [app.AudioController.playlistId,position], function(result){
    callback(result.result); // return items
  });
};



/**
 * Seek curently playing to a percentage
 */
app.AudioController.seek = function(position, callback ){
  app.xbmcController.command('Player.Seek', [app.AudioController.playlistId, position], function(result){
    if(app.helpers.exists(callback)){
      callback(result.result); // return items
    }
  });
};

/**
 * Get items from playlist
 */
app.AudioController.getPlaylistItems = function(callback){
  app.xbmcController.command('Playlist.GetItems',
    [
      app.AudioController.playlistId,
      ['albumid', 'artistid', 'thumbnail', 'file', 'duration', 'year', 'album']
    ], function(result){
    callback(result.result); // return items
  });
};



/**
 * Set Volume
 */
app.AudioController.setVolume = function(val){
  app.xbmcController.command('Application.SetVolume', [val], function(data){
    //volume set
    //app.AudioController.updatePlayerState();
  });
};


/**
 * Library Scan
 */
app.AudioController.audioLibraryScan = function(){

  app.xbmcController.command('AudioLibrary.Scan', [], function(data){

  });

};


/**
 * Get now playing
 */

app.AudioController.getNowPlaying = function(callback){

  var fields = {
    item: ["title", "artist", "artistid", "album", "albumid", "genre", "track", "duration", "year", "rating", "playcount", "albumartist", "file", "thumbnail", "fanart"],
    player: [ "playlistid", "speed", "position", "totaltime", "time", "percentage", "shuffled", "repeat", "canrepeat", "canshuffle", "canseek" ]
  };
  var ret = {'status':'notPlaying', 'item': {}, 'player': {}, 'activePlayer': 0, 'volume': 0}, commands = [];

  // first commands to run
  commands = [
    {method: 'Application.GetProperties', params: [["volume", "muted"]]},
    {method: 'Player.GetActivePlayers', params: []}
  ];

  // first run
  app.xbmcController.multipleCommand(commands, function(data){

    var properties = data[0], players = data[1];

    // set some values
    ret.volume = properties.result;
    app.AudioController.activePlayers = players.result;

    if(players.result.length > 0){
      //something is playing
      ret.activePlayer = players.result[0].playerid;

      // second run commands
      commands = [
        {method: 'Player.GetItem', params: [ret.activePlayer, fields.item]},
        {method: 'Player.GetProperties', params: [ret.activePlayer, fields.player]}
      ];

      // run second lot
      app.xbmcController.multipleCommand(commands, function(item){
        // get data
        ret.item = item[0].result.item;
        ret.player = item[1].result;
        ret.status = 'playing';

        // set cache
        app.cached.nowPlaying = ret;

        // callback
        if(callback){
          callback(ret);
        }

      });

    } else {

      //nothing playing
      app.cached.nowPlaying = ret;
      callback(ret);

    }


  });







  app.xbmcController.command('Application.GetProperties', [["volume", "muted"]], function(properties){
    //get volume level
    ret.volume = properties.result;
    app.xbmcController.command('Player.GetActivePlayers', [], function(players){

      app.AudioController.activePlayers = players.result;

      if(players.result.length > 0){
        //something is playing
        ret.activePlayer = players.result[0].playerid;
        app.xbmcController.command('Player.GetItem', [ret.activePlayer, fields.item], function(item){
          ret.item = item.result.item;
          ret.status = 'playing';

          app.xbmcController.command('Player.GetProperties', [ret.activePlayer, fields.player], function(player){
            ret.player = player.result;
            app.cached.nowPlaying = ret;
            callback(ret);
          });

        });
      } else {
        //nothing playing
        app.cached.nowPlaying = ret;
        callback(ret);
      }

    });

  });



};

/**
 * Kick off a refresh of playing state
 */
var stateTimeout = {};
app.AudioController.updatePlayerState = function(){
  //clearTimeout(stateTimeout);
  app.AudioController.getNowPlaying(function(data){
    app.shellView.updateState(data);
    //stateTimeout = setTimeout(app.AudioController.updatePlayerState, 5000);
  });
};;/**
 * The app.playlists object is a collection of methods and properties specifically for
 * custom playlist functionality and helpers
 *
 * @type {{storageKeyLists: string, storageKeyThumbsUp: string}}
 */
app.playlists = {
  storageKeyLists: 'playlist:lists',
  storageKeyThumbsUp: 'playlist:thumbsUp'
};







app.playlists.sortableChangePlaylistPosition = function( event, ui ) {

  //the item just moved
  var $thisItem = $(ui.item[0]).find('div.playlist-item'),
    changed = {},
    $sortable = $thisItem.closest("ul.playlist");

  //loop over each playlist item to see what (if any has changed)
  $sortable.find('div.playlist-item').each(function(i,d){
    $d = $(d);
    //if this row store the position
    if($d.data('path') === $thisItem.data('path')){
      changed = {from: $thisItem.data('id'), to: i};
    }
  });

  //if an item has changed position, swap its position in xbmc
  if(changed.from != undefined && changed.from !== changed.to){
    app.AudioController.playlistSwap(changed.from, changed.to, function(res){
      app.AudioController.playlistRefresh();
    })
  }
};

// doesnt seem to be in use
app.playlists.changeCustomPlaylistPosition = function( event, ui ) {

  //the item just moved
  var $thisItem = $(ui.item[0]).find('div.playlist-item'),
    changed = {},
    $sortable = $thisItem.closest("ul.playlist");

  //loop over each playlist item to see what (if any has changed)
  $sortable.find('div.playlist-item').each(function(i,d){
    $d = $(d);
    //if this row store the position
    if($d.data('path') === $thisItem.data('path')){
      changed = {from: $thisItem.data('path'), to: i};
    }
  });
  console.log(changed);
  //if an item has changed position, swap its position in xbmc
  if(changed.from != undefined && changed.from !== changed.to){
    app.AudioController.playlistSwap(changed.from, changed.to, function(res){
      app.AudioController.playlistRefresh();
    })
  }
};




/**
 * Change to playlist tab
 * @param type
 *  xbmc or local
 */
app.playlists.changePlaylistView = function(type){

  var $sb = $('#sidebar-second'),
      $at = $('.' + type + "-playlist-tab");

  // active
  $(".playlist-primary-tab").removeClass("active");
  $at.addClass('active');

  // toggle content with classes
  switch(type){
    case 'xbmc':
      $sb.removeClass('alt-view').addClass('normal-view');
      break;
    case 'local':
      $sb.addClass('alt-view').removeClass('normal-view');
      break;
  }

};


/**
 * Save Current xbmc playlist Dialog
 */
app.playlists.saveCustomPlayListsDialog = function(type, items, hideList){

  // validate type & items
  type = (typeof type == 'undefined' ? 'xbmc' : type);
  items= (typeof items == 'undefined' ? [] : items);

  // vars
  var lists = app.playlists.getCustomPlaylist(),
    htmlList = '';

  for(i in lists){
    htmlList += '<li data-id="' + lists[i].id + '">' + lists[i].name + '</li>';
  }

  // for when we want to force create a new list
  if(typeof hideList != 'undefined'){
    htmlList = '';
  }

  var content = '<p>Create a new playlist<br />' +
    '<input class="form-text" type="text" id="newlistname" /> <button class="btn bind-enter" id="savenewlist">Save</button></p>' +
    (htmlList != '' ? '<p>Or add to an existing list</p><ul id="existinglists">' + htmlList + '</ul>' : '');

  // Create Dialog
  app.helpers.dialog(content, {
    title: 'Add to a playlist'
  });

  // save new bind
  $('#savenewlist').on('click', function(e){
    var name = $('#newlistname').val(),
      pl = app.playlists.saveCustomPlayLists('new', name, type, items);
    app.helpers.dialogClose();
    document.location = '#playlist/' + pl.id;
  });

  // add to existing
  $('#existinglists li').on('click', function(e){
    var id = $(this).data('id'),
      pl = app.playlists.saveCustomPlayLists('existing', id, type, items);
    app.helpers.dialogClose();
    document.location = '#playlist/' + pl.id;
  });

};



/**
 * Save Current xbmc playlist to storage
 */
app.playlists.saveCustomPlayLists = function(op, id, source, newItems){

  // vars
  var items = [],
    lists = app.playlists.getCustomPlaylist(),
    lastId = 0,
    plObj = {};

  if(source == 'xbmc'){

    console.log(app.cached.xbmcPlaylist);
    _.each(app.cached.xbmcPlaylist, function(d){
      if(d.id == 'file'){
        // let addons tinker
        d = app.addOns.invokeAll('parseFileRecord', d);
        // if there is no song id, we must cache the whole
        // object as we can't look it up later
        items.push(d);
      } else {
        items.push(d.id);
      }
    });

  } else {
    // load from var
    items = newItems;
  }


  // what do we do with the result
  switch (op){

    // Add a new list
    case 'new':

      // Get lastId
      for(i in lists){
        var list = lists[i];
        if(lastId < list.id){
          lastId = list.id;
        }
      }

      // This id is the next number up
      var thisId = lastId + 1;

      // plobj
      plObj = {
        items: items,
        name: id,
        id: thisId
      };

      // add result
      lists.push(plObj);

      break;

    // Add to existing list
    case 'existing':

      // find matching id and append
      for(i in lists){
        if(id == lists[i].id){
          // append to matching list
          for(n in items){
            lists[i].items.push(items[n]);
          }
          // plobj
          plObj = lists[i];
        }
      }

      break;
  }

  //save playlist
  app.storageController.setStorage(app.playlists.storageKeyLists, lists);

  // update list of playlists
  app.playlists.updateCustomPlayLists();

  // return saved list obj
  return plObj;
};



/**
 * Get the rendered view ready to be added to dom in callback
 * @param callback
 */
app.playlists.addCustomPlayLists = function(callback){

  //custom playlists
  app.cached.playlistCustomListsView = new app.PlaylistCustomListCollection();

  // fetch collection
  app.cached.playlistCustomListsView.fetch({"success": function(items){
    app.cached.playlistCustomListsView = new app.PlaylistCustomListsView({model: items});
    callback(app.cached.playlistCustomListsView);
  }});

};



/**
 * get playlist(s) from local storage
 */
app.playlists.getCustomPlaylist = function(id){

  // get lists
  var currentPlaylists = app.storageController.getStorage(app.playlists.storageKeyLists),
    listsRaw = (currentPlaylists != null ? currentPlaylists : []),
    lists = [];

  // ensure we have a clean data set
  for(n in listsRaw){
    var item = listsRaw[n];
    if(typeof item != 'undefined' && item != null){
      lists.push(item);
    }
  }

  // If specific list
  if(typeof id != 'undefined'){
    for(n in lists){
      if(id == lists[n].id){
        return lists[n];
      }
    }
  }

  // All lists
  return lists;
};


/**
 * delete playlist from local storage
 */
app.playlists.deleteCustomPlaylist = function(id){
  var lists = app.playlists.getCustomPlaylist(),
    o = [];

  // add all but the removed to o
  for(n in lists){
    item = lists[n];
    if(item.id != id){
      o[n] =  item;
    }
  }

  // Save new list
  app.storageController.setStorage(app.playlists.storageKeyLists, o);

  // reload playlists list
  app.playlists.updateCustomPlayLists();

};


/**
 * delete playlist Song
 */
app.playlists.deleteCustomPlaylistSong = function(listId, songId){

  var list = app.playlists.getCustomPlaylist(listId),
  newItems = list.items.filter(function (element) {
    return (songId != element);
  });

  app.playlists.replaceCustomPlayList(listId, newItems);

};


/**
 * replace custom playlist content
 */
app.playlists.updateCustomPlayLists = function(){

  //custom playlists
  app.playlists.addCustomPlayLists(function(view){
    $('.alt-sidebar-items').html(view.render().el);
  });

};


/**
 * replace custom playlist items with new items - useful for for sorting
 */
app.playlists.replaceCustomPlayList = function(listId, items){

  // thumbs up - only songs are sortable
  if(listId == 'thumbsup'){

    var lists = app.storageController.getStorage(app.playlists.storageKeyThumbsUp);

    lists.song = {items: items};

    // Save
    app.storageController.setStorage(app.playlists.storageKeyThumbsUp, lists);

    return;
  }

  // Get a full list then update our specific list
  listId = parseInt(listId);
  var lists = app.playlists.getCustomPlaylist();
  if(items.length > 0){
    for(i in lists){
      // if matching list, update
      if(lists[i].id == listId){
        lists[i].items = items;
      }
    }
  }

  // Save
  app.storageController.setStorage(app.playlists.storageKeyLists, lists);

};


/**
 * Html for the sub tasks of a playlist
 *
 */
app.playlists.getDropdown = function(){

  var items = [],
    type = app.helpers.arg(0),
    buttons = {
      append: 'Add to playlist',
      replace: 'Replace playlist'
    };

  if(type != 'thumbsup'){
    buttons.delete = 'Delete';
  }

  for(key in buttons){
    items.push({
      url: '#',
      class: type + '-' + key,
      title: buttons[key]
    })
  }

  return app.helpers.makeDropdown({
    key: type,
    items: items
  });

};




/**
 * save a thumbs up song
 *
 * @param op
 *  add, remove
 * @param type
 *  song, album, artist
 * @param id
 *  id of type
 */
app.playlists.setThumbsUp = function(op, type, id){

  var allThumbsUp = app.playlists.getThumbsUp(),
    currentThumbsUp = allThumbsUp[type],
    newList = [],
    exists = false,
    itemTemplate = {items: []};

  if(typeof currentThumbsUp == 'undefined' || typeof currentThumbsUp.items == 'undefined'){
    currentThumbsUp = itemTemplate;
  }

  // Add or remove
  switch (op){

    case 'add':
      // only add if not exists
      for(i in currentThumbsUp.items){
        if(currentThumbsUp.items[i] == id){
          exists = true;
        }
      }
      // add
      if(!exists){
        currentThumbsUp.items.push(id);
      }
      break;

    case 'remove':
      // loop and re add all but the id to remove
      for(i in currentThumbsUp.items){
        if(currentThumbsUp.items[i] != id && currentThumbsUp.items[i] != null){
          newList.push(currentThumbsUp.items[i])
        }
      }
      currentThumbsUp.items = newList;
      break;
  }

  // update for current thumbs up type
  allThumbsUp[type] = currentThumbsUp;

  // save storage
  app.storageController.setStorage(app.playlists.storageKeyThumbsUp, allThumbsUp);

  // update cache
  app.playlists.getThumbsUp()
};


/**
 * get thumbs up
 *
 * @param type
 */
app.playlists.getThumbsUp = function(type){
  var currentThumbsUp = app.storageController.getStorage(app.playlists.storageKeyThumbsUp),
    lists = (currentThumbsUp != null ? currentThumbsUp : {});

  // save to cache for "isThumbsUp"
  app.cached.thumbsUp = {};
  for(t in lists){
    app.cached.thumbsUp[t] = {
      items: lists[t].items,
      lookup: {}
    };
    // make a dictionary lookup and ensure id is not null (which storage seems to do)
    var items = [];
    for(n in lists[t].items){
      var id = lists[t].items[n];
      if(id != null){
        items.push(id);
        app.cached.thumbsUp[t].lookup[id] = true;
      }
    }
    lists[t].items = items;
  }

  // return all or one list
  if(typeof type != 'undefined'){
    // return specific type
    return lists[type];
  } else {
    // return all lists
    return lists;
  }

};


/**
 * get thumbs up
 *
 * @param type
 */
app.playlists.isThumbsUp = function(type, id){
  return (typeof app.cached.thumbsUp[type] != 'undefined' &&
    typeof app.cached.thumbsUp[type].lookup[id] != 'undefined');
};

;app.storageController = {
  nameSpace: 'chorusStorage:'
};


/**
 * Get storage
 */
app.storageController.getStorage = function(key, callback){
  var data = $.totalStorage(app.storageController.nameSpace + key);
  if(callback){
    callback(data);
  } else {
    return data;
  }
}


/**
 * Set storage
 */
app.storageController.setStorage = function(key, value, callback){
  var data = $.totalStorage(app.storageController.nameSpace + key, value);
  if(callback){
    callback(value);
  } else {
    return value;
  }
}




;

/********************************************************************************
 * Handles all non library calls to xbmc
 ********************************************************************************/


$.jsonRPC.setup({
  endPoint: app.jsonRpcUrl
});


app.xbmcController = {};

/**
 * Generic command
 * @param command
 * @param options
 * @param callback
 */
app.xbmcController.command = function(command, options, callback, errorCallback){

  $.jsonRPC.request(command, {
    params: options,
    success: function(result) {
      if(callback){
        callback(result);
      }
    },
    error: function(result) {
      app.helpers.errorHandler('xbmc song command call: ' + command, [result, options]);
      if(errorCallback){
        errorCallback([result, options])
      }
    }
  });

};


/**
 * Generic command
 * @param commands
 * @param callback
 */
app.xbmcController.multipleCommand = function(commands, callback){

  $.jsonRPC.batchRequest(commands, {
    success: function(result) {
      for(i in result){
        if(typeof result[i].error != 'undefined'){
          console.log(result, commands[i]);
          app.helpers.errorHandler('xbmc multiple command call: ' + i, [result[i], commands[i]]);
        }
      }
      if(callback){
        callback(result);
      }
    },
    error: function(result) {
      app.helpers.errorHandler('xbmc multiple command call', [result, commands]);
    }
  });

};


;/*
 * Get Song collection
 */
app.SongXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc song call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Song,
  //collection params
  arg1: app.songFields, //fields
  arg2: {"start": 0, "end": 50000}, //count
  arg3: {"sort": {"method": "dateadded", "order": "descending"}},
  //method/params
  methods: {
    read:  ['AudioLibrary.GetSongs'] //, 'arg1', 'arg2', 'arg3'
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return resp.songs;
  }
});



/*
 * Get Song collection
 */
app.SongFilteredXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc song filtered call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Song,
  //collection params
  arg1: app.songFields, //fields
  arg2: {"start": 0, "end": 500}, //count
  arg3: {"sort": {"method": "dateadded", "order": "descending"}},
  //apply our filter - Required! or call will fail
  arg4: function(){
    return this.models[0].attributes.filter;
  },
  //method/params
  methods: {
    read:  ['AudioLibrary.GetSongs', 'arg1', 'arg2', 'arg3', 'arg4']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return resp.songs;
  }
});



/*
 * Get Album collection
 */
app.AlbumXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc album call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Album,
  //collection params
  arg1: app.albumFields, //properties
  arg2: {"start": 0, "end": 5000}, //count
  arg3: {"sort": {"method": "album"}},
  //method/params
  methods: {
    read:  ['AudioLibrary.GetAlbums', 'arg1', 'arg2', 'arg3']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return resp.albums;
  }
});



/*
 * Get Album collection
 */
app.AlbumRecentlyAddedXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc album call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Album,
  //collection params
  arg1: app.albumFields, //properties
  arg2: {"start": 0, "end": 200}, //count
  //method/params
  methods: {
    read:  ['AudioLibrary.GetRecentlyAddedAlbums', 'arg1', 'arg2']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    var a = app.helpers.shuffle(resp.albums);
    return a;
  }
});



/*
 * Get Artist collection
 */
app.ArtistXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc artist call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Artist,
  //collection params
  arg1: true, //albumartistsonly
  arg2: app.artistFields, //properties
  arg3: {"start": 0, "end": 5000}, //count
  arg4: {"sort": {"method": "artist"}},
  //method/params
  methods: {
    read:  ['AudioLibrary.GetArtists', 'arg1', 'arg2', 'arg3', 'arg4']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return resp.artists;
  }
});;
/**
 * A collection of Artists.
 */
app.ArtistCollection = Backbone.Collection.extend({

  model: app.Artist,

  sync: function(method, model, options) {
    if (method === "read") {
      var type = (typeof options.type == 'undefined' ? 'all' : options.type);
      if(type == 'all'){
        app.store.allArtists(function(data){
          options.success(data.models);
        });
      }
      //random block
      if(type == 'rand'){
        app.store.randomArtists(function(data){

          options.success(data);
        });
      }
    }
  }

});


/**
 * A collection of Albums.
 */
app.AlbumsCollection = Backbone.Collection.extend({
  model: app.Album,

  sync: function(method, model, options) {
    if (method === "read") {
      app.notification('Loading Albums');
      app.store.allAlbums(function(data){
        options.success(data.models);
      });
    }
  }
});


/**
 * A single album and its songs.
 */
app.AlbumCollection = Backbone.Collection.extend({
  model: app.Album,

  sync: function(method, model, options) {
    if (method === "read") {
      app.notification('Loading ' + options.type + 's');
      app.store.getAlbums(parseInt(options.id), options.type, function(data){
        options.success(data);
      });
    }
  }
});


/**
 * Get every song, should not be rendered at once!
 * Its generally a big collection.
 */
app.SongCollection = Backbone.Collection.extend({
  model: app.Song,

  sync: function(method, model, options) {
    if (method === "read") {
      options.success(app.stores.allSongs.models);
    }
  }

});



app.PlaylistCollection = Backbone.Collection.extend({
  model: app.PlaylistItem,

  sync: function(method, model, options) {
    if (method === "read") {

      app.AudioController.getPlaylistItems(function(result){
        options.success(result.items);
      });

    }
  }

});



app.PlaylistCustomListCollection = Backbone.Collection.extend({

  model: app.PlaylistCustomListItem,

  sync: function(method, model, options) {
    if (method === "read") {
      // vars
      var lists = app.playlists.getCustomPlaylist(),
        o = [], i = 1;

      // success
      for(n in lists){
        var item = lists[n];
        item.id = i;
        o.push(item);
        i++;
      }

      options.success(o);

    }
  }

});



app.PlaylistCustomListSongCollection = Backbone.Collection.extend({

  model: app.PlaylistCustomListItemSong,

  sync: function(method, model, options) {
    if (method === "read") {

      var list = app.playlists.getCustomPlaylist(options.name);

      app.AudioController.songLoadMultiple(list.items, function(songs){
        options.success(songs);
      });

    }
  }

});


app.ThumbsUpCollection = Backbone.Collection.extend({

  model: app.PlaylistCustomListItemSong,

  sync: function(method, model, options) {
    if (method === "read") {

      var list = app.playlists.getThumbsUp(options.name);

      // no further parsing if empty
      if(list == null || list.length == 0){
        return {items: []};
      }

      switch(options.name){

        case 'song':
          // lookup songs
          app.AudioController.songLoadMultiple(list.items, function(songs){
            options.success(songs);
          });
          break;

        case 'artist':
          // get artists from cache
          app.store.multipleArtists(list.items, function(data){
            options.success(data);
          });
          break;

        case 'album':
          // get albums from cache
          app.store.multipleAlbums(list.items, function(data){
            options.success(data);
          });
          break;

      }

    }
  }

});




app.CustomSongCollection = Backbone.Collection.extend({

  model: app.Song,

  sync: function(method, model, options) {
    if (method === "read") {

      app.AudioController.songLoadMultiple(options.items, function(songs){
        options.success(songs);
      });
    }
  }

});



/**************************
 * Memory store
 * @param successCallback
 * @param errorCallback
 * @constructor
 ***************************/


app.MemoryStore = function (successCallback, errorCallback) {

  this.state = {
    ready: false,
    msg: "connecting"
  };

  // clear/declare
  app.stores = {
    songs: [],
    albums: [],
    artists: [],
    genres: [],
    all: [],
    allArtists: []
  };

 /*
  * Force sync songs with xbmc
  */
  this.syncAudio = function(successCallback){

    var self = this;


    self.songsIndexed = false;
    self.songsIndexing = false;
    self.albumsIndexed = false;
    self.albumsIndexed = false;

    this.allArtists();
    this.allAlbums();
  };


  this.indexSongs = function(successCallback){
    var self = this;

    if(self.songsIndexed === true){
      callLater(successCallback,  self)

    } else {

      // if not indexing, start
      if(self.songsIndexing !== true){

        //get all songs
        self.songsIndexing = true;
        this.allSongs = new app.SongXbmcCollection();

        // fetch all songs (very slow and locks up ui a bit)
        this.allSongs.fetch({"success": function(data){

          // assign to store
          //self.parseAudio(data.models);
          console.log(data);
          //cache
          app.stores.allSongs = data;

          //flag as indexed
          self.songsIndexed = true;

          self.state = {ready: true, msg: 'songs ready'};
          $(window).trigger('songsReady');

          // ready action
          //successCallback();
          callLater(successCallback,  self)
        }});
      }

    }

  };

  /**
   * This is a wrapper for callbacks that rely on the library being present
   */
  this.libraryCall = function(callback, trigger){
    if(typeof trigger == 'undefined'){
      trigger = 'songsReady';
    }
    if(app.store.state.ready === true){
      callback();
    } else {
      //library is not ready, bind to when it is
      $(window).bind(trigger, callback);
    }
  };

  /**
   * Get all artists
   * @param callback
   * @returns {*}
   */
  this.allArtists = function(callback){
    var self = this;

    if(self.artistsIndexed === true){
      var collection = app.stores.allArtists;
      callLater(callback, collection);
      return collection;
    }

    // fetch all artists
    this.allXbmcArtists = new app.ArtistXbmcCollection();
    this.allXbmcArtists.fetch({"success": function(artists){


      artists.models.sort(function(a,b){ return app.helpers.aphabeticalSort(a.attributes.label, b.attributes.label);	});

      // assign to memory
      app.stores.allArtists = artists;

      self.msg = 'artists ready';

      $(window).trigger('artistsReady');

      self.artistsIndexed = true;

      // get the collection
      var collection = app.stores.allArtists;
      callLater(callback, collection);
      return collection;

    }});



  };

  this.allAlbums = function(callback){
    var self = this;

    if(self.albumsIndexed === true){
      var collection = app.stores.allAlbums;
      callLater(callback, collection);
      return collection;
    }

    // fetch all albums
    this.allXbmcAlbums = new app.AlbumXbmcCollection();
    this.allXbmcAlbums.fetch({"success": function(albums){

      // assign to memory
      app.stores.allAlbums = albums;

      self.msg = 'albums ready';
      $(window).trigger('albumsReady');

      self.albumsIndexed = true;

      var collection = app.stores.allAlbums;
      callLater(callback, collection);
      return collection;

    }});


  };

  /**
   * Load multiple artists by ids array
   * @param callback
   */
  this.multipleArtists = function(artistIds, callback){
    if(artistIds.length == 0){
      return;
    }
    this.allArtists(function(artists){
      // filter list by ids
      var filtered = artists.models.filter(function (element) {
        return ($.inArray(element.attributes.artistid, artistIds) != -1);
      });

      callLater(callback, filtered);
    });

  };



  /**
   * Load multiple albums by ids array
   * @param albumIds
   *  array
   * @param callback
   */
  this.multipleAlbums = function(albumIds, callback){
    if(albumIds.length == 0){
      return;
    }
    this.allAlbums(function(albums){
      var filtered = albums.models.filter(function (element) {
        return ($.inArray(element.attributes.albumid, albumIds) != -1);
      });

      callLater(callback, filtered);
    });

  };



  /**
   * Get 20 random artists with artwork
   * @param callback
   */
  this.randomArtists = function(callback){

    // get a random collection
    this.allArtists(function(data){
        artists = data.models,
          randArtists = _.shuffle(artists),
          farts = [], count = 30, i = 0;

        // only add content with artwork
        _.each(randArtists,function(a){
          if(i < count){
            if(a.attributes.fanart.length != 0 && a.attributes.thumbnail.length != 0){
              farts.push(a);
              i++;
            }
          }
        });
        //topup with thumbs
        if(farts.length < count){
          _.each(randArtists,function(a){
            if(i < count){
              if(a.attributes.thumbnail.length != 0){
                farts.push(a);
                i++;
              }
            }
          });
        }
        callLater(callback, farts);
      });

  };

  this.getArtist = function(id, callback){

    this.allArtists(function(){
      var self = this;
      // get the collection
      $.each(app.stores.allArtists.models, function(i,data){
        if(typeof data.attributes != "undefined" && data.attributes.artistid == id){
          callLater(callback,  data);

        }
      });
    });

  };

  /*
   * Grab artist songs and parse them into albums
   * Will attempt to pull from cache first
   */
  this.getAlbums = function(id, type, callback){
    var data = {}, albums = [], self = this, key = type + id, filter = type + 'id', plural = type + 's';

    // if cache exists
    if(app.helpers.exists(app.stores[plural])
      && app.helpers.exists(app.stores[plural][key])
      && app.helpers.exists(app.stores[plural][key].albumsitems)
    ){
      // get cache?
      albums = app.stores[plural][key].albumsitems;
      callLater(callback,  albums);
    }
    // if no cache get/refresh a collection from xbmc
    if(albums.length == 0) {
      // songs by filter
      data[filter] = id;

      var songs = new app.SongFilteredXbmcCollection({"filter": data});
      songs.fetch({"success": function(songs){
        //parse into albums
        albums = self.parseArtistSongsToAlbums(songs.models);
        //add to cache
        app.stores[plural][key] = {albumsitems: albums};
        callLater(callback,  albums);
      }});
    }
  };



  /* parse songs into albums */
  this.parseArtistSongsToAlbums = function(songs){
    albums = {}, ret = [];
    for(i in songs){
      // vars
      var model = songs[i],
          item = (typeof model.attributes != 'undefined' ? model.attributes : 0),
          albumkey = 'album' + item.albumid;

      // parse into albums
      if(typeof albums[albumkey] == "undefined"){
        albums[albumkey] = {};

        // populate album info from first item
        var fields = ['album', 'albumid', 'thumbnail', 'artist', 'artistid'];
        $.each(fields, function(b, field){
          if($.isArray(item[field])){
            item[field] = item[field][0];
          }
          albums[albumkey][field] = item[field];
        });

        // setup for songlist
        albums[albumkey].songs = [];
      }
      albums[albumkey].songs.push(model);
    }
    for(i in albums){
      ret.push(albums[i]);
    }
    return ret;
  };




  //  call it on construct
  this.syncAudio(successCallback);

  /*
   * Force sync songs with xbmc
   */
  this.parseAudio = function(songs){


    //loop over each song
    $.each(songs, function(i,data){

      //vars
      var item = data.attributes
        , songsDefault = { songs:[], artist: {}, albums: [], albumsitems: [] }
        , songkey = item.songid
        , albumid = (typeof item.albumid != "undefined" ? item.albumid : 0)
        , artistid = (typeof item.artistid != "undefined" ? item.artistid[0] : 0)
        , genreid = (typeof item.genreid != "undefined" ? item.genreid[0] : 0)
        , albumkey = 'album' + albumid
        , artistkey = 'artist' + artistid
        , genrekey = 'genre' + genreid
        ;

      // default songs
      if(typeof app.stores.songs[artistkey] == "undefined"){
        app.stores.songs[artistkey] = songsDefault;
      }

      // default artists get more parsing
      if(typeof app.stores.artists[artistkey] == "undefined"){
        app.stores.artists[artistkey] = songsDefault;        
      }

      // default genres
      if(typeof app.stores.genres[genrekey] == "undefined"){
        app.stores.genres[genrekey] = songsDefault;
      }

      //app.stores.albums[albumkey].songs.push(data);
      app.stores.songs[artistkey].songs.push(data);
      //app.stores.artists[artistkey].songs.push(data);
      app.stores.genres[genrekey].songs.push(data);
      app.stores.all.push(data);


    });

  };


  // Used to simulate async calls. This is done to provide a consistent
  // interface with stores that use async data access APIs
  var callLater = function (callback, data) {
    if (callback) {
      setTimeout(function () {
        callback(data);
      });
    }
  }

}

app.store = new app.MemoryStore(function(){

});

;
/**
 * A collection of Artists.
 */
app.FileCollection = Backbone.Collection.extend({

  model: app.File,

  sync: function(method, model, options) {
    if (method === "read") {

      if(options.name == 'sources'){
        // Get Sources
        this.getSources(options.success);
      } else if(options.name == 'addons'){
        // Get addons
        this.getAddonSources(options.success);
      } else {
        // Get Dir
        this.getDirectory(options.name, options.success);
      }

    }
  },

  getSources: function(callback){
    var self = this;

    app.xbmcController.command('Files.GetSources', ['music'], function(res){
      // add a title before return
      var sources = self.parseData(res.result.sources);
      callback(sources);
    })

  },

  //get addon sources
  getAddonSources:function(callback){
    app.addOns.getSources(callback);
  },

  getDirectory: function(dir, callback){
    var self = this;

    app.xbmcController.command('Files.GetDirectory', [dir, 'music', app.fileFields,  {"method": "title", "order": "ascending"}], function(res){

      var files = self.parseData(res.result.files);

      callback(files);

    })

  },

  /**
   * adds a title if missing, sorts and thumb defaults
   * @param models
   * @returns {*}
   */
  parseData: function(models){
    for(i in models){

      if(typeof models[i].filetype == 'undefined' || models[i].filetype == ''){
        models[i].filetype = 'directory';
      }

      if(typeof models[i].id == 'undefined' || models[i].id == 0){
        models[i].id = models[i].file;
      }

      if(models[i].filetype == 'directory'){
//        var f = models[i].file.split('/'),
//          foo = f.pop(),
//          name = f.pop();
        models[i].title = models[i].label;
      } else {
        models[i].type = 'file';
      }

      if(typeof models[i].title == 'undefined' || models[i].title == ''){
        models[i].title = models[i].label;
      }

      if(typeof models[i].thumbnail == 'undefined'){
        models[i].thumbnail = '';
      }

      // let addons tinker
      models[i] = app.addOns.invokeAll('parseFileRecord', models[i]);
    }

    return models;
  }




});

;app.AlbumView = Backbone.View.extend({

  initialize:function () {
  },

  render: function () {
    var self = this;

    this.$el.html(this.template(this.model.attributes));

    self.albumList = new app.AlbumCollection();
    self.albumList.fetch({"id": this.model.attributes.albumid, "type": "album", "success": function(data){
      self.albumsView = new app.AlbumsList({model: data, className: 'album-list'});
      var alb = data.models[0].attributes,
          sidebarSelector = '#sidebar-first .album-row-' + alb.albumid;

      // populate main content
      var $al = $('#album-list').html(self.albumsView.render().el);

      // set title
      app.helpers.setTitle('<a href="#artist/' + alb.artistid + '">' + alb.artist + '</a>' + alb.album);

      // add actions to title
      //var $actions = $al.find('.album-actions-wrapper').clone(true, true);
      //$('#title').append($actions);

      //remove any existing active
      $('#sidebar-first .album-small-row').removeClass('active');

      //check if album exists in current sidebar list and only render if not
      if($(sidebarSelector).length == 0){

        //add the sidebar view
        self.albumArtistView = new app.AlbumArtistView({"model":data.models[0]});
        app.helpers.setFirstSidebarContent(self.albumArtistView.render().el);

      } else {
        //set active row
        $(sidebarSelector).addClass('active');
      }

    }});

    return this;
  }

});



app.AlbumArtistView = Backbone.View.extend({

  tagName:"div",
  className:'album-artist-item',

  initialize:function () {
    this.artistModel = new app.Artist({"id": this.model.attributes.artistid, "fields":app.artistFields});
    this.artistAlbums = {};
  },

  render:function () {
    var self = this;

    this.artistModel.fetch({success:function(artist){

      //base template
      self.$el.html(self.template(artist.attributes));


      // set the sidebar title
      //$('#title a').html('Artists').attr('href', '#artists');

      //get the artists albums
      self.albumList = new app.AlbumCollection();
      self.albumList.fetch({"id": artist.attributes.artistid, "type": "artist", "success": function(data){

        self.albumsView = new app.SmallAlbumsList({model: data});
        $('#sidebar-first .other-albums').html(self.albumsView.render().el);

        //set active row
        $('.album-row-' + self.model.attributes.albumid).addClass('active');

        //scrollbars
        app.helpers.addScrollBar('.other-albums');

      }});

    }});

    return this;
  }

});
;/*
 * Large Album view
 */

app.AlbumsList = Backbone.View.extend({

  tagName:'div',

  className:'artist-list-view',

  initialize:function () {
    var self = this;
    this.model.on("reset", this.render, this);
    this.model.on("add", function (album) {
      self.$el.append(new app.AlbumItemView({model:album}).render().el);
    });
  },

  render:function () {
    this.$el.empty();
    _.each(this.model.models, function (album) {
      this.$el.append(new app.AlbumItemView({model:album}).render().el);
    }, this);
    return this;
  }
});

app.AlbumItemView = Backbone.View.extend({

  tagName:"div",

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    // thumbs up
    if(app.playlists.isThumbsUp('album', this.model.attributes.albumid)){
      $('.album-actions', this.$el).addClass('thumbs-up');
    }

    // songs
    this.songList = new app.SongListView({"model":this.model.attributes.songs});
    $(".tracks", this.$el).html(this.songList.render().el);
    return this;
  },


  events: {
    "click .album-play": "playAlbum",
    "click .album-add": "addAlbum",
    "click .album-thumbsup": "thumbsUp"
  },

  //play an album from start, replacing current playlist
  playAlbum: function(e){
    e.stopPropagation();
    // clear playlist. add artist, play first song
    var album = this.model.attributes;
    app.AudioController.playlistClearAdd( 'albumid', album.albumid, function(result){
      app.AudioController.playPlaylistPosition(0, function(){
        app.AudioController.playlistRefresh();
      });
    });

  },

  addAlbum: function(e){
    e.stopPropagation();
    // clear playlist. add artist, play first song
    var album = this.model.attributes;
    app.AudioController.playlistAdd( 'albumid', album.albumid, function(result){
      app.notification(album.album + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });

  },


  thumbsUp: function(e){
    e.stopPropagation();
    var album = this.model.attributes,
      albumid = this.model.attributes.albumid,
      op = (app.playlists.isThumbsUp('album', albumid) ? 'remove' : 'add'),
      $el = $(e.target).closest('.album-actions');
    app.playlists.setThumbsUp(op, 'album', albumid);
    $el.toggleClass('thumbs-up');

  }



});

/*
 * Small Album view (no songs)
 */
app.SmallAlbumsList = Backbone.View.extend({

  tagName:'ul',

  className:'album-list-small',

  initialize:function () {

/*    this.model.on("add", function (album) {
      this.$el.append(new app.AlbumItemSmallView({model:album}).render().el);
    });*/
  },

  render:function () {

    this.$el.empty();
    _.each(this.model.models, function (album) {
      this.$el.append(new app.AlbumItemSmallView({model:album}).render().el);
    }, this);
    return this;

  }
});

app.SmallAlbumItemView = Backbone.View.extend({

  tagName:"li",
  className:'album-small-item',

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }

});


;app.ArtistView = Backbone.View.extend({

  events:{
    "click .artist-play":      "playArtist",
    "click .artist-add":       "addArtist",
    "click .artist-thumbsup":  "thumbsUp",
    "click .artist-fanart":    "toggleFanart"
  },

  initialize:function () {
    if(!this.artistsList){
      this.artistsList = new app.ArtistCollection();
      this.artistsListView = new app.AristsListView({model: this.artistsList, className: 'artist-list'});
    }

  },

  render: function () {

    //main detail
    this.$el.html(this.template(this.model.attributes));
    $('#artist-meta', this.el).html(new app.ArtistSummaryView({model:this.model}).render().el);


/*    app.artistsView = new app.ArtistsView();
    app.artistsView.renderSidebar();*/

    //select appropriate sidebar item
    $('.artist-row').removeClass('active');
    var $actRow =  $('.artist-row-' + this.model.id);
    // hack to check if loaded
    if($actRow.length > 0){
      $actRow.addClass('active');
      $('#sidebar-first .sidebar-content').scrollTo($actRow);
    }
    return this;
  },

  playArtist: function(){

    // clear playlist. add artist, play first song
    var artist = this.model.attributes;
    app.AudioController.playlistClearAdd( 'artistid', artist.artistid, function(result){
      app.AudioController.playPlaylistPosition(0, function(){
        app.AudioController.playlistRefresh();
      });
    });

  },

  addArtist: function(){

    // clear playlist. add artist, play first song
    var artist = this.model.attributes;
    app.AudioController.playlistAdd( 'artistid', artist.artistid, function(result){
      app.notification(artist.artist + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });

  },

  thumbsUp: function(e){

    var artist = this.model.attributes,
      artistid = this.model.attributes.artistid,
      op = (app.playlists.isThumbsUp('artist', artistid) ? 'remove' : 'add'),
      $el = $(e.target).closest('.artist-actions');
    app.playlists.setThumbsUp(op, 'artist', artistid);
    $el.toggleClass('thumbs-up');

  },

  toggleFanart: function(e){
    $(e.target).parent().toggleClass('full-size');
  }


});

app.ArtistSummaryView = Backbone.View.extend({

  events:{
    "click p.description":"expandDetail"
  },

  initialize:function () {
    this.model.on("change", this.render, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    var self = this;

    self.albumList = new app.AlbumCollection();
    self.albumList.fetch({"id": this.model.attributes.artistid, "type": "artist", "success": function(data){
      self.albumsView = new app.AlbumsList({model: data, className: 'album-list'});
      $('#album-list').html(self.albumsView.render().el);

      // get artist stats and add to sidebar active
      var meta = app.helpers.parseArtistSummary(data);
      $('.artist-list .active .artist-meta').html(meta);


      //scroll fanart down
      if(self.model.attributes.fanart != ''){
        //$('body').scrollTo(176);
      }

    }});


    return this;
  },

  expandDetail: function(){
    $('.artist-detail').toggleClass('full');
  }

});


;app.ArtistsView = Backbone.View.extend({

  initialize: function () {


  },


  render:function () {
    this.$el.html(this.template());

    this.renderSidebar();

    // get artists page
    this.artistsRand = new app.ArtistCollection();
    this.artistsRand.fetch({type: "rand", success: function(data){

      //render the artists page
      this.artistsRandView = new app.AristsRandView({model: data, className: 'rand-list'});
      $('#main-content').html(this.artistsRandView.render().el);

      //add isotope
      app.helpers.addFreewall('ul.rand-list');
    }});


      //this.artistsListView = new app.AristsListView({model: this.artistsList, className: 'artist-list'});


    return this;
  },


  /**
   * Render first sidebar (artist scroller)
   */
  renderSidebar:function(){

    // if no existing artist list (don't re-render if not required)
    if($('.artist-list .artist').length == 0){

      // get artists list
      this.artistsList = new app.ArtistCollection();
      this.artistsList.fetch({success: function(data){
        this.artistsListView = new app.AristsListView({model: data, className: 'artist-list swiper-wrapper'});
        app.helpers.setFirstSidebarContent(this.artistsListView.render().el);

      }});

    }

  }

});

;/*
 * Sidebar artist list
 */
app.AristsListView = Backbone.View.extend({

  tagName:'ul',

  className:'nav nav-list',

  initialize:function () {
    var self = this;
    this.model.on("reset", this.render, this);
    this.model.on("add", function (artist) {
      self.$el.append(new app.ArtistListItemView({model:artist}).render().el);
    });
  },

  render:function () {
    this.$el.empty();

    _.each(this.model.models, function (artist) {
      this.$el.append(new app.ArtistListItemView({model:artist}).render().el);
    }, this);
    return this;
  }
});

app.ArtistListItemView = Backbone.View.extend({

  tagName:"li",

  className: 'artist',

  events:{
    "click .play-artist": "playArtist"
  },

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));

 /*   $('.album-small-item img').resizecrop({
      width:40,
      height:60,
      vertical:"top"
    });*/

    return this;
  },

  playArtist: function(e){
    e.preventDefault();
    // clear playlist. add artist, play first song
    var artist = this.model.attributes;
    app.AudioController.playlistClearAdd( 'artistid', artist.artistid, function(result){
      app.AudioController.playPlaylistPosition(0, function(){
        app.AudioController.playlistRefresh();
      });
    });

  }

});



/*
 * Random Size Block view (ordering is still left to the model)
 */
app.AristsRandView = Backbone.View.extend({

  tagName:'ul',

  className:'random-block',

  initialize:function () {



    var self = this;
    this.model.on("reset", this.render, this);
    this.model.on("add", function (artist) {
      self.$el.append(new app.ArtistLargeItemView({model:artist}).render().el);
    });
  },

  render:function () {
    this.$el.empty();

    _.each(this.model.models, function (artist) {
      this.$el.append(new app.ArtistLargeItemView({model:artist}).render().el);
    }, this);


    return this;
  }
});

app.ArtistLargeItemView = Backbone.View.extend({

  tagName:"li",

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }

});


;app.ContactView = Backbone.View.extend({

    render:function () {
        this.$el.html(this.template());
        return this;
    }

});;app.CustomPlaylistSongListView = Backbone.View.extend({

  tagName:'ul',

  className:'playlist-song-list',

  events: {
    "click .playlist-append": "appendPlaylist",
    "click .playlist-replace": "replacePlaylist",
    "click .playlist-delete": "deleteCustomListPlaylist",
    "click .thumbsup-append": "appendThumbsup",
    "click .thumbsup-replace": "replaceThumbsup"
  },

  initialize:function () {

  },


  render:function () {

    // save the list
    var args = app.helpers.arg();
    if(args[0] == 'playlist'){
      this.list = app.playlists.getCustomPlaylist(args[1]);
    }
    if(args[0] == 'thumbsup'){
      this.list = app.playlists.getThumbsUp('song');
    }

    this.$el.empty();
    var i = 0;
    _.each(this.model.models, function (song) {
      song.attributes.list = this.list;
      song.attributes.position = i;
      this.$el.append(new app.CustomPlaylistSongView({model:song}).render().el);
      i++;
    }, this);

    // sortable
    this.playlistBinds();

    // menu
    var menu = app.playlists.getDropdown();
    this.$el.prepend(menu);

    return this;
  },


  playlistBinds:function(){

    var self = this;

    //sortable
    $sortableCustom = this.$el;

    $sortableCustom.sortable({
      placeholder: "playlist-item-placeholder",
      handle: ".song-title",
      items: "> li",
      axis: "y",

      update: function( event, ui ) {
        var list = [],
          listId = app.helpers.arg(0) == 'thumbsup' ? 'thumbsup' : app.helpers.arg(1),
          $container = $('ul.playlist-song-list');

        // recreate the list using the original list + pos to rebuild
        $container.find('div.playlist-item').each(function(i,d){
          var item = self.list.items[$(d).data('pos')];
          list.push(item);
        });
        console.log(list, listId);
        // Update the playlist order in storage
        app.playlists.replaceCustomPlayList(listId, list);

      }
    }).disableSelection();

  },


  /**
   * Append a custom playlist
   * @param e
   */
  appendPlaylist: function(e){
    e.preventDefault();
    // add list
    var list = app.playlists.getCustomPlaylist(this.list.id);
    console.log(list.items);
    this.addCustomListToPlaylist(list.items);
    app.notification('Playlist updated');
  },


  /**
   * Replace with a custom playlist
   * @param e
   */
  replacePlaylist: function(e){
    e.preventDefault();
    var listId = this.list.id,
      list = app.playlists.getCustomPlaylist(listId);
    this.replacePlaylistItems(list.items);
  },


  /**
   * Delete playlist
   * @param e
   */
  deleteCustomListPlaylist: function(e){
    e.preventDefault();
    // delete with confirm
    var model = this.list;
    app.helpers.confirm("Delete playlist for good? This cannot be undone", function(){

      // delete the list
      app.playlists.deleteCustomPlaylist(model.id);

      // clear the deleted playlist from content
      var $c = $('#content');
      if($c.find('.playlist-song-list').length > 0){
        $c.html('<div class="loading-box">Playlist removed</div>');
      }

    });
  },


  /**
   * Append thumbs up
   */
  appendThumbsup: function(e){
    e.preventDefault();
    var list = app.playlists.getThumbsUp('song');
    this.addCustomListToPlaylist(list.items);
    app.notification('Playlist updated');
  },


  /**
   * replace thumbs up
   */
  replaceThumbsup: function(e){
    e.preventDefault();
    var list = app.playlists.getThumbsUp('song');
    this.replacePlaylistItems(list.items);
  },


  /**
   * handler for replacing a playlist (used by thumbs up too)
   * @param items
   */
  replacePlaylistItems: function(items){
    var self = this;
    app.helpers.confirm("Replace the current xbmc playlist with this list?", function(){
      //Confirmed
      // clear list
      app.AudioController.playlistClear(function(res){
        // Add the list
        self.addCustomListToPlaylist(items, function(pldata){
          // play first song
          app.AudioController.playPlaylistPosition(0, function(data){
            //update playlist
            app.AudioController.playlistRefresh();
            //notify
            app.notification('Playlist updated and playing');
          });
        });
      });
    });
  },


  /**
   * Adds a custom playlist to the xbmc playlist
   * @param items
   * @param callback
   */
  addCustomListToPlaylist:function(items, callback) {
    for(i in items){
      if(typeof items[i] != 'number'){
        items[i] = items[i].file;
      }
    }
    app.AudioController.playlistAddMultiple('mixed', items, function(result){
      // refresh playlist and switch to what got added
      app.AudioController.playlistRefresh();
      app.playlists.changePlaylistView('xbmc');
      if(callback){
        callback(result);
      }
    });
  }
});

app.CustomPlaylistSongView = Backbone.View.extend({

  tagName:"li",

  className:'song-row',

  events: {
    "dblclick .song-title": "playSong",
    "click .song-play":     "playSong",
    "click .song-add":      "addSong",
    "click .song-thumbsup": "thumbsUp",
    "click .song-remove":   "removeSong",
    //menu
    "click .song-download":  "downloadSong",
    "click .song-custom-playlist": "addToCustomPlaylist"
  },

  initialize:function () {

  },

  render:function () {

    if(typeof this.model.attributes.position == 'undefined'){
      console.log('no position');
      return this;
    }

    // add if thumbs up
    if( app.playlists.isThumbsUp('song', this.model.attributes.songid) ) {
      this.$el.addClass('thumbs-up')
    }
    // render
    this.$el.html(this.template(this.model.attributes));

    // set playlist menu
    $('.song-actions', this.$el).append( app.helpers.makeDropdown( app.helpers.dropdownTemplates('song' ) ));

    return this;
  },

  /**
   * Inserts into next pos on playlist then plays
   * @param event
   */
  playSong: function(event){
   var song = this.model.attributes,
     key = app.helpers.getSongKey(song);

    app.playlists.changePlaylistView('xbmc');
    app.AudioController.insertAndPlaySong(key.type, key.id, function(){
      app.notification(song.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });
  },

  addSong: function(){
    var song = this.model.attributes,
      key = app.helpers.getSongKey(song);
    app.AudioController.playlistAdd(key.type, key.id, function(result){
      app.notification(song.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });
  },

  /**
   * Toggle thumbs up status
   */
  thumbsUp: function(e){
    var songid = this.model.attributes.songid,
      op = (app.playlists.isThumbsUp('song', songid) ? 'remove' : 'add'),
      $el = $(e.target).closest('li');
    app.playlists.setThumbsUp(op, 'song', songid);
    $el.toggleClass('thumbs-up');
  },


  removeSong: function(e){
    var songid = this.model.attributes.songid,
      listid = this.model.attributes.list.id,
      $target = $(e.target);

    app.playlists.deleteCustomPlaylistSong(listid, songid);
    $target.closest('li').slideUp(function(){ $(this).remove(); });
  },

  downloadSong: function(e){
    var file = this.model.attributes.file;

    e.preventDefault();
    app.AudioController.downloadFile(file, function(url){
      window.location = url;
    })
  },

  addToCustomPlaylist: function(e){
    e.preventDefault();

    var song = this.model.attributes,
      key = app.helpers.getSongKey(song),
    // if file, gets the whole object
      id = (key.type == 'file' ? song : song.songid);
    console.log(id);
    app.playlists.saveCustomPlayListsDialog(key.type, [id]);
  }

});;app.FilesView = Backbone.View.extend({

  tagName:'ul',

  className:'files-list',

  initialize:function () {

  },


  render:function () {

    this.$el.empty();

    var $content = $('#content'),
      $filesContainer = $('#files-container', $content),
      $fc = $('<ul class="files-music"></ul>');

    if($filesContainer.length == 0){
      $content.html(this.template(this.model));
    }

    this.model.models.sort(function(a,b){
      return app.helpers.aphabeticalSort(a.attributes.title, b.attributes.title)
    });

    _.each(this.model.models, function (file) {

      if(file.attributes.filetype == '' || file.attributes.filetype == 'directory'){
        // is a dir
        this.$el.append(new app.FileView({model:file}).render().el);
      } else {
        // is a file
        $fc.append(new app.FileView({model:file}).render().el);
      }

    }, this);

    if($fc.html() != ''){
      $filesContainer.html($fc);
    } else {
      $filesContainer.html('<p class="loading-box">No music found in this folder</p>');
    }

    return this;
  }


});


/**
 * Raw file list
 * @type {*|void|Object|extend|extend|extend}
 */
app.FilesListView = Backbone.View.extend({

  tagName:'ul',

  className:'files-list',

  initialize:function () {

  },

  render:function () {

    this.$el.empty();

    this.model.models.sort(function(a,b){
      return app.helpers.aphabeticalSort(a.attributes.title, b.attributes.title)
    });

    _.each(this.model.models, function (file) {
      this.$el.append(new app.FileView({model:file}).render().el);
    }, this);

    return this;
  }

});



app.FileView = Backbone.View.extend({

  tagName:"li",

  className:'file-row',

  events: {
    "dblclick .file-item": "playDir",
    "click .file-play": "playDir",
    "click .file-type-directory": "clickDir",
    "click .file-add": "addDir",
    //menu
    "click .song-download":  "downloadSong",
    "click .song-custom-playlist": "addToCustomPlaylist"
  },

  initialize:function () {

  },

  render:function () {

    // render
    this.$el.html(this.template(this.model.attributes));

    // set song menu
    $('.file-actions', this.$el).append( app.helpers.makeDropdown( app.helpers.dropdownTemplates('song')  ));

    // post process file
    this.$el = app.addOns.invokeAll('postProcessFileView', this.$el, this.model.attributes);

    return this;

  },

  clickDir:function(e){
    e.stopPropagation();

    var file = this.model.attributes,
      dir = file.file,
      self = this,
      $this = $(e.target).parent();

    // let addons tinker
    app.addOns.invokeAll('clickDir', file);

    $('#sidebar-first li').removeClass('lowest');
    $this.addClass('loading');

    app.cached.fileCollection = new app.FileCollection();
    app.cached.fileCollection.fetch({"name":dir, "success": function(res){

      // render content and get sidebar updated content
      var el = new app.FilesView({"model":res}).render().$el;

      // dont append if already appended
      //console.log(self.$el);
      if(self.$el.find('ul.files-list').length == 0){
        self.$el.append(el);
      }

      // add a class to the curent open tree
      $this.addClass('lowest').removeClass('loading');
      $('#folder-name').html(file.label);

    }});


  },


  playDir:function(e){
    e.stopPropagation();

    var file = this.model.attributes,
      key = 'file',
      value = file.file;

    if(file.type == 'album' || file.type == 'artist' || file.type == 'song'){
      key = file.type + 'id';
      value = file.id
    }

    app.AudioController.insertAndPlaySong(key, value, function(result){
      app.notification(file.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });
  },



  addDir:function(e){
    e.stopPropagation();

    var file = this.model.attributes,
      key = 'file',
      value = file.file;

    if(file.type == 'album' || file.type == 'artist' || file.type == 'song'){
      key = file.type + 'id';
      value = file.id
    }

    app.AudioController.playlistAdd( key, value, function(result){
      app.notification(file.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });

  },

  downloadSong: function(e){
    var file = this.model.attributes.file;

    e.preventDefault();
    app.AudioController.downloadFile(file, function(url){
      window.location = url;
    })
  },

  addToCustomPlaylist: function(e){
    e.preventDefault();
    var file = this.model.attributes;
    app.playlists.saveCustomPlayListsDialog('file', [file]);
  }



});;app.HomeView = Backbone.View.extend({

    events:{
        "click #logo":"showMeBtnClick"
    },

    render:function () {
        this.$el.html(this.template(this.model));
        return this;
    },

    showMeBtnClick:function (e) {


    }

});;/**
 * Handles all the updates to the dom in regard to the player state
 * eg. now playing, connection, etc.
 *
 * @type {*|void|Object|extend|extend|extend}
 */


app.playerStateView = Backbone.View.extend({

  initialize: function () {

    this.$body = $('body');
    this.$nowPlaying = $('#now-playing');

  },

  render:function () {

    // get model
    var data = this.model,
      $window = $(window),
      lastPlaying = app.helpers.varGet('lastPlaying', '');

    this.$songs = $('.song');

    // enrich
    data.playingItemChanged = (lastPlaying != data.item.file);
    data.status = (app.helpers.exists(data.player.speed) && data.player.speed == 0 ? 'paused' : data.status);

    // resave model
    this.model = data;

    // set current as last playing var
    app.helpers.varSet('lastPlaying', data.item.file);

    // body classes
    this.bodyClasses();

    // remove any playing classes
    this.$songs.removeClass('playing-row');

    // if playing
    if(data.status == 'playing' || data.status == 'paused'){

      this.nowPlayingMinor();

      // if playing has changed
      if(data.playingItemChanged){

        this.nowPlayingMajor();
        $window.trigger('playingItemChange', data);

      }

    } else {
      this.notPlaying();
    }

    // init cron
    this.playerCron();

    $window.trigger('playerUpdate', data);

  },




  /***************************************
   * Helpers
   **************************************/


  /**
   * body classes
   */
  bodyClasses:function () {

    var data = this.model;

    this.$body
      // remove all old classes and list the options in use
      .removeClass('playing').removeClass('paused').removeClass('notPlaying')
      .removeClass('random-on').removeClass('random-off')
      .removeClass('repeat-off').removeClass('repeat-all').removeClass('repeat-one')
      // add active classes
      .addClass(data.status)
      .addClass( 'random-' + (data.player.shuffled === true ? 'on' : 'off') )
      .addClass( 'repeat-' + data.player.repeat );
  },


  /**
   * Now playing minor update
   */
  nowPlayingMinor:function(){

    // add currently playing class
    this.tagPlayingRow();

    // set the title
    this.setTitle();

    var data = this.model,
    // time stuff
      $time = $('#time'),
      cur = (parseInt(data.player.percentage) / 100) * parseInt(data.item.duration),
    // playlist stuff
      meta = app.helpers.parseArtistsArray(data.item),
      $playlistActive = $('.playlist .playing-row');

    //set playlist meta and playing row
    $('.playing-song-meta').html(meta);
    $playlistActive.find('.playlist-meta').html(meta);
    $playlistActive.find('.thumb').attr('src', app.parseImage(data.item.thumbnail));

    //set progress
    app.shellView.$progressSlider.slider( "value",data.player.percentage );

    //time
    $time.find('.time-cur').html(app.helpers.secToTime(Math.floor(cur)));
    $time.find('.time-total').html(app.helpers.secToTime(data.item.duration));

  },


  /**
   * Now playing major update
   */
  nowPlayingMajor:function(){

    var data = this.model;

    //set thumb
    this.$nowPlaying.find('#playing-thumb')
      .attr('src',app.parseImage(data.item.thumbnail))
      .attr('title', data.item.album)
      .parent().attr('href', '#album/' + data.item.albumid);

    // set title
    $('.playing-song-title').html(data.item.label); //now playing


    // Backstretch
    // @TODO move to home view as bind
    if(location.hash == '#' || location.hash == ''){
      // if homepage backstretch exists and changed, update
      var $bs = $('.backstretch img'),
        origImg = $bs.attr('src'),
        newImg = app.parseImage(data.item.fanart, 'fanart');
      // if image is different
      if($bs.length > 0 && origImg != newImg){
        $.backstretch(newImg);
      }
    }

    // refresh playlist
    app.AudioController.playlistRefresh();
  },

  /**
   * Set a playing class on currently playing row
   */
  tagPlayingRow:function(){

    var data = this.model;

    // playing row we should have a loaded item
    this.$songs.each(function(i,d){
      var $d = $(d);
      // correct song id
      if($d.attr('data-songid') == data.item.id && !$d.hasClass('playlist-item')){
        $d.addClass('playing-row');
      } else if($d.hasClass('playlist-item')){

        // match pos
        if($d.data('id') == data.player.position){
          $d.addClass('playing-row');
        }
      }
    });
  },


  /**
   * Set document title
   */
  setTitle:function () {
    var data = this.model;
    document.title = (status == 'playing' ? '▶ ' : '') + data.item.label + ' | Chorus.'; //doc
  },


  notPlaying:function () {
    var data = this.model;
    //doc title
    document.title = 'Chorus.';
    //title and artist
    $('.playing-song-title').html('Nothing Playing');
    $('.playing-song-meta').html('');
    //playlist row
    $('ul.playlist div.playlist-item.playing-row').removeClass('playing-row');
    //progress
    app.shellView.$progressSlider.slider( "value",0);
    //set thumb
    this.$nowPlaying.find('#playing-thumb')
      .attr('src',app.parseImage(''))
      .attr('title', '')
      .parent().attr('href', '#albums');
    //time
    var $time = $('#time');
    $time.find('.time-cur').html('0');
    $time.find('.time-total').html('0:00');
  },


  /**
   * Runs every 5 sec
   */
  playerCron:function (){
    var data = this.model,
      lastState =  app.helpers.varGet('lastState', ''),
      noState = (typeof lastState == 'undefined' || typeof lastState.volume == 'undefined');

    //set volume, only if we must
    if(!$('a.ui-slider-handle', app.shellView.$volumeSlider).hasClass('.ui-slider-active')  // is the slider currently being moved?
      && (noState || lastState.volume.volume != data.volume.volume)){
      app.shellView.$volumeSlider.slider( "value",data.volume.volume );
      //muted class
      if(data.volume.volume == 0){
        $('body').addClass('muted');
      } else {
        $('body').removeClass('muted');
      }
    }

    // set repeat title text
    if(noState || lastState.player.repeat != data.player.repeat){
      var $t = $('.player-repeat'), t = $t.attr('title'),
        n = (data.player.repeat == 'off' ? 'Repeat is off' : 'Currently repeating ' + data.player.repeat);
      if(t != n){ $t.attr('title', n); }
    }

    // set random title text
    if(noState || lastState.player.shuffled != data.player.shuffled){
      var $t = $('.player-random'), t = $t.attr('title'),
        n = 'Random is ' + (data.player.shuffled === true ? 'On' : 'Off');
      if(t != n){ $t.attr('title', n); }
    }

    // Set last state to data
    app.helpers.varSet('lastState', data);
  }



});;/*
 * Sidebar artist list
 */



app.PlaylistView = Backbone.View.extend({

  tagName:'ul',

  className:'playlist',

  initialize:function () {

  },

  render:function () {
    // html
    this.$el.empty();
    var pos = 0; //position
    _.each(this.model.models, function (item) {
      item.pos = pos; pos++;
      this.$el.append(new app.PlaylistItemView({model:item}).render().el);
    }, this);

    // reload thumbsup
    app.playlists.getThumbsUp();

    // bind others
    $(window).bind('playlistUpdate', this.playlistBinds());
    return this;
  },

  playlistBinds:function(self){

    //sortable
    $sortable = $( "ul.playlist");
    $sortable.sortable({
      placeholder: "playlist-item-placeholder",
      handle: ".playlist-play",
      items: "> li",
      axis: "y",
      update: function( event, ui ) {
        app.playlists.sortableChangePlaylistPosition(event, ui);
      }
    }).disableSelection();

  }

});

app.PlaylistItemView = Backbone.View.extend({

  tagName:"li",

  className: 'playlist-item',

  events: {
    "dblclick .playlist-play": "playPosition",
    "click .removebtn": "removePosition",
    "click .playbtn": "playPosition",
    "click .repeating": "cycleRepeat",
    "click .playlist-song-thumbsup": "thumbsUp",
    //menu
    "click .song-download":  "downloadSong",
    "click .song-custom-playlist": "addToCustomPlaylist"
  },

  initialize:function () {

  },

  render:function () {
    // file fallback
    this.model.id = (typeof this.model.id != 'undefined' ? this.model.id : 'file');
    this.model.albumid = (typeof this.model.albumid != 'undefined' ? this.model.albumid : 'file');
    // render
    this.$el.html(this.template(this.model));

    // if file, add its path
    if(this.model.id == 'file'){
      $('.song', this.$el).data('file', this.model.file);
    }

    // add if thumbs up
    if( this.model.id != 'file' && app.playlists.isThumbsUp('song', this.model.id) ) {
      this.$el.addClass('thumbs-up')
    }

    // set song menu
    var songDropDown = app.helpers.dropdownTemplates('song');

    songDropDown.pull = 'right';
    $('.playlist-song-actions', this.$el).append( app.helpers.makeDropdown( songDropDown ));

    return this;
  },

  playPosition:function(event){

    app.AudioController.playPlaylistPosition(this.model.pos, function(data){
      app.AudioController.playlistRefresh();
    });
  },

  removePosition:function(event){
    var self = this;
    app.AudioController.removePlaylistPosition(this.model.pos, function(data){
      app.AudioController.playlistRefresh();
    });
  },

  cycleRepeat:function(event){
    $('#footer').find('.player-repeat').trigger('click');
  },

  thumbsUp: function(e){
    e.stopPropagation();
    var songid = this.model.id,
      op = (app.playlists.isThumbsUp('song', songid) ? 'remove' : 'add'),
      $el = $(e.target).closest('li');
    app.playlists.setThumbsUp(op, 'song', songid);
    $el.toggleClass('thumbs-up');
  },

  downloadSong: function(e){
    var file = this.model.file;
    e.stopPropagation();
    e.preventDefault();
    app.AudioController.downloadFile(file, function(url){
      window.location = url;
    })
  },

  addToCustomPlaylist: function(e){
    e.stopPropagation();
    e.preventDefault();
    var id = this.model.id;
    app.playlists.saveCustomPlayListsDialog('song', [id]);
  }




});





/**
 * Custom playlists
 */
app.PlaylistCustomListsView = Backbone.View.extend({

  tagName:'ul',
  className:'custom-lists',

  events: {
    "dblclick li": "replacePlaylist",
    "click .name": "toggleDetail"
  },

  initialize:function () {

  },

  render:function () {

    this.$el.empty();
    var pos = 0;

    _.each(this.model.models, function (item) {
      item.pos = pos; pos++;
      var el = new app.PlaylistCustomListItemView({model:item}).render();

      this.$el.append(el.el);
    }, this);

    // Add thumbs up to the top
    this.$el.prepend('<li class="list-item thumbsup-link"><a href="#thumbsup" class="name">Thumbs Up</a></li>');

    return this;
  },

  toggleDetail: function(e){
    var $this = $(e.target),
      $parent = $this.closest('li');

    if($parent.hasClass('open')){
      $parent.removeClass('open');
    } else {
      $parent.parent().find('li').removeClass('open');
      $parent.addClass('open');
    }

  }

});



app.PlaylistCustomListItemView = Backbone.View.extend({

  tagName:"li",

  className: 'list-item',

  events: {
    "dblclick .name": "replacePlaylist"
  },


  initialize:function () {

  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }

});




;/**
 * Search view
 *
 * @type {*|void|Object|extend|extend|extend}
 */


app.searchView = Backbone.View.extend({

  initialize: function () {

  },

  /**
   * Render based on key in the model
   * this is all a bit messy and could be refined
   *
   */
  render:function () {

    var key = this.model.key,
      self = this;

    if(key.length > 1){
      //set url
      document.location.hash = '#search/' + key;

      //set searching
      app.shellView.selectMenuItem('search', 'sidebar');

      //empty content as we append
      var $content = $('#content'),
        $title = $('#title'),
        notfoundartist = '<div class="noresult-box">No Artists found</div>',
        $el = $('<div class="search-results-content"></div>');

      $el.append('<div id="search-albums"></div>')
        .append('<div id="search-songs"></div>')
        .append('<div id="search-addons"></div>');

      $content.empty().html($el);
      $title.html('<a href="#artists">Artists </a>Albums');

      // get artists list (sidebar)
      app.cached.SearchArtistsList = new app.ArtistCollection();
      app.cached.SearchArtistsList.fetch({success: function(data){
        // filter based on string match
        var artists = data.models.filter(function (element) {
          var label = element.attributes.artist;
          return label.toLowerCase().indexOf(key.toLowerCase()) > -1;
        });
        // update model with new collection
        data.models = artists;
        //if result
        if(data.models.length > 0){
          // add the sidebar view
          app.cached.artistsListSearch = new app.AristsListView({model: data, className: 'artist-search-list'});
          app.helpers.setFirstSidebarContent(app.cached.artistsListSearch.render().el);
        } else {
          app.helpers.setFirstSidebarContent(notfoundartist);
        }

      }});


      //get albums
      var $albums = $('#search-albums'),
        loading = '<div class="noresult-box">' + self.getLogo('album') + '<span>Loading Albums</span></div>',
        notfoundalb = '<div class="noresult-box empty">' + self.getLogo('album') + '<span>No Albums found with "'+key+'" in the title<span></div>';

      $albums.html(loading);

      app.cached.SearchAlbumList = new app.AlbumsCollection();
      app.cached.SearchAlbumList.fetch({success: function(data){
        $albums.empty();
        // filter based on string match
        var albums = data.models.filter(function (element) {
          var label = element.attributes.label;
          return label.toLowerCase().indexOf(key.toLowerCase()) > -1;
        });
        // update model with new collection
        data.models = albums;
        //if result
        if(data.models.length > 0){
          // add to content
          app.cached.SearchAlbumListSmall = new app.SmallAlbumsList({model: data, className: 'album-generic-list'});
          $albums.append(app.cached.SearchAlbumListSmall.render().el);
          $albums.prepend('<h3 class="search-heading">' + self.getLogo('album') + 'Album search for:<span>' + key + '</span></h3>');
        } else {
          //no results
          $albums.html(notfoundalb);
        }

      }});


      // get addons
      var $addons = $('#search-addons');
      $addons.empty();
      app.addOns.ready(function(){
        $addons = app.addOns.invokeAll('searchAddons', $addons, key);
      });


      // searrch songs
      self.searchSongs(key);

    }

  },

  // Get a generic logo/icon
  getLogo: function(type){
    return '<img src="theme/images/icons/icon-' + type + '.png" />'
  },


  /**
   * Init searching songs, could be dealing with lots o data
   * @param key
   */
  searchSongs: function(key){

    var $songs = $('#search-songs'),
      self = this;


    // bind to songs ready
    $songs.html('<div class="addon-box">' + self.getLogo('song') + '<span>Loading Songs</span></div>');

    app.store.indexSongs(function(){

      app.cached.SearchsongList = new app.SongCollection();
      app.cached.SearchsongList.fetch({success: function(data){

        console.log('songs loaded', data);
        var songsIds = [];

        $songs.empty();
        // filter based on string match
        var songs = data.models.filter(function (element) {
          var label = element.attributes.label;
          return label.toLowerCase().indexOf(key.toLowerCase()) > -1;
        });

        // get array of ids for multi-load
        _.each(songs, function(song){
          songsIds.push(song.attributes.songid);
        });

        // redefine this
        //var $songs = $('#search-songs');

        // Get a list of fully loaded models from id
        if(songsIds.length > 0){
          app.cached.SearchsongListFiltered = new app.CustomSongCollection();
          app.cached.SearchsongListFiltered.fetch({items: songsIds, success: function(data){

            // heading
            $songs.append('<h3 class="search-heading">' + self.getLogo('song') + 'Songs search for:<span>' + key + '</span></h3>');

            // add to content
            app.cached.SearchsongList = new app.SongListView({model: data.models, className: 'song-search-list song-list'});
            $songs.append(app.cached.SearchsongList.render().el);

          }});
        } else {
          // no res
          $songs.html('<div class="noresult-box empty">' + self.getLogo('song') + '<span>No Songs found</span></div>')
        }


      }});

    });


  }


});;app.ShellView = Backbone.View.extend({

  initialize: function () {

    /**
     * Maybe a more "backbone" way of doing this,
     * but basically want to bind to all page changes and trigger
     * this.pageChange()
     */
    var $window = $(window), $body = $('body'), self = this;

    // keyup timeout
    app.cached.keyupTimeout = 0;

    // init first page change to setup classes, etc.
    self.pageChange(location.hash, '#init');

    $window.bind('hashchange', function() {
      var newHash = location.hash,
          lastHash = app.vars.lastHash,
          back = (typeof lastHash == 'undefined' ? '#' : lastHash);

      // if page change
      if(newHash != back){
        self.pageChange(newHash, back);
      }

      // set last hash
      app.vars.lastHash = newHash;

    });

    /**
     * Fades the header bg when at the top
      */
    $window.bind('scroll', function(e) {
      if( $window.scrollTop() > 50 ){
        $body.addClass('fixed-header');
      } else {
        $body.removeClass('fixed-header');
      }
    });

  },

  render: function () {
    this.$el.html(this.template());
    var self = this;

    //set playlist
    app.AudioController.playlistRefresh(function(result){

    });

    //init the progress bar
    this.$progressSlider = $( "#progress-bar", this.el );

    this.$progressSlider.slider({
      range: "min",
      value: 0,
      min: 0,
      max: 100,
      stop: function( event, ui ) {
        app.AudioController.seek(ui.value);

      }
    });

    //init the volume bar
    this.$volumeSlider = $( "#volume", this.el );
    this.$volumeSlider.slider({
      range: "min",
      value: 0,
      min: 0,
      max: 100,
      stop: function( event, ui ) {
        app.AudioController.setVolume(ui.value);
      }
    });

    // Init player state cycle
    setInterval(app.AudioController.updatePlayerState, 5000);

    // set playlist menu
    $('.playlist-actions-wrapper', this.$el).html(
      app.helpers.makeDropdown( app.helpers.dropdownTemplates('playlistShell') )
    );

    //custom playlists
    app.playlists.addCustomPlayLists(function(view){
      var $sb = $('.alt-sidebar-items', self.$el);
      $sb.html(view.render().el);
    });

    return this;
  },

  events: {
    // search
    "keyup #search": "onkeyupSearch",
    "click #search-this": "search",
    "keypress #search": "onkeypressSearch",
    // misc
    "click #logo": "home",
    // player
    "click .player-prev": "playerPrev",
    "click .player-next": "playerNext",
    "click .player-play": "playerPlay",
    "click .player-mute": "playerMute",
    "click .player-repeat": "playerRepeat",
    "click .player-random": "playerRandom",
    // tabs
    "click .playlist-primary-tab": "primaryTabClick",
    // menu
    "click .save-playlist": "savePlayList",
    "click .clear-playlist": "clearPlaylist",
    "click .refresh-playlist": "refreshPlaylist",
    "click .new-custom-playlist": "newCustomPlaylist",
    // bottom menu
    "click .about-dialog": "about"
  },


  /**
   * Generic page change bind
   * @param event
   */
  pageChange: function(newHash, back){
    var key = app.helpers.arg(0);
    // Remove all classes starting with 'section'
    $("body").removeClass (function (index, css) {
      return (css.match (/\bsection\S+/g) || []).join(' ');
    })
      // Add the current page
      .addClass('section-'+ key);
  },

  /**
   * Playlist tab click
   * @param event
   * @param o
   */
  primaryTabClick:function(event){
    $thisTab = $(event.target);
    // toggle based on tab class
    var view = ($thisTab.hasClass('local-playlist-tab') ? 'local' : 'xbmc');
    app.playlists.changePlaylistView(view);
  },

  /**
   * Search artists, albums & songs
   * @see view/search.js
   * @param event
   */
  search: function (event) {

    var $search = $('#search');
    app.cached.searchView = new app.searchView({model: {'key': $search.val()}});
    app.cached.searchView.render();

  },

  onkeyupSearch: function (event) {

    // before rendering the entire search page we should give the user a chance to type in
    // something significant, in fact each time they press the key we should give them time
    // to press another before render.

    // the time we wait from key up, and this
    var keyDelay = 500, self = this;

    // set and clear timeout to leave a gap
    $('#search').keyup(function () {
      clearTimeout(app.cached.keyupTimeout); // doesn't matter if it's 0
      app.cached.keyupTimeout = setTimeout(function(){
        self.search();
      }, keyDelay);
    });

  },


  onkeypressSearch: function (event) {
    if (event.keyCode === 13) { // enter key pressed
      event.preventDefault();
    }
  },


  /**
   * This acts as layout definer wrapper
   * @param menuItem
   * @param sidebar
   */
  selectMenuItem: function(menuItem, sidebar) {

    var $body = $('body'),
        state = (typeof sidebar != 'undefined' && sidebar == 'sidebar' ? 'open' : 'close');

    //sidebar - reset and add
    app.helpers.toggleSidebar(state);

    // layout changes for different pages
    if(menuItem == 'home'){

      //specific to home
      $body.addClass('home');

    } else {

      // ensure backstretch is gone
      if($('.backstretch').length > 0){
        $.backstretch("destroy", false);
      }
      $body.removeClass('home');

      // specifics for non home pages
      switch (menuItem) {

        case 'playlist':
          // all this to open the sidebar playlist item
          app.playlists.changePlaylistView('local');
          $('ul.custom-lists .custom-playlist-item').each(function(i,d){
            var $d = $(d), $parent = $d.parent();
            if($d.data('id') == app.helpers.arg(1)){
              $parent.addClass('open');
            } else {
              $parent.removeClass('open')
            }
          });
          break;

        case 'thumbsup':
          $('.custom-lists li').removeClass('open');
          $('.thumbsup-link').addClass('open');
          app.playlists.changePlaylistView('local');
          break;
      }
    }



    if (menuItem) {
      // Toggle the actual menu class based on menuItem
      var $nav = $('.mainnav', this.el),
        $active = $nav.find('li.nav-' + menuItem);
      $nav.find('li').removeClass('active');
      $active.addClass('active');
    }


  },


  //player commands
  playerPrev:function(){
    app.AudioController.sendPlayerCommand('Player.GoTo', 'previous');
  },
  playerNext:function(){
    app.AudioController.sendPlayerCommand('Player.GoTo', 'next');
  },
  playerPlay:function(){
    app.AudioController.sendPlayerCommand('Player.PlayPause', 'toggle');
  },
  playerRepeat:function(){
    app.AudioController.sendPlayerCommand('Player.SetRepeat', 'cycle');
  },
  playerRandom:function(){
    app.AudioController.sendPlayerCommand('Player.SetShuffle', 'toggle');
  },



  //mute
  playerMute:function(){
    //get current vol
    var cur = this.$volumeSlider.slider( "value"), $body = $('body');
    if(cur > 0){
      //store current vol then set to 0
      this.lastVol = cur;
      app.AudioController.setVolume(0);
      this.$volumeSlider.slider( "value",0 );
      $body.addClass('muted');
    } else {
      //if last vol
      if(app.helpers.exists(this.lastVol) && this.lastVol > 0){
        var lastvol = this.lastVol; //set back to last value
      } else {
        var lastvol = 50; //default last vol to 50%
      }
      //set lastvol
      app.AudioController.setVolume(lastvol);
      this.$volumeSlider.slider( "value",lastvol );
      $body.removeClass('muted');
    }
  },


  // update the playing state
  updateState:function(data){

    app.cached.playerState = new app.playerStateView({model: data});
    app.cached.playerState.render();

  },



  /**
   * Save a playlist
   * @param e
   */
  savePlayList: function(e){
    e.preventDefault();
    // Save playlist
    app.playlists.saveCustomPlayListsDialog();
    app.playlists.changePlaylistView('local');
  },

  /**
   * refresh playlist
   */
  refreshPlaylist: function(e){
    e.preventDefault();
    app.AudioController.playlistRefresh();
  },


  /**
   * New Custom playlist
   */
  newCustomPlaylist: function(e){
    e.preventDefault();
    app.playlists.saveCustomPlayListsDialog('song', []);
  },


  /**
   *  Clear a playlist
   */
  clearPlaylist: function(e){
    e.preventDefault();
    // Clear playlist
    app.AudioController.playlistClear(function(data){
      app.AudioController.playlistRefresh();
    });
  },


  /**
   *  About
   */
  about: function(e){
    e.preventDefault();
    app.helpers.aboutDialog();
  }




});;app.SongListView = Backbone.View.extend({

  tagName:'ul',

  className:'song-list',

  initialize:function () {

  },

  render:function () {
    this.$el.empty();
    _.each(this.model, function (song) {
      this.$el.append(new app.SongView({model:song}).render().el);
    }, this);
    return this;
  }

});

app.SongView = Backbone.View.extend({

  tagName:"li",

  className:'song-row',

  events: {
    "dblclick .song-title": "playSong",
    "click .song-play": "playSong",
    "click .song-add": "addSong",
    "click .song-thumbsup": "thumbsUp",
    //menu
    "click .song-download":  "downloadSong",
    "click .song-custom-playlist": "addToCustomPlaylist"
  },

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    // add if thumbs up
    if( app.playlists.isThumbsUp(this.model.attributes.songid) ) {
      this.$el.addClass('thumbs-up')
    }
    // render
    this.$el.html(this.template(this.model.attributes));

    // set song menu
    $('.song-actions', this.$el).append( app.helpers.makeDropdown( app.helpers.dropdownTemplates('song')  ));

    return this;
  },

  /**
   * Inserts into next pos on playlist then plays
   * @param event
   */
  playSong: function(event){
    var song = this.model.attributes;
    app.playlists.changePlaylistView('xbmc');
    app.AudioController.insertAndPlaySong('songid', song.songid, function(){
      app.notification(song.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });
  },

  addSong: function(){
    var song = this.model.attributes;
    app.AudioController.playlistAdd( 'songid', song.songid, function(result){
      app.notification(song.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });
  },

  /**
   * Toggle thumbs up status
   */
  thumbsUp: function(e){
    var songid = this.model.attributes.songid,
      op = (app.playlists.isThumbsUp('song', songid) ? 'remove' : 'add'),
      $el = $(e.target).closest('li');
    app.playlists.setThumbsUp(op, 'song', songid);
    $el.toggleClass('thumbs-up');
  },

  downloadSong: function(e){
    var file = this.model.attributes.file;

    e.preventDefault();
    app.AudioController.downloadFile(file, function(url){
      window.location = url;
    })
  },

  addToCustomPlaylist: function(e){
    e.preventDefault();
    var id = this.model.attributes.songid;
    app.playlists.saveCustomPlayListsDialog('song', [id]);
  }

});;

app.XbmcView = Backbone.View.extend({

  tagName:'div',

  className:'xbmc-page',



  initialize:function () {

  },


  render:function () {

    console.log(this.model);

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

    for(p in pages){
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
      app.helpers.setTitle('<a href="#xbmc/home">XBMC</a>Chorus ChangeLog');
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
    app.helpers.setTitle('<a href="#xbmc/home">XBMC</a>jsonRPC');

    this.$el.empty();

    var tpl =
      '<h3>JSONrpc tester</h3>' +
        '<p class="alert alert-warning">Use this to test out commands on the api, be careful - you could break something</p>' +
        '<div id="execute">' +
        '<strong>Method:</strong> <select id="method"><option>Loading...</option></select> ' +
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


      for(m in data.result.methods){
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

    for(p in methodObj.params){
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
        (param.type != '' ? JSON.stringify(param.type, null, 2) : '');


      // The element used
      // have options, make a select
      if(typeof param.type.enums != 'undefined' && param.type.enums.length > 0){
        $el = $('<select>');
        for(m in param.type.enums){
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
    $div = $('<div />')
      .addClass('param actions')
      .append('<button class="btn" id="doit">Execute</button>');
    this.$params.append($div);


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
    return (!$el.hasClass('select') && text != '' && (typeof param.type == 'object' || param.type == 'array'));
  }
});