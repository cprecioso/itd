#pragma once

enum Command
{
  kEmpty,
  kStatus,
  kReady,
  kColorIndicatorFill,
  kPrintStart,
  kPrintDone,
  kColorSensorStart,
  kColorSensorStop,
  kColorSensorData,
  kDisplayStart,
  kPressureButtonPressed,
  kStartButtonPressed,
  kScanLightsStart
};

typedef enum Command Command;
