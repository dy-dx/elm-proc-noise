
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
