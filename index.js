const express = require('express');
let mysql = require('mysql');
const app = express();
// The database port and the application port should be different.
// I'll set the app port to 3000.
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Database connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'gyan1234',
  database: 'biodata',
  port : 3307
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connection to database successful');
});

// GET all mahasiswa
app.get('/api/mahasiswa', (req, res) => {
    // Corrected SQL syntax: "FROM" instead of "FORM"
    db.query('SELECT * FROM mahasiswa', (err, results) => {
        if (err) {
            console.error('Error executing query: ' + err.stack) 
            res.status(500).send('Error fetching data');
            return;
    }
    res.json(results);
    });
});

// POST a new mahasiswa
app.post('/api/mahasiswa', (req, res) =>{
    const { nama, nim, kelas, prodi } = req.body;

    if (!nama || !nim || !kelas || !prodi) {
        // Corrected syntax: res.status(400)
        return res.status(400).json({ message: 'nama, nim, kelas, prodi are required fields'});
    }

    db.query(
        'INSERT INTO mahasiswa (nama, nim, kelas, prodi) VALUES (?, ?, ?, ?)',
    [nama, nim, kelas, prodi],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json ({ message: 'Database Error' });   
            }
            res.status(201).json({ message: 'Mahasiswa added successfully', id: result.insertId });
        }
    );
});

// PUT (update) a mahasiswa by ID
app.put('/api/mahasiswa/:id', (req, res) => {
    const userId = req.params.id;
    const{ nama, nim, kelas, prodi } = req.body;
    db.query(
        'UPDATE mahasiswa SET nama = ?, nim = ?, kelas = ?, prodi = ? WHERE id = ?',
        [nama, nim, kelas, prodi, userId],
        (err, result) => {
            if (err) {
                console.error(err);
                // Corrected syntax: res.status(500).json(...)
                return res.status(500).json({ message: 'Database error'});
            }
            res.json({ message: 'User updated successfully'});
        }
    );
})

// DELETE a mahasiswa by ID
app.delete('/api/mahasiswa/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM mahasiswa WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({message: 'Database error' });
        }
        res.json({ message: 'User deleted successfully'});
    });
});
