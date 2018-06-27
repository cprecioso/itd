#include "Button.h"

namespace Button
{
void setup()
{
  pinMode(2, INPUT);
  pinMode(3, INPUT);
}

bool wasStartPressed()
{
  static bool prev;
  const bool curr = digitalRead(2);
  if (prev != curr)
  {
    prev = curr;
    if (curr == true)
    {
      return true;
    }
  }
  return false;
}

bool wasPressurePressed()
{
  static bool prev;
  const bool curr = digitalRead(3);
  if (prev != curr)
  {
    prev = curr;
    if (curr == true)
    {
      return true;
    }
  }
  return false;
}

void checkButtons()
{
  if (wasStartPressed())
    SerialCommand::write_u8(kStartButtonPressed);
  if (wasPressurePressed())
    SerialCommand::write_u8(kPressureButtonPressed);
}
} // namespace Button
