var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "root1234",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    commPrompts();
  });

function commPrompts() {
    inquirer.prompt(
        {
            name: "menu",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory", 
                "Add to Inventory", 
                "Add New Product",
                "Exit"
            ]
        }
    ).then(function(answer) {
        switch (answer.menu) {
            case "View Products for Sale":
                readProducts();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                newProduct();
                break;
            case "Exit":
                console.log("\nGoodbye\n");
                connection.end();
        }
    })
}

function startAgain() {
    inquirer.prompt(
        {
            name: "confirm",
            type: "confirm",
            message: "Continue?",
            default: true
        }
    ).then(function(answer) {
        if (answer.confirm) {
            commPrompts();
        } else {
            console.log("\nGoodbye\n");
            connection.end();
        }
    })
}

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        
        totalInv = res.length;
        
        console.log("ID || Product || Department || Price || Quantity");
        for (var x in res){
            console.log(res[x].item_id, res[x].product_name,  res[x].department_name, "$" + res[x].price, res[x].stock_quantity);
        }
        startAgain();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        console.log("\nGetting Inventory with less than 5 in stock\n");
        
        console.log("ID || Product || Department || Price || Quantity");
        for (var x in res){
            if (res[x].stock_quantity < 5) {
                console.log(res[x].item_id, res[x].product_name,  res[x].department_name, "$" + res[x].price, res[x].stock_quantity);
            }
        }
        console.log("End of list\n");
        startAgain();
    });

}

function addInventory() {
    inquirer.prompt(
        [
            {
                name: "id",
                type: "input",
                message: "Product ID",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "Add quantity",
                validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]
  ).then(function(answer) {
        var id = parseInt(answer.id) || 0;
        var quantity = parseInt(answer.quantity) || 0;
        var newQuantity;
        console.log(id, quantity);

        if (id <= 0 || quantity <= 0){
            console.log("INVALID INPUT. Input must be number greater than zero.");
            startAgain();

        } else {
              
            connection.query("SELECT * FROM products WHERE ?", {item_id: id}, function(err, res) {
                if (err) throw err;
                  
                newQuantity = res[0].stock_quantity + quantity;
                console.log(newQuantity);
                updateInv(id, newQuantity);
                  
            });   
        }
    })
}

function updateInv(id, num) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {stock_quantity: num},
            {item_id: id}
        ],
        function(err, res) {
            if (err) throw err;
            console.log(res.changedRows + " product has been updated");
            startAgain();
        }
    );
}

function newProduct() {
    inquirer.prompt(
        [
            {
                name: "name",
                type: "input",
                message: "New product name",
            },
            {
                name: "department",
                type: "input",
                message: "Product department",
            },
            {
                name: "price",
                type: "input",
                message: "Product price"
            },
            {
                name: "quantity",
                type: "input",
                message: "Quantity"
            }
        ]
    ).then(function(answer) {
        var price = parseFloat(answer.price) || 0;
        var quantity = parseInt(answer.quantity) || 0;
        
        if (price === 0 || quantity === 0) {
            console.log("INVALID INPUT === Please enter price and quantity number that is greater than zero.");
            startAgain();
        } else {

            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.name,
                    department_name: answer.department,
                    price: price,
                    stock_quantity: quantity
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows);
                    
                    startAgain();
                }
            );
        }
    })
  }


