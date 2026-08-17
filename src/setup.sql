CREATE DATABASE IF NOT EXISTS starwars_db;

USE starwars_db;

CREATE TABLE IF NOT EXISTS starwarscharacters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  height VARCHAR(20),
  mass VARCHAR(20),
  birth_year VARCHAR(20),
  homeworld VARCHAR(100)
);

INSERT INTO starwarscharacters (name, height, mass, birth_year, homeworld) VALUES
  ('Luke Skywalker', '172', '77', '19BBY', 'Tatooine'),
  ('Leia Organa', '150', '49', '19BBY', 'Alderaan'),
  ('Han Solo', '180', '80', '29BBY', 'Corellia'),
  ('Darth Vader', '202', '136', '41.9BBY', 'Tatooine'),
  ('Yoda', '66', '17', '896BBY', 'unknown');
