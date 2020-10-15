
import sqlite3 as sql
from time import *
from flask import Flask, jsonify, render_template, request
from w1thermsensor import W1ThermSensor
import RPi.GPIO as GPIO
from flask_crontab import Crontab
from flask_cors import CORS

app = Flask(__name__)
crontab = Crontab(app)
CORS(app)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

GPIO.setup(6, GPIO.OUT) #serwo−pin 6
GPIO.setup(25, GPIO.IN) #czujnij - jest czy nie ma karmy
GPIO.setup(20, GPIO.OUT) #zielona  dioda

pwm = GPIO.PWM(6, 50) #czest. 50Hz
#pwm.start(0)
sensor = W1ThermSensor()


def dict_factory(cursor, row):
  d = {}
  for idx, col in enumerate(cursor.description):
    d[col[0]] = row[idx]
  return d

@app.route("/api/v1/time")
def get_current_time():
  timee = {'time': time.time()}
  return jsonify(timee)

@app.route("/api/v1/temp")
def get_current_temp():
  temp = sensor.get_temperature()
  data = {'temp': temp}
  return jsonify(data)

@app.route("/api/v1/activate")
def action():
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
    return 'ok'
  else:
    return 'pusto'

@app.route("/api/v1/addpet", methods = ['POST'])
def addpet():
  if request.method == "POST":
    req = request.get_json()
    name = req.get('name')
    type = req.get('type')
    portion = req.get('portion')
    hours = req.get('hours')
    minutes = req.get('minutes')
    active = req.get('active')

    hours = hours.replace("[", " ").replace("]", " ")
    minutes = minutes.replace("[", " ").replace("]", " ")
    with sql.connect("database.db") as con:
            cur = con.cursor()
            cur.execute("INSERT INTO pet (name,type,portion,hours,minutes,active) VALUES (?,?,?,?,?,?)",(name,type,portion,hours,minutes,active) ) 
            con.commit()
    return 'ok'
    con.close()


@app.route("/api/v1/update", methods= ['POST'])
def updatepet():
  if request.method == "POST":
    req = request.get_json()
    id = req.get('id')
    name = req.get('name')
    type = req.get('type')
    portion = req.get('portion')
    hours = req.get('hours')
    minutes = req.get('minutes')
    active = req.get('active')

    hours = hours.replace("[", " ").replace("]", " ")
    minutes = minutes.replace("[", " ").replace("]", " ")

    with sql.connect("database.db") as con:
      cur = con.cursor()
      cur.execute("UPDATE pet SET name = ?, type = ?, portion = ?, hours = ?, minutes = ?, active = ? WHERE id = ?", (name,type,portion,hours,minutes,active,id) )
      con.commit()
    return 'ok'
    con.close()

@app.route('/api/v1/delete', methods=['POST'])
def delete_pet():
  if request.method == "POST":
    req = request.get_json()
    id = req.get('id')

    with sql.connect("database.db") as con:
      cur = con.cursor()
      cur.execute("DELETE FROM pet WHERE id = ?", (id, ) )
      con.commit()
    return 'ok'
    con.close()


@app.route("/api/v1/disabled", methods = ['POST'])
def disabled_active_pet():
  if request.method == "POST":
    req = request.get_json()
    id = req.get('idDis')
    with sql.connect("database.db") as con:
      cur = con.cursor()
      cur.execute("UPDATE pet SET active = 0 WHERE id = ?", (id, ) )
      con.commit()
    return 'ok'
    con.close()

@app.route("/api/v1/enabled", methods = ['POST'])
def enabled_active_pet():
  if request.method == "POST":
    req = request.get_json()
    id = req.get('idEn')
    with sql.connect("database.db") as con:
      cur = con.cursor()
      cur.execute("UPDATE pet SET active = 0 WHERE id != ?", (id, ) )
      con.commit()
      cur.execute("UPDATE pet SET active = 1 WHERE id = ?", (id, ) )
      con.commit()
    return 'ok'
    con.close()

@app.route('/api/v1/list')
def list():
   con = sql.connect("database.db")
   con.row_factory = dict_factory #sql.Row
   cur = con.cursor()
   cur.execute("select * from pet")
   rows = cur.fetchall();
   return jsonify(rows)

@app.route('/api/v1/getActiveId')
def get_active_id():
  con = sql.connect("database.db")
  cur = con.cursor()
  cur.execute("SELECT * FROM pet")
  count = len(cur.fetchall())
  if count != 0:
    cur.execute("SELECT id FROM pet WHERE active = 1")
    id = cur.fetchone()
    if id is None:
      _id = {'id': 0}
    else:
      _id = {'id': id[0]}
  else:
    _id = {'id': 0}
  return jsonify(_id)


def get_current_pet_hours():
  con = sql.connect("database.db")
  cur = con.cursor()
  count = cur.execute("SELECT * FROM pet")
  count = len(cur.fetchall())
  if count != 0:
    cur.execute("SELECT hours FROM pet WHERE active = 1" )
    _hours = cur.fetchone()
    if _hours is None:
      h = '-1'
    else:
      h = str(_hours[0])
  else:
    print ('e')
    h = '-1'
  return h

def get_current_pet_minutes():
  con = sql.connect("database.db")
  cur = con.cursor()
  count = cur.execute("SELECT * FROM pet")
  count = len(cur.fetchall())
  if count != 0:
    cur.execute("SELECT minutes FROM pet WHERE active = 1" )
    _min = cur.fetchone()
    if _min is None:
      min = '-1'
    else:
      min = str(_min[0])
  else:
    min = '-1'
  return min

@crontab.job(minute= get_current_pet_minutes(), hour= get_current_pet_hours())
def my_scheduled_job():
  print ('hej')
   #GPIO.output(20, GPIO.HIGH)
   #sleep(3)
   #GPIO.output(20, GPIO.LOW)

if __name__ == "__main__":
  app.run(host='0.0.0.0',debug=True)
