import time
import w1thermsensor
from flask import Flask

app = Flask(__name__)
#app.config['CORS_HEADERS'] = 'Content-Type'
#cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

sensor = w1thermsensor.W1ThermSensor()

@app.route("/api/v1/time")
def get_current_time():
  return {'time': time.time()}

@app.route("/api/v1/temp")
def get_current_temp():
  temp = sensor.get_temperature()
  return {'temp': temp}

if __name__ == "__main__":
  app.run(host='0.0.0.0',debug=True)
