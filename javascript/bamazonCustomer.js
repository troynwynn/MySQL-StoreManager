// 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale. (complete)

// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.

const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "itsnotthecat'12",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    placeOrder();
;   connection.end();
    // songsBy(artist);
  });

function placeOrder() {
    products = [];
    connection.query("SELECT * FROM products", function(err, res) {
    //   for (var i = 0; i < res.length; i++) {
    //     products.push(
    //         res[i].item_id + " | " + 
    //         res[i].product_name + " | " + 
    //         res[i].department_name + " | " + 
    //         res[i].price + " | " + res[i].stock_quantity
    //     );
    //   }
    //   console.log(products);
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
        // based on their answer, either call the bid or the post functions
        // chosenItem;
        for (var i = 0; i < res.length; i++) {
            if (res[i].product_name === answer.order) {
              chosenItem = res[i];
            }
        }
        console.log(chosenItem);
        inquirer
            .prompt({
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?"
            })
            .then(function(answer) {
                console.log(chosenItem.stock_quantity);
                
                if (chosenItem.stock_quantity >= answer.quantity) {
                    difference = chosenItem.stock_quantity - answer.quantity;
                    // console.log(parseFloat(chosenItem.price));
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                          {
                            stock_quantity: difference,
                          },
                          {
                            id: chosenItem.id
                          }
                        ],
                        function(error, res) {

                            total = parseFloat(answer.quantity)*chosenItem.price;
                            console.log(`Thank you for order! You're total is ${total}`);
                        }
                      );
                    
                }                
            })
 
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
    