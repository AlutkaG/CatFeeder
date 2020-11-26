import sqlite3 as sql
from time import *
from flask import Flask, jsonify, render_template, request
from w1thermsensor import W1ThermSensor
import RPi.GPIO as GPIO
from flask_crontab import Crontab
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
crontab = Crontab(app)
CORS(app)

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

GPIO.setup(6, GPIO.OUT) #serwo−pin 6
GPIO.setup(25, GPIO.IN) #czujnik - jest czy nie ma karmy
GPIO.setup(18, GPIO.OUT) #TRIG
GPIO.setup(23, GPIO.IN) #ECHO
GPIO.setup(20, GPIO.OUT) #zielona  dioda
GPIO.setup(21, GPIO.OUT) #dioda czerwona

pwm = GPIO.PWM(6, 50) #czest. 50Hz
sensor = W1ThermSensor()


def dict_factory(cursor, row):
  d = {}
  for idx, col in enumerate(cursor.description):
    d[col[0]] = row[idx]
  return d

@app.route("/api/v1/register", methods=['POST'])
def registration():
  if request.method == "POST":
    req = request.get_json()
    name = req.get('name')
    password = req.get('password')
    q = req.get('question')

    con = sql.connect("database.db")
    cur = con.cursor()
    cur.execute("SELECT id FROM user WHERE name = ?", (str(name),))
    exist = cur.fetchone()
    if exist is None:
      cur.execute("INSERT INTO user (name,password, q1) VALUES (?,?,?)",(name,password,q))
      con.commit()
      response = {"msg": "Registration successful"}
    else:
      response = {"msg": "Account is already exist"}
    return jsonify(response)
    con.close()

@app.route("/api/v1/login", methods=['POST'])
def login():
  if request.method == "POST":
    req = request.get_json()
    name = req.get('name')
    password = req.get('password')

    con = sql.connect("database.db")
    cur = con.cursor()
    cur.execute("SELECT password FROM user WHERE name = ?", (str(name),))
    pswd = cur.fetchone()

    if pswd is None:
      response = {"msg": "Bad name"}
    elif str(pswd[0]) == str(password):
      response = {"msg": "Logged successful"}
    else:
      response = {"msg": "Bad password"}
    return jsonify(response)
    con.close()

@app.route("/api/v1/forgotPassword", methods=['POST'])
def change_pswd():
  if request.method == "POST":
    req = request.get_json()
    name = req.get('name')
    q = req.get('question')
    pswd = req.get('password')

    con = sql.connect("database.db")
    cur = con.cursor()
    cur.execute("SELECT q1 FROM user WHERE name = ?", (str(name),))
    q1 = cur.fetchone()
    if q1 is None:
      msg = {'msg': 'Bad name'}
    elif str(q1[0]) == q:
      cur.execute("UPDATE user SET password = ? WHERE name = ?",(pswd,name))
      con.commit()
      msg = {'msg': 'Change successful'}
    else:
      msg = {'msg': 'Bad answer'}
    return jsonify(msg)
    con.close()

@app.route("/api/v1/displayActivePet")
def disp_act_pet():
  con = sql.connect("database.db")
  cur = con.cursor()
  cur.execute("SELECT user FROM pet WHERE active = 1")
  user = cur.fetchone()
  if user is None:
    user = "0"
  else:
    user = str(user[0])
  cur.execute("SELECT name FROM pet WHERE active = 1")
  pet = cur.fetchone()
  if pet is None:
    pet = "0"
  else:
    pet = str(pet[0])
  info = {'user': user, 'pet': pet}
  return jsonify(info)
  con.close()

@app.route("/api/v1/temp")
def get_current_temp():
  temp = sensor.get_temperature()
  data = {'temp': temp}
  return jsonify(data)

