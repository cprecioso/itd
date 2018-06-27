#pragma once

#include <Arduino.h>
#include <TM1637Display.h>

namespace Display
{
void setup();
void startTimer();
void frame();
} // namespace Display
