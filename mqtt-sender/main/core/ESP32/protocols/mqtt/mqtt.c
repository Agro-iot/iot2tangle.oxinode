#include "mqtt.h"

#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include "esp_wifi.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event.h"
//#include "tcpip_adapter.h"
#include "esp_netif.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"

#include "lwip/sockets.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"
#include "esp_err.h"
#include "esp_log.h"
#include "mqtt_client.h"

static const char *TAG = "MQTT_CLIENT";
//esp_http_client_handle_t client;

bool socket_sender(const char *endp, int p, const char *_top, const char *_us, const char *_pass, const char *j, long t)
//socket_sender(z->addr, z->addr_port, z->top, z->user_mqtt, z->pass_mqtt, z->json, z->interv);
{
    // URL adaptation
    /*char *p_s = " ";
    char p_buff[8];
    sprintf(p_buff, ":%d/", p);
    p_s = p_buff;

    const char *u = " ";
    char buffer[40], aux[40];
    strcpy(aux, endp);

    char *c_aux;
    c_aux = strtok(aux, "/");
    strcpy(buffer, "mqtt://");
    strcat(buffer, c_aux);
    strcat(buffer, p_s);
    c_aux = strtok(NULL, "\0");
    strcat(buffer, c_aux);
    u = buffer; */
    ESP_LOGE(TAG, "socket_sender");
    char p_str[50];
    char address[100];
    sprintf(p_str, "%d", p);	/* Convert port to string */
	
	strcpy(address, "mqtt://");
    strcat(address, endp);
    //strcat(address, ":");    
    //strcat(address, p_str);

    esp_err_t err;

    esp_mqtt_client_config_t mqtt_cfg = {
        .uri = address,
        .port = p,
        .username = _us,
        .password = _pass,
    };

    esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);
    esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, client);
    esp_err_t error = esp_mqtt_client_start(client);
    ESP_LOGE(TAG, "error:%s",esp_err_to_name(error));

    int msg_id;
    msg_id = esp_mqtt_client_subscribe(client, _top, 1);
    ESP_LOGI(TAG, "resultado suscripcion_id:%d", msg_id);

    if (msg_id == -1)
    {
        printf(" -- Endpoint is NOT detected!! -- Please, check your configuration --\nRebooting....");
        esp_mqtt_client_stop(client);
        return false;
    }
    printf("Suscrito correctamente a topico\n");

    msg_id = esp_mqtt_client_publish(client, _top, j, 0, 1, 0);

    printf("Mensaje enviado a topico\n");
    esp_mqtt_client_stop(client);
    return true;
    /*
    // POST
    esp_http_client_config_t config = {
        .url = u,
        .event_handler = _http_event_handler,
    };

    client = esp_http_client_init(&config);

    err = esp_http_client_perform(client); // Check HTTP Endpoint
    if (err == ESP_OK)
    {
        esp_http_client_set_url(client, u);
        esp_http_client_set_method(client, HTTP_METHOD_POST);
        esp_http_client_set_header(client, "Content-Type", "application/json");
        esp_http_client_set_post_field(client, j, strlen(j));
        err = esp_http_client_perform(client);

        if (err == 28676 || err == 0)
        {
            ESP_LOGI(TAG, "Data Sucessfully sent to Tangle!");
            esp_http_client_cleanup(client);
            return true;
        }
        else
        {
            ESP_LOGE(TAG, "Failed to send Data to Endpoint!");
            esp_http_client_cleanup(client);
            return false;
        }
    }
    else
    {
        ESP_LOGE(TAG, "Endpoint no detected! -- Please, check your configuration --");
        esp_http_client_cleanup(client);
        return false;
    }

    */
}

