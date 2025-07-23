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

// Create foods table if it doesn't exist and ensure image column is TEXT
pool.query(`
  CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image TEXT, -- Changed from VARCHAR(255)
    tags TEXT[]
  );
`).then(() => {
  console.log('Foods table ensured.');
  // Attempt to alter the column type if it's not already TEXT
  return pool.query(`
    ALTER TABLE foods ALTER COLUMN image TYPE TEXT;
  `);
}).then(() => {
  console.log('Image column type ensured to be TEXT.');
}).catch(err => {
  console.error('Error ensuring foods table or image column type:', err.stack);
});

// Create food_reviews table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS food_reviews (
    id SERIAL PRIMARY KEY,
    food_id INTEGER NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    user_id VARCHAR(255), -- Optional, if you want to track who reviewed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => {
  console.log('Food reviews table ensured.');
}).catch(err => {
  console.error('Error ensuring food reviews table:', err.stack);
});

// Create daily_results table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS daily_results (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    winning_food_id INTEGER REFERENCES foods(id) ON DELETE SET NULL,
    winning_food_name VARCHAR(255),
    total_votes INTEGER DEFAULT 0,
    vote_details JSONB, -- Stores details like { foodId: votes, ... }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => {
  console.log('Daily results table ensured.');
}).catch(err => {
  console.error('Error ensuring daily results table:', err.stack);
});

// POST a new review for a food item
app.post('/api/foods/:id/reviews', async (req, res) => {
  const { id } = req.params; // food_id
  const { rating, comment, userId } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO food_reviews (food_id, rating, comment, user_id) VALUES ($1, $2, $3, $4) RETURNING *'
      , [id, rating, comment, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding review:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET all reviews for a specific food item
app.get('/api/foods/:id/reviews', async (req, res) => {
  const { id } = req.params; // food_id
  try {
    const result = await pool.query('SELECT * FROM food_reviews WHERE food_id = $1 ORDER BY created_at DESC', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reviews:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET average rating for a specific food item
app.get('/api/foods/:id/average-rating', async (req, res) => {
  const { id } = req.params; // food_id
  try {
    const result = await pool.query(
      'SELECT AVG(rating)::numeric(10,2) AS average_rating FROM food_reviews WHERE food_id = $1'
      , [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching average rating:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST daily voting results
app.post('/api/daily-results', async (req, res) => {
  const { date, winningFoodId, winningFoodName, totalVotes, voteDetails } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO daily_results (date, winning_food_id, winning_food_name, total_votes, vote_details) VALUES ($1, $2, $3, $4, $5) RETURNING *'
      , [date, winningFoodId, winningFoodName, totalVotes, voteDetails]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving daily results:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET daily reports
app.get('/api/reports/daily', async (req, res) => {
  const { month, year } = req.query;
  try {
    let query = 'SELECT * FROM daily_results';
    const params = [];
    if (month && year) {
      query += ' WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2';
      params.push(month, year);
    } else if (year) {
      query += ' WHERE EXTRACT(YEAR FROM date) = $1';
      params.push(year);
    }
    query += ' ORDER BY date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching daily reports:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single daily report by ID
app.get('/api/daily-results/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM daily_results WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching single daily report:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST to get multiple food items by their IDs
app.post('/api/foods/batch', async (req, res) => {
  const { foodIds } = req.body; // Expects an array of food IDs
  if (!Array.isArray(foodIds) || foodIds.length === 0) {
    return res.status(400).json({ error: 'foodIds must be a non-empty array' });
  }
  try {
    // Using UNNEST to query for multiple IDs efficiently
    const result = await pool.query('SELECT id, name, image FROM foods WHERE id = ANY($1::int[])', [foodIds]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching food items in batch:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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

// PUT (Update) a food item
app.put('/api/foods/:id', async (req, res) => {
  const { id } = req.params;
  const { name, image, tags } = req.body;
  try {
    const result = await pool.query(
      'UPDATE foods SET name = $1, image = $2, tags = $3 WHERE id = $4 RETURNING *'
      , [name, image, tags, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating food item:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

"""// DELETE a food item
app.delete('/api/foods/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM foods WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.status(204).send(); // No content for successful deletion
  } catch (err) {
    console.error('Error deleting food item:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- Daily Menu State (In-memory) ---
let dailyMenuState = {
  status: 'idle', // idle, voting, closed, admin_set
  voteOptions: [], // Array of { foodItemId, name, image, votes }
  votedUsers: {}, // { userId: foodItemId }
  winningFoodItemId: null,
  adminSetFoodItemId: null,
  timestamp: null,
};

// --- API Endpoints for Daily Menu ---

// GET the current daily menu state
app.get('/api/daily-menu', (req, res) => {
  res.json(dailyMenuState);
});

// POST to start the voting process (Admin)
app.post('/api/daily-menu/start', (req, res) => {
  const { voteOptions } = req.body;
  if (dailyMenuState.status !== 'idle' && dailyMenuState.status !== 'closed') {
    return res.status(400).json({ error: 'Voting is already in progress or set by admin.' });
  }
  if (!Array.isArray(voteOptions) || voteOptions.length === 0) {
    return res.status(400).json({ error: 'Vote options must be a non-empty array.' });
  }

  dailyMenuState = {
    status: 'voting',
    voteOptions: voteOptions.map(opt => ({ ...opt, votes: 0 })),
    votedUsers: {},
    winningFoodItemId: null,
    adminSetFoodItemId: null,
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(dailyMenuState);
});

// POST to close the voting process (Admin)
app.post('/api/daily-menu/close', (req, res) => {
  if (dailyMenuState.status !== 'voting') {
    return res.status(400).json({ error: 'No voting is currently active.' });
  }

  let winningItem = null;
  if (dailyMenuState.voteOptions.length > 0) {
    winningItem = dailyMenuState.voteOptions.reduce((prev, current) =>
      (prev.votes > current.votes) ? prev : current
    );
  }

  dailyMenuState.status = 'closed';
  dailyMenuState.winningFoodItemId = winningItem ? winningItem.foodItemId : null;
  dailyMenuState.timestamp = new Date().toISOString();

  // Optional: Save the result to the database here as well
  // This part can be enhanced later

  res.status(200).json(dailyMenuState);
});

// POST to cast a vote
app.post('/api/daily-menu/vote', (req, res) => {
  const { userId, foodItemId } = req.body;

  if (dailyMenuState.status !== 'voting') {
    return res.status(400).json({ error: 'Voting is not active.' });
  }
  if (dailyMenuState.votedUsers[userId]) {
    return res.status(400).json({ error: 'User has already voted.' });
  }

  const option = dailyMenuState.voteOptions.find(opt => opt.foodItemId === foodItemId);
  if (!option) {
    return res.status(404).json({ error: 'Food item not found in vote options.' });
  }

  option.votes += 1;
  dailyMenuState.votedUsers[userId] = foodItemId;
  dailyMenuState.timestamp = new Date().toISOString();

  res.status(200).json(dailyMenuState);
});

// POST to set the menu by admin
app.post('/api/daily-menu/admin-set', (req, res) => {
    const { foodId } = req.body;
    if (!foodId) {
        return res.status(400).json({ error: 'Food ID is required.' });
    }

    dailyMenuState = {
        status: 'admin_set',
        voteOptions: [],
        votedUsers: {},
        winningFoodItemId: null,
        adminSetFoodItemId: foodId,
        timestamp: new Date().toISOString(),
    };
    res.status(200).json(dailyMenuState);
});


// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});
""

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
