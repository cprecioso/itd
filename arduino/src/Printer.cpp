#include "Printer.h"

namespace Printer
{
const byte rxPin = 4;
const byte txPin = 5;

SoftwareSerial printerSerial(rxPin, txPin);
Adafruit_Thermal printer(&printerSerial);

void setup()
{
  printerSerial.begin(19200);
  printer.begin();
}

void separator()
{
  printer.println(F("------------------------------"));
}

void printReceipt(byte n)
{
  const static byte namesNum = 7;
  const static __FlashStringHelper *names[] = {
      //NAME        AGE  QTY  RESOURCE
      F("Marie Colin   17    1      VC18A"),
      F("Jason Copper  29    2    C3H7O2B"),
      F("Carlos Preci  23    1    83JW9JC"),
      F("Jasmijn de B  76    1    87HW9GF"),
      F("Xiaoying Che  29    2    C3H7O28"),
      F("Xinhe Yao     26    1    C39AKL8"),
      F("Eva van Dijk   8    1     CX1389")};

  printer.wake();
  printer.setDefault();

  printer.doubleHeightOn();
  printer.boldOn();
  printer.justify('C');
  printer.setSize('L');
  printer.println(F("GOOD DAY"));
  printer.doubleHeightOff();
  printer.boldOff();
  printer.setSize('S');
  printer.inverseOn();
  printer.print(F(" "));

  for (byte i = 0; i < 19; i++)
  {
    printer.print((char)Serial.read());
  }

  printer.print(F(" "));
  printer.println();
  printer.inverseOff();
  printer.feed(1);
  printer.setSize('S');
  separator();
  printer.feed(1);
  printer.boldOn();
  printer.justify('R');
  printer.println(F("NAME         AGE  QTY  RESOURCE"));
  printer.boldOff();

  const int maxNum = constrain(n, 0, namesNum);
  for (byte i = 0; i < maxNum; i++)
  {
    printer.println(names[i]);
  }

  printer.feed(1);
  separator();
  printer.feed(1);
  printer.justify('L');
  printer.print(F("Food Gained: "));
  printer.print(n);
  printer.print(F(" Meals"));
  printer.println();
  printer.print(F("Consequence: "));
  printer.print(n);
  printer.print(F(" People Suffering"));
  printer.println();
  printer.feed(1);
  separator();
  printer.feed(1);
  printer.justify('C');
  printer.println(F("Impersonal robbery,"));
  printer.println(F("Personal suffering."));
  printer.feed(30);
}
} // namespace Printer
