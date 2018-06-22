#include "Glue.h"

namespace Glue
{

void tick()
{
  static Logic::Decision previousDecision = Logic::Cooperate;
  static Logic::Decision currentDecision = Logic::Cooperate;

  Logic::Decision decision;

  if (Buttons::isPressed1())
  {
    decision = Logic::Steal;
  }
  else if (Buttons::isPressed2())
  {
    decision = Logic::Cooperate;
  }
  else
  {
    return;
  }

  previousDecision = currentDecision;
  currentDecision = decision;

  Logic::Decision oppositeDecision = Logic::computeDecision(previousDecision);
  Logic::applyOutcome(currentDecision, oppositeDecision);
}

} // namespace Glue
