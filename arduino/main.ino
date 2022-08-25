//Proyecto sistemas digitales
//modify with the correct pin number
#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <OneWire.h>//permite la comunicacion mediante BUS(Investigar)
#include <DallasTemperature.h>//permite leer la temperatura en el sensor de marca Dallas

#define led1 32 
#define led2 33 
#define tempPin 24//definir el pin donde se conectara el sensor de temperatura
#define fan 31
#define redMotorDoor 43
#define blackMotorDoor 42
#define trig 37 //definimos los pines del sensor ultrasonico 
#define echo 36

//Objetos necesarios para la lectura de la temperatura
OneWire tempBus(tempPin);//tempPin como bus OneWire(Investigar)
DallasTemperature tempSensor(&tempBus);//Se declara objeto para el sensor

//variables necesarias para el control automatico
const int dMin=20;
const int tempMax=29;//temperatura a la cual se activa el ventilador

char stateOfDoor='C';
char controlDoor='M';//variable que permitira conocer el mode del control de la puerta en el void loop
char controlFan='M';//variable que permitira conocer el mode del control del ventilador en el void loop

// Parametros necesarios para la conexion en la red de acceso local y direccion ip del servidor mqtt
byte mac[]    = {  0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA };//direccion mac de la arduino mega
IPAddress ip(192, 168, , .);//direccion ipv3 de la arduino mega
IPAddress server(192, 168, ., .);//direccion ip del servidor mqtt
//crea instancias de objetos necesarios para la conexion de red y mqtt
EthernetClient ethClient;//crea el cliente de red
PubSubClient client(ethClient);//permite convertir al cliente de red en un cliente mqtt de forma parcial

//variable que permitira convertir el topic a string asi como almacenar los estados recibidos en los topicos
char state;
String topicStr;
//se crea la funcion que se llamara cada que llegue algun mensaje de un topico
void callback(char* topic, byte* payload, unsigned int length) {
  topicStr=String(topic);
  Serial.print("Message arrived [");
  Serial.print(topicStr);
  Serial.println("] ");
  state=(char)payload[0];
  Serial.print("State: ");
  Serial.println(state);
  if(topicStr=="led1"){
    onOffLed1(state);
    Serial.println("Dentro de la condicion del led 1");
  }
  if(topicStr=="led2"){
    onOffLed2(state);
    Serial.println("Dentro de la condicion del led 2");
  }
  if(topicStr=="doorState"){
    openCloseDoor(state);
    Serial.println("Dentro de la condicion de abrir/cerrar la puerta");
  }
  if(topicStr=="doorControl"){
    enableDisableAutomaticDoor(state);
    Serial.println("Dentro de la condicion de control automatico/manual la puerta");
  }
  if(topicStr=="fanState"){
    onOffFan(state);
    Serial.println("Dentro de la condicion de encendido/apagado de ventilador");
  }
  if(topicStr=="fanControl"){
    enableDisableAutomaticFan(state);
    Serial.println("Dentro de la condicion de control automatico/manual del ventilador");
  }
}

//const char* mqttServer = "node02.myqtthub.com";
const int mqttPort = 1883;
const char* mqttUser = "test1";
const char* mqttPassword = "test1";

//funcion que reconectara el arduino al servidor mqtt
void reconnect() {
  client.setBufferSize(255);
  // Bucle hasta estar conectado 
  while (!client.connected()) {
    Serial.println("Intentando conexión MQTT ...");
    // Intentando conectar arduino a servidor mqtt 
    if (client.connect("arduinoClient",mqttUser,mqttPassword)) {
      Serial.println("Arduino esta conectado al servidor mqtt");
      // Se vuelve a suscribir a los topicos de leds y motores 
      client.subscribe("led1");
      client.subscribe("led2");
      client.subscribe("doorState");
      client.subscribe("doorControl");
      client.subscribe("fanState");
      client.subscribe("fanControl");
      Serial.println("Suscrito a los topicos de leds y motores");
    } else {
      Serial.print("fallo en la conexion, estado del cliente =");
      Serial.print(client.state());
      Serial.println(" intentando nuevamente en 5 segundos...");
      // esperando 5 segundos para conectar nuevamente
      delay(5000);
    }
  }
}

