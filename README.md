![Logo](admin/tinytx4.png)
# ioBroker.tinytx
[![Build Status](https://travis-ci.org/PericNikola/ioBroker.tinytx4.svg?branch=master)](https://travis-ci.org/PericNikola/ioBroker.tinytx4)

This is an adapter for ioBroker to integrate RFM12B/RFM69 via Attiny Chip.

## Installation:
### released version
```javascript
npm install iobroker.tinytx
```
on raspberry it might help to use:
```javascript
 npm install --unsafe-perm iobroker.tinytx
 ```
 because serialport package must be built on unsupported arm-hw 

### the actual development version from github (when under testing, may not work!)
```javascript
npm install https://github.com/PericNikola/ioBroker.tinytx/tarball/master --production
```
or
```javascript
npm install --unsafe-perm https://github.com/PericNikola/ioBroker.tinytx/tarball/master --production
```
## Settings:
- Serial port of TinyTX Adapter usually /dev/ttyAMA0
- Serial Speed usually 9600 Baud

## Configuration:
to be done in admin
* deinition of the Serial port
* setting the baudrate
- define sensor address which is received on air
- define unique sensors address within adapter 
- define the room

## Sensors
|Object|device variants|telegram example|Description|
|--------|-------|:-:|--------|
| TinyTX Wireless Sensor | TinyTX Wireless Sensor | ID 21 ... | sensor with RFM12B for Temperatur and Humidity |


## Changelog:

### 0.0.1
* working with 1 sensors 

## License
The MIT License (MIT)

Copyright (c) 2018 Peric Nikola <peric.nikola@ggs.ch>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
