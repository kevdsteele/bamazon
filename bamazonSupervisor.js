var mysql = require("mysql");
var inquirer = require("inquirer");

var cTable = require("console.table")



var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazon_DB"
  });

  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
supMenu()
  }); 




function supMenu() {
    inquirer
    .prompt({
      name: "queryType",
      type: "list",
      message: "Welcome Bamazon Supervisor! What would you like to do today? ",
      choices: ["View Sales by Department" , "Add a Department",  "Exit"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.queryType=== "View Sales by Department") {
        calcSales();
      }
      else if(answer.queryType=== "Add a Department") {
          addDept();
        
      }   else {
          connection.end();
      }
    });


}



function calcSales() {
console.log("\n------------------------------Sales by Department----------------------------\n")
connection.query("SELECT departments.Department_ID, departments.Department_Name, departments.Over_Head_Costs, SUM(products.Product_Sales) AS Product_Sales, ((SUM(products.Product_Sales) - departments.Over_Head_Costs)) AS Total_Profit FROM products RIGHT JOIN departments ON departments.Department_Name = products.Department_Name GROUP BY departments.Department_ID ", function(err, res) {
    if (err) throw err;
    console.table(res)

    supMenu()
})

}

function addDept() {
    inquirer
    .prompt([{
      name: "deptName",
      type: "input",
      message: "What is the new Department name?",
     
    },
    {
        type: "number",
        message: "What are the Over head costs?",
        name: "ohcost"
      }
    
    ]).then(function(answer) { 
        connection.query(
            "INSERT INTO departments SET ?",
            {
              Department_Name: answer.deptName,
              Over_Head_Costs: answer.ohcost
              
            },
            function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " product inserted!\n");
              // Call updateProduct AFTER the INSERT completes
              supMenu()
            }
          );



    })

}





