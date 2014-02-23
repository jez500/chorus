/**
 * https://github.com/jakiestfu/iTunes-Colors
 */

var Colors = (function() {
  function euclidean(p1, p2) {
    var s = 0,
      i;
    for (i = 0, l = p1.length; i < l; i++) {
      s += Math.pow(p1[i] - p2[i], 2);
    }
    return Math.sqrt(s);
  }

  function calculateCenter(points, n) {
    var vals = [],
      plen = 0,
      i, j;
    for (i = 0; i < n; i++) {
      vals.push(0);
    }
    for (i = 0, l = points.length; i < l; i++) {
      plen++;
      for (j = 0; j < n; j++) {
        vals[j] += points[i][j];
      }
    }
    for (i = 0; i < n; i++) {
      vals[i] = vals[i] / plen;
    }
    return vals;
  }

  function kmeans(points, k, min_diff) {
    plen = points.length;
    clusters = [];
    seen = [];
    while (clusters.length < k) {
      idx = parseInt(Math.random() * plen);
      found = false;
      for (var i = 0; i < seen.length; i++) {
        if (idx === seen[i]) {
          found = true;
          break;
        }
      }
      if (!found) {
        seen.push(idx);
        clusters.push([points[idx], [points[idx]]]);
      }
    }

    while (true) {
      plists = [];
      for (var i = 0; i < k; i++) {
        plists.push([]);
      }

      for (var j = 0; j < plen; j++) {
        var p = points[j],
          smallest_distance = 10000000,
          idx = 0;
        for (var i = 0; i < k; i++) {
          var distance = euclidean(p, clusters[i][0]);
          if (distance < smallest_distance) {
            smallest_distance = distance;
            idx = i;
          }
        }
        plists[idx].push(p);
      }

      var diff = 0;
      for (var i = 0; i < k; i++) {
        var old = clusters[i],
          list = plists[i],
          center = calculateCenter(plists[i], 3),
          new_cluster = [center, (plists[i])],
          dist = euclidean(old[0], center);
        clusters[i] = new_cluster
        diff = diff > dist ? diff : dist;
      }
      if (diff < min_diff) {
        break;
      }
    }
    return clusters;
  }


  function rgbToHex(rgb) {
    function th(i) {
      var h = parseInt(i).toString(16);
      return h.length == 1 ? '0' + h : h;
    }
    return '#' + th(rgb[0]) + th(rgb[1]) + th(rgb[2]);
  }

  function process_image(img, ctx) {
    var points = [];
    ctx.drawImage(img, 0, 0, 200, 200);
    data = ctx.getImageData(0, 0, 200, 200).data;
    for (var i = 0, l = data.length; i < l; i += 4) {
      var r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      points.push([r, g, b]);
    }
    var results = kmeans(points, 3, 1),
      hex = [];
    for (var i = 0; i < results.length; i++) {
      hex.push(rgbToHex(results[i][0]));
    }
    return hex;
  }

  function analyze(img_elem, returnFunc) {
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      img = new Image();
    img.onload = function() {
      var colors = process_image(img, ctx);

      $.when( colors ).done(function(){
        img = null;
        returnFunc(colors);
      });
    }
    img.src = img_elem.src;
  }

  return {
    analyze: analyze
  };
})();