void setup(){
  tempSensor.begin();
  Serial.begin(9600);
  pinMode(led1,OUTPUT);
  pinMode(led2,OUTPUT);
  pinMode(fan,OUTPUT);
  pinMode(trig,OUTPUT);
  pinMode(echo,INPUT);
  pinMode(redMotorDoor,OUTPUT);
  pinMode(blackMotorDoor,OUTPUT);
  //aseguramos que tanto leds como motores esten apagados
  digitalWrite(led1,LOW);
  digitalWrite(led2,LOW);
  digitalWrite(fan,LOW);
  digitalWrite(redMotorDoor,LOW);
  digitalWrite(blackMotorDoor,LOW);
  client.setServer(server, mqttPort);//establece el servidor mqtt al cual se conectara y el puerto
  client.setCallback(callback);//se asgina el puntero de la funcion creada para ejecutarse cada que llegue algun mensaje de un topico

  Ethernet.begin(mac, ip);//inicializa la configuracion de red
  //tiempo para que el hardware termine de inicializarse 
  delay(2000);
}

//SENSORES

//creando parametros para la medicion de temperatura

float tempCelsius=0;//valor de la temperatura en celsius
String tempS;//crear una variable que almacenara la conversion a String del num
char tempToSend[10];//variable que almacenara la conversion del String a array de chars

//definiendo la funcion que enviara la temperatura(Publicador)
void sendTemp(){
  tempSensor.requestTemperatures();   //Se envía el comando para leer la temperatura
  tempCelsius= tempSensor.getTempCByIndex(0); //Se obtiene la temperatura en ºC
  Serial.print("Temperatura: ");
  Serial.println(tempCelsius);
  tempS = String(tempCelsius);//convierto a string
  tempS.toCharArray(tempToSend,tempS.length()+1);//convierto a cadena de chars
  client.publish("temperature",tempToSend); //envio la temperatura al serv. web
}

//creando parametros para la medicion de distancia

float timemS=0;//tiempo de ida y regreso de señal en microsegundos
float distance=0;//valor de la distancia
String distanceS;//crear una variable que almacenara la conversion a String del num
char distanceToSend[20];//variable que almacenara la conversion del String a array de chars

//definiendo la funcion que enviara la distancia de objeto a la puerta
void sendDistance(){
  digitalWrite(trig,LOW);
  delayMicroseconds(5);
  digitalWrite(trig,HIGH);
  delayMicroseconds(10);
  timemS=pulseIn(echo,HIGH);
  distance=int(0.017*timemS);
  Serial.print("Distancia: ");
  Serial.print(distance);
  Serial.println(" cm");
  distanceS=String(distance);//convirtiendo a string
  distanceS.toCharArray(distanceToSend,distanceS.length()+1);//convirtiendo a cadena de chars
  client.publish("distance",distanceToSend);//enviar la distancia al servidor web
}

//CONTROL DE LEDS, VENTILADOR Y PUERTA

//definiendo la funcion que encendera/apagara el led 1
void onOffLed1(char state){
  if(state=='1'){
    digitalWrite(led1,HIGH);
  }else{
    digitalWrite(led1,LOW);
  }
}

//definiendo la funcion que encendera/apagara el led 2
void onOffLed2(char state){
  if(state=='1'){
    digitalWrite(led2,HIGH);
  }else{
    digitalWrite(led2,LOW);
  }
}

//definiendo la funcion que encendera/apagara el ventilador
void onOffFan(char state){
  if(state=='1'){
    digitalWrite(fan,HIGH);
    Serial.println("ventilador encendido");
  }else{
    digitalWrite(fan,LOW);
    Serial.println("ventilador apagado");
  }
}

//definiendo la funcion que manejara el control automatico del ventilador
void automaticControlFan(){
  if(tempCelsius>tempMax){
    digitalWrite(fan,HIGH);
    Serial.println("ventilador encendido");
  }else{
    digitalWrite(fan,LOW);
    Serial.println("ventilador apagado");
  }
}

