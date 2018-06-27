#include <Arduino.h>
#include <Reactduino.h>

#include "Commands.h"
#include "SerialCommand.h"
#include "Printer.h"
#include "ColorSensor.h"
#include "LedChain.h"
#include "Button.h"
#include "Display.h"

void dispatchCommands()
{
  if (Serial.available() > 0)
  {
    switch ((Command)SerialCommand::read_u8())
    {
    case kPrintStart:
    {
      const byte n = SerialCommand::read_u8();
      Printer::printReceipt(n);
      SerialCommand::write_u8(kPrintDone);
      break;
    }
    case kColorSensorStart:
    {
      ColorSensor::start();
      break;
    }
    case kColorSensorStop:
    {
      ColorSensor::stop();
      break;
    }
    case kDisplayStart:
    {
      Display::startTimer();
      break;
    }
    case kColorIndicatorFill:
    {
      const byte i = SerialCommand::read_u8();
      const byte maxJ = SerialCommand::read_u8();
      LedChain::fill(i, maxJ);
      break;
    }
    case kScanLightsStart:
    {
      LedChain::startScan();
      break;
    }
    default:
    {
    }
    }
  }
}

Reactduino app([] {
  Serial.begin(115200);

  Printer::setup();

  ColorSensor::setup();
  app.repeat(20, ColorSensor::read);

  LedChain::setup();
  app.repeat(16, LedChain::frame);

  Button::setup();
  app.repeat(10, [] {
    Button::checkButtons();
  });

  Display::setup();
  app.repeat(16, Display::frame);

  app.onTick(dispatchCommands);

  // Give plenty of buffer
  SerialCommand::write_u8(0);
  SerialCommand::write_u8(0);
  SerialCommand::write_u8(0);
  SerialCommand::write_u8(0);
  delay(10);
  SerialCommand::write_u8(0);
  delay(10);
  SerialCommand::write_u8(kReady);
  delay(10);
});
