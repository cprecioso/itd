module Components.Game exposing (Model, Msg, init, update, subscriptions)

import Time exposing (Time, second)
import Task
import Stage exposing (Stage)
import Util.Duration as Duration exposing (Duration)
import Util.Time

type alias Model =
  { stage : Stage
  , endTime : Time
  }

type Msg
  = Tick Time
  | NextStage
  | EnterStage Stage
  | SetStage Stage Time

init : (Model, Cmd Msg)
init =
  update
    (EnterStage Stage.initialStage)
    { stage = Stage.initialStage
    , endTime = Util.Time.farFuture
    }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Tick currentTime ->
      if model.endTime >= currentTime
      then update NextStage model
      else (model, Cmd.none)

    NextStage ->
        Stage.next model.stage
        |> EnterStage
        |> (flip update) model

    EnterStage stage ->
      ( model
      , Time.now
        |> Task.perform (SetStage stage)
      )

    SetStage stage time ->
      ( { model
        | stage = stage
        , endTime = Duration.endTime time (Stage.duration stage)
        }
      , Cmd.none
      )

subscriptions : Model -> Sub Msg
subscriptions model =
  let
    seconds =
      Time.every second Tick
  in
    case model.stage of
      Stage.Idle -> Sub.none
      Stage.Semaphore -> seconds
      Stage.Game -> seconds
      Stage.Processing -> seconds
      Stage.Finished -> seconds
