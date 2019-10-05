//Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

//Set up connection to MySQL workbench
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.PASSWORD,
    database: "bamazon"
});

//Upon connection, notify user and run giveOptions function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    giveOptions();
    connection.end;
});

//Function to present user with a list of their options and then run the function associated with that option
function giveOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function(choice) {
        //If the user chooses to view products, get products table, loop through, display item #, product name, price, quantity
        if (choice.choice === "View Products for Sale") {
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                for (i = 0; i < res.length; i++) {
                    console.log("Item #: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
                }
            })
        }
        //Same as above but only console log products with stock_quantity less than 5
        else if (choice.choice === "View Low Inventory") {
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                for (i = 0; i < res.length; i++) {
                    if (res[i].stock_quantity < 5) {
                        console.log("Item #: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
                    }
                }
            })
        }
        //If user selects "Add to Inventory", get all from products table as above, then give another inquirer prompts
        else if (choice.choice === "Add to Inventory") {
            connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            //Prompt user for product they would like to restock and how much
            inquirer.prompt([
                {
                    type: "input",
                    name: "productID",
                    message: "Which product (ID) would you like to restock?"
                },
                {
                    type: "input",
                    name: "amount",
                    message: "How much would you like to add?"
                }
            ]).then(function(restock) {
                for (i = 0; i < res.length; i++) {
                    //loop through item_id's of products table and look for match with product id selected by user
                    if (res[i].item_id == restock.productID) {
                        //If found, update stock quantity by amount user chose
                        connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: parseInt(res[i].stock_quantity) + parseInt(restock.amount)}, {item_id: res[i].item_id}], function(err) {
                            if (err) throw err;
                        })
                    }
                }
                //Show restocked item in the console
                connection.query("SELECT * FROM products", function(err, resNew) {
                    if (err) throw err;
                    console.log("Updated quantity information:")
                    console.log("Item #: " + resNew[restock.productID - 1].item_id + " || Product: " + resNew[restock.productID - 1].product_name + " || Price: " + resNew[restock.productID - 1].price + " || Quantity: " + resNew[restock.productID - 1].stock_quantity)
                })
            })
        })
        }
        //If user selects "Add New Product"
        else if (choice.choice === "Add New Product") {
            //Get all from products table, then prompt user for the name, department, unit price, and quantity of new item
            connection.query("SELECT * FROM products", function(err, res){
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: "input",
                        name: "productName",
                        message: "What is the name of the new product?"
                    },
                    {
                        type: "input",
                        name: "department",
                        message: "What department does it belong in?"
                    },
                    {
                        type: "input",
                        name: "price",
                        message: "What is its price per unit?"
                    },
                    {
                        type: "input",
                        name: "quantity",
                        message: "How many are you adding?"
                    }
                ]).then(function(newProduct) {
                    //Insert new item into products table
                    var query = connection.query("INSERT INTO products SET ?", {
                        item_id: res.length + 1,
                        product_name: newProduct.productName,
                        department_name: newProduct.department,
                        price: newProduct.price,
                        stock_quantity: newProduct.quantity
                    })
                    //Log new item to the console
                    console.log("Your new item is: ");
                    console.log("Item #: " + query.values.item_id + " || Product: " + query.values.product_name + " || Price: " + query.values.price + " || Quantity: " + query.values.stock_quantity)

                })
            })
        }
    })
}