#pragma once

#include <Arduino.h>

namespace SerialCommand
{

uint8_t read_u8();

int8_t read_i8();

int16_t read_i16();

int32_t read_i32();

void write_u8(uint8_t num);

void write_i8(int8_t num);

void write_i16(int16_t num);

void write_u16(uint16_t num);

void write_i32(int32_t num);

} // namespace SerialCommand
