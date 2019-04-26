var mysql = require("mysql");
var inquirer = require("inquirer");
var totalInv;

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "root1234",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    readProducts();
  });

  function commPrompts() {
    inquirer.prompt(
        {
            name: "menu",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products Sales by Department",
                "Create New Department", 
                "Exit"
            ]
        }
    ).then(function(answer) {
        switch (answer.menu) {
            case "View Products Sales by Department":
                readDeptSales();
                break;
            case "Create New Department":
                newDept();
                break;
            case "Exit":
                console.log("\nGoodbye\n");
                connection.end();
        }
    })
}
