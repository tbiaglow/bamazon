var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "V@der1977",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    // displayItems();
    promptPurchase();
});

function promptPurchase() {
    connection.query("SELECT item_id,product_name,price FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
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
            console.log(res[0].stock_quantity)
            for (i = 0; i < res.length; i++) {
                if (res[i].item_id === user.id) {
                    if (user.number > res[i].stock_quantity) {
                        console.log("Insufficient quantity!");
                    }
                    else if (user.number <= res[i].stock_quantity) {
                        console.log("Sufficient quantity!")
                    };
                }
            }
        })
    connection.end;
    })
}