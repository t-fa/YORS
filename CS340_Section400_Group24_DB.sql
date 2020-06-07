-- Authors: Janet Anderson and Thomas Fattah
-- Step: 7 (Final Portfolio)
-- Date: June 5, 2020
-- Course: CS 340
-- Section: 400
-- Group: 24
-- Database for Ye Olde Shoppe employee web pages to view customers, orders, items, purchases, suppliers
-- and items in an order.  Employees can also add new entries for each entity, update item information, 
-- search and filter customers, delete an item, and delete an item from an order. 
-- -------------------------------------------------------------------------------------------------------

-- a) Data Definition Queries

--
-- Table structure for table `Customers`
--

DROP TABLE IF EXISTS `Customers`;
CREATE TABLE `Customers` (
  `customerID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customerFirstName` varchar(255) NOT NULL,
  `customerLastName` varchar(255) NOT NULL,
  `customerPlanet` varchar(255) NOT NULL
) ENGINE=INNODB DEFAULT CHARSET=latin1;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
CREATE TABLE `Orders` (
  `orderID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customerID` int(11) NOT NULL,
  `orderDate` date NOT NULL,
  `galacticPay` boolean NOT NULL,
  `orderBeamed` boolean NOT NULL,
  CONSTRAINT `orders_fk_1` FOREIGN KEY (`customerID`) REFERENCES `Customers` (`customerID`) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=latin1;


--
-- Table structure for table `Suppliers`
--

DROP TABLE IF EXISTS `Suppliers`;
CREATE TABLE `Suppliers` (
  `supplierID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `supplierName` varchar(255) NOT NULL,
  `supplierPlanet` varchar(255) NOT NULL
) ENGINE=INNODB DEFAULT CHARSET=latin1;


--
-- Table structure for table `Items`
--

DROP TABLE IF EXISTS `Items`;
CREATE TABLE `Items` (
  `itemID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `itemType` varchar(255) NOT NULL,
  `supplierID` int(11) DEFAULT NULL,
  `YeOldePrice` decimal(8,2) NOT NULL,
  `currentQuantity` int(11) NOT NULL,
  CONSTRAINT `Items_fk_1` FOREIGN KEY (`supplierID`) REFERENCES `Suppliers` (`supplierID`) ON DELETE SET NULL
) ENGINE=INNODB DEFAULT CHARSET=latin1;


--
-- Table structure for table `Purchases`
--

DROP TABLE IF EXISTS `Purchases`;
CREATE TABLE `Purchases` (
  `purchaseID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `purchaseDate` date NOT NULL,
  `customerID` int(11) NOT NULL,
  CONSTRAINT `Purchases_fk_1` FOREIGN KEY (`customerID`) REFERENCES `Customers` (`customerID`) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=latin1;


--
-- Table structure for intersection table `OrderItem`
--

DROP TABLE IF EXISTS `OrderItem`;
CREATE TABLE `OrderItem` (
  `orderID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`orderID`, `itemID`),
  CONSTRAINT `OrderItem_fk_1` FOREIGN KEY (`orderID`) REFERENCES `Orders` (`orderID`) ON DELETE CASCADE,
  CONSTRAINT `OrderItem_fk_2` FOREIGN KEY (`itemID`) REFERENCES `Items` (`itemID`) ON DELETE CASCADE
) ENGINE=INNODB DEFAULT CHARSET=latin1;




-- -------------------------------------------------------------------------------------------------------

-- b) Sample Data

--
-- Sample data for table `Customers`
--
INSERT INTO `Customers` (`customerFirstName`, `customerLastName`, `customerPlanet`) VALUES ('Bob', 'Saget', 'Earth');
INSERT INTO `Customers` (`customerFirstName`, `customerLastName`, `customerPlanet`) VALUES ('Kayne', 'West', 'Jupiter');
INSERT INTO `Customers` (`customerFirstName`, `customerLastName`, `customerPlanet`) VALUES ('VR', '2103', 'Ergotron V');
INSERT INTO `Customers` (`customerFirstName`, `customerLastName`, `customerPlanet`) VALUES ('CRK', '42', 'Machina');
INSERT INTO `Customers` (`customerFirstName`, `customerLastName`, `customerPlanet`) VALUES ('PR', '007', 'Chin Thum');


