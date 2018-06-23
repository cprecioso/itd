module Stage exposing (..)

import Time exposing (second)
import Util.Duration exposing (Duration, infinite)

type Stage
  = Idle
  | Semaphore
  | Game
  | Processing
  | Finished

initialStage : Stage
initialStage =
  Idle

duration : Stage -> Duration
duration stage =
  case stage of
    Idle -> infinite
    Semaphore -> 5 * second
    Game -> 30 * second
    Processing -> infinite
    Finished -> 5 * second

next : Stage -> Stage
next currentStage =
  case currentStage of
    Idle -> Semaphore
    Semaphore -> Game
    Game -> Processing
    Processing -> Finished
    Finished -> Idle
