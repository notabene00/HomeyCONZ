module.exports.util = {}

module.exports.util.round = function (value, exp) {
    if (typeof exp === 'undefined' || +exp === 0)
      return Math.round(value);
  
    value = +value;
    exp = +exp;
  
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
      return NaN;
  
    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
  
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

module.exports.util.rgbToXy = function (r, g, b) {
  var X = .412453 * r + .35758 * g + .180423 * b
    , Y = .212671 * r + .71516 * g + .072169 * b
    , Z = .019334 * r + .119193 * g + .950227 * b;
  return [X / (X + Y + Z), Y / (X + Y + Z)]
}

module.exports.util.rgbToXy2 = function (rgb) {
  var viv = rgb.map(x=>x > .04045 ? Math.pow((x + .055) / 1.055, 2.4) : x / 12.92);
  let red = viv[0]
    , green = viv[1]
    , blue = viv[2]
    , X = .649926 * red + .103455 * green + .197109 * blue
    , Y = .234327 * red + .743075 * green + .022598 * blue
    , Z = 0 * red + .053077 * green + 1.035763 * blue;
  return [X / (X + Y + Z), Y / (X + Y + Z)]
}

module.exports.util.HSVtoRGB = function (h, s, v) {
  var r, g, b, i, f, p, q, t;
  switch (p = v * (1 - s),
  q = v * (1 - (f = 6 * h - (i = Math.floor(6 * h))) * s),
  t = v * (1 - (1 - f) * s),
  i % 6) {
  case 0:
      r = v,
      g = t,
      b = p;
      break;
  case 1:
      r = q,
      g = v,
      b = p;
      break;
  case 2:
      r = p,
      g = v,
      b = t;
      break;
  case 3:
      r = p,
      g = q,
      b = v;
      break;
  case 4:
      r = t,
      g = p,
      b = v;
      break;
  case 5:
      r = v,
      g = p,
      b = q
  }
  return [r, g, b]
}

module.exports.util.hueToHex = function (hue) {
  var rgb = {}
    , h = hue
    , t1 = 255
    , t3 = h % 60 * 255 / 60;
  360 == h && (h = 0),
  h < 60 ? (rgb.r = t1,
  rgb.b = 0,
  rgb.g = 0 + t3) : h < 120 ? (rgb.g = t1,
  rgb.b = 0,
  rgb.r = t1 - t3) : h < 180 ? (rgb.g = t1,
  rgb.r = 0,
  rgb.b = 0 + t3) : h < 240 ? (rgb.b = t1,
  rgb.r = 0,
  rgb.g = t1 - t3) : h < 300 ? (rgb.b = t1,
  rgb.g = 0,
  rgb.r = 0 + t3) : h < 360 ? (rgb.r = t1,
  rgb.g = 0,
  rgb.b = t1 - t3) : (rgb.r = 0,
  rgb.g = 0,
  rgb.b = 0);
  var r = parseInt(rgb.r).toString(16)
    , rr = 2 == r.length ? r : "0" + r
    , g = parseInt(rgb.g).toString(16)
    , gg = 2 == g.length ? g : "0" + g
    , b = parseInt(rgb.b).toString(16);
  return rr + gg + (2 == b.length ? b : "0" + b)
}

module.exports.util.mapHueTo360 = function (hue) {
  return Math.floor(360 / 65535 * hue)
}

module.exports.util.mapHueFrom360 = function (hue) {
  return Math.floor(hue / 360 * 65535)
}

module.exports.util.xyToHs = function (x, y, bri) {
      var z = 1 - x - y
        , X = (bri,
      0 === y ? 0 : 1 / y * x)
        , Z = 0 === y ? 0 : 1 / y * z
        , r = 3.2406 * X - 1.5372 - .4986 * Z
        , g = .9689 * -X + 1.8758 + .0415 * Z
        , b = .0557 * X - .204 + 1.057 * Z;
      r > b && r > g && r > 1 ? (g /= r,
      b /= r,
      r = 1) : g > b && g > r && g > 1 ? (r /= g,
      b /= g,
      g = 1) : b > r && b > g && b > 1 && (r /= b,
      g /= b,
      b = 1),
      r = r <= .0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055,
      g = g <= .0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1 / 2.4) - .055,
      b = b <= .0031308 ? 12.92 * b : 1.055 * Math.pow(b, 1 / 2.4) - .055,
      r < 0 && (r = 0),
      g < 0 && (g = 0),
      b < 0 && (b = 0);
      var hsv = module.exports.util.rgb2hsv(String(255 * r), String(255 * g), String(255 * b));
      return { hue: hsv[0] / 360 * 65535, sat: 255 * hsv[1] }
}

module.exports.util.rgb2hsv = function (r, g, b) {
  r = parseInt(("" + r).replace(/\s/g, ""), 10),
  g = parseInt(("" + g).replace(/\s/g, ""), 10),
  b = parseInt(("" + b).replace(/\s/g, ""), 10);
  if (!(null == r || null == g || null == b || isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255)) {
      r /= 255,
      g /= 255,
      b /= 255;
      var minRGB = Math.min(r, Math.min(g, b))
        , maxRGB = Math.max(r, Math.max(g, b));
      return minRGB == maxRGB ? [0, 0, minRGB] : [60 * ((r == minRGB ? 3 : b == minRGB ? 1 : 5) - (r == minRGB ? g - b : b == minRGB ? r - g : b - r) / (maxRGB - minRGB)), (maxRGB - minRGB) / maxRGB, maxRGB]
  }
}
