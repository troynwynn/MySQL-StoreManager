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
    // console.log("connected as id " + connection.threadId);
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
                choices: ["BUY", "EXIT"]
            }
        )
        .then(function(answer){
            if (answer.start === "BUY") {
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
                message: "Would you like to BUY another item?",
                choices: function() {
                    var choiceArray =[]
                    if (currentBasket.length === 0) {
                        choiceArray = ["BUY", "EXIT"];
                    }
                    else {
                        choiceArray = ["BUY", "CHECKOUT", "EXIT"];
                    }
                    return choiceArray;
                    
                }
            }
        )
        .then(function(answer){
            if (answer.new_order === "BUY") {
                placeOrder();
            }
            else if (answer.new_order == "CHECKOUT") {
                console.log(`Thank you for shopping at Bamazon! Your order is currently processing.`)
                console.log(`A total of ${total} has been charged to your American Express ending in 0000.`);
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
    console.log(`\nYour current total is $${total}.`)
    console.log(`---------------------------------`);
    console.log(`\n`);
    console.log(basket);
    // console.log(`\n`);
}

function nsfOrder() {
    console.log(`\n`);
    console.log(`Your order exceeds our current on-hand quanity. Please enter a number less than or equal to ${chosenItem.stock_quantity}.`);
    inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
        })
        .then(function(answer){
            units = answer.quantity;

            if (chosenItem.stock_quantity >= answer.quantity) {
                difference = chosenItem.stock_quantity - answer.quantity;
                
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                    {
                        stock_quantity: difference,
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                    ],
                    function(error, res) {
                        if (error) throw error;
                        purchaseTotal = parseFloat(answer.quantity)*chosenItem.price;
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
        // console.log(chosenItem);
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
                    message: "How many would you like to buy?"
                })
                .then(function(answer) {
                    units = answer.quantity;

                    if (chosenItem.stock_quantity >= answer.quantity) {
                        difference = chosenItem.stock_quantity - answer.quantity;
                        
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                            {
                                stock_quantity: difference,
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                            ],
                            function(error, res) {
                                if (error) throw error;
                                purchaseTotal = parseFloat(answer.quantity)*chosenItem.price;
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