#include "logic.h"

int stolenInARow = 0;

bool nextDecision(bool lastOpponentDecision)
{
  if (lastOpponentDecision == STEAL)
  {
    stolenInARow++;
  }
  else
  {
    stolenInARow = 0;
  }
  bool willMistake = random(100) < MISTAKE_RATIO;
  bool response = (stolenInARow >= TOLERANCE_THRESHOLD) ? STEAL : NO_STEAL;
  if (willMistake)
  {
    response = !response;
  }
  return response;
}

int computePunishment(bool yourDecision, bool theirDecisions)
{
  if (yourDecision == STEAL)
  {
    if (theirDecisions == STEAL)
    {
      return BOTH_STEAL;
    }
    else
    {
      return YOU_STEAL;
    }
  }
  else
  {
    if (theirDecisions == STEAL)
    {
      return THEY_STEAL;
    }
    else
    {
      return NONE_STEAL;
    }
  }
}
