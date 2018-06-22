#pragma once

#include <Arduino.h>
#include <FastLED.h>
#include "settings.h"

namespace LedChain
{

extern CRGB leds[LED_CHAIN_NUM];

void setup();

void show();

} // namespace LedChain
