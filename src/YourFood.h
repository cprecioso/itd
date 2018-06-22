#pragma once

#include <Arduino.h>
#include <FastLED.h>
#include "settings.h"
#include "LedStrip.h"
#include "Colors.h"

namespace YourFood
{
void setup();
void tick();

void add(float qty);

} // namespace YourFood
