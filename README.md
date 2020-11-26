![Oxinode Banner](https://user-images.githubusercontent.com/51343893/99599291-47c8df00-29b8-11eb-9485-ace8ebf45acf.png)

## Subject
The Oxinode is a Secure Remote Control System for Oxygen and Pulse levels which has been developed by integrating an [ESP32-38PINOUT](https://github.com/Agro-iot/iot2tangle.oxinode/wiki/Architecture#esp32), a [MAX30102](https://github.com/Agro-iot/iot2tangle.oxinode/wiki/Architecture#max30102), a [3D Printed Case](https://www.thingiverse.com/thing:4658384), and the [Oxinode version]() of the [iot2tangle stack](https://github.com/iot2tangle).

For full instructions, visit the [Oxinode Wiki](https://github.com/Agro-iot/iot2tangle.oxinode/wiki).

## Standards
For this project we used [I2T Standard](https://github.com/Agro-iot/iot2tangle.oxinode/wiki/Architecture#esp32), [IOTA Streams Framework](https://www.iota.org/solutions/streams), and [ESP-IDF Standard](https://docs.espressif.com/projects/esp-idf/en/stable/get-started/).

## Overview and Background
The Oxinode sends Pulse and Oxygen data to the [IOTA Tangle](https://blog.iota.org/the-tangle-an-illustrated-introduction-4d5eae6fe8d4!), through the IoTStack. The developed system can be used to alert, through telegram, to patient's relatives about the blood Oxygen and Pulse levels. It can also be used as a quick mechanism to detect possible symptoms of COVID19, and a potential tool for physicians to take Oxygen and Pulse measurements that they can relay on.

### Potential
The same principle could be applied with wearable technologies (i.e. Smartwatch) adding other sensors such GPS and temperature to have the full picture of the end user's physical activity. Thanks to IOTA Streams Framework the user is always in control of its own data, and can profit from it by deciding who and when others are accessing the produced data.

### Future Challenges
Reduce the size of the prototype to a wearable device, or reuse available hardware for smartwatches and develop the applications to read sensor data and send it to the tangle, through LTE.
