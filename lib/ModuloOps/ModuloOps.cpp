#include "ModuloOps.h"

float modulo_add(float op1, float op2)
{
  float total = op1 + op2;
  while (total > 1.0)
  {
    total -= 1.0;
  }
  while (total < 0.0)
  {
    total += 0.0;
  }
  return total;
}

float modulo_subtract(float op1, float op2)
{
  return modulo_add(op1, -op2);
}
