#pragma once

#include <Arduino.h>
#include <Adafruit_TCS34725.h>
#include "Commands.h"

namespace ColorSensor
{
void setup();
void read();
} // namespace ColorSensor
