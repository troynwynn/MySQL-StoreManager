const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

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
    // viewDepartments();
    checkDepartments();
  });

function checkDepartments() {
    console.log(`\n`);
    inquirer
        .prompt(
            {
                name: "start",
                type: "list",
                message: "Inventory Menu:",
                choices: ["VIEW PRODUCT SALES - BY DEPARMENT", "ADD NEW DEPARTMENT", "EXIT"]
            }
        )
        .then(function(answer){
            if (answer.start === "VIEW PRODUCT SALES - BY DEPARMENT") {
                viewProductSales();
            }
            else if (answer.start === "ADD NEW DEPARTMENT") {
                addDepartment();
            }
            else {
                console.log(`Exiting.....`)
                connection.end();
            }

        });
}
   

function viewProductSales() {
    console.log('\n');
    var query = 'SELECT departments.department_id as "Department ID", departments.department_name as "Department Name", departments.overhead_costs as "Overhead Costs", SUM(products.product_sales) as "Department Sales", (SUM(products.product_sales) - departments.overhead_costs) as "Total Profit"' ;
    query += 'FROM departments INNER JOIN products ON products.department_name = departments.department_name ';
    query += 'GROUP BY departments.department_id, departments.department_name, departments.overhead_costs';
    connection.query(query, function(err,res) {
        if (err) throw err;
        console.table(res);
        checkDepartments();

    });
}

function addDepartment() {
    console.log(`\n`);
    connection.query(`SELECT * FROM departments`, function(err, res) {
        var choiceArray = []; 
        for (let i=0; i < res.length; i++) {
            choiceArray.push(`${res[i].department_name}`);
        }
        // return choiceArray;
    
    
        inquirer 
        .prompt([{
            name: "department_name",
            type: "input",
            message: "Please enter [ DEPARTMENT NAME ] : ",
            validate: function(value) {
                if ((/^[a-zA-Z]+$/.test(value) && !choiceArray.includes(value) )) {
                  return true;
                }
                return false;
            }

        },
        {
            name: "overhead_costs",
            type: "input",
            message: "Please enter [ EXPECTED OVERHEAD COSTS ] : ",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
            }
        
        }]
        )
        .then(function(answers){
            connection.query(
                "INSERT INTO departments SET ?",
                {
                  department_name: answers.department_name,
                  overhead_costs: answers.overhead_costs,
                },
                function(err, res) {
                    console.log(`\n`);
                    console.log(`TASK COMPLETE...`);
                    console.log(`\n`);
                    console.log(`* NEW DEPARTMENT ALERT *`)
                    console.log(`\n`);
                    console.log(`DEPARTMENT: ${answers.department_name}, OVERHEAD COSTS: ${answers.overhead_costs}`);
                    checkDepartments();
                }
              );
        })
    })
    
}