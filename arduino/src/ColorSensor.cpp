#include "ColorSensor.h"

namespace ColorSensor
{

const byte ledPin = 13;

bool isReading;

Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_2_4MS, TCS34725_GAIN_16X);

void setup()
{
  while (!tcs.begin())
  {
    delay(100);
  }
}

void read()
{
  if (isReading)
  {
    uint16_t clear, red, green, blue;
    tcs.getRawData(&red, &green, &blue, &clear);

    SerialCommand::write_u8(kColorSensorData);
    SerialCommand::write_i16(clear);
    SerialCommand::write_i16(red);
    SerialCommand::write_i16(blue);
    SerialCommand::write_i16(green);
  }
}

void start() { isReading = true; }
void stop() { isReading = false; }

} // namespace ColorSensor
