const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');

let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');
require('handlebars-helpers')({
    handlebars: hbs.handlebars
})

let connection;

async function main() {
    connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })
}

app.get('/', (req,res) => {
    res.send('Hello, World!');
});

app.get('/shippingProducts', async function (req, res) {
    let [shippingProducts] = await connection.execute('SELECT Products.*, Companies.companyName, Products.name as productName, ProductType.typeName FROM Products INNER JOIN ProductType ON Products.productTypeId = ProductType.productTypeId JOIN Companies ON Products.companyId = Companies.companyId ORDER BY ProductsId');
    res.render('index', {
        'shippingProducts': shippingProducts
    })
})

app.get('/shippingProducts/create', async(req,res)=>{
    let [companies] = await connection.execute('SELECT * from Companies')
    let [producttypes] = await connection.execute ('SELECT * from ProductType')
    console.log(companies);
    res.render('create', {
        companies,
        producttypes
    })
})

app.post('/shippingProducts/create', async(req,res)=>{
    let {product_name, price, productType_id, company_id} = req.body;
    console.log(company_id);
    let query = 'INSERT INTO Products (name, price, productTypeId, companyId) VALUES (?, ?, ?, ?)';
    let bindings = [product_name, price, productType_id, company_id];
    await connection.execute(query, bindings);
    res.redirect('/shippingProducts');
})


app.get('/shippingProducts/edit/:Products_id', async(req,res)=>{
    let [products] = await connection.execute('SELECT * from Products WHERE ProductsId = ?', [req.params.Products_id])
    let [companies] = await connection.execute('SELECT * from Companies')
    let [producttypes] = await connection.execute ('SELECT * from ProductType')
    let product = products[0];
    res.render('edit', {
        companies,
        producttypes,
        product
    })
})

app.post('/shippingProducts/edit/:Products_id', async(req,res)=>{
    let {product_name, price, productType_id, company_id} = req.body;
    let query = 'UPDATE Products SET name = ?, price = ?, productTypeId = ?, companyId = ? WHERE ProductsId = ?';
    let bindings = [product_name, price, productType_id, company_id, req.params.Products_id];
    await connection.execute(query, bindings);
    res.redirect('/shippingProducts');
})

app.get("/shippingProducts/delete/:Products_id", async function (req,res){
    const {Products_id} = req.params; // same as `const customerId = req.params.customerId`
    const query = `SELECT * FROM Products WHERE ProductsId = ?`;
    
    // connection.execute with a SELECT statement 
    // you always get an array as a result even if there ONLY one possible result
    const [Product] = await connection.execute(query, [Products_id]);
    const productsToDelete = Product[0];

    res.render('delete', {
         productsToDelete
    })

})

app.post('/shippingProducts/delete/:Products_id', async function (req,res){
    const {Products_id} = req.params;

    // check if the customerId in a relationship with an employee
    const checkProductId = `SELECT * FROM Products WHERE ProductsId = ?`;
    // const [involved] = await connection.execute(checkProductId, [Products_id]);
    if (checkProductId == Products_id) {
        res.send("Are you sure you want to delete this product ?");
        return;
    }

    const query = `DELETE FROM Products WHERE ProductsId = ?`;
    await connection.execute(query, [Products_id]);
    res.redirect('/shippingProducts');
})


app.listen(3000, ()=>{
    console.log('Server is running')
});

main();

// app.get('/customers', async (req, res) => {
//     let [customers] = await connection.execute('SELECT * FROM Customers INNER JOIN Companies ON Customers.company_id = Companies.company_id');
//     res.render('customers/index', {
//         'customers': customers
//     })
// })



