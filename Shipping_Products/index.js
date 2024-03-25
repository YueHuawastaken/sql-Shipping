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



