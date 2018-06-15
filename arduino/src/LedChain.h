#pragma once

#include <Arduino.h>
#include <FastLED.h>

#define NUMLEDS 4

namespace LedChain
{
void setup();
void frame();
void changeLed(byte n, byte r, byte g, byte b);
void changeLedAll(byte r, byte g, byte b);
} // namespace LedChain