--
-- Sample data for table `Orders`
--
INSERT INTO `Orders` (`customerID`, `orderDate`, `galacticPay`, `orderBeamed`) VALUES ('1', '2020-01-01', '1', '1');
INSERT INTO `Orders` (`customerID`, `orderDate`, `galacticPay`, `orderBeamed`) VALUES ('2', '2020-01-01', '0', '1');
INSERT INTO `Orders` (`customerID`, `orderDate`, `galacticPay`, `orderBeamed`) VALUES ('3', '2020-01-02', '0', '1');
INSERT INTO `Orders` (`customerID`, `orderDate`, `galacticPay`, `orderBeamed`) VALUES ('1', '2020-01-03', '1', '0');
INSERT INTO `Orders` (`customerID`, `orderDate`, `galacticPay`, `orderBeamed`) VALUES ('4', '2020-01-04', '1', '0');


--
-- Sample data for table `Suppliers`
--
INSERT INTO `Suppliers` (`supplierName`, `supplierPlanet`) VALUES ('Robot Renovators', 'Coruscant');
INSERT INTO `Suppliers` (`supplierName`, `supplierPlanet`) VALUES ('Robotronics', 'Coruscant');
INSERT INTO `Suppliers` (`supplierName`, `supplierPlanet`) VALUES ('Gear Suppliers, Inc.', 'Death Star');
INSERT INTO `Suppliers` (`supplierName`, `supplierPlanet`) VALUES ("Not The Droid You're Looking For", 'Tattooine');
INSERT INTO `Suppliers` (`supplierName`, `supplierPlanet`) VALUES (	'C-3PO', 'Tattooine');


--
-- Sample data for table `Items`
--
INSERT INTO `Items` (`itemType`, `supplierID`, `YeOldePrice`, `currentQuantity`) VALUES ('Processor', '2', '750.99', '3');
INSERT INTO `Items` (`itemType`, `supplierID`, `YeOldePrice`, `currentQuantity`) VALUES ('RAM', '5', '250.99', '10');
INSERT INTO `Items` (`itemType`, `supplierID`, `YeOldePrice`, `currentQuantity`) VALUES ('SSD', '2', '169.99', '4');
INSERT INTO `Items` (`itemType`, `supplierID`, `YeOldePrice`, `currentQuantity`) VALUES ('Hard Drive', '3', '59.99', '7');
INSERT INTO `Items` (`itemType`, `supplierID`, `YeOldePrice`, `currentQuantity`) VALUES ('Motherboard', '1', '119.99', '1');


--
-- Sample data for table `Purchases`
--
INSERT INTO `Purchases` (`purchaseDate`, `customerID`) VALUES ('2020-01-20', '3');
INSERT INTO `Purchases` (`purchaseDate`, `customerID`) VALUES ('2020-03-13', '5');
INSERT INTO `Purchases` (`purchaseDate`, `customerID`) VALUES ('2020-03-13', '5');
INSERT INTO `Purchases` (`purchaseDate`, `customerID`) VALUES ('2020-03-14', '2');
INSERT INTO `Purchases` (`purchaseDate`, `customerID`) VALUES ('2020-04-24', '1');


--
-- Sample data for table `OrderItem`
--
INSERT INTO `OrderItem` (`OrderID`, `itemID`, `quantity`) VALUES ('1', '1', '2');
INSERT INTO `OrderItem` (`OrderID`, `itemID`, `quantity`) VALUES ('1', '2', '1');
INSERT INTO `OrderItem` (`OrderID`, `itemID`, `quantity`) VALUES ('2', '3', '4');
INSERT INTO `OrderItem` (`OrderID`, `itemID`, `quantity`) VALUES ('3', '1', '3');
INSERT INTO `OrderItem` (`OrderID`, `itemID`, `quantity`) VALUES ('3', '4', '2');
INSERT INTO `OrderItem` (`OrderID`, `itemID`, `quantity`) VALUES ('4', '5', '7');
INSERT INTO `OrderItem` (`OrderID`, `itemID`, `quantity`) VALUES ('5', '4', '4');