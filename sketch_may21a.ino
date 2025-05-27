#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

const char* ssid = "Yogaone";
const char* password = "yogawan123";

const char* mqtt_server = "2df92edc4fe74558a88f779cb914ac77.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_user = "yogawan";
const char* mqtt_password = "Yog@pr4t4m4";

#define TRIG_PIN 14
#define ECHO_PIN 12

WiFiClientSecure espClient;
PubSubClient client(espClient);

void setup_wifi() {
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  int retry = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    retry++;
    if (retry > 40) {  // timeout 20 detik
      Serial.println("Gagal konek WiFi");
      return;
    }
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);

    espClient.setInsecure();

    if (client.connect(clientId.c_str(), mqtt_user, mqtt_password)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) {
    Serial.println("Timeout, tidak ada echo");
  } else {
    float distance = duration * 0.034 / 2;
    Serial.print("Jarak: ");
    Serial.print(distance);
    Serial.println(" cm");

    char msg[50];
    dtostrf(distance, 4, 2, msg);

    client.publish("devices/wokwi_esp8266/data", msg);
  }

  delay(500);
}
