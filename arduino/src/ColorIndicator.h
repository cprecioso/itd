#pragma once

#include <Arduino.h>
#include <FastLED.h>

namespace ColorIndicator
{
void setup();
void set(byte chainNumber, byte ledNumber);
void frame();
} // namespace ColorIndicator
