module VisualTest where

import Noise.ProcNoise
import Noise.PureNoise
import Noise.PureNoise (NoiseGenerator)


import Signal
import List
import Graphics.Element (Element, empty)
import Graphics.Collage (..)
import Color
import Window
import Mouse
import Time
import Debug


(w,h) = (256, 256)
seed = 55


toCartesian : (Float, Float) -> (Float, Float)
toCartesian (x, y) =
  (x - (w/2), y - (h/2))


pixelColor : (Float, Float) -> NoiseGenerator (Float, Float) -> Color.Color
pixelColor (x, y) noiseGenerator =
  --Color.grayscale (Noise.PureNoise.perlin2 seed (x/w) (y/h))
  Color.grayscale
    ( Noise.PureNoise.generate noiseGenerator (x/w, y/h) )


drawPixel : (Float, Float) -> Color.Color -> Form
drawPixel (x, y) color =
  rect 1 1
    |> filled color
    |> move (toCartesian (x, y))


texture : Element
texture =
  let noiseGen = (Noise.PureNoise.dim2 seed)
  in List.concatMap
    (\x ->
      List.map
        (\y -> drawPixel (x, y) (pixelColor (x, y) noiseGen))
        [0..(h-1)]
    )
    [0..(w-1)]
  |> collage w h


main : Element
main = texture
