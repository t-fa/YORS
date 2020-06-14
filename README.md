# YORS
Ye Olde Robot Shoppe simulates a robot parts store with a SQL database consisting of several different tables and types of relationships.

![Home Page](images/home.png)

The database was designed using an entity-relationship diagram as well as a schema.

![ERD](erd.png)

![Schema](images/schema.png)

As can be seen in the above diagrams, several different types of tables and relationships are present. 

1:Many Relationships:
Customers:Orders
Customers:Purchases
Suppliers:Items

Many:Many Relationships:
Items:Purchases
Orders:Items

In the final version of the project, the Items:Purchases M:M relationship was not implemented. However, the Orders:Items relationship was implemented with an OrdemItem table. The OrderItem table can be viewed on the "Items" page in table.

The project was built with Node.js, Express, MySQL, Handlebars, and Bootstrap. While the page is no longer being hosted, below are screenshots of how the project was implemented:

Home Page:
![Home Page](images/home page.png)

Customers Page:
![Customers](images/customers.png)

Orders Page:
![Orders](images/orders.png)

Items Page:
![Items](images/items.png)

Purchases Page:
![Purchases](images/purchases.png)

Suppliers Page:
![Suppliers](images/suppliers.png)
