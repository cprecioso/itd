#include "LedChain.h"

namespace LedChain
{

CRGB leds[LED_CHAIN_NUM];

void setup()
{
  FastLED.addLeds<P9813, LED_CHAIN_PIN_DAT, LED_CHAIN_PIN_CLK, RGB>(leds, LED_CHAIN_NUM);
  FastLED.show();
}

void show()
{
  FastLED.show();
}

} // namespace LedChain
