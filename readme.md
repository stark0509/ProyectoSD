# ProyectoSD
ProyectoSD was the project carried out in the digital systems course in 2020.
It allows to control a mini-house from a web platform.



## Installation

### Arduino

You need prepare the arduino/main.ino program before load into the Arduino mega. <br> 

Define the correct pin numbers:<br>
```
#define led1 32 //led1
#define led2 33 //led2
#define tempPin 24//temperature sensor
#define fan 31 //fan 
#define redMotorDoor 43 //open the door
#define blackMotorDoor 42 //close the door
#define trig 37 //trigger of ultrasonic proximity sensor 
#define echo 36 //echo of ultrasonic proximity sensor 
```
Define the desired values: <br>
```
//modify with the desired values 
const int dMin=20;//distance at which the door should be opened
const int tempMax=29;//temperature at which the fan is activated
```

Now you can load the program in the arduino mega.

### Web platform
Install the dependecys 
```
npm install
```
Run the servers
```
npm run start
```
Go to http://localhost:3000/ 

## Usage
This is an example of the final presentation. The door is automatically closing.

![](/media/demo_final.gif)