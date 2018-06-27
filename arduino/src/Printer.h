#pragma once

#include <Arduino.h>
#include <Adafruit_Thermal.h>
#include <SoftwareSerial.h>

namespace Printer
{
void setup();
void printReceipt(byte n);
} // namespace Printer
