#include "Display.h"

namespace Display
{
TM1637Display display(6, 7);

bool isRunning;
unsigned long startTime;

const unsigned int gameDuration = 30000;

void setup()
{
  display.setBrightness(0x00);
  display.showNumberDec(0);
}

void startTimer()
{
  isRunning = true;
  startTime = millis();
}

void frame()
{
  if (isRunning)
  {
    const unsigned long curr = millis();
    byte sLeft = (startTime + gameDuration - curr) / 1000;
    if (sLeft <= 0)
      isRunning = false;
    display.showNumberDec(max(0, sLeft));
  }
}

} // namespace Display
