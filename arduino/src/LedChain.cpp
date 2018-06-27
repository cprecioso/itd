#include "LedChain.h"

namespace LedChain
{

const CRGB inactiveColor = CRGB::Black;
const CRGB chainColors[] = {CRGB::Red, CRGB::White, CRGB::Green, CRGB::Blue};

CRGBArray<6> leds[4];

const byte scannerLedsN = 10;
CRGBArray<scannerLedsN> scannerLeds;

bool isScanning;
unsigned long scanStart;

void fill(byte i, byte maxJ)
{
  leds[i].fill_solid(CRGB::Black);
  leds[i](0, maxJ - 1).fill_solid(chainColors[i]);
  FastLED.show();
}

void setup()
{
  FastLED.addLeds<NEOPIXEL, 8>(leds[0], 6);
  FastLED.addLeds<NEOPIXEL, 9>(leds[1], 6);
  FastLED.addLeds<NEOPIXEL, 10>(leds[2], 6);
  FastLED.addLeds<NEOPIXEL, 11>(leds[3], 6);
  FastLED.addLeds<NEOPIXEL, 12>(scannerLeds, scannerLedsN);
  FastLED.show();
}

void startScan()
{
  isScanning = true;
  scanStart = millis();
}

void frame()
{
  if (isScanning)
  {
    const unsigned long currentTime = millis();
    if (currentTime < scanStart + 5000)
    {
      for (byte i = 0; i < scannerLedsN; i++)
        scannerLeds[i] = (currentTime / 100 % (scannerLedsN / 2) == i % (scannerLedsN / 2)) ? CRGB::White : CRGB::Black;
    }
    else if (currentTime < scanStart + 6000)
    {
      scannerLeds.fill_solid(CRGB::Green);
    }
    else
    {
      scannerLeds.fill_solid(CRGB::Black);
      isScanning = false;
    }
    FastLED.show();
  }
}
} // namespace LedChain
