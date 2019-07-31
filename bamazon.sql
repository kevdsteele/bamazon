DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  Product_ID INT NOT NULL AUTO_INCREMENT,
  Product_Name VARCHAR(100) NOT NULL,
  Product_Sales DECIMAL(10,2) NULL,
  Department_Name VARCHAR(45) NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  Stock_Quantity INT NOT NULL,
  PRIMARY KEY (Product_ID)
);


INSERT INTO products (Product_Name, Product_Sales, Department_Name, Price, Stock_Quantity)
VALUES ("Sony TV",20000, "Electronics", 750.99, 10),("Samsung TV",30000, "Electronics", 950.00, 2), ("Mens Large Polo",15000, "Mens Clothing", 50.00, 6), ("Mens Medium Polo",10000, "Mens Clothing", 40.50, 7), ("Womens Medium Blouse", 25000,"Womens Clothing", 60.00, 2),  ("Womens Small Blouse",30000, "Womens Clothing", 50.00, 3), ("Avengers End Game DVD", 15000, "Movies", 50.00, 0), ("The Davinci Code", 5000, "Books", 30.00, 6), ("Barbie Doll", 25000, "Toys", 25.00, 2), ("Nerf Gun", 7500,"Toys", 20.00, 7), ("Football", 6500, "Sports Equipment", 25.00, 8);

CREATE TABLE departments(
  Department_ID INT NOT NULL AUTO_INCREMENT,
  Department_Name VARCHAR(100) NOT NULL,
  Over_Head_Costs DECIMAL (10,2) NOT NULL,
  Product_Sales DECIMAL(10,2) NULL,
  PRIMARY KEY (Department_ID)
);

INSERT INTO departments (Department_Name, Over_Head_Costs)
VALUES ("Electronics", 60000), ("Mens Clothing", 20000), ('Womens Clothing', 30000), ("Movies", 15000), ("Toys", 25000), ("Books", 10000), ("Sports Equipment", 10000)