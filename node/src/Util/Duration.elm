module Util.Duration exposing (..)

import Time exposing (Time)
import Util.Time as Util

type alias Duration =
  Time


infinite : Duration
infinite =
  Util.farFuture


endTime : Time -> Duration -> Time
endTime base duration =
  base + duration