//definiendo la funcion que habilitara control automatico/manual de ventilacion
void enableDisableAutomaticFan(char state){
  if(state=='1'){//habilitando control automatico del puerta
    client.unsubscribe("fanState");//desuscribiendo del topico llamado controlDoor
    //HABILITAR LA FUNCION DE ENCENDIDO/APAGADO AUTOMATICO DEL VENTILADOR EN EL VOID LOOP
    controlFan='A';
    Serial.println("Desuscrito de fanState");
  }else{//habilitando control manual de la puerta
    digitalWrite(fan,LOW);
    client.subscribe("fanState");
    controlFan='M';
    Serial.println("Suscrito a fanState nuevamente");
  }
}

//funciones basicas para el control de la puerta
const int timeDoor=450;//establecer tiempo para abrir la puerta
//funcion que abrira la puerta
void openDoor(){
  Serial.println("Girando el motor en sentido 1");
  digitalWrite(redMotorDoor,HIGH);
  digitalWrite(blackMotorDoor,LOW);  
  delay(timeDoor); 
  digitalWrite(redMotorDoor,LOW);
 }
//funcion que cerrara la puerta
 void closeDoor(){
  Serial.println("Girando el motor en sentido -1");
  digitalWrite(blackMotorDoor,HIGH);
  digitalWrite(redMotorDoor,LOW);  
  delay(timeDoor); 
  digitalWrite(blackMotorDoor,LOW);
 }

//definiendo la funcion que manejara control manual de la puerta
void openCloseDoor(char state){
  if(state=='1' && stateOfDoor=='C'){//abriendo
    Serial.println("Abriendo puerta...");
    openDoor();
    stateOfDoor='O';
    Serial.println("Puerta abierta");
  }else if(state=='1' && stateOfDoor=='O'){//cerrando
    Serial.println("La puerta ya esta abierta");
  }else if(state=='0' && stateOfDoor=='O'){//cerrando
    Serial.println("Cerrando puerta...");
    closeDoor();
    stateOfDoor='C';
    Serial.println("Puerta cerrada");
  }else if(state=='0' && stateOfDoor=='C'){//cerrando
    Serial.println("La puerta ya esta cerrada");
  }
}

//definiendo la funcion que manejara control automatico de la puerta
void automaticControlDoor(){
  if(distance<dMin && stateOfDoor=='C'){
    Serial.println("Abriendo puerta...");
    openDoor();
    stateOfDoor='O';
    Serial.println("Puerta abierta");
  }else if(distance>=dMin && stateOfDoor=='O'){
    Serial.println("Cerrando puerta...");
    closeDoor();
    stateOfDoor='C';
    Serial.println("Puerta cerrada");
  }
}

//definiendo la funcion que establecera control automatico/manual de la puerta
void enableDisableAutomaticDoor(char state){
  if(state=='1'){//habilitando control automatico de la puerta
    client.unsubscribe("doorState");//desuscribiendo del topico llamado controlDoor
    //HABILITAR LA FUNCION DE APERTURA/CIERRE AUTOMATICO DE LA PUERTA EN EL VOID LOOP
    controlDoor='A';
    Serial.println("Desuscrito de doorState");
  }else{//habilitando control manual de la puerta
    if(stateOfDoor=='O'){//si la puerta esta abierta entonces se cerrara!
      Serial.println("Cerrando puerta...");
      closeDoor();
      stateOfDoor='C';
      Serial.println("Puerta cerrada");
    }
    client.subscribe("doorState");
    controlDoor='M';
    Serial.println("Suscrito a doorState nuevamente");
  }
}

//estableciendo las funciones que se ejecutaran en bucle
void loop(){
  if (!client.connected()) {//si es que el cliente no esta conectado se asegura que vuelva a conectarse
    reconnect();
  }
  client.loop();//funcion que se llama regularmente y permite procesar mensajes entrantes y mantener la conexion con el servidor
  sendTemp();
  sendDistance();
  if(controlDoor=='A'){
    automaticControlDoor();
  }
  if(controlFan=='A'){
    automaticControlFan();
  }
  delay(1000);
}
