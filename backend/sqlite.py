#!/usr/bin/python

import sqlite3

conn = sqlite3.connect('database.db')
print "Opened database successfully";

conn.execute('CREATE TABLE pet (id INTEGER PRIMARY KEY, name TEXT, type TEXT, portion INTEGER, hours CHAR, minutes CHAR, active INTEGER, user TEXT)')
conn.execute('CREATE TABLE report (id INTEGER PRIMARY KEY, date TEXT, action TEXT, pet TEXT, user TEXT)')
conn.execute('CREATE TABLE event (id INTEGER PRIMARY KEY, blue INTEGER, user TEXT)')
conn.execute('CREATE TABLE user (id INTEGER PRIMARY KEY, name TEXT, password TEXT, q1 TEXT)')
#q1 - What's the name of your favorite pet?
#conn.execute('CREATE TABLE keys (id INTEGER PRIMARY KEY, key TEXT, use INTEGER)')
print "Table created successfully";
conn.close()
