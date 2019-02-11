# Bamazon Store Manager

## Introduction
"Lets Play: Guess That State!" is a CLI (Command-Line Interface) Game that gives a user `x` amount of tries to guess the correct word. 
For this edition, the words to be guessed are the 50 United States of America, which will be chosen at random during each game. When the user runs out of remaining guesses or when the user correctly guesses the word, he/she will be asked whether or not they would like to play again.

## Required Files
* `bamazonCustomer.js` - contains a constructor, Letter
* `bamazon` - contains a constructor, Word, which requires the Letter constructor to rebuild the random state name
* `index.js` - contains the game's logic and inquirer prompts for gameplay

## Required packages & APIs
* [mysql]
* [Inquirer](https://www.npmjs.com/package/inquirer)
* []

## Command Line Calls

To start the game:
```
node index.js 
```

## Folder Tree

```
├── _javascript
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

## Built With:
* Programming Language: Javascript
* Run-time environment: Node.js
* Database: MySQL

# Video walk-through

* ADD PRODUCT: doesnt add a product if there are any undefined or issues with the entry
* 

1 row(s) affected

