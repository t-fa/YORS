-- Authors: Janet Anderson and Thomas Fattah
-- Step: 6 Draft
-- Date: May 31, 2020
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

-- Get the planets currently in the database to perform a filter based on planet name
SELECT DISTINCT `customerPlanet` FROM `Customers` ORDER BY `customerPlanet` ASC;

-- The search filters will search for customers by first name, last name, or first and last name.
-- Below are the queries based on which option the user enters in the first and/or last name search box.
-- First name only
SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers` 
WHERE `customerFirstName` LIKE '% :userFirstNameInput %'; 

-- Last name only
SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers` 
WHERE `customerLastName` LIKE '% :userLastNameInput %'; 

-- First and last name
SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers` 
WHERE `customerFirstName` LIKE '% :userFirstNameInput %' AND `customerLastName` LIKE '% :userLastNameInput %'; 

-- Filtering option that will filter the customer results based on the customer's planet.
-- Below are the queries based on which option the user selects from the drop-down options,
-- which are dynamically populated by the query above to get the DISTINCT customer planets
SELECT `customerID`, `customerFirstName`, `customerLastName`, `customerPlanet` FROM `Customers` 
WHERE `customerPlanet` = :customerPlanetSelection;

-- Query to insert a new customer functionality with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `Customers` (`customerFirstName`, `customerLastName`, `customerPlanet`) 
VALUES (:customerFirstNameInput, :customerLastNameInput, :customerPlanetSelection);


-- ------------------------------------------------------
-- For the Orders webpage, the SELECT, INSERT, UPDATE, and DELETE CRUD functionalities are needed.

-- Get the orderID, customerID, customerName, orderDate, galacticPay, orderBeamed, itemID, item Type, and
-- quantity to be displayed in a table that will serve for both the Orders Entity and the orderItem relationship
SELECT `Orders`.`orderID` AS "orderID", `orderDate`, `galacticPay`, `orderBeamed`, `Orders`.`customerID` AS "customerID", 
`Customers`.`customerFirstName` AS "customerFirstName", `Customers`.`customerLastName` AS "customerLastName", 
`OrderItem`.`itemID` AS "itemID", `OrderItem`.`quantity` AS "quantity", `Items`.`itemType` AS "itemType" FROM `Orders` 
LEFT JOIN `Customers` ON `Orders`.`customerID` = `Customers`.`customerID` 
LEFT JOIN `OrderItem` ON `Orders`.`orderID` = `OrderItem`.`orderID` 
LEFT JOIN `Items` ON `OrderItem`.`itemID` = `Items`.`itemID`;

-- Get the customerID, customerFirstName, and customerLastName currently in the database to create a 
-- dynamically populated drop down menu for INSERT form
SELECT `customerID`, `customerFirstName`, `customerLastName` FROM `Customers` ORDER BY `customerID` ASC;

-- Get the itemID and itemType currently in the database to create a dynamically populated drop down 
-- menu for INSERT form
SELECT `itemID`, `itemType` FROM `Items` ORDER BY `itemID` ASC;

-- Get the orderIDs currently in the database to create a dynamically populated drop down menu for 
-- INSERT form
SELECT `orderID` FROM `Orders` ORDER BY `orderID` ASC;

-- Query to insert a new order functionality with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `Orders` (`customerID`,  `orderBeamed`, `orderDate`, `galacticPay`) 
VALUES (:customerIDSelection, :orderBeamedSelection, :orderDateInput, :galacticPaySelection);

-- Query to insert an item with a new order functionality with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `OrderItem` (`orderID`, `itemID`, `quantity`) 
VALUES (:valueGottenFromQuery,:itemIDSelection,:quantitySelection)

-- Query to delete an orderItem relationship functionality with colon : chracter being used to 
-- denote the variables that will have data passed from the front end
DELETE FROM `orderItem` WHERE `orderID` = :orderIDSelected AND `itemID` = :itemIDSelected;


-- ------------------------------------------------------
-- For the Items webpage, the SELECT and INSERT CRUD functionalities are needed.

-- Get the itemID, itemType, supplierID, YeOldePrice, and currentQuantity to be displayed in a table
SELECT `itemID`, `itemType`, `YeOldePrice`, `currentQuantity`, `Items`.`supplierID` AS "supplierID", 
`Suppliers`.`supplierName` AS "supplierName"  FROM `Items` 
LEFT JOIN `Suppliers` ON `Items`.`supplierID` = `Suppliers`.`supplierID`;

-- Get the supplierID and supplierName currently in the database to create a dynamically populated 
SELECT `supplierID`, `supplierName` FROM `Suppliers` ORDER BY `supplierID` ASC;

-- Query to insert a new item functionality (supplierID != NULL) with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `Items` (`itemType`, `supplierID`, `YeOldePrice`, `currentQuantity`) 
VALUES (:itemTypeInput, :supplierIDSelection, :YeOldePriceInput, :currentQuantityInput);

-- Query to insert a new item functionality (supplierID == NULL) with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `Items` (`itemType`, `YeOldePrice`, `currentQuantity`) 
VALUES (:itemTypeInput, :YeOldePriceInput, :currentQuantityInput);

-- Query to get the information for the item that the user selects to update


-- Query to update an order functionality with colon : character being used to 
-- denote the variables that will have data passed from the front end
UPDATE `Items` 
SET  `itemType` = :itemTypeText,
`YeOldePrice` = :YeOldePriceInput,
`currentQuantity` = :currentQuantityInput
WHERE `itemID` = :itemIDSelected;

-- Query to delete an Item functionality with colon : chracter being used to 
-- denote the variables that will have data passed from the front end
DELETE FROM `Items` WHERE `itemID` = :itemIDSelected;


-- ------------------------------------------------------
-- For the Purchases webpage, the SELECT and INSERT CRUD functionalities are needed.

-- Get the purchaseID, purchaseDate, customerID, customerFirstName, 
-- and customerLastName to be displayed in a table
SELECT `purchaseID`, `purchaseDate`, `Purchases`.`customerID` AS "customerID", 
`Customers`.`customerFirstName` AS "customerFirstName", 
`Customers`.`customerLastName` AS "customerLastName" FROM `Purchases` 
LEFT JOIN `Customers` ON `Purchases`.`customerID`=`Customers`.`customerID`;

-- Get the customer information to add a new purchase
SELECT `customerID`, `customerFirstName`, `customerLastName` FROM `Customers` ORDER BY `customerID` ASC;

-- Query to insert a new purchase functionality with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `Purchases` (`purchaseDate`, `customerID`) VALUES (:purchaseDate, :customerIDSelection);


-- ------------------------------------------------------
-- For the Suppliers webpage, the SELECT and INSERT CRUD functionalities are needed.

-- Get the supplierID, supplierName, and supplierPlanet to be displayed in a table
SELECT `supplierID`, `supplierName`, `supplierPlanet` FROM `Suppliers`;

-- Query to insert a new supplier functionality with colon : character being used to
-- denote the variables that will have data passed from the front end
INSERT INTO `Suppliers` (`supplierName`, `supplierPlanet`) VALUES (:supplierNameInput, :supplierPlanetInput);