#include "ColorIndicator.h"

namespace ColorIndicator
{

const byte chainN = 4;
const byte pixelM = 6;

const CRGB inactiveLed = CRGB::Black;
const CRGB chainColors[chainN] = {CRGB::Red, CRGB::Green, CRGB::White, CRGB::Blue};

CRGBArray<pixelM> chainLeds[chainN];

void setup()
{
  FastLED.addLeds<NEOPIXEL, 2>(chainLeds[0], pixelM);
  FastLED.addLeds<NEOPIXEL, 3>(chainLeds[1], pixelM);
  FastLED.addLeds<NEOPIXEL, 4>(chainLeds[2], pixelM);
  FastLED.addLeds<NEOPIXEL, 5>(chainLeds[3], pixelM);
  FastLED.show();
}

void set(byte i, byte maxJ)
{
  byte j = 0;
  for (CRGB &pixel : chainLeds[i])
  {
    pixel = j++ < maxJ ? chainColors[i] : inactiveLed;
  }
  FastLED.show();
}

} // namespace ColorIndicator
