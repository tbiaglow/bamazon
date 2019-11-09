# bamazon

This repository creates a node app called "bamazon" which can be run from the point of view of a customer, a manager, or a supervisor. This is a back-end only application; therefore, it has not been deployed. This back-end only application is intended to be run in a terminal with NodeJS.

To run this app, download it to your local machine. You will first need to run the bamazonSchema and bamazonSeeds files in MySQL Workbench to initialize the database. In your terminal, navigate to the folder containing bamazon and type "node bamazonCustomer", "node bamazonCustomer", "node bamazonCustomer" to run the application as a "customer", a "manager", or a "supervisor", respectively.

The customer file is bamazonCustomer.js, which shows customers a list of available items in the story, and prompts them to purchase an item, as well as how many of that item they would like to buy. It then presents the customer the total cost of their order.

The manager file is bamazonManager.js, which gives a manager a list of available options. They can view all products available in the store, view only products with low inventory, add to the inventory of a product, or add a new product.

Technologies used: SQL, NodeJS
