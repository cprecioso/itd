#include <Arduino.h>
#include <ChainableLED.h>
#include <Reactduino.h>
#include <TM1637Display.h>
#include <ModuloOps.h>
#include <LEDUtil.h>

#define PIN_BUTTON 6
TM1637Display digits(2, 3);
#define NUM_LEDS 3
ChainableLED leds(7, 8, NUM_LEDS);

#define HUE_ANIM_STEP 0.0025
#define HUE_ANIM_DELAY 10
#define HUE_ANIM_OFFSET 0.33

int presses = 0;
reaction mainSequenceReaction = NULL;

void mainSequence()
{
  setAllBlack(leds, NUM_LEDS);
  delay(500);
  for (byte led = 0; led < NUM_LEDS; led++)
  {
    leds.setColorHSB(led, .06, 1, .3);
    delay(500);
  }
  for (int i = 0; i < 3; i++)
  {
    setAllBlack(leds, NUM_LEDS);
    delay(300);
    setAllWhite(leds, NUM_LEDS);
    delay(200);
  }
  delay(400);
  setAllBlack(leds, NUM_LEDS);
  delay(1000);

  digits.setBrightness(7, true);
  digits.showNumberDec(0);
  int limit = (presses <= 1) ? 16 : ((presses == 2) ? 42 : 261);
  for (int i = 0; i < limit; i++)
  {
    digits.showNumberDec(i + 1);
    delay(1);
  }
  delay(1000);
  while (true)
  {
    digits.setBrightness(7, false);
    digits.showNumberDec(limit);
    delay(500);
    digits.setBrightness(7, true);
    digits.showNumberDec(limit);
    delay(1000);
  }
}

Reactduino app([] {
  pinMode(PIN_BUTTON, INPUT);

  for (byte led = 0; led < NUM_LEDS; led++)
    leds.setColorRGB(led, 0, 0, 0);

  digits.setBrightness(7, false);
  digits.showNumberDec(0);

  app.repeat(HUE_ANIM_DELAY, [] {
    static float hue = 0.0;
    for (byte led = 0; led < NUM_LEDS; led++)
    {
      float ledHue = modulo_add(hue, HUE_ANIM_OFFSET * led);
      leds.setColorHSB(led, ledHue, 1, .3);
    }
    hue = modulo_add(hue, HUE_ANIM_STEP);
  });

  app.onTick([] {
    static bool enabled = true;
    if (!enabled || presses != 1)
      return;

    enabled = false;
    if (mainSequenceReaction != NULL)
    {
      mainSequenceReaction = app.delay(3000, [] {
        app.free(mainSequenceReaction);
        mainSequenceReaction = NULL;
        mainSequence();
      });
    }
  });

  app.onTick([] {
    static bool buttonIsBeingPressed = false;

    bool buttonCurrentlyPressed = digitalRead(PIN_BUTTON);
    if (buttonIsBeingPressed && !buttonCurrentlyPressed)
    {
      presses++;
      buttonIsBeingPressed = false;
    }
    else if (!buttonIsBeingPressed && buttonCurrentlyPressed)
    {
      buttonIsBeingPressed = true;
    }
  });

});
