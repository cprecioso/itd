import App

main : Program Never App.Model App.Msg
main =
    Platform.program
        { init = App.init
        , update = App.update
        , subscriptions = App.subscriptions
        }
