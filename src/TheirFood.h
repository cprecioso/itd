#pragma once

#include <Arduino.h>
#include <FastLED.h>
#include "settings.h"
#include "LedChain.h"
#include "Colors.h"

namespace TheirFood
{
void setup();
void tick();

void add(float qty);

} // namespace TheirFood
