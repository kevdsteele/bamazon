var mysql = require("mysql");
var inquirer = require("inquirer");

var clear = require("clear")

var cTable = require("console.table")

var cart =[]



var itemTotal =0;


var newQuantity=0;



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
    mainMenu()
  });


  function displayItems() {
    if( cart.length > 0) {
      console.log("---------------------------------- Your Cart ---------------------------------------------- \n")
      console.table(cart)
    }
 
    console.log("\n----------------------------------- Products for Sale ------------------------------------- \n")
    connection.query("SELECT * FROM products ORDER BY Product_Name", function(err, res) {
      if (err) throw err;

      console.table(res)
      
      buyMenu()
    });
  }



  function buyMenu() {
    inquirer
    .prompt([{
        type: "input",
        message: "Enter the Product ID of the item you wish to purchase",
        name: "productid"
      },
      {type: "input",
        message: "How many would you like to purchase",
        name: "quantity"
      }]).then(function(answer) {
        connection.query("SELECT * FROM products WHERE ?", {
            Product_ID: answer.productid
        }, function(err, res) {
            if (err) throw err;

            if((res[0].Stock_Quantity - answer.quantity) <0) {

              console.log("Insufficent quantity availble to fulfill your oder")

              mainMenu() 
            } else if (cart.length > 0) {
              checkCart(cart, res, answer);

            } else {
              addToCart(cart, res, answer)
                 
            }


          /* end sql function */  
        })
      
    })
  }  

function exitApp ( ) {
    console.log("Thanks for shopping at Bamazon")
    connection.end()
}

function checkout (cart) {

console.log("Cart being processed \n")

itemTotal=0
for (i =0; i < cart.length; i++) {
    itemTotal+=cart[i].Total
 
    getProdInfo(cart[i])

    
}
console.table(cart)
console.log("\n Cart total is " + itemTotal + "\n")

cart.length =0;
mainMenu()

}

function getProdInfo(item) {
  

    currentQuant =0;
    currentSales=0;

    connection.query("SELECT * FROM products WHERE ?", {
        Product_ID: item.Product_ID
    }, function(err, res) {
        if (err) throw err;
        
        currentQuant = res[0].Stock_Quantity
        currentSales = res[0].Product_Sales

        newQuantity = currentQuant - item.Quantity
        newSales = currentSales + item.Total

     
        
       updateProdInfo(item.Product_ID, newQuantity, newSales)
    })
    
}

function updateProdInfo (itemID, newQuantity, newSales) {

   

    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            Stock_Quantity: newQuantity,
            Product_Sales: newSales
          },
          {
            Product_ID: itemID
          }
        ],
        function(err, res) {
          if (err) throw err;

         
        }
      );
}

/*function promptCheckout () {

  inquirer.prompt([{
    type: "confirm",
    message: "Ready to checkout?",
    name: "checkout",
    default:"false"
}
]) .then(function(answer) {
if(answer.checkout) {
checkout(cart)
} else {
displayItems()
}


})

}*/

function addToCart(cart,res, answer) {
  cart.push({Product_ID: res[0].Product_ID, Product_Name: res[0].Product_Name, Price: res[0].Price, Quantity: answer.quantity, Total: answer.quantity * res[0].Price})
                
                  mainMenu()


}

function checkCart (cart, res, answer) {


function inCart(cartItem) {
  return parseInt(cartItem.Product_ID) === parseInt(answer.productid)
}

result = cart.find(inCart)

if (result === undefined) {
  cart.push({Product_ID: res[0].Product_ID, Product_Name: res[0].Product_Name, Price: res[0].Price, Quantity: answer.quantity, Total: answer.quantity * res[0].Price})

  mainMenu()
} else {


  inquirer.prompt([{
    type: "confirm",
    message: "That item is already in your cart. Do you want to change the quanity to " + answer.quantity + " ?",
    name: "cartmatch",
    default:"false"
}
]) .then(function(matchanswer) {
if(matchanswer.cartmatch) {
  
  function findItem(element) {
    return parseInt(element.Product_ID) === parseInt(result.Product_ID)
  }

 
   cartItemToUpdate = cart.findIndex(findItem)

 
   cart[cartItemToUpdate].Quantity = answer.quantity
   cart[cartItemToUpdate].Total = answer.quantity *  cart[cartItemToUpdate].Price

  

   mainMenu()

} else {
mainMenu()
}


})
 

}




}

function mainMenu() {

  console.log("------------------------------------Welcome to Bamazon!! --------------------------------- \n")
  if (cart.length > 0) {
    console.log("Your shopping cart")
    console.table(cart)
  }

  inquirer
    .prompt({
      name: "queryType",
      type: "list",
      message: "Welcome to Bamazon! What would you like to do today? ",
      choices: ["View Products for Sale", "View Cart", "Checkout", "Exit"]
    })
    .then(function(answer) {

      if (answer.queryType=== "View Products for Sale") {
        
        displayItems()
      }
      else if(answer.queryType=== "View or Update Cart") {
        
        viewCart();
        
      } else if (answer.queryType=== "Checkout"){
        
        checkout(cart)
        

      } else {
          exitApp()
      }
    });

}

function viewCart() {

  if(cart.length === 0) {
    console.log("There is nothing in your cart \n")
  } else {
  console.table(cart)
  }

  inquirer
    .prompt({
      name: "queryType",
      type: "list",
      message: "What would you like to do?",
      choices: ["Update Cart Item Quantity", "Delete item from Cart", "Checkout", "Return to Main Menu"]
    })
    .then(function(answer) {

      if (answer.queryType=== "Update Cart Item Quantity") {
        
        updateShoppingCart()
      }
      else if(answer.queryType=== "Delete item from Cart") {
        
        deleteFromCart()
        
      } else if (answer.queryType=== "Checkout"){
        
        checkout(cart)
        

      } else {
          mainMenu()
      }
    });
  
}

function updateShoppingCart () {
  console.table(cart)

  
  


}

function deleteFromCart () {
  console.table(cart)

}