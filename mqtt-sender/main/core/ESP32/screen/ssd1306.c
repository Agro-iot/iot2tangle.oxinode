#include "ssd1306.h"
#include "driver/i2c.h"
#include "sdkconfig.h"
#include "stdint.h"
#include "esp_log.h"
#include "string.h"

#define i2c_port                                   1
#define I2C_MASTER_TX_BUF_DISABLE                  0                       
#define I2C_MASTER_RX_BUF_DISABLE                  0  
#define WRITE_BIT I2C_MASTER_WRITE
#define READ_BIT I2C_MASTER_READ
#define ACK_CHECK_EN                             0x1                 
#define ACK_CHECK_DIS                            0x0               
#define ACK_VAL                                  0x0                    
#define NACK_VAL                                 0x1                  
#define LAST_NACK_VAL                            0x2  

uint8_t fonttable5x7[1080] =
    {
        0x00, 0x00, 0x00, 0x00, 0x00, // SPACE
        0x00, 0x00, 0x5F, 0x00, 0x00, // !
        0x00, 0x03, 0x00, 0x03, 0x00, // "
        0x14, 0x3E, 0x14, 0x3E, 0x14, // #
        0x24, 0x2A, 0x7F, 0x2A, 0x12, // $
        0x43, 0x33, 0x08, 0x66, 0x61, // %
        0x36, 0x49, 0x55, 0x22, 0x50, // &
        0x00, 0x05, 0x03, 0x00, 0x00, // '
        0x00, 0x1C, 0x22, 0x41, 0x00, // (
        0x00, 0x41, 0x22, 0x1C, 0x00, // )
        0x14, 0x08, 0x3E, 0x08, 0x14, // *
        0x08, 0x08, 0x3E, 0x08, 0x08, // +
        0x00, 0x50, 0x30, 0x00, 0x00, // ,
        0x08, 0x08, 0x08, 0x08, 0x08, // -
        0x00, 0x60, 0x60, 0x00, 0x00, // .
        0x20, 0x10, 0x08, 0x04, 0x02, // /

        0x3E, 0x51, 0x49, 0x45, 0x3E, // 0
        0x00, 0x04, 0x02, 0x7F, 0x00, // 1
        0x42, 0x61, 0x51, 0x49, 0x46, // 2
        0x22, 0x41, 0x49, 0x49, 0x36, // 3
        0x18, 0x14, 0x12, 0x7F, 0x10, // 4
        0x27, 0x45, 0x45, 0x45, 0x39, // 5
        0x3E, 0x49, 0x49, 0x49, 0x32, // 6
        0x01, 0x01, 0x71, 0x09, 0x07, // 7
        0x36, 0x49, 0x49, 0x49, 0x36, // 8
        0x26, 0x49, 0x49, 0x49, 0x3E, // 9
        0x00, 0x36, 0x36, 0x00, 0x00, // :
        0x00, 0x56, 0x36, 0x00, 0x00, // ;
        0x08, 0x14, 0x22, 0x41, 0x00, // <
        0x14, 0x14, 0x14, 0x14, 0x14, // =
        0x00, 0x41, 0x22, 0x14, 0x08, // >
        0x02, 0x01, 0x51, 0x09, 0x06, // ?

        0x3E, 0x41, 0x59, 0x55, 0x5E, // @
        0x7E, 0x09, 0x09, 0x09, 0x7E, // A
        0x7F, 0x49, 0x49, 0x49, 0x36, // B
        0x3E, 0x41, 0x41, 0x41, 0x22, // C
        0x7F, 0x41, 0x41, 0x41, 0x3E, // D
        0x7F, 0x49, 0x49, 0x49, 0x41, // E
        0x7F, 0x09, 0x09, 0x09, 0x01, // F
        0x3E, 0x41, 0x41, 0x49, 0x3A, // G
        0x7F, 0x08, 0x08, 0x08, 0x7F, // H
        0x00, 0x41, 0x7F, 0x41, 0x00, // I
        0x30, 0x40, 0x40, 0x40, 0x3F, // J
        0x7F, 0x08, 0x14, 0x22, 0x41, // K
        0x7F, 0x40, 0x40, 0x40, 0x40, // L
        0x7F, 0x02, 0x0C, 0x02, 0x7F, // M
        0x7F, 0x02, 0x04, 0x08, 0x7F, // N
        0x3E, 0x41, 0x41, 0x41, 0x3E, // O

        0x7F, 0x09, 0x09, 0x09, 0x06, // P
        0x1E, 0x21, 0x21, 0x21, 0x5E, // Q
        0x7F, 0x09, 0x09, 0x09, 0x76, // R
        0x26, 0x49, 0x49, 0x49, 0x32, // S
        0x01, 0x01, 0x7F, 0x01, 0x01, // T
        0x3F, 0x40, 0x40, 0x40, 0x3F, // U
        0x1F, 0x20, 0x40, 0x20, 0x1F, // V
        0x7F, 0x20, 0x10, 0x20, 0x7F, // W
        0x41, 0x22, 0x1C, 0x22, 0x41, // X
        0x07, 0x08, 0x70, 0x08, 0x07, // Y
        0x61, 0x51, 0x49, 0x45, 0x43, // Z
        0x00, 0x7F, 0x41, 0x00, 0x00, // [
        0x02, 0x04, 0x08, 0x10, 0x20, // backslash
        0x00, 0x00, 0x41, 0x7F, 0x00, // ]
        0x04, 0x02, 0x01, 0x02, 0x04, // ^
        0x40, 0x40, 0x40, 0x40, 0x40, // _

        0x00, 0x01, 0x02, 0x04, 0x00, // `
        0x20, 0x54, 0x54, 0x54, 0x78, // a
        0x7F, 0x44, 0x44, 0x44, 0x38, // b
        0x38, 0x44, 0x44, 0x44, 0x44, // c
        0x38, 0x44, 0x44, 0x44, 0x7F, // d
        0x38, 0x54, 0x54, 0x54, 0x18, // e
        0x04, 0x04, 0x7E, 0x05, 0x05, // f
        0x08, 0x54, 0x54, 0x54, 0x3C, // g
        0x7F, 0x08, 0x04, 0x04, 0x78, // h
        0x00, 0x44, 0x7D, 0x40, 0x00, // i
        0x20, 0x40, 0x44, 0x3D, 0x00, // j
        0x7F, 0x10, 0x28, 0x44, 0x00, // k
        0x00, 0x41, 0x7F, 0x40, 0x00, // l
        0x7C, 0x04, 0x78, 0x04, 0x78, // m
        0x7C, 0x08, 0x04, 0x04, 0x78, // n
        0x38, 0x44, 0x44, 0x44, 0x38, // o

        0x7C, 0x14, 0x14, 0x14, 0x08, // p
        0x08, 0x14, 0x14, 0x14, 0x7C, // q
        0x00, 0x7C, 0x08, 0x04, 0x04, // r
        0x48, 0x54, 0x54, 0x54, 0x20, // s
        0x04, 0x04, 0x3F, 0x44, 0x44, // t
        0x3C, 0x40, 0x40, 0x20, 0x7C, // u
        0x1C, 0x20, 0x40, 0x20, 0x1C, // v
        0x3C, 0x40, 0x30, 0x40, 0x3C, // w
        0x44, 0x28, 0x10, 0x28, 0x44, // x
        0x0C, 0x50, 0x50, 0x50, 0x3C, // y
        0x44, 0x64, 0x54, 0x4C, 0x44, // z
        0x00, 0x08, 0x36, 0x41, 0x41, // {
        0x00, 0x00, 0x7F, 0x00, 0x00, // |
        0x41, 0x41, 0x36, 0x08, 0x00, // }
        0x02, 0x01, 0x02, 0x04, 0x02  // ~
};

