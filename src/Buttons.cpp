#include "Buttons.h"

namespace Buttons
{

void setup()
{
  pinMode(BUTTON1_PIN, INPUT);
  pinMode(BUTTON2_PIN, INPUT);
}

bool isPressed1()
{
  static bool button1Pressed = false;
  const int state1 = digitalRead(BUTTON1_PIN);
  if (state1 != button1Pressed)
  {
    button1Pressed = state1;
    if (state1 == HIGH)
    {
      return true;
    }
  }
  return false;
}

bool isPressed2()
{
  static bool button2Pressed = false;
  const int state2 = digitalRead(BUTTON2_PIN);
  if (state2 != button2Pressed)
  {
    button2Pressed = state2;
    if (state2 == HIGH)
    {
      return true;
    }
  }
  return false;
}

} // namespace Buttons
