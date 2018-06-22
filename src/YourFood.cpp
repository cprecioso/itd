#include "YourFood.h"

namespace YourFood
{

float quantity;
const float percentPerLed = 1.0 / LED_STRIP_NUM;

void setup()
{
  quantity = random(4, 8) / 10.0;
}

void tick()
{
  const byte totallyOnLeds = min(floor(quantity / percentPerLed), LED_STRIP_NUM - 1);
  const float lastLedPercent = (quantity - (percentPerLed * totallyOnLeds)) * (1.0 / percentPerLed);

  byte i = 0;
  for (; i < totallyOnLeds; i++)
  {
    LedStrip::leds[i].setHue(GREEN);
  }
  if (lastLedPercent < BLINK_TRESHOLD && (millis() / 500) % 2)
  {
    LedStrip::leds[i] = CRGB::Black;
  }
  else
  {
    LedStrip::leds[i].setHue(percentToHue(lastLedPercent, RED, GREEN));
  }
  i++;
  for (; i < LED_STRIP_NUM; i++)
  {
    LedStrip::leds[i] = CRGB::Black;
  }

  LedStrip::show();
}

void add(float qty)
{
  quantity = constrain(quantity + qty, 0.0, 1.0);
}

} // namespace YourFood
