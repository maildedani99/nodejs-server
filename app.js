const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors()); 

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3305',
    user: 'root',
    password: 'nds2020',
    database: 'nodejs_db'
});
//route
app.get('/', (req, res) => {
    res.send('Welcome to my API');
})
//clientes
app.get('/customers', (req, res) => {
    const sql = 'SELECT * FROM customers';

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Not result');
        }
    })
})
app.get('/customers/:id', (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    const sql = `SELECT * FROM customers WHERE id = ${id}`;
    connection.query(sql, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Not result');
        }
    })

})
app.post('/add', (req, res) => {
    const sql = 'INSERT INTO customers SET ?';
    const customerObj = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        city: req.body.city,
    }
    connection.query(sql, customerObj, error => {
        if (error) throw error;
        res.send('Customer Created!');
    });
})


app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, city } = req.body;
    const sql = `UPDATE customers SET first_name = '${first_name}', last_name='${last_name}', city = '${city}' WHERE id='${id}'`;
    connection.query(sql, error => {
        if (error) throw error;
        res.send('Customer Updated!');
    }); 
})
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM customers WHERE id=${id}`;
    connection.query(sql, error => {
        if (error) throw error;
        res.send('Customer Deleted!');
    }); 
})
//check connect
connection.connect(error => {
    if (error) throw error;
    console.log('Database server running!!')
})

app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Server running on port ${url}`);
})