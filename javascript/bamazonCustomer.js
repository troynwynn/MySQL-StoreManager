const mysql = require('mysql');
const inquirer = require('inquirer');

var currentBasket = [];
var total = 0;


var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "yourRootPassword",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    startOrder();
  });

function startOrder() {
    console.log(`\n`);
    inquirer
        .prompt(
            {
                name: "start",
                type: "list",
                message: "Welcome to Bamazon, your #1 source for books & music. How may I help you?",
                choices: ["START SHOPPING", "EXIT"]
            }
        )
        .then(function(answer){
            if (answer.start === "START SHOPPING") {
                placeOrder();
            }
            else {
                console.log(`No problem, please come back again !`)
                connection.end();
            }


        });
}
   
function placeAnotherOrder() {
    console.log(`\n`);
    inquirer
        .prompt(
            {
                name: "new_order",
                type: "list",
                message: "Would you like to CONTINUE SHOPPING?",
                choices: function() {
                    var choiceArray =[]
                    if (currentBasket.length === 0) {
                        choiceArray = ["CONTINUE SHOPPING", "EXIT"];
                    }
                    else {
                        choiceArray = ["CONTINUE SHOPPING", "CHECKOUT", "EXIT"];
                    }
                    return choiceArray;
                    
                }
            }
        )
        .then(function(answer){
            if (answer.new_order === "CONTINUE SHOPPING") {
                placeOrder();
            }
            else if (answer.new_order == "CHECKOUT") {
                console.log('\n');
                console.log(`Thank you for shopping at Bamazon! Your order is currently processing.`)
                console.log(`A total of $${total.toFixed(2)} has been charged to your American Express ending in 0000.`);
                console.log('\n');
                connection.end();
            }
            else {
                console.log(`No problem, have a great day!`)
                connection.end();
            }

        })

}

function basketCalculator(currentBasket) {
    basket = currentBasket.join('\n');
    console.log(`\nYour current total is $${total.toFixed(2)}.`)
    console.log(`---------------------------------`);
    console.log(`\n`);
    console.log(basket);
}

function nsfOrder() {
    console.log(`\n`);
    console.log(`Your order exceeds our current on-hand quanity. Please enter a number less than or equal to ${chosenItem.stock_quantity}.`);
    inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?",
            validate: function(value) {
                if (isNaN(parseInt(value)) === false) {
                  return true;
                }
                return false;
            }
        })
        .then(function(answer){
            units = answer.quantity;

            if (chosenItem.stock_quantity >= answer.quantity) {
                difference = chosenItem.stock_quantity - answer.quantity;
                purchaseTotal = parseFloat(answer.quantity)*chosenItem.price;
                updatedSales = chosenItem.product_sales + purchaseTotal;
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                    {
                        stock_quantity: difference,
                        product_sales: updatedSales
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                    ],
                    function(error, res) {
                        if (error) throw error;
                        total += purchaseTotal;
                        currentPurchase = `$${purchaseTotal} - ${answer.quantity} x ${chosenItem.product_name}`;
                        currentBasket.push(currentPurchase);
                        console.log(`\nI've added ${answer.quantity} units to your cart!`);
                        basketCalculator(currentBasket);        
                        placeAnotherOrder();

                    }
                );
            }

        });
}

function placeOrder() {
    console.log(`\n`);
    connection.query("SELECT * FROM products", function(err, res) {
    
    inquirer
    .prompt({
        name: "order",
        type: "list",
        choices: function() {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].product_name);
            }
            return choiceArray;
          },
        message: "What would you like to buy?",
    })
   
    .then(function(answer) {
        for (var i = 0; i < res.length; i++) {
            if (res[i].product_name === answer.order) {
              chosenItem = res[i];
            }
        }
        if ((chosenItem.stock_quantity == 0)) {
            console.log(`\n`);
            console.log(`We apologize for the inconvenience, but we have sold out of ${chosenItem.product_name}.`);
            placeAnotherOrder();
        }
        else {
            console.log(`\n`);
            inquirer
                .prompt({
                    name: "quantity",
                    type: "input",
                    message: "How many would you like to buy?",
                    validate: function(value) {
                        if (isNaN(parseInt(value)) === false) {
                          return true;
                        }
                        return false;
                    }
                })
                .then(function(answer) {
                    units = answer.quantity;

                    if (chosenItem.stock_quantity >= answer.quantity) {
                        difference = chosenItem.stock_quantity - answer.quantity;
                        purchaseTotal = parseFloat(answer.quantity)*chosenItem.price;
                        updatedSales = chosenItem.product_sales + purchaseTotal;

                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                            {
                                stock_quantity: difference,
                                product_sales: updatedSales
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                            ],
                            function(error, res) {
                                if (error) throw error;
                                total += purchaseTotal;
                                currentPurchase = `$${purchaseTotal} - ${answer.quantity} x ${chosenItem.product_name}`;
                                currentBasket.push(currentPurchase);
                                console.log(`\nI've added ${answer.quantity} units to your cart!`);
                                basketCalculator(currentBasket);        
                                placeAnotherOrder();

                            }
                        );
                    }
                    else {
                        nsfOrder();
                    }                
                })
            }
 
     });


    });

  }