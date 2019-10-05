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

//Upon connection, notify user and run promptPurchase function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    promptPurchase();
});

//Function to prompt user to make a purchase
function promptPurchase() {
    //Get all from products table
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        //Display item #, product name, price, and sales for each item
        for (i = 0; i < res.length; i++) {
            console.log("Item #: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Sales: " + res[i].product_sales);
        }
        //Run inquirer prompt function
        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "Which item would you like to purchase?"
            },
            {
                type: "input",
                name: "number",
                message: "How many would you like to purchase?"
            }
        ]).then(function(user) {
            //Notify insufficient quantity if user wants to buy more than amount of item in stock
            if (user.number > res[user.id - 1].stock_quantity) {
                console.log("Insufficient quantity!");
            }
            //Reduce stock quantity by amount purchased
            else if (user.number <= res[user.id - 1].stock_quantity) {
                connection.query("UPDATE products SET ? WHERE ?",
                [{stock_quantity: res[user.id - 1].stock_quantity - user.number}, {item_id: res[user.id - 1].item_id}],
                function(err) {
                    if (err) throw err;
                })
                //Increase sales of product by price * amount purchased
                connection.query("UPDATE products SET ? WHERE ?",
                [{product_sales: res[user.id - 1].price * user.number + res[user.id - 1].product_sales}, {item_id: res[user.id - 1].item_id}],
                function(err) {
                    if (err) throw err;
                })
                //Calculate and display user's total
                connection.query("SELECT * FROM products", function(err, resNew) {
                    if (err) throw err
                    cost = user.number * resNew[user.id - 1].price
                    console.log("Your total comes to: " + cost)
                })
            };        
        })
    connection.end;
    })
}