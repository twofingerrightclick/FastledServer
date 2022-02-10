# FastLEDServer
![image](https://user-images.githubusercontent.com/11265760/151496096-05d60eb5-dcf6-4cf5-8ab5-5c8f8332a387.png)
https://youtu.be/JiqsUggyYz0

FastLEDServer aims to be a starting point for remote control of your leds. It makes use the libraries Arduino JSON, and ESPAsyncWebServer to demonstrate the essentials for asynchronous ( no blocking code ) control over your lights. That means control inputs are delay free and animations are smooth. It is ready for your expansion - the addition of more animations and modes. 

The one feature I implemented heavily relies on the FastLED Palette. The webpage allows for easy creation and real-time viewing of palettes. Check out the palette documentation: https://github.com/FastLED/FastLED/wiki/Gradient-color-palettes

The webpage JavaScript is done with KnockoutJs in TypeScript. Other tooling for it is done via npm. See the web folder. An overview of the web portion is featured in the youtube video.

## Wifi Config
Rename the `example.wifi.config.json` in the SPIFFS `data` folder to `wifi.config.json` and fill in your access point credentials.

## Useful Tutorials and Docs:
Getting aquainted with the nodemcu esp8266
- https://randomnerdtutorials.com/getting-started-with-esp8266-wifi-transceiver-review/


fastled 8266 notes:
- https://github.com/FastLED/FastLED/wiki/ESP8266-notes

fasteLed palette:
- https://github.com/FastLED/FastLED/wiki/Gradient-color-palettes

starter tutorial for asynchronous webserver
- https://techtutorialsx.com/2017/12/01/esp32-arduino-asynchronous-http-webserver/

github docs for ESPAsyncWebServer
 - https://github.com/me-no-dev/ESPAsyncWebServer#body-data-handling

arduino json:
- https://arduinojson.org/v5/assistant/


Using spiffs file system on the esp8266
- https://tttapa.github.io/ESP8266/Chap11%20-%20SPIFFS.html

example of spiffs on esp32:
- https://techtutorialsx.com/2018/10/04/esp32-http-web-server-serving-external-javascript-file/
- https://microcontrollerslab.com/display-images-esp32-esp8266-web-server-arduino-ide/

esp8266 multiwifi library:
- https://arduino-esp8266.readthedocs.io/en/latest/esp8266wifi/station-examples.html


Arduino programming with Vscode:
- https://learn.sparkfun.com/tutorials/efficient-arduino-programming-with-arduino-cli-and-visual-studio-code/all
