#include <Arduino.h>
#include <Reactduino.h>
#include <CmdMessenger.h>

#include "LedChain.h"
#include "Printer.h"
#include "Magnet.h"

enum Commands
{
  kAck,
  kStatus,
  kReady,
  kLedChain,
  kLedChainAll,
  kPrintReceipt,
  kPrintDone,
  kMagnet
};

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

#pragma region Magnet
  Magnet::setup();

  app.repeat(10, [] {
    Magnet::read();
    messenger.sendCmd(kMagnet, Magnet::read());
  });
#pragma endregion Magnet

  messenger.sendCmd(kReady);
});
