const { Client } = require('pg');
require('dotenv').config();

const SQL = `
DELETE FROM books_authors;

DELETE FROM books_genres;

DELETE FROM books;

DELETE FROM authors;

DELETE FROM genres;
`;

async function main() {
  console.log('clearing...');
  const client = new Client({
    connectionString: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
