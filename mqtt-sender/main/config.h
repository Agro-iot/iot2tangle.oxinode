#ifndef _CONFIG_H
#define _CONFIG_H

/* ----- CONFIG FILE ----- */

 #define MQTT
/* Device */
const char* id_name = "ESP32-MQTT";

/* Network Configuration */
const char* ssid_WiFi = "mySSID";
const char* pass_WiFi = "myPASS";

/* Broker Configuration */
const char* address = "yourIpBroker";  /* Broker address (MQTT), must NOT include 'http://xxx' or 'tcp://xxx' */
int port = 1883;
const char* topic = "yourTopicBasic";		/* MQTT topic */
const char* user = "yourUser";			/* MQTT user */
const char* password = "yourPassword";	/* MQTT password */

/* Enable Sensors */
bool isEnable_TemperatureIntern = true;
bool isEnable_TemperatureExtern = false;	/*                     true: Enable  --  false: Disable                            */
bool isEnable_Humidity = false;		/* If the sensor is disabled the data about it will not be displayed in the Tangle */
bool isEnable_Pressure = false;
bool isEnable_Acoustic = false;
bool isEnable_Light = false;
bool isEnable_Accelerometer_X = false;
bool isEnable_Accelerometer_Y = false;
bool isEnable_Accelerometer_Z = false;
bool isEnable_Gyroscope_X = false;
bool isEnable_Gyroscope_Y = false;
bool isEnable_Gyroscope_Z = false;
bool isEnable_Heart_BPM = true;
bool isEnable_SPO2 = true;


/* Interval of time */
long interval = 30;    /* Time in seconds between */


#endif
