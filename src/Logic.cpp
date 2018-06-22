#include "Logic.h"

namespace Logic
{

int stolenInARow = 0;

Decision computeDecision(Decision previousDecision)
{
  stolenInARow = (previousDecision == Steal) ? stolenInARow + 1 : 0;
  const Decision response = (stolenInARow >= TOLERANCE_TRESHOLD) ? Steal : Cooperate;
  const bool willMistake = (random(0, 100) / 100.0) < MISTAKE_RATIO;

  if (willMistake)
  {
    if (response == Cooperate)
    {
      return Steal;
    }
    else
    {
      return Cooperate;
    }
  }
  else
  {
    return response;
  }
}

void applyOutcome(Decision yourDecision, Decision theirDecision)
{
  if (yourDecision == Steal)
  {
    if (theirDecision == Steal)
    {
      YourFood::add(BOTH_STEAL);
      TheirFood::add(BOTH_STEAL);
    }
    else
    {
      YourFood::add(YOU_STEAL);
      TheirFood::add(THEY_STEAL);
    }
  }
  else
  {
    if (theirDecision == Steal)
    {
      YourFood::add(THEY_STEAL);
      TheirFood::add(YOU_STEAL);
    }
    else
    {
      YourFood::add(NONE_STEAL);
      TheirFood::add(NONE_STEAL);
    }
  }
}

} // namespace Logic
