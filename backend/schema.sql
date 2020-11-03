DROP TABLE IF EXISTS pet;
DROP TABLE IF EXISTS timeT;
DROP TABLE IF EXISTS pet_timeT;

CREATE TABLE pet (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  dose INTEGER NOT NULL
);

CREATE TABLE timeT (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hour INTEGER NOT NULL,
  minutes INTEGER NOT NULL
);

CREATE TABLE pet_timeT (
  pet_id INTEGER NOT NULL,
  timeT_id INTEGER NOT NULL,
  FOREIGN KEY(pet_id) REFERENCES pet(id),
  FOREIGN KEY(timeT_id) REFERENCES timeT(id)
);
