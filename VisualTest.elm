module VisualTest where

import Noise.ProcNoise
import Noise.PureNoise


import Signal
import List
import Graphics.Element (Element, empty)
import Graphics.Collage (..)
import Color
import Window
import Mouse
import Time
import Debug


--(w,h) = (256, 256)
(w,h) = (64, 64)
seed = 0.0


toCartesian : (Float, Float) -> (Float, Float)
toCartesian (x, y) =
  (x - (w/2), y - (h/2))


pixelColor : (Float, Float) -> Color.Color
pixelColor (x, y) =
  --Color.grayscale (Noise.ProcNoise.perlin2 seed (x/w) (y/h))
  Color.grayscale (Noise.PureNoise.perlin2 seed (x/w) (y/h))


drawPixel : (Float, Float) -> Form
drawPixel (x, y) =
  rect 1 1
    |> filled (pixelColor (x, y))
    |> move (toCartesian (x, y))


texture : Element
texture =
  List.concatMap
    (\x ->
      List.map
        (\y -> drawPixel (x, y))
        [0..(h-1)]
    )
    [0..(w-1)]
  |> collage w h


main : Element
main = texture
