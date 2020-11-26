#ifndef _SSD1306_H_
#define _SSD1306_H_
#include "stdint.h"

int init_ssd1306();
int ssd1306_blank(uint8_t val);
int ssd1306_text(char *disp_string);


#endif