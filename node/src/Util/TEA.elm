module Util.TEA exposing (..)

import Task

send : msg -> Cmd msg
send =
  Task.succeed
  >> Task.perform identity