@app.route("/api/v1/red/<user>")
def get_alert_no_feed(user):
  state = 0
  newState = GPIO.input(25)
  if(state != newState):
    state = newState
  if(state==0):
    out = {'red': '0'}
    con = sql.connect("database.db")
    cur = con.cursor()
    cur.execute("SELECT red FROM event WHERE id = 1")
    red = cur.fetchone()
    if red[0] == 1:
       cur.execute("UPDATE event SET red = 0 WHERE id = 1")
       con.commit()
  else:
    out = {'red': '1'}
    dateTime = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    act = "The tank is empty"
    name = get_current_pet()
    con = sql.connect("database.db")
    cur = con.cursor()
    cur.execute("SELECT red FROM event WHERE id = 1")
    red = cur.fetchone()
    if red[0] == 0:
       cur.execute("INSERT INTO report (date,action,pet,user) VALUES (?,?,?,?)",(dateTime,act,name,user) )
       cur.execute("UPDATE event SET red = 1 WHERE id = 1")
       con.commit()
  return jsonify(out)

@app.route("/api/v1/blue/<user>")
def get_alert_is_pet(user):
  while True:
    GPIO.output(18, True) #Ustawienie stanu wysokiego na wyjscie TRIG
    sleep(0.000001) #Wykonywanie pomiaru przez 10us
    GPIO.output(18, False) #Ustawienie stanu niskiego na wyjscie TRIG
    #Oczekiwanie na stan wysoki na ECHO
    _start = time()
    _stop = time()
    while GPIO.input(23) == 0:
      _start = time()
    #Oczekiwanie na stan niski na ECHO
    while GPIO.input(23) == 1:
      _stop = time()
    delaySignal = _stop - _start
    dist = int(delaySignal * 1000000/58) #Wynik w [cm] 
    sleep(1)
    if(dist>10 and dist<70): #Jezeli kot jest w odleglosci pomiedzy 10cm a 30cm
      blue = {'blue': 1}
      _blue = 1
      dateTime = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
      act = "The pet was nearby"
      name = get_current_pet()
      with sql.connect("database.db") as con:
        cur = con.cursor()
        cur.execute("INSERT INTO report (date,action,pet,user) VALUES (?,?,?,?)",(dateTime,act,name,user) )
        cur.execute("UPDATE event SET blue = 1 WHERE id = 1")
        con.commit()
    else:
      blue = {'blue': 0}
    return jsonify(blue)

@app.route("/api/v1/activate/<user>")
def action(user):
  if(GPIO.input(25) == 0 ): #Jezeli w zrobioniku jest karma
    pwm.start(0)
    try:
      GPIO.output(20, GPIO.HIGH) #Zapal diode zielona
      pwm.ChangeDutyCycle(7.5) #wykonaj maly  obrot
      sleep(1.5) #odczekaj 1.5 s
      pwm.ChangeDutyCycle(11.5) #wykonaj  drugi  maly  obrot w tyl
      sleep(1.5) #odczekaj  1.5 s
      GPIO.output(20,GPIO.LOW) #Wylacz  diode  zielona
      dateTime = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
      act = "Feeding pet"
      name = get_current_pet()
      with sql.connect("database.db") as con:
        cur = con.cursor()
        cur.execute("INSERT INTO report (date,action,pet,user) VALUES (?,?,?,?)",(dateTime,act,name,user) )
        con.commit()
      con.close()
    except KeyboardInterrupt:
      pwm.stop()
      GPIO.cleanup()
    return 'ok'
  else:
    return jsonify(new)


@app.route("/api/v1/addpet/<user>", methods = ['POST'])
def addpet(user):
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
    con = sql.connect("database.db")
    cur = con.cursor()
    cur.execute("SELECT type FROM pet WHERE name = ?",(str(name),))
    existName = cur.fetchone()
    if (existName is None):
      cur.execute("INSERT INTO pet (name,type,portion,hours,minutes,active,user) VALUES (?,?,?,?,?,?,?)",(name,type,portion,hours,minutes,active,user) ) 
      con.commit()
      msg = {'msg': 'ok'}
    else:
      msg = {'msg': 'Pet exist'}
    return jsonify(msg)
    con.close()


@app.route("/api/v1/update/<user>", methods= ['POST'])
def updatepet(user):
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

@app.route('/api/v1/delete/<user>', methods=['POST'])
def delete_pet(user):
  if request.method == "POST":
    req = request.get_json()
    id = req.get('id')
    name = req.get('name')

    with sql.connect("database.db") as con:
      cur = con.cursor()
      cur.execute("DELETE FROM pet WHERE id = ?", (id, ) )
      cur.execute("DELETE FROM report WHERE pet = ?", (str(name),))
      con.commit()
    return 'ok'
    con.close()


