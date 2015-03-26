module Noise.PureNoise where

{- An attempt to implement Perlin Noise in pure Elm -}

import Array (Array)
import Array
import Bitwise (shiftLeft, shiftRight, and)
import Random
import Maybe


-- Constants
perlin_ywrapb = 4
perlin_ywrap  = 1 `shiftLeft` perlin_ywrapb
perlin_zwrapb = 8
perlin_zwrap  = 1 `shiftLeft` perlin_zwrapb
--perlin_size   = 4095
perlin_size   = 2047

-- Constants we may want to make configurable later

perlin_octaves = 4       -- default to medium smooth
perlin_amp_falloff = 0.5 -- 50% reduction/octave

-- cos lookup table
deg_to_rad       = 0.0174532925
sincos_precision = 0.5
sincos_length    = floor (360/sincos_precision)
perlin_TWOPI     = sincos_length
perlin_PI        = sincos_length `shiftRight` 1

cosLUT: Array Float
cosLUT =
  Array.initialize
    sincos_length
    (\n -> cos ((toFloat n) * deg_to_rad * sincos_precision))


noise_fsc: Float -> Float
noise_fsc i =
  0.5 * (1.0 -
      (Array.get
        ((floor (i * (toFloat perlin_PI))) % perlin_TWOPI)
        cosLUT
      |> Maybe.withDefault 0
      )
    )


perlin_array: Float -> Array Float
perlin_array seed =
  Array.fromList
    (Random.generate
      (Random.list (perlin_size + 1) (Random.float 0 1))
      (Random.initialSeed (floor seed))
    |> fst
    )

get: Int -> Array Float -> Float
get i arr =
  Array.get i arr
    |> Maybe.withDefault 0


{-| dear lord this was not a good idea -}

noise: Int -> Array Float -> Int -> Int -> Int -> Float -> Float -> Float -> Float -> Float -> Float
noise octave parr xi yi zi xf yf zf r ampl =
  if | (octave == perlin_octaves) -> r
     | otherwise ->
        let of_0 = xi + (yi `shiftLeft` perlin_ywrapb) + (zi `shiftLeft` perlin_zwrapb)
            rxf = noise_fsc xf
            ryf = noise_fsc yf
            n1_0 = get (of_0 `and` perlin_size) parr
            n1_1 = n1_0 + (rxf * ((get ((of_0 + 1) `and` perlin_size) parr) - n1_0))
            n2_0 = get ((of_0 + perlin_ywrap) `and` perlin_size) parr
            n2_1 = n2_0 + (rxf * ((get ((of_0 + perlin_ywrap + 1) `and` perlin_size) parr) - n2_0))
            n1_2 = n1_1 + (ryf * (n2_1-n1_1))
            of_1 = of_0 + perlin_zwrap
            n2_2 = get (of_1 `and` perlin_size) parr
            n2_3 = n2_2 + (rxf * ((get ((of_1 + 1) `and` perlin_size) parr) - n2_2))
            n3_0 = get ((of_1 + perlin_ywrap) `and` perlin_size) parr
            n3_1 = n3_0 + (rxf * ((get ((of_1 + perlin_ywrap + 1) `and` perlin_size) parr) - n3_0))
            n2_4 = n2_3 + (ryf * (n3_1 - n2_3))
            n1_3 = n1_2 + ((noise_fsc zf) * (n2_4 - n1_2))

            r' = n1_3 * ampl
            ampl' = ampl * perlin_amp_falloff
            xi' = xi `shiftLeft` 1
            xf' = xf * 2
            yi' = yi `shiftLeft` 1
            yf' = yf * 2
            zi' = zi `shiftLeft` 1
            zf' = zf * 2

            xi'' = if (xf' >= 1) then xi' + 1 else xi'
            xf'' = if (xf' >= 1) then xf' - 1 else xf'

            yi'' = if (yf' >= 1) then yi' + 1 else yi'
            yf'' = if (yf' >= 1) then yf' - 1 else yf'

            zi'' = if (zf' >= 1) then zi' + 1 else zi'
            zf'' = if (zf' >= 1) then zf' - 1 else zf'

        in r + (noise (octave+1) parr xi'' yi'' zi'' xf'' yf'' zf'' r' ampl')



perlin3: Float -> Float -> Float -> Float -> Float
perlin3 seed x y z =
  let octave = 0
      parr = perlin_array seed
      xi = floor x
      yi = floor y
      zi = floor z
      xf = x - (toFloat xi)
      yf = y - (toFloat yi)
      zf = z - (toFloat zi)
      r = 0
      ampl = 0.5

  in noise octave parr xi yi zi xf yf zf r ampl



perlin: Float -> Float -> Float
perlin seed x = perlin3 seed x 0 0

perlin2: Float -> Float -> Float -> Float
perlin2 seed x y = perlin3 seed x y 0
