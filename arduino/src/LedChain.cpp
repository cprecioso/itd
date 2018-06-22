#include "LedChain.h"

namespace LedChain
{

ChainableLED chain(8, 9, NUMLEDS);

void changeLed(byte n, byte r, byte g, byte b)
{
  chain.setColorRGB(n, r, g, b);
}

void changeLedAll(byte r, byte g, byte b)
{
  for (byte i = 1; i < NUMLEDS; i++)
  {
    chain.setColorRGB(i, r, g, b);
  }
}

void setup()
{
  changeLedAll(0, 0, 0);
}

void frame()
{
}
} // namespace LedChain
