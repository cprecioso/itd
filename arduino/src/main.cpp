#include <Arduino.h>
#include <Reactduino.h>
#include <CmdMessenger.h>

#include "Commands.h"
#include "LedChain.h"
#include "Printer.h"
#include "ColorSensor.h"

static CmdMessenger messenger(Serial);

void onUnknownCommand() { messenger.sendCmd(kStatus, F("Unknown command")); }

Reactduino app([] {
  Serial.begin(115200);
  messenger.attach(onUnknownCommand);
  app.onTick([] { messenger.feedinSerialData(); });

#pragma region LedChain
  LedChain::setup();

  messenger.attach(kLedChain, [] {
    const byte n = messenger.readInt16Arg();
    const byte r = messenger.readInt16Arg();
    const byte g = messenger.readInt16Arg();
    const byte b = messenger.readInt16Arg();
    LedChain::changeLed(n, r, g, b);
  });

  messenger.attach(kLedChainAll, [] {
    const byte r = messenger.readInt16Arg();
    const byte g = messenger.readInt16Arg();
    const byte b = messenger.readInt16Arg();
    LedChain::changeLedAll(r, g, b);
  });

  app.repeat(16, [] {
    LedChain::frame();
  });
#pragma endregion LedChain

#pragma region Printer
  Printer::setup();

  messenger.attach(kPrintReceipt, [] {
    const char *today = messenger.readStringArg();
    const byte n = messenger.readInt16Arg();
    Printer::printReceipt(today, n);
    messenger.sendCmd(kPrintDone);
  });
#pragma endregion Printer

#pragma region ColorSensor
  ColorSensor::setup();

  app.repeat(20, [] {
    ColorSensor::read();
  });
#pragma endregion ColorSensor

  messenger.sendCmd(kReady);
});
