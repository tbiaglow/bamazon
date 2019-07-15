var mysql = require("mysql");

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
    displayItems();
});

function displayItems() {
    connection.query("SELECT item_id,product_name,price FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end;
    })
}