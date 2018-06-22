#include "TimeWaves.h"

namespace TimeWaves
{
float square(int length)
{
  return ((millis() / length) % 2) * 1.0;
}

float chainsaw(int length)
{
  return (millis() % length) / 500.0;
}

float sin(int length);
} // namespace TimeWaves
