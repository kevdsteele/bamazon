var mysql = require("mysql");
var inquirer = require("inquirer");



var cTable = require("console.table")

var allProducts =[]

var allDepts =[]




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

   manMenu()
  });

  


  function manMenu ( ) {

    inquirer
    .prompt({
      name: "queryType",
      type: "list",
      message: "Welcome Bamazon Manager! What would you like to do today? ",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product",  "Exit"]
    })
    .then(function(answer) {

      if (answer.queryType=== "View Products for Sale") {
       
        viewAll();
      }
      else if(answer.queryType=== "View Low Inventory") {
       
        viewLow();
        
      } else if (answer.queryType=== "Add to Inventory"){
       
        addInventory();
        
      } else if (answer.queryType=== "Add New Product"){
        
        AddProduct()

      }  else {
          connection.end();
      }
    });


  }

  function viewAll() {
    console.log("\n----------------------------------- Products for Sale ------------------------------------- \n")
    connection.query("SELECT * FROM products ORDER BY Product_Name", function(err, res) {
      if (err) throw err;

      console.table(res)
      
      manMenu()
    });
  }

  function viewLow() {
    console.log("\n----------------------------------- Low inventory ------------------------------------ \n")
    connection.query("SELECT * FROM products WHERE Stock_Quantity < 5 ORDER BY Product_Name", function(err, res) {
        if (err) throw err;
        console.table(res)
      manMenu()
    });
  }

  function addInventory() {
    
    connection.query("SELECT * FROM products ORDER BY Product_Name", function(err, res) {
      if (err) throw err;

      for (i=0; i < res.length; i ++)
      allProducts.push(res[i].Product_Name)

      inquirer
    .prompt([{
      name: "inventoryupdate",
      type: "list",
      message: "Which Product would you like to update? ",
      choices: allProducts
    },
    {
        type: "number",
        message: "How many would you like to add?",
        name: "quantity"
      }
    
    ]).then(function(answer) { 
        connection.query(
            "Select * from products WHERE ?",
              {
                Product_Name: answer.inventoryupdate
              }
            ,
            function(err, res) {
              if (err) throw err;
             
        var productUpdate = answer.inventoryupdate
          var currentQuantity = res[0].Stock_Quantity
          var newQuantity=parseInt(currentQuantity+answer.quantity)
         



          console.log('Previous quantity was ' + currentQuantity)
          

          console.log("New quantity will be " + newQuantity)
          
          updateInventory(newQuantity, productUpdate)
            }
          );

    })

function updateInventory(newQuantity, productUpdate) {
   


    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            Stock_Quantity: newQuantity
          },
          {
            Product_Name: productUpdate
          }
        ],
        function(err, res) {
          if (err) throw err;
         
     
       console.log('Product updated!')
         manMenu()
        }
      );
}  
      
      
    });
  }

  function AddProduct () {
    connection.query("SELECT * FROM departments ORDER BY Department_Name", function(err, res) {
        if (err) throw err;
  
        for (i=0; i < res.length; i ++)
        allDepts.push(res[i].Department_Name)

    })

    inquirer
    .prompt([
    {
        type: "prompt",
        message: "What is the Product Name?",
        name: "productname"
      },
      {
        type: "list",
        message: "Select a Department. Supervisors must create new Departments",
        name: "productdept",
        choices: allDepts
      },
      {
        type: "number",
        message: "What is the Product Price",
        name: "productprice"
      },

      {
        type: "prompt",
        message: "How many items are available now?",
        name: "productquantity"
      }
    
    ]).then(function(answer) {
        connection.query(
            "INSERT INTO products SET ?",
            {
              Product_Name: answer.productname,
             Department_Name: answer.productdept,
              Price: answer.productprice,
              Stock_Quantity: answer.productquantity

            },
            function(err, res) {
              if (err) throw err;
              console.log(answer.productname+ " was added");
             
              manMenu()
            }
          );






     })




  }

