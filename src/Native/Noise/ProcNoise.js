(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// PERLIN NOISE
// based 99.999% on Processing's implementation, found here:
// https://github.com/processing/processing/blob/master/core/src/processing/core/PApplet.java
// credit goes entirely to them. i just ported it to javascript.

var Alea = require("alea"); // this is pretty great, btw

var Perlin = module.exports = function(seed) {
	if (seed != undefined) {
		this.alea_rand = new Alea(seed); // use provided seed
	} else {
		this.alea_rand = new Alea(); // use random seed
	}
	this.PERLIN_YWRAPB = 4;
	this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
	this.PERLIN_ZWRAPB = 8;
	this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
	this.PERLIN_SIZE = 4095;
	this.perlin_octaves = 4; // default to medium smooth
	this.perlin_amp_falloff = 0.5; // 50% reduction/octave
	this.perlin_array = new Array();
	// generate cos lookup table
	var DEG_TO_RAD = 0.0174532925;
	var SINCOS_PRECISION = 0.5;
	var SINCOS_LENGTH = Math.floor(360/SINCOS_PRECISION);
	this.cosLUT = new Array();
	for (var i = 0; i < SINCOS_LENGTH; i++) {
		this.cosLUT[i] = Math.cos(i * DEG_TO_RAD * SINCOS_PRECISION);
	}
	this.perlin_TWOPI = SINCOS_LENGTH;
	this.perlin_PI = SINCOS_LENGTH;
	this.perlin_PI >>= 1;
}

Perlin.prototype.noiseReseed = function() {
	this.alea_rand = new Alea(); // new random seed
	this.perlin_array = new Array(); // start the perlin array fresh
}

Perlin.prototype.noiseSeed = function(seed) {
	this.alea_rand = new Alea(seed); // use provided seed
	this.perlin_array = new Array(); // start the perlin array fresh
}


Perlin.prototype.noiseDetail = function(lod, falloff) {
	if (Math.floor(lod) > 0) this.perlin_octaves = Math.floor(lod);
	if (falloff != undefined && falloff > 0) this.perlin_amp_falloff = falloff;
}

Perlin.prototype.noise_fsc = function(i) {
	return 0.5 * (1.0 - this.cosLUT[Math.floor(i * this.perlin_PI) % this.perlin_TWOPI]);
}

Perlin.prototype.noise = function(x, y, z) {
	if (x == undefined) {
		return false; // we need at least one param
	}
	if (y == undefined) {
		y = 0; // use 0 if not provided
	}
	if (z == undefined) {
		z = 0; // use 0 if not provided
	}
	
	// build the first perlin array if there isn't one
	if (this.perlin_array.length == 0) {
		this.perlin_array = new Array();
		for (var i = 0; i < this.PERLIN_SIZE + 1; i++) {
			this.perlin_array[i] = this.alea_rand();
		}
	}

	if (x < 0) x = -x;
	if (y < 0) y = -y;
	if (z < 0) z = -z;
	var xi = Math.floor(x);
	var yi = Math.floor(y);
	var zi = Math.floor(z);
	var xf = x - xi;
	var yf = y - yi;
	var zf = z - zi;
	var r = 0;
	var ampl = 0.5;
	var rxf, ryf, n1, n2, n3;
	
	for (var i = 0; i < this.perlin_octaves; i++) {
		// look at all this math stuff
		var of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);
		rxf = this.noise_fsc(xf);
		ryf = this.noise_fsc(yf);
		n1  = this.perlin_array[of & this.PERLIN_SIZE];
		n1 += rxf * (this.perlin_array[(of + 1) & this.PERLIN_SIZE] - n1);
		n2  = this.perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
		n2 += rxf * (this.perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
		n1 += ryf * (n2-n1);
		of += this.PERLIN_ZWRAP;
		n2  = this.perlin_array[of & this.PERLIN_SIZE];
		n2 += rxf * (this.perlin_array[(of + 1) & this.PERLIN_SIZE] - n2);
		n3  = this.perlin_array[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
		n3 += rxf * (this.perlin_array[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
		n2 += ryf * (n3 - n2);
		n1 += this.noise_fsc(zf) * (n2 - n1);
		r += n1 * ampl;
		ampl *= this.perlin_amp_falloff;
		xi <<= 1;
		xf *= 2;
		yi <<= 1;
		yf *= 2;
		zi <<= 1; 
		zf *= 2;
		if (xf >= 1) { xi++; xf--; }
		if (yf >= 1) { yi++; yf--; }
		if (zf >= 1) { zi++; zf--; }
	}
	return r;
}

},{"alea":2}],2:[function(require,module,exports){
(function (root, factory) {
  if (typeof exports === 'object') {
      module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
      define(factory);
  } else {
      root.Alea = factory();
  }
}(this, function () {

  'use strict';

  // From http://baagoe.com/en/RandomMusings/javascript/

  // importState to sync generator states
  Alea.importState = function(i){
    var random = new Alea();
    random.importState(i);
    return random;
  };

  return Alea;

  function Alea() {
    return (function(args) {
      // Johannes Baagøe <baagoe@baagoe.com>, 2010
      var s0 = 0;
      var s1 = 0;
      var s2 = 0;
      var c = 1;

      if (args.length == 0) {
        args = [+new Date];
      }
      var mash = Mash();
      s0 = mash(' ');
      s1 = mash(' ');
      s2 = mash(' ');

      for (var i = 0; i < args.length; i++) {
        s0 -= mash(args[i]);
        if (s0 < 0) {
          s0 += 1;
        }
        s1 -= mash(args[i]);
        if (s1 < 0) {
          s1 += 1;
        }
        s2 -= mash(args[i]);
        if (s2 < 0) {
          s2 += 1;
        }
      }
      mash = null;

      var random = function() {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = t | 0);
      };
      random.uint32 = function() {
        return random() * 0x100000000; // 2^32
      };
      random.fract53 = function() {
        return random() + 
          (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
      };
      random.version = 'Alea 0.9';
      random.args = args;

      // my own additions to sync state between two generators
      random.exportState = function(){
        return [s0, s1, s2, c];
      };
      random.importState = function(i){
        s0 = +i[0] || 0;
        s1 = +i[1] || 0;
        s2 = +i[2] || 0;
        c = +i[3] || 0;
      };
 
      return random;

    } (Array.prototype.slice.call(arguments)));
  }

  function Mash() {
    var n = 0xefc8249d;

    var mash = function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
  }
}));

},{}],3:[function(require,module,exports){

var PerlinGenerator = require('proc-noise');

Elm.Native.Noise = Elm.Native.Noise || {};
Elm.Native.Noise.ProcNoise = {};
Elm.Native.Noise.ProcNoise.make = function(elm) {
  elm.Native = elm.Native || {};
  elm.Native.Noise = elm.Native.Noise || {};
  elm.Native.Noise.ProcNoise = elm.Native.Noise.ProcNoise || {};
  if (elm.Native.Noise.ProcNoise.values) {
    return elm.Native.Noise.ProcNoise.values;
  }


  function generator (seed) {
    return new PerlinGenerator(seed);
  }

  function perlin (seed, x) {
    return generator(seed).noise(x);
  }

  function perlin2 (seed, x, y) {
    return generator(seed).noise(x, y);
  }

  function perlin3 (seed, x, y, z) {
    return generator(seed).noise(x, y, z);
  }

  Elm.Native.Noise.ProcNoise.values = {
    perlin: F2(perlin),
    perlin2: F3(perlin2),
    perlin3: F4(perlin3)
  };
  return Elm.Native.Noise.ProcNoise.values;
};

},{"proc-noise":1}]},{},[3]);