bool init_socket(const char *endp, int p, const char *_us, const char *_pass, bool ft_http)
//bool init_socket(const char * addr, int port, const char * user_mqtt, const char * user_pswd, bool b)
{
    ESP_LOGE(TAG, "init_socket");
    if (ft_http == true)
    {
        // URL adaptation
       /* char *p_s = " ";
        char p_buff[8];
        sprintf(p_buff, ":%d/", p);
        p_s = p_buff;

        const char *u = " ";
        char buffer[40], aux[40];
        strcpy(aux, endp);

        char *c_aux;
        c_aux = strtok(aux, "/");
        strcpy(buffer, "mqtt://");
        strcat(buffer, c_aux);
        strcat(buffer, p_s);
        c_aux = strtok(NULL, "\0");
        strcat(buffer, c_aux);
        u = buffer;
        esp_err_t err; */

        char p_str[50];
        char address[100];

        sprintf(p_str, "%d", p);	/* Convert port to string */
	
	strcpy(address, "mqtt://");
    strcat(address, endp);
    //strcat(address, ":");    
    //strcat(address, p_str);

        esp_mqtt_client_config_t mqtt_cfg = {
            .uri = address,
            .port = p,
            .username = _us,
            .password = _pass,
        };

        esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);
        esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, client);
        //esp_mqtt_client_start(client);
        esp_err_t error = esp_mqtt_client_start(client);
        ESP_LOGE(TAG, "error:%s",esp_err_to_name(error));

        int msg_id;
        msg_id = esp_mqtt_client_subscribe(client, "/topic/raaa", 1);
        ESP_LOGI(TAG, "resultado suscripcion_id:%d", msg_id);

        if (msg_id == -1)
        {
            printf(" -- Endpoint is NOT detected!! -- Please, check your configuration --\nRebooting....");
            esp_mqtt_client_stop(client);
            return false;
        }
        else
        {
            printf(" -- The Configuration Network is correct, sending data to The Tangle --\n");
            msg_id = esp_mqtt_client_unsubscribe(client, "/topic/raaa");
            ESP_LOGE(TAG, "resultado desuscripcion_id:%d", msg_id);
            esp_mqtt_client_stop(client);
            return true;
        }

        /*
		esp_http_client_config_t config = {
		    .url = u,
		    .event_handler = _http_event_handler,
		};

    	client = esp_http_client_init(&config);
	
		err = esp_http_client_perform(client);

		if (err == 0)
		{
			printf(" -- The Configuration Network is correct, sending data to The Tangle --\n");
			return true; 
		}
		else
		{
			printf(" -- Endpoint is NOT detected!! -- Please, check your configuration --\nRebooting....");
			return false;
		}
		esp_http_client_cleanup(client);
        */
    }

    /* No need to reconnect on ESP32 */
    return true;
}

void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data)
{
    ESP_LOGD(TAG, "Event dispatched from event loop base=%s, event_id=%d", base, event_id);
    mqtt_event_handler_cb(event_data);
}

esp_err_t mqtt_event_handler_cb(esp_mqtt_event_handle_t event)
{
    esp_mqtt_client_handle_t client = event->client;
    int msg_id;
    // your_context_t *context = event->context;
    switch (event->event_id)
    {
    case MQTT_EVENT_CONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
        /*
        msg_id = esp_mqtt_client_publish(client, "/topic/qos1", "data_3", 0, 1, 0);
        ESP_LOGI(TAG, "sent publish successful, msg_id=%d", msg_id);

        msg_id = esp_mqtt_client_subscribe(client, "/topic/qos0", 0);
        ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);

        msg_id = esp_mqtt_client_subscribe(client, "/topic/qos1", 1);
        ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);

        msg_id = esp_mqtt_client_unsubscribe(client, "/topic/qos1");
        ESP_LOGI(TAG, "sent unsubscribe successful, msg_id=%d", msg_id);
        */
        break;
    case MQTT_EVENT_DISCONNECTED:
        ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
        break;

    case MQTT_EVENT_SUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
        //msg_id = esp_mqtt_client_publish(client, "/topic/qos0", "data", 0, 0, 0);
        //ESP_LOGI(TAG, "sent publish successful, msg_id=%d", msg_id);
        break;
    case MQTT_EVENT_UNSUBSCRIBED:
        ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
        break;
    case MQTT_EVENT_PUBLISHED:
        ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
        break;
    case MQTT_EVENT_DATA:
        ESP_LOGI(TAG, "MQTT_EVENT_DATA");
        printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
        printf("DATA=%.*s\r\n", event->data_len, event->data);
        break;
    case MQTT_EVENT_ERROR:
        ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
        break;
    default:
        ESP_LOGI(TAG, "Other event id:%d", event->event_id);
        break;
    }
    return ESP_OK;
}