static int i2c_read(uint8_t chip_addr, uint8_t data_addr, uint8_t *data_rd, size_t len)
{
    //i2c_init();
    //vTaskDelay(1);
    /*i2c_driver_install(i2c_port, I2C_MODE_MASTER, I2C_MASTER_RX_BUF_DISABLE,
                       I2C_MASTER_TX_BUF_DISABLE, 0); */
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, chip_addr << 1 | WRITE_BIT, ACK_CHECK_EN);
    i2c_master_write_byte(cmd, data_addr, ACK_CHECK_EN);
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, chip_addr << 1 | READ_BIT, ACK_CHECK_EN);
    if (len > 1)
    {
        i2c_master_read(cmd, data_rd, len - 1, ACK_VAL);
    }
    i2c_master_read_byte(cmd, data_rd + len - 1, NACK_VAL);
    i2c_master_stop(cmd);
    esp_err_t ret = i2c_master_cmd_begin(i2c_port, cmd, 100 / portTICK_RATE_MS);
    i2c_cmd_link_delete(cmd);
    if (ret == ESP_OK)
    {
        //for(int i=0; i<len; i++){ printf ("%d %x\n", i, data_rd[i]); }
    }
    else if (ret == ESP_ERR_TIMEOUT)
    {
        ESP_LOGW("", "Bus is busy");
    }
    else
    {
        ESP_LOGW("", "Read failed");
    }
    //i2c_driver_delete(i2c_port);
    //vTaskDelay(2);
    return 0;
}

