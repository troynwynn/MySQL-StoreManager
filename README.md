# Bamazon Store Manager

## Introduction
A CLI (Command-Line Interface) application with a "store-front" for customers and an inventory management system for managers and supervisors to check inventory and store sales. As customers make purchases, the inventory management system updates after each transaction.

## Required packages & APIs
* [mysql](https://www.npmjs.com/search?q=mysql)
* [Inquirer](https://www.npmjs.com/package/inquirer)
* [console.table](https://www.npmjs.com/package/console.table)

## Required Files
* `bamazonCustomer.js` - serves as the "store-front" for customers, where available items can be purchased at checkout
* `bamazonManager.js` - allows the manager to 'VIEW INVENTORY', 'VIEW LOW IN-STOCKS', 'ADD TO EXISTING INVENTORY', & 'ADD NEW PRODUCTS'
* `bamazonSupervisor.js` - allows the supervisor to 'VIEW DEPARTMENTAL SALES'  & 'ADD NEW DEPARTMENTS'
* `MySQL schemas` - creates/saves *bamazon* database, creates/saves *products* and *departments* table schematics, 
* `MySQL seeds`- inserts inventory and departments into *products* and *departments* tables

## Command Line Calls

```
node bamazonCustomer.js
node bamazonManager.js
node bamazonSupervisor.js
```

## Folder Tree

```
├── javascript
    ├── bamazonCustomer.js
    ├── bamazonManager.js
    └── bamazonSupervisor.js
├── _node_modules
├── package-lock.json
├── package.json
├── sql
    ├── schemeCustomer.sql
    ├── schemeCustomer.sql
    ├── seedCustomer.sql
    └── seedsSupervisor.sql
└── README.md

```
