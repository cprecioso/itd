#ifndef LEDUTIL_H
#define LEDUTIL_H 1

#include <ChainableLED.h>

void setAllLedRGB(ChainableLED &leds, byte numLEDs, byte red, byte blue, byte green);
void setAllLedHSB(ChainableLED &leds, byte numLEDs, float hue, float saturation, float brightness);

void setAllBlack(ChainableLED &leds, byte numLEDs);
void setAllWhite(ChainableLED &leds, byte numLEDs);

#endif /* LEDUTIL_H */