static int i2c_write_block(int chip_addr, int data_addr, uint8_t *wr_data, int len)
{
    //i2c_init();
   /* i2c_driver_install(i2c_port, I2C_MODE_MASTER, I2C_MASTER_RX_BUF_DISABLE,
                       I2C_MASTER_TX_BUF_DISABLE, 0); */
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, chip_addr << 1 | WRITE_BIT, ACK_CHECK_EN);
    i2c_master_write_byte(cmd, data_addr, ACK_CHECK_EN);
    for (int i = 0; i < len; i++)
    {
        i2c_master_write_byte(cmd, wr_data[i], ACK_CHECK_EN);
    }
    i2c_master_stop(cmd);
    esp_err_t ret = i2c_master_cmd_begin(i2c_port, cmd, 100 / portTICK_RATE_MS);
    i2c_cmd_link_delete(cmd);
    if (ret == ESP_OK)
    { //ESP_LOGI("", "Write OK addr %x  datablock\n", chip_addr);
    }
    else if (ret == ESP_ERR_TIMEOUT)
    {
        ESP_LOGW("", "Bus is busy");
    }
    else
    {
        ESP_LOGW("", "Write Failed");
    }
    //i2c_driver_delete(i2c_port);
    return 0;
}

static int i2c_write(int chip_addr, int data_addr, int wr_data)
{
    //i2c_init();
    /*i2c_driver_install(i2c_port, I2C_MODE_MASTER, I2C_MASTER_RX_BUF_DISABLE,
                       I2C_MASTER_TX_BUF_DISABLE, 0);*/
    i2c_cmd_handle_t cmd = i2c_cmd_link_create();
    i2c_master_start(cmd);
    i2c_master_write_byte(cmd, chip_addr << 1 | WRITE_BIT, ACK_CHECK_EN);
    i2c_master_write_byte(cmd, data_addr, ACK_CHECK_EN);
    i2c_master_write_byte(cmd, wr_data, ACK_CHECK_EN);
    i2c_master_stop(cmd);
    esp_err_t ret = i2c_master_cmd_begin(i2c_port, cmd, 100 / portTICK_RATE_MS);
    i2c_cmd_link_delete(cmd);
    if (ret == ESP_OK)
    { //ESP_LOGI("", "Write OK addr %x  data %x\n", chip_addr, wr_data);
    }
    else if (ret == ESP_ERR_TIMEOUT)
    {
        ESP_LOGW("", "Bus is busy");
    }
    else
    {
        ESP_LOGW("", "Write Failed");
    }
   // i2c_driver_delete(i2c_port);
    return 0;
}

int init_ssd1306()
{
    i2c_write(0x3c, 0x00, 0xae); // display off
    i2c_write(0x3c, 0x00, 0xd5); // clockdiv
    i2c_write(0x3c, 0x00, 0x80);
    i2c_write(0x3c, 0x00, 0xa8); // multiplex
    i2c_write(0x3c, 0x00, 0x3f);
    i2c_write(0x3c, 0x00, 0xd3); // offset
    i2c_write(0x3c, 0x00, 0x00);
    i2c_write(0x3c, 0x00, 0x40); // startline
    i2c_write(0x3c, 0x00, 0x8d); // charge pump
    i2c_write(0x3c, 0x00, 0x14);
    i2c_write(0x3c, 0x00, 0x20); // memory mode
    i2c_write(0x3c, 0x00, 0x00);
    i2c_write(0x3c, 0x00, 0xa1); // segregmap
    i2c_write(0x3c, 0x00, 0xc8); // comscandec
    i2c_write(0x3c, 0x00, 0xda); // set com pins
    i2c_write(0x3c, 0x00, 0x12);
    i2c_write(0x3c, 0x00, 0x81); // contrast
    i2c_write(0x3c, 0x00, 0xcf);
    i2c_write(0x3c, 0x00, 0xd9); // precharge
    i2c_write(0x3c, 0x00, 0xf1);
    i2c_write(0x3c, 0x00, 0xdb); // vcom detect
    i2c_write(0x3c, 0x00, 0x40);
    i2c_write(0x3c, 0x00, 0xa4); // resume
    i2c_write(0x3c, 0x00, 0xa6); // normal (not inverted)
    //i2c_write( 0x3c,  0x00,  0xe4);    // undocumented command saw on internet
    i2c_write(0x3c, 0x00, 0x00);
    i2c_write(0x3c, 0x00, 0x10);
    i2c_write(0x3c, 0x00, 0xaf); // display on
    return (0);
}

