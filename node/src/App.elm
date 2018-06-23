module App exposing (..)

import Components.Game as Game
import Return

type alias Model =
  { game : Game.Model
  }

type Msg =
  GameMsg Game.Msg

init : (Model, Cmd Msg)
init =
  Game.init
  |> Return.mapBoth GameMsg (\game -> {game = game})

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    GameMsg childMsg ->
      Game.update childMsg model.game
      |> Return.mapBoth GameMsg (\game -> {model | game = game})

subscriptions : Model -> Sub Msg
subscriptions model =
    Game.subscriptions model.game
    |> Sub.map GameMsg
