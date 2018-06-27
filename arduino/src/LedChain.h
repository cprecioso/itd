#pragma once

#include <Arduino.h>
#include <FastLED.h>

namespace LedChain
{
void setup();
void frame();
void fill(byte, byte);
void startScan();
} // namespace LedChain
