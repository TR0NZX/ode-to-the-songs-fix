
CREATE DATABASE IF NOT EXISTS song_messages;
USE song_messages;

CREATE TABLE IF NOT EXISTS songs (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  album_cover VARCHAR(255),
  uri VARCHAR(255),
  preview_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(36) PRIMARY KEY,
  recipient VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  song_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES songs(id)
);

-- sample data
INSERT INTO songs (id, title, artist, album_cover, preview_url)
VALUES ('1', 'Always', 'Bon Jovi', 'https://i.scdn.co/image/ab67616d0000b273b7c05417113f613a3c76c226', 'https://p.scdn.co/mp3-preview/96d3a5e20256d5ab68b88eb37a62dabe7d3efe16');

INSERT INTO messages (id, recipient, message, song_id, created_at)
VALUES ('1', 'Ode Team', 'bismillah UTS 100 amin ya ges :)))', '1', '2025-03-29');
