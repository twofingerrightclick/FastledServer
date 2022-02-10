/*********
  Twofingerrightclick
  Complete project details at  
*********/
#define FASTLED_ESP8266_NODEMCU_PIN_ORDER //always first
#include <Arduino.h>
// Load Wi-Fi library
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ArduinoJson.h>
#include <ESPAsyncWebServer.h>
#include <FastLED.h>
#include "AsyncJson.h"
#include <FS.h> // Include the SPIFFS library

#define STRIP_RGB_ORDER BRG
#define NUM_LEDS 50
#define LED_PIN 1

CRGB _Leds[NUM_LEDS];

// variables that can be set via the web page
uint8_t _brightness = 100;
uint8_t _GradientStep = 255 / NUM_LEDS;
uint_fast16_t _speed = 200;
uint8_t _numberOfLedsPerPaletteColor = 5;
uint8_t _currentMode = 0;

CRGBPalette16 _CurrentPalette;

uint8_t _wifiCheckInterval = 200; // seconds
String _lastErrorMessage = "no error logged";

//define functions that need to be defined prior to use for compiling
void fillLEDsFromPaletteColors(uint8_t startingIndex = 0);
void initializeWifi(ESP8266WiFiMulti wifiMulti);

// Mode is probably a bad term, as it includes server request "events" as well
// like speed_ which just sets the speed of animation
enum Mode
{
  none_,
  solidColor_,
  brightness_,
  gradient_,
  rainbow_,
  flowPalette_,
  breathePalette_,
  speed_,
  gradientStep_,
  numLedsPerPaletteColor_
};

ESP8266WiFiMulti WifiMulti;
// Set web server port number to 80
AsyncWebServer server(80);

void setup()
{
  Serial.begin(115200);
  delay(20);

  FastLED.addLeds<WS2811, LED_PIN, STRIP_RGB_ORDER>(_Leds, NUM_LEDS);
  FastLED.setBrightness(_brightness);
  FastLED.setCorrection(TypicalPixelString);

  _CurrentPalette = RainbowColors_p;
  _currentMode = Mode::none_;

  // Initialize SPIFFS
  if (!SPIFFS.begin())
  {
    _lastErrorMessage = "An Error has occurred while mounting SPIFFS";
    Serial.println(_lastErrorMessage);
  }

  //  ---- Connect to Wi-Fi network with SSID and password
  WiFi.mode(WIFI_STA); // client only
  initializeWifi(WifiMulti);
  Serial.print("Connected to ");
  Serial.println(WiFi.SSID());
  //show on the _Leds the host portion of the IP i.e. 192.168.0.<#red><#green><#blue>)
  showHostId(WiFi.localIP());
  //------- end wifi

  // ----- server
  // Handle CORS
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");
  //when accessing the post end point the browser will do a preflight check with an HTTP OPTIONS call to check for the Access-Control-Allow-Orgin headers
  server.on("/post", HTTP_OPTIONS, [](AsyncWebServerRequest *request)
            { request->send(200); });

  server.on("/hello", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              Serial.println("hello request");
              request->send(200, "text/plain", "Hello World");
            });

  server.on("/error", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(200, "text/plain", _lastErrorMessage); });

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              String path = "/index.html";
              if (SPIFFS.exists(path))
              {
                request->send(SPIFFS, "/index.html", String(), false);
              }
              else
              {
                request->send(200, "text/plain", "error - index.html not found");
              }
            });

  server.on("/favicon", HTTP_GET, [](AsyncWebServerRequest *request)
            {
              String path = "/favicon.ico";
              if (SPIFFS.exists(path))
              {
                request->send(SPIFFS, "/favicon.ico", "image/x-icon");
              }
              else
              {
                request->send(200, "text/plain", "error - index.html not found");
              }
            });

  AsyncCallbackJsonWebHandler *jsonPostHandler =
      new AsyncCallbackJsonWebHandler(
          "/post", [](AsyncWebServerRequest *request, JsonVariant &json)
          {
            Serial.println("json post request");

            StaticJsonDocument<800> root;
            root = json.as<JsonObject>();

            if (json.is<JsonArray>())
            {
              root = json.as<JsonArray>();
            }
            else if (json.is<JsonObject>())
            {
              root = json.as<JsonObject>();
            }

            uint8_t data_type = root["type"].as<uint8_t>();
            Serial.println(data_type);
            switch (data_type)
            {
            case Mode::rainbow_:
              //statement
              break;
            case Mode::speed_:

              _speed = root["data"].as<uint_fast16_t>();
              Serial.println(_speed);
              break;
            case Mode::solidColor_:
              // statements
              setSolid(root);
              break;
            case Mode::gradient_:
              setGradient(root);
              // statements
              break;
            case Mode::brightness_:
              Serial.println("brightness");
              setBrightness(root);
              // statements
              break;
            case Mode::gradientStep_:
              _GradientStep = root["data"].as<uint8_t>();
              if (_currentMode == Mode::none_)
              {
                fillLEDsFromPaletteColors(0);
              }
              Serial.println(_GradientStep);
              // statements
              break;
            case Mode::none_:
              _currentMode = Mode::none_;
              break;
            case Mode::flowPalette_:
              Serial.println("flow");
              _currentMode = Mode::flowPalette_;
              // statements
              break;
            case Mode::numLedsPerPaletteColor_:
              Serial.println("numLeds");
              _numberOfLedsPerPaletteColor = root["data"].as<uint8_t>();
              if (_currentMode == Mode::none_)
              {
                fillLEDsFromPaletteColors(0);
              }
              Serial.println(_numberOfLedsPerPaletteColor);
              // statements
              break;
            default:
              // statements
              break;
            }
            request->send(200, "text/plain", "json post");
          });

  server.addHandler(jsonPostHandler);

  server.begin();
  // ----end server
}

