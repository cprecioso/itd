#include <Arduino.h>

#define MISTAKE_RATIO 5
#define TOLERANCE_THRESHOLD 2

#define NONE_STEAL (0)
#define YOU_STEAL (+1)
#define THEY_STEAL (-1)
#define BOTH_STEAL (-2)

#define STEAL true
#define NO_STEAL false

bool nextDecision(bool lastOpponentDecision);

int computePunishment(bool yourDecision, bool theirDecision);
