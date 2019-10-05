//Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");
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
});

//Function to present user with a list of their options and then run the function associated with that option
function giveOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Add New Department"]
        }
    ]).then(function(choice) {
        //If user chooses to view product sales, get all from departments table
        if (choice.choice === "View Product Sales by Department") {
            connection.query("SELECT * FROM departments", function(err, res) {
                if (err) throw err;
            //Then sum the sales for each product and subtract it from the overhead to get total profit
            connection.query("SELECT SUM(product_sales) AS product_sales, department_name FROM products GROUP BY department_name", function(err1, res1) {
                if (err1) throw err;
                for (i = 0; i < res.length; i++) {
                    res[i].product_sales = res1[i].product_sales
                    res[i].total_profit = res[i].product_sales - res[i].over_head_costs
                }
                //Log this information using cTable (console.table)
                const table = cTable.getTable(res)
                console.log(table);
            })
        })
        }
        //If user chooses to add new department, get all from departments
        else if (choice.choice === "Add New Department") {
            connection.query("SELECT * FROM departments", function(err, res) {
                if (err) throw err;
                //Then prompt for name and overhead of new department
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
                    //Then insert prompt information into departments table
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