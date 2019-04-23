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

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        
        totalInv = res.length;
        
        console.log("ID || Product || Department || Price || Quantity");
        for (var x in res){
            console.log(res[x].item_id, res[x].product_name,  res[x].department_name, "$" + res[x].price, res[x].stock_quantity);
        }
        userSelect();
    });
  }
  

function userSelect() {
    inquirer.prompt([
        {
            name: "id",
            message: "Please enter product ID",
            type: "input",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            message: "How many of this product?",
            type: "input",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]
    ).then(function(answer){
        var productID = parseInt(answer.id) || 0;
        var quantity = parseInt(answer.quantity) || 0;

        varifyID(productID, quantity);
    })
}

function varifyID(id, quantity) {
    if (id > totalInv || id <= 0) {
        console.log("\nInvalid ID\n");
        startAgain();
    } else {
        getProduct(id, quantity);
    }
}

function getProduct(id, quantity){
    connection.query("SELECT * FROM products WHERE ?", {item_id: id}, function(err, res) {
        if (err) throw err;

        var productData = {
            id: res[0].item_id,
            name: res[0].product_name,
            price: res[0].price,
            stock: res[0].stock_quantity
        };

        quantityCheck(productData, quantity);
    })
}

function quantityCheck(data, quantity) {
    if (data.stock < quantity || quantity <= 0) {
            
        console.log("\nInvalid quantity. Please select again.\n");
        startAgain();

    } else {
        var total = data.price * quantity;
        
        console.log("\nYou have selected " + quantity + " of " + data.name + " at $" + data.price);
        console.log("Your total is $" + total.toFixed(2) + "\n");
        
        varifyPurch(data, quantity);

    }
}

function varifyPurch(data, quantity) {
    inquirer.prompt(
        {
            name: "confirm",
            message: "Ready to go?",
            type: "confirm",
            default: true
        }
    ).then(function(answer) {
        if (answer.confirm) {
            finalizePurch(data, quantity)
        } else {
            startAgain();
        }
    })
}

function finalizePurch(data, quantity){
    var total = data.price * quantity;
    
    console.log("\nYou have purchased " + quantity + " of " + data.name + " for a toal of $" + total.toFixed(2));
    
    var stockRemain = data.stock - quantity;
        
    console.log("\nUpdating Inventory...\n");
    
    connection.query("UPDATE products SET ? WHERE ?",
    [
        {stock_quantity: stockRemain},
        {item_id: data.id}
    ], 
    function (err, res) {
        if (err) throw err;
    })
    startAgain();
}

function startAgain() {
    inquirer.prompt(
        {
            name: "confirm",
            type: "confirm",
            message: "Start over?",
            default: true
        }
    ).then(function(answer) {
        if (answer.confirm) {
            readProducts();
        } else {
            console.log("\nThanks for shopping!\n");
            connection.end();
        }
    })
}

