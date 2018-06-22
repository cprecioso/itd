#include <Arduino.h>
#include <FastLED.h>

#define NUM_MAGS 4
const byte magnetPins[NUM_MAGS] = {2, 3, 4, 5};
boolean magnetPresent[NUM_MAGS] = {false, false, false, false};

#define NUM_LEDS 3
#define PIN_CLK_LED 8
#define PIN_DAT_LED 9
CRGB leds[NUM_LEDS];

#define SMOOTH_STEP 0.01

#define MAX_MAGS 6

long mapFloat(float amount, long min, long max, byte resolution = 2)
{
    const long amountMax = 10 ^ resolution;
    const long intAmount = amount * amountMax;
    return map(intAmount, 0, amountMax, min, max);
}

void setup()
{

    for (byte i = 0; i < NUM_MAGS; i++)
        pinMode(magnetPins[i], INPUT);

    FastLED.addLeds<P9813, PIN_DAT_LED, PIN_CLK_LED, RGB>(leds, NUM_LEDS);

    for (byte i = 0; i < NUM_LEDS; i++)
        leds[i] = CRGB::Black;
    FastLED.show();
    delay(1000);

    Serial.begin(9600);
}

float getLevel()
{
    static byte magnets = 0;
    for (byte i = 0; i < NUM_MAGS; i++)
    {
        const boolean magnetNow = digitalRead(magnetPins[i]);
        const boolean magnetBefore = magnetPresent[i];
        if (magnetNow != magnetBefore)
        {
            if (magnetBefore == false)
                magnets++;
            magnetPresent[i] = magnetNow;
        }
    }
    return magnets / (float)MAX_MAGS;
}

float breathe(float level)
{
    const byte angle = millis() / mapFloat(level, 20, 2);
    const byte x = triwave8(angle);
    const float extra = ((x / 255.0) * 1.0) - 0.5;
    return level + extra;
}

void setLEDs(float level)
{
    const byte hue = constrain(mapFloat(level, 255, 165), 0, 255);
    const byte sat = constrain(mapFloat(level, 255, 150), 0, 255);
    const byte val = constrain(mapFloat(breathe(level), 250, 255), 0, 255);

    for (byte i = 0; i < NUM_LEDS; i++)
    {
        leds[i] = CHSV(hue, sat, val);
    }

    FastLED.show();
}

float smooth(float targetLevel)
{
    static float currentLevel = 0.0;
    Serial.println(currentLevel);
    if (currentLevel == targetLevel)
    {
        return targetLevel;
    }
    else if (currentLevel < targetLevel)
    {
        currentLevel = min(currentLevel + SMOOTH_STEP, targetLevel);
    }
    else if (currentLevel > targetLevel)
    {
        currentLevel = max(currentLevel - SMOOTH_STEP, targetLevel);
    }
    return currentLevel;
}

void loop()
{
    const float level = getLevel();
    // const float level = ((millis() / 5000) % (NUM_MAGS + 1)) / (float)NUM_MAGS;
    setLEDs(smooth(level));
}
