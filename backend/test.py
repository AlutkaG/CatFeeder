#!/usr/bin/python

import time
from flask import Flask

app = Flask(__name__)

@app.route('/time')
def ala():
  return 'Ala'
