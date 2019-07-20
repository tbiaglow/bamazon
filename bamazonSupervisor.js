var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

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
    giveOptions();
});

function giveOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Add New Department"]
        }
    ]).then(function(choice) {
        if (choice.choice === "View Product Sales by Department") {
            connection.query("SELECT * FROM departments", function(err, res) {
                if (err) throw err;
                // const table = cTable.getTable(res)
                // console.log(table);

            connection.query("SELECT SUM(product_sales) AS product_sales, department_name FROM products GROUP BY department_name", function(err1, res1) {
                if (err1) throw err;
                // console.log(res1[0].product_sales);
                for (i = 0; i < res.length; i++) {
                    res[i].product_sales = res1[i].product_sales
                    res[i].total_profit = res[i].product_sales - res[i].over_head_costs
                }
                const table = cTable.getTable(res)
                console.log(table);
            })
        })
        }
        
        else if (choice.choice === "Add New Department") {
            connection.query("SELECT * FROM departments", function(err, res) {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: "input",
                        name: "departmentName",
                        message: "What is the name of the new department?"
                    },
                    {
                        type: "input",
                        name: "overhead",
                        message: "What are the expected overhead costs of the department?"
                    }
                ]).then(function(newProduct) {
                    var query = connection.query("INSERT INTO departments SET ?", {
                        department_id: res.length + 1,
                        department_name: newProduct.departmentName,
                        over_head_costs: newProduct.overhead
                    })
                    console.log("Department created!");
                })
            })
        }
    })
}