@app.route("/api/v1/disabled/<user>", methods = ['POST'])
def disabled_active_pet(user):
  if request.method == "POST":
    req = request.get_json()
    id = req.get('idDis') 
    with sql.connect("database.db") as con:
      cur = con.cursor()
      cur.execute("UPDATE pet SET active = 0 WHERE id = ?", (id, ) )
      con.commit()
    return 'ok'
    con.close()

@app.route("/api/v1/enabled/<user>", methods = ['POST'])
def enabled_active_pet(user):
  if request.method == "POST":
    req = request.get_json()
    id = req.get('idEn')
    with sql.connect("database.db") as con:
      cur = con.cursor()
      cur.execute("UPDATE pet SET active = 0 WHERE id != ?", (id,) )
      cur.execute("UPDATE pet SET active = 1 WHERE id = ?", (id, ) )
      con.commit()
    return 'ok'
    con.close()

@app.route('/api/v1/list/<user>')
def list(user):
   con = sql.connect("database.db")
   con.row_factory = dict_factory #sql.Row
   cur = con.cursor()
   cur.execute("select * from pet where user = ?", (user,))
   rows = cur.fetchall();
   return jsonify(rows)

@app.route('/api/v1/getActiveId/<user>')
def get_active_id(user):
  con = sql.connect("database.db")
  cur = con.cursor()
  cur.execute("SELECT * FROM pet")
  count = len(cur.fetchall())
  if count != 0:
    cur.execute("SELECT id FROM pet WHERE active = 1 AND user = ?", (user,))
    id = cur.fetchone()
    if id is None:
      _id = {'id': 0}
    else:
      _id = {'id': id[0]}
  else:
    _id = {'id': 0}
  return jsonify(_id)

@app.route('/api/v1/reportPet/<user>', methods = ['POST'])
def get_report(user):
  if request.method == "POST":
    req = request.get_json()
    name = req.get('name')

    con = sql.connect("database.db")
    con.row_factory = dict_factory
    cur = con.cursor()
    cur.execute("SELECT date,action FROM report WHERE pet = ? AND user = ?", (name,user) )
    info = cur.fetchall()
    if info is None:
      _info = 'No report'
    else:
      _info = info
    return jsonify(_info)

def get_current_pet():
  con = sql.connect("database.db")
  cur = con.cursor()
  cur.execute("SELECT * FROM pet")
  count = len(cur.fetchall())
  if count != 0:
    cur.execute("SELECT name FROM pet WHERE active = 1")
    name = cur.fetchone()
    if name is None:
      _name = "Noname"
    else:
      _name = str(name[0])
  else:
    _name = "Noname"
  return _name

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

def get_blue_value():
  con = sql.connect("database.db")
  cur = con.cursor()
  cur.execute("SELECT blue FROM event WHERE id = 1")
  _blue = cur.fetchone()
  blue = str(_blue[0])
  return blue

@crontab.job(minute= get_current_pet_minutes(), hour= get_current_pet_hours())
def my_scheduled_job():
  b = get_blue_value()
  if GPIO.input(25) == 0 and b == "1" : #Jezeli w zrobioniku jest karma i kot byl w poblizu miski
    pwm.start(0)
    try:
      GPIO.output(20, GPIO.HIGH) #Zapal diode zielona
      pwm.ChangeDutyCycle(7.5) #wykonaj maly  obrot
      sleep(1.5) #odczekaj 1.5 s
      pwm.ChangeDutyCycle(11.5) #wykonaj  drugi  maly  obrot w tyl
      sleep(1.5) #odczekaj  1.5 s
      GPIO.output(20,GPIO.LOW) #Wylacz  diode  zielona
      dateTime = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
      act = "The feed was automatically served"
      name = get_current_pet()
      with sql.connect("database.db") as con:
        cur = con.cursor()
        cur.execute("INSERT INTO report (date,action,pet) VALUES (?,?,?)",(dateTime,act,name) )
        con.commit()
        cur.execute("UPDATE event SET blue = 0 WHERE id = 1")
        con.commit()
    except KeyboardInterrupt:
      pwm.stop()
      GPIO.cleanup()
    return 'ok'
  else:
    return 'pusto'

if __name__ == "__main__":
  app.run(host='0.0.0.0',debug=True)
