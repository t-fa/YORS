-- Authors: Janet Anderson and Thomas Fattah
-- Step: 5 Draft
-- Date: May 25, 2020
-- Course: CS 340
-- Section: 400
-- Group: 24
-- Database manipulations for Ye Olde Shoppe online store 
-- which  that buys and sells robot parts.
-- ------------------------------------------------------

-- ------------------------------------------------------
-- For the Customers webpage, the SELECT and INSERT CRUD functionalities are needed.

-- Get the customerID, customerFirstName, customerLastName and customerPlanet to be displayed in a table
SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers`;

-- The search for names portion is planned to be a JavaScript function that will hide rows as needed, but
-- the dropdown selection will activate a SELECT query to re-display the table.
-- Below are the queries based on which option the user selects from the drop-down options.
SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers` WHERE `customerPlanet` = 'Earth';

SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers` WHERE `customerPlanet` = 'Jupiter';

SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers` WHERE `customerPlanet` = 'Ergotron V';

SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers` WHERE `customerPlanet` = 'Machina';

SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers` WHERE `customerPlanet` = 'Chin Thum';

-- Query to insert a new customer functionality with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `Customers` (`customerFirstName`, `customerLastName`, `customerPlanet`) 
VALUES (:customerFirstNameInput, :customerLastNameInput, :customerPlanetInput);


-- ------------------------------------------------------
-- For the Orders webpage, the SELECT, INSERT, UPDATE, and DELETE CRUD functionalities are needed.

-- Get the orderID, customerID, orderDate, galacticPay, and orderBeamed to be displayed in a table
SELECT `orderID`, `customerID`, `orderDate`, `galacticPay`, `orderBeamed` FROM `Orders`;

-- Query to insert a new order functionality with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `Orders` (`customerID`, `orderDate`, `galacticPay`, `orderBeamed`) 
VALUES (:customerIDSelectionChoice, :orderDateInput, :galacticPayInput, :orderBeamedSelectionChoice);

-- Query to update an order functionality with colon : character being used to 
-- denote the variables that will have data passed from the front end
UPDATE `Orders` 
SET `customerID` = :customerIDInput, 
`orderDate` = :orderDateInput,
`galaticPay` = :galacticPayInput,
`orderBeamed` = :orderBeamedRadioButtonChoice
WHERE `orderID` = :orderIDFromTheUpdateForm;

-- Query to delete an order functionality with colon : chracter being used to 
-- denote the variables that will have data passed from the front end
DELETE FROM `Orders` WHERE `orderID` = :orderIDSelectedFromOrdersTable;


-- ------------------------------------------------------
-- For the Items webpage, the SELECT and INSERT CRUD functionalities are needed.

-- Get the itemID, itemType, supplierID, YeOldePrice, and currentQuantity to be displayed in a table
SELECT `itemID`, `itemType`, `SupplierID`, `YeOldePrice`, `currentQuantity` FROM `Items`;

-- Query to insert a new item functionality with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `Items` (`itemType`, `supplierID`, `YeOldePrice`, `currentQuantity`) 
VALUES (:itemType, :supplierID, :YeOldePrice, :currentQuantity);

INSERT INTO `Items` (`itemType`, `YeOldePrice`, `currentQuantity`) 
VALUES (:itemType, :YeOldePrice, :currentQuantity);


-- ------------------------------------------------------
-- For the OrderItem webpage, the SELECT and INSERT CRUD functionalities are needed.

-- Get the orderID, itemID, and quantity to be displayed in a table
SELECT `orderID`, `itemID`, `quantity` FROM `OrderItem`;

-- Query to insert an item into an order functionality with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `OrderItem` (`orderID`, `itemID`, `quantity`) VALUES (:orderID, :itemID, :quantity);

-- Query to delete an item from an order functionality with colon : chracter being used to 
-- denote the variables that will have data passed from the front end
DELETE FROM `OrderItem` WHERE `orderID` = :orderIDSelectedFromOrdersTable
AND `itemID` = :itemIDSelectedFromOrdersTable;


-- ------------------------------------------------------
-- For the Purchases webpage, the SELECT and INSERT CRUD functionalities are needed.

-- Get the purchaseID, purchaseDate, and customerID to be displayed in a table
SELECT `purchaseID`, `purchaseDate`, `customerID` FROM `Purchases`;

-- Query to insert a new purchase functionality with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `Purchases` (`purchaseDate`, `customerID`) VALUES (:purchaseDate, :customerID);


-- ------------------------------------------------------
-- For the Suppliers webpage, the SELECT and INSERT CRUD functionalities are needed.

-- Get the supplierID, supplierName, and supplierPlanet to be displayed in a table
SELECT `supplierID`, `supplierName`, `supplierPlanet` FROM `Suppliers`;

-- Query to insert a new supplier functionality with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `Suppliers` (`supplierName`, `supplierPlanet`) VALUES (:supplierName, :supplierPlanet);