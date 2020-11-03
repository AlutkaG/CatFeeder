#!/usr/bin/python

import sqlite3

conn = sqlite3.connect('database.db')
print "Opened database successfully";

conn.execute('CREATE TABLE pet (id INTEGER PRIMARY KEY, name TEXT, type TEXT, portion INTEGER, hours CHAR, minutes CHAR, active INTEGER)')
print "Table created successfully";
conn.close()
