-- 1. Create a MySQL Database called `bamazon`.

-- 2. Then create a Table inside of that database called `products`.

-- 3. The products table should have each of the following columns:

--    * item_id (unique id for each product)

--    * product_name (Name of product)

--    * department_name

--    * price (cost to customer)

--    * stock_quantity (how much of the product is available in stores)

--    * Modify the products table so that there's a product_sales column

DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(45) NULL,
  price decimal(10, 4) NULL,
  stock_quantity INT NOT NULL,
  product_sales decimal(10, 4) NULL,
  PRIMARY KEY (item_id)
  );
