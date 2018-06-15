#include "Magnet.h"

namespace Magnet
{

const byte numMags = 4;
const byte pinMags[numMags] = {2, 3, 4, 5};

void setup()
{
  for (byte i = 0; i < numMags; i++)
  {
    pinMode(pinMags[i], OUTPUT);
  }
}

byte read()
{
  byte magnetRead = 0;

  for (byte i = 0; i < numMags; i++)
  {
    const bool thisMagnet = digitalRead(pinMags[i]);
    magnetRead = (magnetRead << 1) | thisMagnet;
  }

  return magnetRead;
}
} // namespace Magnet
