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
  const static byte namesNum = 6;
  const static __FlashStringHelper *names[] = {
      F("Resource VC18A\n"
        "--------------\n"
        "Type: Protein\n"
        "Name: Amino Acid Alpha\n"
        "Chemical formula: RCHNH2COOH\n"
        "Amount: 8g\n"
        "Procedence: China\n"
        "Owner: Marie Colin, 17\n"),

      F("Resource C3H702B\n"
        "----------------\n"
        "Type: Carbohydrates\n"
        "Name: Fructose\n"
        "Chemical formula: C6H12O6\n"
        "Amount: 43g\n"
        "Procedence: Netherlands\n"
        "Owner: Jason Copper, 29\n"),

      F("Resource 87HW9GF\n"
        "----------------\n"
        "Type: Vitamin\n"
        "Name: B12\n"
        "Chemical formula: C63H88CoN14O14P\n"
        "Amount: 0.025g\n"
        "Procedence: France\n"
        "Owner: Carlos Precioso, 23\n"),

      F("Resource C3H7028\n"
        "----------------\n"
        "Type: Vitamin\n"
        "Name: Folic acid\n"
        "Chemical formula: C19H23N7O6\n"
        "Amount: 0.1mg\n"
        "Procedence: Spain\n"
        "Owner: Jasmijn de Boers, 76\n"),

      F("Resource C39AKL8\n"
        "----------------\n"
        "Type: Protein\n"
        "Name: Glutamic acid\n"
        "Chemical formula: C5H9NO4\n"
        "Amount: 0.04mg\n"
        "Procedence: Netherlands\n"
        "Owner: Xiaoying Che, 38\n"),

      F("Resource CX1389\n"
        "---------------\n"
        "Type: Vitamin\n"
        "Name: Nicotamide\n"
        "Chemical formula: C6H6N2O\n"
        "Amount: 56mg\n"
        "Procedence: Colombia\n"
        "Owner: Xinhe Yao, 52\n")};

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
  printer.justify('L');

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
  printer.println(F("Impersonal robbery,\nPersonal suffering."));
  printer.feed(30);
}
} // namespace Printer
