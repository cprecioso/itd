#pragma once

#include <Arduino.h>
#include "settings.h"
#include "YourFood.h"
#include "TheirFood.h"

namespace Logic
{

enum Decision
{
  Steal,
  Cooperate
};

Decision computeDecision(Decision previousDecision);

void applyOutcome(Decision yourDecision, Decision theirDecision);

} // namespace Logic
