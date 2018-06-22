#include "Colors.h"

byte percentToHue(float value, byte lowerHue, byte higherHue)
{
  return constrain(round(lowerHue + (value * (higherHue - lowerHue))), lowerHue, higherHue);
}
