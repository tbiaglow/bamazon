var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

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

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // displayItems();
    promptPurchase();
});

function promptPurchase() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log("Item #: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Sales: " + res[i].product_sales);
        }
        // connection.end;
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
            if (user.number > res[user.id - 1].stock_quantity) {
                console.log("Insufficient quantity!");
            }
            else if (user.number <= res[user.id - 1].stock_quantity) {
                connection.query("UPDATE products SET ? WHERE ?",
                [{stock_quantity: res[user.id - 1].stock_quantity - user.number}, {item_id: res[user.id - 1].item_id}],
                function(err) {
                    if (err) throw err;
                })
                connection.query("UPDATE products SET ? WHERE ?",
                [{product_sales: res[user.id - 1].price * user.number + res[user.id - 1].product_sales}, {item_id: res[user.id - 1].item_id}],
                function(err) {
                    if (err) throw err;
                })
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