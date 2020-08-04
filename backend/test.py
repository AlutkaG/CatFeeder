#!/usr/bin/python

import time
from flask import Flask

app = Flask(__name__)

@app.route('/timr')
def ala():
  return 'Ala'
