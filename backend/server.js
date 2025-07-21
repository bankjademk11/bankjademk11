const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render's PostgreSQL
  },
});

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Database connected:', result.rows[0].now);
  });
});

// Create foods table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    tags TEXT[]
  );
`).then(() => {
  console.log('Foods table ensured.');
}).catch(err => {
  console.error('Error ensuring foods table:', err.stack);
});

// GET all food items
app.get('/api/foods', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM foods ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching food items:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new food item
app.post('/api/foods', async (req, res) => {
  const { name, image, tags } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO foods (name, image, tags) VALUES ($1, $2, $3) RETURNING *'
      , [name, image, tags]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding food item:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
