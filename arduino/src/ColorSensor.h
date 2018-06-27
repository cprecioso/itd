#pragma once

#include <Arduino.h>
#include <Adafruit_TCS34725.h>
#include "Commands.h"
#include "SerialCommand.h"

namespace ColorSensor
{
void setup();
void read();
void start();
void stop();
} // namespace ColorSensor
