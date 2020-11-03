import RPi.GPIO as GPIO
from time import *

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(6, GPIO.OUT) #serwo−pin 6
GPIO.setup(25, GPIO.IN) #czujnij - jest czy nie ma karmy
GPIO.setup(20, GPIO.OUT) #zielona  dioda
pwm = GPIO.PWM(6, 50) #czest. 50Hz

if(GPIO.input(25) == 0 ): #Jezeli w zrobioniku jest karma
    pwm.start(0)
    try:
      GPIO.output(20, GPIO.HIGH) #Zapal diode zielona
      pwm.ChangeDutyCycle(7.5) #wykonaj maly  obrot
      sleep(1.5) #odczekaj 1.5 s
      pwm.ChangeDutyCycle(11.5) #wykonaj  drugi  maly  obrot w tyl
      sleep(1.5) #odczekaj  1.5 s
      GPIO.output(20,GPIO.LOW) #Wylacz  diode  zielona
    except KeyboardInterrupt:
      pwm.stop()
      GPIO.cleanup()
