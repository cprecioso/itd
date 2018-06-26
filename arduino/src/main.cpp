#include <Arduino.h>
#include <Reactduino.h>
#include <CmdMessenger.h>

#include "Commands.h"
#include "ColorIndicator.h"

static CmdMessenger messenger(Serial);

void onUnknownCommand() { messenger.sendCmd(kStatus, F("Unknown command")); }

Reactduino app([] {
  Serial.begin(115200);
  messenger.attach(onUnknownCommand);
  app.onTick([] { messenger.feedinSerialData(); });

  ColorIndicator::setup();
  messenger.attach(kColorIndicatorSet, [] {
    byte chainNumber = messenger.readInt16Arg();
    byte ledNumber = messenger.readInt16Arg();
    ColorIndicator::set(chainNumber, ledNumber);
  });

  messenger.sendCmd(kReady);
});
