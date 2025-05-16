const { Client } = require('pg');
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  num_of_pages INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS authors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS books_authors (
  book_id INTEGER REFERENCES books(id),
  author_id INTEGER REFERENCES authors(id),
  PRIMARY KEY (book_id, author_id)
);

CREATE TABLE IF NOT EXISTS books_genres (
  book_id INTEGER REFERENCES books(id),
  genre_id INTEGER REFERENCES genres(id),
  PRIMARY KEY (book_id, genre_id)
);
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
