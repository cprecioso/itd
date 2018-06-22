#pragma once

#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <FastLED.h>
#include "settings.h"

namespace LedStrip
{

extern CRGB leds[LED_STRIP_NUM];
extern Adafruit_NeoPixel strip;

void setup();

void show();

} // namespace LedStrip