void loop()
{
  checkWifiStatus();

  switch (_currentMode)
  {
  case Mode::flowPalette_:
    flow();
    break;
  default:
    EVERY_N_MILLISECONDS(200)
    {
      FastLED.show();
    }
    break;
  }
}

void setGradient(StaticJsonDocument<800U> &root)
{
  JsonArray palette = root["data"].as<JsonArray>();
  //fill_gradient_RGB(_Leds, 40, CRGB::Magenta, CRGB::Yellow);
  uint8_t length = root["length"].as<uint8_t>();
  uint8_t convertedPalette[length];
  for (int i = 0; i < length; i++)
  {
    convertedPalette[i] = palette[i].as<uint8_t>();
    Serial.println(convertedPalette[i]);
  }
  _CurrentPalette.loadDynamicGradientPalette(convertedPalette);
  fillLEDsFromPaletteColors();
}

uint8_t _flowStartingIndex = 0;
void flow()
{
  EVERY_N_MILLISECONDS_I(thistimer, _speed)
  {
    thistimer.setPeriod(_speed);

    fillLEDsFromPaletteColors(_flowStartingIndex);
    _flowStartingIndex += _GradientStep;
    FastLED.show();
  }
}

void setSolid(StaticJsonDocument<800U> root)
{
  JsonArray rgb = root["data"].as<JsonArray>();
  CRGB color = CRGB(rgb[0].as<uint8_t>(), rgb[1].as<uint8_t>(), rgb[2].as<uint8_t>());

  fill_solid(_Leds, NUM_LEDS, color);
}

void setBrightness(StaticJsonDocument<800U> root)
{
  _brightness = root["data"].as<uint8_t>();
  FastLED.setBrightness(_brightness);
  Serial.println(_brightness);
}

void fillLEDsFromPaletteColors(uint8_t startingIndex /*=0*/)
{
  uint8_t index = startingIndex;

  uint8_t interval = NUM_LEDS / _numberOfLedsPerPaletteColor;

  for (uint8_t i = 0; i < interval; i++)
  {
    uint8_t startingLed = (i * _numberOfLedsPerPaletteColor);
    uint8_t endLed = startingLed + _numberOfLedsPerPaletteColor;
    //if this is the last iteration then set it cover the rest of the _Leds
    if (((i + 1) - interval) == 0)
    {
      endLed = NUM_LEDS;
    }
    for (uint8_t led = startingLed; led < endLed; ++led)
    {
      _Leds[led] = ColorFromPalette(_CurrentPalette, index, 255, LINEARBLEND);
    }
    index += _GradientStep;
  }
}

//check on wifi status every 200 seconds
void checkWifiStatus()
{

  EVERY_N_SECONDS_I(thistimer, _wifiCheckInterval)
  {
    if (WifiMulti.run() != WL_CONNECTED)
    {
      _wifiCheckInterval = 5;
    }
    else
    {
      _wifiCheckInterval = 200;
    }
    thistimer.setPeriod(_wifiCheckInterval);
  }
}

void showHostId(IPAddress ip)
{
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(ip);
  u_int ipAsInt = (uint32_t)ip;
  uint8_t hostId = (ipAsInt & 0xFF000000) >> 24;

  CRGB redGreenBlue[] = {CRGB::Red, CRGB::Green, CRGB::Blue};

  uint8_t startLedIndex = 0;
  for (uint8_t i = 0; i < 3; i++)
  {
    uint8_t digit = digitAtPos(hostId, 2 - i);
    uint8_t endIndex = digit + startLedIndex;
    if (digit == 0)
    {
      endIndex++;
    }
    for (uint8_t index = startLedIndex; index < endIndex; index++)
    {
      if (digit != 0)
      {
        _Leds[index] = redGreenBlue[i];
      }
      else
      {
        _Leds[index] = CRGB::Black;
      }
      startLedIndex++;
    }
  }

  FastLED.show();
}
//for getting the digit of integer
int digitAtPos(int number, int pos)
{
  return (number / (int)pow(10.0, pos)) % 10;
}

void initializeWifi(ESP8266WiFiMulti wifiMulti)
{

  File configFile = SPIFFS.open("/wifi.config.json", "r");
  StaticJsonDocument<800> wifiConfigDoc;
  
  deserializeJson(wifiConfigDoc, configFile);
  JsonObject root = wifiConfigDoc.as<JsonObject>();
  uint8_t numAps = root["numAps"].as<uint8_t>();
  JsonArray aps = root["aps"].as<JsonArray>();
  configFile.close();

  for (size_t i = 0; i < numAps; i++)
  {
    const char *ssid = aps[i]["ssid"].as<const char*>();
    const char *secret = aps[i]["secret"].as<const char*>();

    wifiMulti.addAP(ssid, secret);
  }

  Serial.print("Connecting to wifi");
  while (wifiMulti.run() != WL_CONNECTED)
  { // Wait for the Wi-Fi to connect
    delay(250);
    Serial.print('.');
  }
}
