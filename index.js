const express = require('express');
let mysql = require('mysql');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'gyan1234',
  database: 'biodata',
  port : 3307
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connection Successfully');
});

app.get('/api/Mahasiswa', (req, res) => {
    db.query('SELECT * FORM mahasiswa', (err, results) => {
       if (err) {
            console.error('Error executing query : ' + err.stack) 
            res.status(500).send('Error fetching users');
            return;
    }
    res.json(results);
    });
});