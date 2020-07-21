# HomeyCONZ

This app for [Athom Homey](https://homey.app/en-us/) adds support for [deCONZ](https://www.dresden-elektronik.de/funk/software/deconz.html)'s [[RaspBee](https://www.phoscon.de/en/raspbee)/[ConBee](https://www.phoscon.de/en/conbee)] child devices.

[![current version](https://img.shields.io/badge/version-1.11.2-<COLOR>.svg)](https://shields.io/)

# Installation information

Before we start. Clone this repo to your local machine.

Then, first we need to get NPM.
On macOS, e.g., you can use [brew](http://brew.sh): `brew install node`.
Then via NPM you should install cli for Homey: `npm i -g athom-cli`.
Almost there. Now you can install app using `athom app install` command being in the app's root directory.

# Supported devices

- [x] Bulbs
- [x] Blinds
- [x] Plugs
- [x] deCONZ groups
- [x] Motion sensors: Philips, Xiaomi, Aqara, TRÅDFRI, Trust, Develco
- [x] Temperature/Humidity sensors: Xiaomi, Aqara
- [x] Buttons: Mi, Aqara, Aqara gyro, TRÅDFRI, 
- [x] Switches: Aqara, TRÅDFRI, Philips, Trust, Feller
- [x] Contact sensors: Xiaomi, Aqara, Trust
- [x] Remotes: TRÅDFRI, Tint
- [x] Leakage sensor: Aqara, Develco, Zipato
- [x] Smoke sensor: Honeywell, Trust, Heimann
- [x] CO sensor: Heimann

- [x] Aqara Cube
- [x] Aqara Vibration sensor
- [x] TRÅDFRI signal repeater
- [x] Mi Light sensor
