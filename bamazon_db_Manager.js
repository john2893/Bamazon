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
askQuestion();
function askQuestion(){
    inquirer
    .prompt([
        {
            type: "list",
            message:"List of options",
            name:"task",
            choices:["View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"]

        },
    ])
    .then(function(inquirerResp){
        if (inquirerResp.task === "View Products for Sale"){
            productForSale();

        }else if (inquirerResp.task === "View Low Inventory"){
            lowInventory();

        } else if (inquirerResp.task === "Add to Inventory"){
            inquirer
            .prompt([
                {
                    type: "input",
                    message:"Id of the product you want to add",
                    name:"id",
                },
                {
                    type: "input",
                    message:"How many of this would you like to add? ",
                    name:"units",
                },
            ])
            .then(function(inquirerResp){
                addMoreInventory(inquirerResp.units, inquirerResp.id);
            });
        
        }
        else if (inquirerResp.task === "Add New Product"){
            inquirer
            .prompt([
                {
                    type: "input",
                    message:"Product Name",
                    name:"prodName",
                },
                {
                    type: "input",
                    message:"Department Name",
                    name:"deptName",
                },
                {
                    type: "input",
                    message:"Price",
                    name:"price",
                },
                {
                    type: "input",
                    message:"Quantity",
                    name:"quantity",
                },
            ])
            .then(function(inquirerResp){
                var prodName = inquirerResp.prodName;
                var deptName = inquirerResp.deptName;
                var price = inquirerResp.price;
                var quantity = inquirerResp.quantity;
                addNewProduct(prodName,deptName,price,quantity);
            });
        

            
        }
        // console.log(inquirerResp.id);
    });
};
function productForSale(){
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
    
};

function lowInventory(){
    connection.query(`SELECT * FROM products where stock_quantity <= 5`, function (err, res){
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
        askQuestion();
    });
}

function addMoreInventory(newStockQuantity, input_id){
    var update = "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id =?"
    connection.query(update,[newStockQuantity,input_id], function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
        // console.log(newStockQuantity);

    });
    productForSale();
}
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

function addNewProduct(prodName,deptName,price,quantity){
    var newProd = "INSERT INTO products SET ?;
    //var newProd = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('capo', 'musical instruments', '23.99','24')";
    var post = {product_name:prodName,department_name:deptName,price:price, stock_quantity:quantity};
    connection.query('INSERT INTO products SET ?',post, function (err, result) {
        if (err) throw err;
        console.log(result.insertId + " record(s) updated");
        // console.log(newStockQuantity);

    });
    productForSale();
};

// connection.connect(function(err){
//     // if (err) throw err;
//     console.log("\n\r")
//     console.log ("  ==> Welcome To BamaZon <==  \n");
//     connection.query(`SELECT * FROM products`, function (err, res){
//         if (err) throw err;
        
//         var table = new Table ({
//             head: ['Sl','Product', 'Department', 'Price', 'Stock Quantity']
//           , colWidths: [20, 20]
//         });
//         for (var i=0; i<res.length; i++){
//             table.push(
//                 [res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
              
//             );
//         }

//         console.log(table.toString());
//         console.log("\n\r");
//         // console.log(res);
//         // connection.end();
//         askQuestion();
//     });
// });