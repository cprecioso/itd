#include "TheirFood.h"

namespace TheirFood
{

float food[LED_CHAIN_NUM];

void setup()
{
  for (int i = 0; i < LED_CHAIN_NUM; i++)
  {
    food[i] = random(2, 11) / 10.0;
  }
}

void tick()
{
  for (int i = 0; i < LED_CHAIN_NUM; i++)
  {
    if (food[i] < BLINK_TRESHOLD && (millis() / 500) % 2)
    {
      LedChain::leds[i] = CRGB::Black;
    }
    else
    {
      LedChain::leds[i].setHue(percentToHue(food[i], RED, GREEN));
    }
  }
  LedChain::show();
}

void add(float qty)
{
  byte chosen;
  float tentative;
  int times = 0;

  do
  {
    chosen = random(0, LED_CHAIN_NUM);
    tentative = food[chosen] + qty;

    if (times++ >= 100)
    {
      for (int i = 0; i < LED_CHAIN_NUM; i++)
      {
        food[i] = 0.0;
      }
    }

  } while (tentative > 1.0 || tentative < 0.0);
  food[chosen] = tentative;
}

} // namespace TheirFood