int ssd1306_blank(uint8_t val)
{
    int len = 1024;
    uint8_t *data = malloc(len);
    for (int i = 0; i < len; i++)
    {
        data[i] = val;
    }
    i2c_write_block(0x3c, 0x40, data, len);
    free(data);
    return (0);
}

int ssd1306_text(char *disp_string)
{
    int len = 1024;
    int framebuf_ptr = 0;
    int line = 0;
    int size = 1;
    char f0;
    char f1;
    char ft;

    //setup and clear framebuffer;
    uint8_t *framebuffer = malloc(len);
    for (int i = 0; i < len; i++)
    {
        framebuffer[i] = (uint8_t)0x00;
    }

    for (int n = 0; n < strlen(disp_string); n++)
    {
        if (disp_string[n] == '|')
        {
            framebuf_ptr = 128 * ++line;
        }
        else if (disp_string[n] == '1' && framebuf_ptr % 128 == 0)
        {
            size = 1;
            ++framebuf_ptr;
        }
        else if (disp_string[n] == '2' && framebuf_ptr % 128 == 0)
        {
            size = 2;
            ++framebuf_ptr;
        }
        else if (disp_string[n] == '4' && framebuf_ptr % 128 == 0)
        {
            size = 4;
            ++framebuf_ptr;
        }
        else if (size == 1)
        {
            for (int a = 0; a < 5; a++)
            {
                framebuffer[framebuf_ptr++] = fonttable5x7[(a + 5 * (disp_string[n] - ' ')) % 1024];
            }
            framebuf_ptr++;
        }
        else if (size == 2 || size == 4)
        { //twice as wide
            for (int a = 0; a < 5; a++)
            {
                framebuffer[framebuf_ptr++] = fonttable5x7[(a + 5 * (disp_string[n] - ' ')) % 1024];
                framebuffer[framebuf_ptr++] = fonttable5x7[(a + 5 * (disp_string[n] - ' ')) % 1024];
                if (size == 4)
                { //twice as big
                    f0 = 0;
                    f1 = 0;
                    ft = fonttable5x7[a + 5 * (disp_string[n] - ' ')];
                    if ((ft >> 7) & 1)
                        f0 = 0xc0;
                    if ((ft >> 6) & 1)
                        f0 = f0 + 0x30;
                    if ((ft >> 5) & 1)
                        f0 = f0 + 0x0c;
                    if ((ft >> 4) & 1)
                        f0 = f0 + 0x03;
                    if ((ft >> 3) & 1)
                        f1 = 0xc0;
                    if ((ft >> 2) & 1)
                        f1 = f1 + 0x30;
                    if ((ft >> 1) & 1)
                        f1 = f1 + 0x0c;
                    if ((ft >> 0) & 1)
                        f1 = f1 + 0x03;
                    framebuffer[framebuf_ptr - 1] = f1;
                    framebuffer[framebuf_ptr - 2] = f1;
                    framebuffer[128 + (framebuf_ptr - 1)] = f0;
                    framebuffer[128 + (framebuf_ptr - 2)] = f0;
                }
            }
            framebuf_ptr++;
        }
    }

    //have to split up 1K framebuffer i2c write - full transfer takes 100msec (i2c 100KHz fixed)
    //otherwise oled screen wtite blocks for 100msec
    for (int a = 0; a < 8; a++)
    {
        //vTaskDelay(1);
        i2c_write(0x3c, 0x00, 0x40);
        i2c_write_block(0x3c, 0x40, framebuffer + a * 128, 128);
    }
    free(framebuffer);
    vTaskDelay(10); //let it finish up before relinquishing or else i2c errors
    return (0);
}
//each font 4 bytes SPACE=0x32
