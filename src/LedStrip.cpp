#include "LedStrip.h"

namespace LedStrip
{

CRGB leds[LED_STRIP_NUM];
Adafruit_NeoPixel strip(LED_STRIP_NUM, LED_STRIP_PIN, NEO_GRBW + NEO_KHZ800);

void setup()
{
  strip.begin();
  strip.clear();
}

void show()
{
  for (byte i = 0; i < LED_STRIP_NUM; i++)
  {
    byte r = leds[i].r;
    byte g = leds[i].g;
    byte b = leds[i].b;
    strip.setPixelColor(i, strip.Color(r, g, b, 0));
  }
  strip.show();
}

} // namespace LedStrip
