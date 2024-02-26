#include "Arduino.h"
#include <WiFi.h>
#include "ESP32MQTTClient.h"
#include <ArduinoJson.h>
#include <DHTesp.h>
#define DHTPIN 4
const int fotoresistorPin = 33;
DHTesp dht;
const char *ssid = "INFINITUM3281_2.4";  // Enter your WiFi name
const char *password = "q4LxZ8EBa7";

char *server = "mqtt://broker.hivemq.com:1883";
char *subscribeTopic = "equipo/animales/gecko";
char *publishTopic = "equipo/animales/gecko";

ESP32MQTTClient mqttClient;

void setup() {
  Serial.begin(115200);
  pinMode(33, INPUT);
  dht.setup(DHTPIN, DHTesp::DHT11);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    Serial.println("Conectando a WiFi...");
  }
  Serial.println("Conexión exitosa a WiFi");

  mqttClient.enableDebuggingMessages();
  mqttClient.setURI(server);
  mqttClient.enableLastWillMessage("lwt", "fuera de linea");
  mqttClient.setKeepAlive(30);
  WiFi.setHostname("c3test");
  mqttClient.loopStart();
}



void loop() {


  float humidity = dht.getHumidity();
  float temperature = dht.getTemperature();
  int valorFotoresistor = analogRead(fotoresistorPin);
  Serial.println(humidity);
  Serial.println(temperature);
  Serial.println(valorFotoresistor);

  // Crear un objeto JSON
  DynamicJsonDocument jsonDocument(200);
  jsonDocument["humedad"] = humidity;
  jsonDocument["temperatura"] = temperature;
  jsonDocument["fototransistor"] = valorFotoresistor;
  String jsonString;
  serializeJson(jsonDocument, jsonString);

  Serial.println("Enviando datos");
  mqttClient.publish(publishTopic, jsonString.c_str(), 0, false);
  delay(5000);
}

void onConnectionEstablishedCallback(esp_mqtt_client_handle_t client) {
  if (mqttClient.isMyTurn(client)) {
    mqttClient.subscribe(subscribeTopic, [](const String &payload) {
      Serial.printf("%s: %s\n", subscribeTopic, payload.c_str());
    });

    mqttClient.subscribe("bar/#", [](const String &topic, const String &payload) {
      Serial.printf("%s: %s\n", topic.c_str(), payload.c_str());
    });
  }
}

esp_err_t handleMQTT(esp_mqtt_event_handle_t event) {
  mqttClient.onEventCallback(event);
  return ESP_OK;
}