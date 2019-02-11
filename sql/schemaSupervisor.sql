-- Create a new MySQL table called departments. Your table should include the following columns:

-- department_id
-- department_name
-- over_head_costs (A dummy number you set for each department)

-- DROP DATABASE IF EXISTS bamazon;

-- CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  overhead_costs INT NOT NULL,
  PRIMARY KEY (department_id)
  );
