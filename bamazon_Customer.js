var mysql = require ("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');
var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"root123",
    database: "bamazon"

//The first should ask them the ID of the product they would like to buy.
//The second message should ask how many units of the product they would like to buy.

});
connection.connect(function(err){
    if (err) throw err;

})
function askQuestion(){
    inquirer
    .prompt([
        {
            type: "input",
            message:"ID of the product you would like to buy?",
            name:"id"
             

        },
        {
            type: "input",
            message:"How many units did you want to buy?",
            name:"units"            
        }
    ])
    .then(function(inquirerResp){
        var query = "SELECT product_name, stock_quantity, price from products WHERE ?";
        connection.query(query,{item_id: inquirerResp.id},function(err, res){
            console.log("\n");
            console.log(" Product: " + res[0].product_name + '\n'+
         " Quantity: " +inquirerResp.units );
            //checking quantity against the stock_quantity
            var quantity = inquirerResp.units;
            var stock = res[0].stock_quantity;
            var price = res[0].price;
            var input_id = inquirerResp.id;
            if (quantity < stock){
                console.log("\n");
                console.log ("We have enough in our stock! Processing your order.. Please wait..")
                console.log("\n");
                var newStockQuantity = (stock - quantity);
                var totalPrice = (quantity * price);
                var update = "UPDATE products SET stock_quantity = ? WHERE item_id =?"
                connection.query(update,[newStockQuantity,inquirerResp.id], function (err, result) {
                    if (err) throw err;
                    // console.log(result.affectedRows + " record(s) updated");
                    // console.log(newStockQuantity);

                });
                customerOrder(input_id,quantity,totalPrice);

            }else {
                console.log(" Sorry! we don't have enough stock at the moment");
                console.log("\n")
                askQuestion();
            }   
         
        })
        // console.log(inquirerResp.id);
        

    });
};
function customerOrder(input_id,newQuantity,newPrice){
    var Table = require('cli-table2');
    console.log ( " Customer Order:  ");
    var query = "SELECT product_name, department_name, price from products WHERE ?";
    connection.query(query,{item_id: `${input_id}`},function(err, res){
        var table = new Table ({
            head: ['Product', 'Department', 'Price', 'Quantity', 'Total Price']
          , colWidths: [15, 25]
        });
        
        table.push(
            [res[0].product_name, res[0].department_name, res[0].price,newQuantity, "$"+newPrice]
        );
        console.log(table.toString());
        console.log("\n");
        
    });
    connection.query(`SELECT * FROM products`, function (err, res){
        if (err) throw err;
        
        var table = new Table ({
            head: ['Sl','Product', 'Department', 'Price', 'Stock Quantity']
          , colWidths: [20, 20]
        });
        for (var i=0; i<res.length; i++){
            table.push(
                [res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
              
            );
        }
        console.log(" Current Stock Details:  ")
        console.log(table.toString());
        console.log("\n");
        connection.end();
    });
};



connection.connect(function(err){
    // if (err) throw err;
    console.log("\n\r")
    console.log ("  ==> Welcome To BamaZon <==  \n");
    connection.query(`SELECT * FROM products`, function (err, res){
        if (err) throw err;
        
        var table = new Table ({
            head: ['Sl','Product', 'Department', 'Price', 'Stock Quantity']
          , colWidths: [20, 20]
        });
        for (var i=0; i<res.length; i++){
            table.push(
                [res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
              
            );
        }

        console.log(table.toString());
        console.log("\n\r");
        // console.log(res);
        // connection.end();
        askQuestion();
    });
});