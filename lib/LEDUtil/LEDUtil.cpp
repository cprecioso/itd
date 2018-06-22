#include "LedUtil.h"

void setAllLedRGB(ChainableLED &leds, byte numLEDs, byte red, byte blue, byte green)
{
  for (byte led = 0; led <= numLEDs; led++)
    leds.setColorRGB(led, red, green, blue);
}

void setAllLedHSB(ChainableLED &leds, byte numLEDs, float hue, float saturation, float brightness)
{
  for (byte led = 0; led <= numLEDs; led++)
    leds.setColorHSB(led, hue, saturation, brightness);
}

void setAllBlack(ChainableLED &leds, byte numLEDs)
{
  setAllLedRGB(leds, numLEDs, 0, 0, 0);
}

void setAllWhite(ChainableLED &leds, byte numLEDs)
{
  setAllLedRGB(leds, numLEDs, 255, 255, 255);
}
