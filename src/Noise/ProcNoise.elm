module Noise.ProcNoise where
import Native.Noise.ProcNoise

{-| Lorem Ipsum
Lorem Ipsum

# Noise Generation Functions
@docs perlin, perlin2, perlin3
-}

{-| Generate 1-Dimensional Perlin noise.

    perlin 0 0
-}
perlin: Float -> Float -> Float
perlin = Native.Noise.ProcNoise.perlin

perlin2: Float -> Float -> Float -> Float
perlin2 = Native.Noise.ProcNoise.perlin2

perlin3: Float -> Float -> Float -> Float -> Float
perlin3 = Native.Noise.ProcNoise.perlin3
