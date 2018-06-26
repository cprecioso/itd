#include "ColorSensor.h"

namespace ColorSensor
{

const byte ledPin = 13;

Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_2_4MS, TCS34725_GAIN_16X);

void setup()
{
  while (!tcs.begin())
  {
    Serial.print(kStatus);
    Serial.print(F(",Can't find sensor!;"));
    delay(100);
  }
}

void read()
{
  static const auto comma = F(",");

  static uint16_t clear, red, green, blue;
  tcs.getRawData(&red, &green, &blue, &clear);

  Serial.print(kColorSensor);
  Serial.print(comma);
  Serial.print(clear);
  Serial.print(comma);
  Serial.print(red);
  Serial.print(comma);
  Serial.print(green);
  Serial.print(comma);
  Serial.print(blue);
  Serial.print(F(";"));
}
} // namespace ColorSensor
