#include <Arduino.h>
#include <Reactduino.h>
#include "Buttons.h"
#include "Glue.h"
#include "LedChain.h"
#include "LedStrip.h"
#include "TheirFood.h"
#include "YourFood.h"

Reactduino app([] {
  Serial.begin(9600);
  randomSeed(analogRead(0));
  Buttons::setup();
  LedChain::setup();
  LedStrip::setup();
  YourFood::setup();
  TheirFood::setup();

  app.onTick([] {
    Glue::tick();
    TheirFood::tick();
    YourFood::tick();
  });
});
