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
    checkInventory();
  });

function checkInventory() {
    console.log(`\n`);
    inquirer
        .prompt(
            {
                name: "start",
                type: "list",
                message: "Inventory Menu:",
                choices: ["VIEW INVENTORY", "VIEW LOW IN-STOCKS", "ADD TO INVENTORY", "ADD NEW PRODUCT", "EXIT"]
            }
        )
        .then(function(answer){
            if (answer.start === "VIEW INVENTORY") {
                viewInventory();
            }
            else if (answer.start === "VIEW LOW IN-STOCKS") {
                viewLows();
            }
            else if (answer.start === "ADD TO INVENTORY") {
                addInventory();
            }
            else if (answer.start === "ADD NEW PRODUCT") {
                addProduct();
            }
            else {
                console.log(`Exiting.....`)
                connection.end();
            }


        });
}
   
function viewInventory(){
    inventory = [];
    connection.query( "SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (let i=0; i < res.length; i++) {
            inventory.push(`${res[i].item_id}. ${res[i].product_name}, Deparment: ${res[i].department_name}, Price: ${res[i].price}, Quantity: ${res[i].stock_quantity}`);
        }
        console.log('\n');
        console.log(inventory.join('\n'));
        console.log('\n');
        checkInventory();
        
    });

}

function viewLows(){
    lows = [];
    connection.query( "SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (let i=0; i < res.length; i++) {
            if (res[i].stock_quantity <= 5) {
                lows.push(`${res[i].item_id}. ${res[i].product_name}, Deparment: ${res[i].department_name}, Price: ${res[i].price}, Quantity: ${res[i].stock_quantity}`);
            } 
        }
        console.log('\n');
        console.log(lows.join('\n'));
        console.log('\n');   
        checkInventory();
    });


}


function addInventory() {
    console.log(`\n`);
    connection.query( "SELECT * FROM products", function(err, res) {
    if (err) throw err;
    inquirer
        .prompt({
            name: "addInventory",
            type: "list",
            message: "What would you like to add?",            
            choices: function() {
                var choiceArray = [];   
                for (let i=0; i < res.length; i++) {
                    choiceArray.push(`${res[i].item_id}. ${res[i].product_name}, Deparment: ${res[i].department_name}, Price: ${res[i].price}, Quantity: ${res[i].stock_quantity}`);
                    
                }
                return choiceArray;
            }
        })
        .then(function(answer) {            
            for (let i=0; i<  res.length; i++) {
                if (res[i].item_id == answer.addInventory.split(`.`)[0]) {
                    chosenItem = res[i];
                }
            }
            // console.log(chosenItem);

            console.log(`\n`);
            inquirer
                .prompt({
                    name: "quantity",
                    type: "input",
                    message: "Okay. How many would you like to add?"
                })
                .then(function(answer){
                   units = parseInt(answer.quantity);
            
                   if (isNaN(units)) {
                        console.log(`\n`);
                        console.log(`PLEASE ENTER A VALID QUANTITY.`);
                        nsfQuantity();
                   }
                    else {
                        newQuantity = chosenItem.stock_quantity + units;
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                              {
                                stock_quantity: newQuantity,
                              },
                              {
                                item_id: chosenItem.item_id
                              }
                            ],
                            function(err, res) {
                                console.log(`\n`);
                                console.log(`TASK COMPLETE`);
                                console.log(`\n`);
                                console.log(`INVENTORY UPDATE ALERT: ${chosenItem.product_name} [ NEW On-Hand => ${newQuantity} ]`);
                                checkInventory();
                            }
                          );
                        }
                });
            
        });
    });
}

function nsfQuantity() {
    console.log(`\n`);
    inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "Let's try again. How many would you like to add?"
        })
        .then(function(answer){
            units = parseInt(answer.quantity);    
            if (isNaN(units)) {
                console.log(`Please enter a valid quantity.`);
                nsfQuantity();
            }
            else {
                newQuantity = chosenItem.stock_quantity + units;
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                        stock_quantity: newQuantity,
                        },
                        {
                        item_id: chosenItem.item_id
                        }
                    ],
                    function(err, res) {
                        console.log(`\n`);
                        console.log(`TASK COMPLETE`);
                        console.log(`\n`);
                        console.log(`INVENTORY UPDATE ALERT: ${chosenItem.product_name} [ NEW On-Hand => ${newQuantity} ]`);
                        checkInventory();
                    }
                    );
                }
        });
}

function addProduct() {
    console.log(`\n`);

    inquirer 
        .prompt([{
            name: "product_name",
            type: "input",
            message: "Please enter [ 'BOOK NAME - AUTHOR' or 'DISC NAME - ARTIST(S)' ] : "
        },
        {
            name: "department_name",
            type: "list",
            choices: [`music`, `books`]
        },
        {
            name: "price",
            type: "input",
            message: "Please enter [ PRICE ] : ",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
            }
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "Please enter [ QUANTITY ] : ",
            validate: function(value) {
                if (isNaN(parseInt(value)) === false) {
                  return true;
                }
                return false;
            }
        }]
        )
        .then(function(answers){
            connection.query(
                "INSERT INTO products SET ?",
                {
                  product_name: answers.product_name,
                  department_name: answers.department_name,
                  price: answers.price,
                  stock_quantity: answers.stock_quantity
                },
                function(err, res) {
                    console.log(`\n`);
                    console.log(`TASK COMPLETE`);
                    console.log(`\n`);
                    console.log(`NEW PRODUCT ALERT: ${answers.product_name}, Department: ${answers.department_name}, Price: ${answers.price}, Quantity: ${answers.stock_quantity}`);
                    checkInventory();
                }
              );
        })
    


}


