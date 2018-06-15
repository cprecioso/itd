#include "LedChain.h"

namespace LedChain
{

CRGB leds[NUMLEDS];

void changeLed(byte n, byte r, byte g, byte b)
{
  leds[n].setRGB(r, g, b);
}

void changeLedAll(byte r, byte g, byte b)
{
  leds[0].setRGB(r, g, b);
  for (byte i = 1; i < NUMLEDS; i++)
  {
    leds[i] = leds[0];
  }
}

void setup()
{
  FastLED.addLeds<P9813, 9, 8, RGB>(leds, NUMLEDS);
  FastLED.show();
}

void frame()
{
  FastLED.show();
}
} // namespace LedChain
