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
    giveOptions();
    connection.end;
});

function giveOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function(choice) {
        if (choice.choice === "View Products for Sale") {
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                for (i = 0; i < res.length; i++) {
                    console.log("Item #: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
                }
            })
        }
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
        else if (choice.choice === "Add to Inventory") {
            connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
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
                    if (res[i].item_id == restock.productID) {
                        connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: parseInt(res[i].stock_quantity) + parseInt(restock.amount)}, {item_id: res[i].item_id}], function(err) {
                            if (err) throw err;
                        })
                    }
                }
                connection.query("SELECT * FROM products", function(err, resNew) {
                    if (err) throw err;
                    console.log("Updated quantity information:")
                    console.log("Item #: " + resNew[restock.productID - 1].item_id + " || Product: " + resNew[restock.productID - 1].product_name + " || Price: " + resNew[restock.productID - 1].price + " || Quantity: " + resNew[restock.productID - 1].stock_quantity)
                })
            })
        })
        }
        else if (choice.choice === "Add New Product") {
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
                    var query = connection.query("INSERT INTO products SET ?", {
                        item_id: res.length + 1,
                        product_name: newProduct.productName,
                        department_name: newProduct.department,
                        price: newProduct.price,
                        stock_quantity: newProduct.quantity
                    })
                    console.log("Your new item is: ");
                    console.log("Item #: " + query.values.item_id + " || Product: " + query.values.product_name + " || Price: " + query.values.price + " || Quantity: " + query.values.stock_quantity)

                })
            })
        }
    })
}