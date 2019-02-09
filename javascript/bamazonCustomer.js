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
                message: "Welcome to Bamazon. How may I help you?",
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
            message: "\nHow many would you like to buy?"
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
    },
    {
        name: "choice",
        type: "input",
        message: "How many would you like to buy?"
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

// var display1 = displayProducts();
// console.log(display1);

//   function displayProducts() {
//     var query = `SELECT * FROM products WHERE ?`;
//     var queryCon = connection.query(query, function(err, res) {
//     for (var i = 0; i < res.length; i++) {
//         console.log(res[i].id + " | " + res[i].title + " | " + res[i].artist + " | " + res[i].genre);
//         }
//         console.log("-----------------------------------"); 
    
//         if (err) throw err;
//         console.log(res);
//         connection.end();
//         }
//     );

//     console.log(queryCon);



//   }
//   // function which prompts the user for what action they should take
// function start() {
//     inquirer
//       .prompt({
//         name: "postOrBid",
//         type: "list",
//         message: "Would you like to [POST] an auction or [BID] on an auction?",
//         choices: ["POST", "BID", "EXIT"]
//       })
//       .then(function(answer) {
//         // based on their answer, either call the bid or the post functions
//         if (answer.postOrBid === "POST") {
//           postAuction();
//         }
//         else if(answer.postOrBid === "BID") {
//           bidAuction();
//         } else{
//           connection.end();
//         }
//       });
//   }
  
//   // function to handle posting new items up for auction
//   function postAuction() {
//     // prompt for info about the item being put up for auction
//     inquirer
//       .prompt([
//         {
//           name: "item",
//           type: "input",
//           message: "What is the item you would like to submit?"
//         },
//         {
//           name: "category",
//           type: "input",
//           message: "What category would you like to place your auction in?"
//         },
//         {
//           name: "startingBid",
//           type: "input",
//           message: "What would you like your starting bid to be?",
//           validate: function(value) {
//             if (isNaN(value) === false) {
//               return true;
//             }
//             return false;
//           }
//         }
//       ])
//       .then(function(answer) {
//         // when finished prompting, insert a new item into the db with that info
//         connection.query(
//           "INSERT INTO auctions SET ?",
//           {
//             item_name: answer.item,
//             category: answer.category,
//             starting_bid: answer.startingBid || 0,
//             highest_bid: answer.startingBid || 0
//           },
//           function(err) {
//             if (err) throw err;
//             console.log("Your auction was created successfully!");
//             // re-prompt the user for if they want to bid or post
//             start();
//           }
//         );
//       });
//   }
//   function songsBy(artist) {
//     var query = `SELECT * FROM albums WHERE ?`;
//     var queryCon = connection.query(query, { artist_name: artist }, function(err, res) {
        
//         if (err) throw err;
//         console.log(res);
//         connection.end();
//         }
//     );

  // logs the actual query being run
//   console.log(queryCon.sql);
// }

// var Products = function() {
    //     this.products = [];
    //     this.displayProducts = function() {
    //         connection.query("SELECT * FROM products", function(err, res) {
    //             for (var i = 0; i < res.length; i++) {
    //               this.products.push(
    //                   res[i].item_id + " | " + 
    //                   res[i].product_name + " | " + 
    //                   res[i].department_name + " | " + 
    //                   res[i].price + " | " + res[i].stock_quantity
    //             );
    //                 console.log(this.products);
    //                 return this.products;
    //             }
    //         });
    //     }
    // }
    
    // var store = new Products();
    // store.displayProducts();
    