#include <Arduino.h>
#include <Reactduino.h>
#include <Grove_LED_Bar.h>
#include <ChainableLED.h>
#include <logic.h>

#define BREATHE_STEP 0.005
#define BREATHE_MIN 0.3
#define BREATHE_MAX 0.5

#define STEAL_BUTTON_PIN 4
#define NO_STEAL_BUTTON_PIN 3

#define INITIAL_FOOD 3

Grove_LED_Bar bar(9, 8, 0); // Clock pin, Data pin, Orientation
ChainableLED leds(6, 7, 1); // Clock pin, Data pin, Number of LEDs

bool prevButton = NO_STEAL;
bool buttonPressed = NO_STEAL;

int foodLevel = INITIAL_FOOD;

Reactduino app([] {
    randomSeed(analogRead(0));
    bar.begin();
    bar.setLevel(foodLevel);
    leds.setColorRGB(0, 0, 0, 0);
    pinMode(STEAL_BUTTON_PIN, INPUT);
    pinMode(NO_STEAL_BUTTON_PIN, INPUT);
    // Serial.begin(9600);
});

reaction breathing_animation = app.repeat(10, [] {
    // Serial.println("breathe");
    static float value = BREATHE_MIN;
    static bool rising = true;
    leds.setColorHSB(0, .12, 1.0, value);
    if (rising)
    {
        value += BREATHE_STEP;
    }
    else
    {
        value -= BREATHE_STEP;
    }
    if (value >= BREATHE_MAX || value <= BREATHE_MIN)
        rising = !rising;
});

reaction showResponse;

reaction check_buttons = app.onTick([] {
    // Serial.println("check");
    bool steal = digitalRead(STEAL_BUTTON_PIN);
    bool no_steal = digitalRead(NO_STEAL_BUTTON_PIN);
    if (steal || no_steal)
    {
        Serial.println("hit");
        app.disable(check_buttons);

        prevButton = buttonPressed;
        if (steal)
            buttonPressed = STEAL;
        else
            buttonPressed = NO_STEAL;

        app.enable(breathing_animation);

        showResponse = app.delay(2000, [] {
            app.free(showResponse);
            app.disable(breathing_animation);

            bool decision = nextDecision(prevButton);
            if (decision == STEAL)
                leds.setColorRGB(0, 255, 0, 0);
            else
                leds.setColorRGB(0, 0, 255, 0);

            foodLevel = max(0, min(10, foodLevel + computePunishment(buttonPressed, decision)));
            bar.setLevel(foodLevel);

            showResponse = app.delay(2000, [] {
                app.free(showResponse);
                leds.setColorRGB(0, 0, 0, 0);
                app.enable(check_buttons);
            });
        });
    }
});

reaction setup_work = app.delay(0, [] {
    leds.setColorRGB(0, 0, 0, 0);
    app.disable(breathing_animation);
});
