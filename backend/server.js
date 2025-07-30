require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: ['https://odgfood.netlify.app', 'http://localhost:3000'] }));
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

// Create daily_menu_states table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS daily_menu_states (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'idle',
    vote_options JSONB DEFAULT '[]'::jsonb,
    voted_users JSONB DEFAULT '{}'::jsonb,
    winning_food_item_id INTEGER REFERENCES foods(id) ON DELETE SET NULL,
    admin_set_food_item_id INTEGER REFERENCES foods(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => {
  console.log('Daily menu states table ensured.');
}).catch(err => {
  console.error('Error ensuring daily menu states table:', err.stack);
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
  console.log('Received request to add new food item:', req.body);
  const { name, image, tags } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO foods (name, image, tags) VALUES ($1, $2, $3) RETURNING *'
      , [name, image, tags]
    );
    console.log('Sending response:', result.rows[0]);
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

// DELETE a food item
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

// --- API Endpoints for Daily Menu ---

// GET the current daily menu state
app.get('/api/daily-menu', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let result = await pool.query('SELECT * FROM daily_menu_states WHERE date = $1', [today]);

    if (result.rows.length === 0) {
      // If no entry for today, create a new idle one
      const newEntry = await pool.query(
        'INSERT INTO daily_menu_states (date, status, vote_options, voted_users) VALUES ($1, $2, $3, $4) RETURNING *'
        , [today, 'idle', [], {}]
      );
      res.json(newEntry.rows[0]);
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error fetching daily menu state:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST to start the voting process (Admin)
app.post('/api/daily-menu/start', async (req, res) => {
  const { voteOptions } = req.body; // voteOptions will be an array of arrays, e.g., [[1, 2], [3, 4]]
  const today = new Date().toISOString().split('T')[0];

  if (!Array.isArray(voteOptions) || voteOptions.length === 0) {
    return res.status(400).json({ error: 'Vote options must be a non-empty array.' });
  }

  try {
    // Extract all unique food IDs from the voteOptions
    const allFoodIds = [...new Set(voteOptions.flat())];

    // Fetch food names for these IDs
    const foodsResult = await pool.query('SELECT id, name FROM foods WHERE id = ANY($1::int[])', [allFoodIds]);
    const foodMap = new Map(foodsResult.rows.map(food => [food.id, food.name]));

    // Construct the new vote_options array with names and votes
    const newVoteOptions = voteOptions.map(pack => {
      if (pack.length !== 2) {
        throw new Error('Each vote pack must contain exactly two food items.');
      }
      const food1Id = pack[0];
      const food2Id = pack[1];
      const food1Name = foodMap.get(food1Id);
      const food2Name = foodMap.get(food2Id);

      if (!food1Name || !food2Name) {
        throw new Error('One or more food items in the pack not found.');
      }

      return {
        foodIds: pack, // Store the array of food IDs
        name: `${food1Name} & ${food2Name}`, // Generate a display name for the pack
        votes: 0
      };
    });

    const result = await pool.query(
      'UPDATE daily_menu_states SET status = $1, vote_options = $2, voted_users = $3, winning_food_item_id = NULL, admin_set_food_item_id = NULL, timestamp = NOW() WHERE date = $4 RETURNING *'
      , ['voting', JSON.stringify(newVoteOptions), {}, today]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Daily menu state for today not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error starting voting:', err.stack);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// POST to close the voting process (Admin)
app.post('/api/daily-menu/close', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    let result = await pool.query('SELECT * FROM daily_menu_states WHERE date = $1', [today]);
    if (result.rows.length === 0 || result.rows[0].status !== 'voting') {
      return res.status(400).json({ error: 'No voting is currently active for today.' });
    }

    const currentMenu = result.rows[0];
    let winningItem = null;
    if (currentMenu.vote_options && currentMenu.vote_options.length > 0) {
      // Find the winning pack based on votes
      winningItem = currentMenu.vote_options.reduce((prev, current) =>
        (prev.votes > current.votes) ? prev : current
      );
    }

    const updatedMenu = await pool.query(
      'UPDATE daily_menu_states SET status = $1, winning_food_item_id = $2, timestamp = NOW() WHERE date = $3 RETURNING *'
      , ['closed', winningItem && winningItem.foodIds && winningItem.foodIds.length > 0 ? winningItem.foodIds[0] : null, today] // Store the first foodId of the winning pack
    );

    // Save the result to the daily_results table
    const totalVotes = currentMenu.vote_options.reduce((sum, option) => sum + option.votes, 0);
    const voteDetails = currentMenu.vote_options; // vote_details now stores the entire vote_options array (packs with votes)

    await pool.query(
      'INSERT INTO daily_results (date, winning_food_id, winning_food_name, total_votes, vote_details) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (date) DO UPDATE SET winning_food_id = EXCLUDED.winning_food_id, winning_food_name = EXCLUDED.winning_food_name, total_votes = EXCLUDED.total_votes, vote_details = EXCLUDED.vote_details, created_at = NOW()'
      , [today, winningItem && winningItem.foodIds && winningItem.foodIds.length > 0 ? winningItem.foodIds[0] : null, winningItem ? winningItem.name : null, totalVotes, JSON.stringify(voteDetails)]
    );

    res.status(200).json(updatedMenu.rows[0]);
  } catch (err) {
    console.error('Error closing voting:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST to cast a vote
app.post('/api/daily-menu/vote', async (req, res) => {
  const { userId, foodPackIndex } = req.body; // foodPackIndex is the index of the chosen pack in vote_options array
  const today = new Date().toISOString().split('T')[0];

  try {
    let result = await pool.query('SELECT * FROM daily_menu_states WHERE date = $1', [today]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Daily menu state for today not found.' });
    }

    const currentMenu = result.rows[0];

    if (currentMenu.status !== 'voting') {
      return res.status(400).json({ error: 'Voting is not active.' });
    }
    if (currentMenu.voted_users && currentMenu.voted_users[userId]) {
      return res.status(400).json({ error: 'User has already voted.' });
    }

    const updatedVoteOptions = [...currentMenu.vote_options]; // Create a shallow copy

    if (foodPackIndex < 0 || foodPackIndex >= updatedVoteOptions.length) {
      return res.status(400).json({ error: 'Invalid food pack index.' });
    }

    // Increment votes for the selected pack
    updatedVoteOptions[foodPackIndex].votes += 1;

    const updatedVotedUsers = { ...currentMenu.voted_users, [userId]: foodPackIndex }; // Store the index of the voted pack

    const updatedMenu = await pool.query(
      'UPDATE daily_menu_states SET vote_options = $1, voted_users = $2, timestamp = NOW() WHERE date = $3 RETURNING *'
      , [JSON.stringify(updatedVoteOptions), JSON.stringify(updatedVotedUsers), today]
    );

    res.status(200).json(updatedMenu.rows[0]);
  } catch (err) {
    console.error('Error casting vote:', err.stack);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// POST to set the menu by admin
app.post('/api/daily-menu/admin-set', async (req, res) => {
    const { foodId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    if (!foodId) {
        return res.status(400).json({ error: 'Food ID is required.' });
    }

    try {
        const result = await pool.query(
            'UPDATE daily_menu_states SET status = $1, admin_set_food_item_id = $2, winning_food_item_id = NULL, vote_options = $3, voted_users = $4, timestamp = NOW() WHERE date = $5 RETURNING *'
            , ['admin_set', foodId, [], {}, today]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Daily menu state for today not found.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error setting menu by admin:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET all daily menu states
app.get('/api/daily-menu/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM daily_menu_states ORDER BY date ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all daily menu states:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET daily menu state for a specific date
app.get('/api/daily-menu/:date', async (req, res) => {
  const { date } = req.params;
  try {
    let result = await pool.query('SELECT * FROM daily_menu_states WHERE date = $1', [date]);
    if (result.rows.length === 0) {
      // If no entry for this date, create a new idle one
      const newEntry = await pool.query(
        'INSERT INTO daily_menu_states (date, status, vote_options, voted_users) VALUES ($1, $2, $3, $4) RETURNING *'
        , [date, 'idle', [], {}]
      );
      res.json(newEntry.rows[0]);
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error('Error fetching daily menu state by date:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT to update status of a daily menu state
app.put('/api/daily-menu/:date/status', async (req, res) => {
  const { date } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  try {
    const result = await pool.query(
      'UPDATE daily_menu_states SET status = $1, timestamp = NOW() WHERE date = $2 RETURNING *'
      , [status, date]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Daily menu state for this date not found.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating daily menu state status:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a daily menu state
app.delete('/api/daily-menu/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const result = await pool.query('DELETE FROM daily_menu_states WHERE date = $1 RETURNING *'
      , [date]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Daily menu state for this date not found.' });
    }
    res.status(204).send(); // No content for successful deletion
  } catch (err) {
    console.error('Error deleting daily menu state:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/reports/summary', async (req, res) => {
    try {
        const monthlyQuery = `
            SELECT winning_food_name, COUNT(*) as wins
            FROM daily_results
            WHERE date_part('month', date) = date_part('month', CURRENT_DATE)
              AND date_part('year', date) = date_part('year', CURRENT_DATE)
              AND winning_food_name IS NOT NULL
            GROUP BY winning_food_name
            ORDER BY wins DESC
            LIMIT 1;
        `;

        const yearlyQuery = `
            SELECT winning_food_name, COUNT(*) as wins
            FROM daily_results
            WHERE date_part('year', date) = date_part('year', CURRENT_DATE)
              AND winning_food_name IS NOT NULL
            GROUP BY winning_food_name
            ORDER BY wins DESC
            LIMIT 1;
        `;

        const overallQuery = `
            SELECT winning_food_name, COUNT(*) as wins
            FROM daily_results
            WHERE winning_food_name IS NOT NULL
            GROUP BY winning_food_name
            ORDER BY wins DESC
            LIMIT 1;
        `;

        const [monthlyRes, yearlyRes, overallRes] = await Promise.all([
            pool.query(monthlyQuery),
            pool.query(yearlyQuery),
            pool.query(overallQuery)
        ]);

        res.json({
            monthly: monthlyRes.rows[0] || null,
            yearly: yearlyRes.rows[0] || null,
            overall: overallRes.rows[0] || null,
        });
    } catch (err) {
        console.error('Error fetching report summary:', err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/reports/daily-summary', async (req, res) => {
    const date = req.query.date || new Date().toISOString().split('T')[0];

    try {
        const dailyStateQuery = 'SELECT * FROM daily_menu_states WHERE date = $1';
        const dailyResultQuery = 'SELECT * FROM daily_results WHERE date = $1';

        const [dailyStateRes, dailyResultRes] = await Promise.all([
            pool.query(dailyStateQuery, [date]),
            pool.query(dailyResultQuery, [date])
        ]);

        res.json({
            dailyState: dailyStateRes.rows[0] || null,
            dailyResult: dailyResultRes.rows[0] || null
        });
    } catch (err) {
        console.error('Error fetching daily summary:', err.stack);
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
