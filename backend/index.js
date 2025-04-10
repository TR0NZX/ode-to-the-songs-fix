
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.status(200).json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.id, m.recipient, m.message, m.created_at, 
             s.id as song_id, s.title, s.artist, s.album_cover, s.uri, s.preview_url
      FROM messages m
      JOIN songs s ON m.song_id = s.id
      ORDER BY m.created_at DESC
    `);
    
    const messages = rows.map(row => ({
      id: row.id,
      recipient: row.recipient,
      message: row.message,
      date: row.created_at,
      song: {
        id: row.song_id,
        title: row.title,
        artist: row.artist,
        albumCover: row.album_cover,
        uri: row.uri,
        previewUrl: row.preview_url
      }
    }));
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.get('/api/messages/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.id, m.recipient, m.message, m.created_at, 
             s.id as song_id, s.title, s.artist, s.album_cover, s.uri, s.preview_url
      FROM messages m
      JOIN songs s ON m.song_id = s.id
      WHERE m.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const message = {
      id: rows[0].id,
      recipient: rows[0].recipient,
      message: rows[0].message,
      date: rows[0].created_at,
      song: {
        id: rows[0].song_id,
        title: rows[0].title,
        artist: rows[0].artist,
        albumCover: rows[0].album_cover,
        uri: rows[0].uri,
        previewUrl: rows[0].preview_url
      }
    };
    
    res.status(200).json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

app.get('/api/messages/search/:query', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.id, m.recipient, m.message, m.created_at, 
             s.id as song_id, s.title, s.artist, s.album_cover, s.uri, s.preview_url
      FROM messages m
      JOIN songs s ON m.song_id = s.id
      WHERE m.recipient LIKE ?
      ORDER BY m.created_at DESC
    `, [`%${req.params.query}%`]);
    
    const messages = rows.map(row => ({
      id: row.id,
      recipient: row.recipient,
      message: row.message,
      date: row.created_at,
      song: {
        id: row.song_id,
        title: row.title,
        artist: row.artist,
        albumCover: row.album_cover,
        uri: row.uri,
        previewUrl: row.preview_url
      }
    }));
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({ error: 'Failed to search messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  const { recipient, message, song } = req.body;
  
  if (!recipient || !message || !song || !song.id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const [existingSongs] = await connection.query(
      'SELECT * FROM songs WHERE id = ?', 
      [song.id]
    );
    
    if (existingSongs.length === 0) {
      await connection.query(
        'INSERT INTO songs (id, title, artist, album_cover, uri, preview_url) VALUES (?, ?, ?, ?, ?, ?)',
        [song.id, song.title, song.artist, song.albumCover, song.uri, song.previewUrl]
      );
    }
    
    const messageId = uuidv4();
    
    await connection.query(
      'INSERT INTO messages (id, recipient, message, song_id, created_at) VALUES (?, ?, ?, ?, NOW())',
      [messageId, recipient, message, song.id]
    );
    
    await connection.commit();
    
    res.status(201).json({ 
      id: messageId,
      recipient,
      message,
      song,
      date: new Date().toISOString()
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  } finally {
    connection.release();
  }
});

const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS songs (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        album_cover VARCHAR(255),
        uri VARCHAR(255),
        preview_url VARCHAR(255)
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(36) PRIMARY KEY,
        recipient VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        song_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (song_id) REFERENCES songs(id)
      )
    `);
    
    const [songCount] = await connection.query('SELECT COUNT(*) as count FROM songs');
    
    if (songCount[0].count === 0) {
      await connection.query(`
        INSERT INTO songs (id, title, artist, album_cover, preview_url) VALUES 
        ('1', 'Always', 'Bon Jovi', 'https://i.scdn.co/image/ab67616d0000b273b7c05417113f613a3c76c226', 'https://p.scdn.co/mp3-preview/96d3a5e20256d5ab68b88eb37a62dabe7d3efe16')
      `);
      
      await connection.query(`
        INSERT INTO messages (id, recipient, message, song_id, created_at) VALUES 
        ('1', 'Ode Team', 'bismillah UTS 100 amin ya ges :)))', '1', '2025-03-29')
      `);
    }
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDatabase();
});
