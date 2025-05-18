const pool = require('./pool');

async function createBook({ title, author, genre, pages }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const authorObj = getAuthor(author);
    const authorId = getAuthor(author).length
      ? authorObj
      : createAuthor(author).id;

    const genreObj = getGenre(genre);
    const genreId = getGenre(author).length ? genreObj : createGenre(genre).id;

    const insertBookQuery = `
    INSERT INTO books (title, num_of_pages)
    VALUES ($1, $2)
    RETURNING id;
    `;
    const res = await client.query(insertBookQuery, [title, pages]);
    const bookId = res.rows[0].id;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating book:', error);
  } finally {
    client.release;
  }
}

async function getAllAuthors() {
  try {
    const query = 'SELECT * FROM authors';
    const { rows } = pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting all authors:', error);
  }
}

async function getAuthor(name) {
  try {
    const query = 'SELECT * FROM authors WHERE name LIKE ($1)';
    const queryArgs = [name];
    const { rows } = pool.query(query, queryArgs);
    return rows;
  } catch (error) {
    console.error(`Error getting author (name: ${name}):`, error);
  }
}

async function createAuthor(name) {
  try {
    const insertAuthorQuery =
      'INSERT INTO authors (name) VALUES ($1) RETURNING *;';
    const queryArgs = [name];
    const { rows } = pool.query(insertAuthorQuery, queryArgs);
    return rows[0]; // This will return the author created
  } catch (error) {
    console.error(`Error creating author (name: ${name}):`, error);
  }
}

async function getAllGenres() {
  try {
    const query = 'SELECT * FROM genres';
    const { rows } = pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting all genres:', error);
  }
}

async function getGenre(name) {
  try {
    const query = 'SELECT * FROM genres WHERE name LIKE ($1)';
    const queryArgs = [name];
    const { rows } = pool.query(query, queryArgs);
    return rows;
  } catch (error) {
    console.error(`Error getting genre (name: ${name}):`, error);
  }
}

async function createGenre(name) {
  try {
    const insertGenreQuery =
      'INSERT INTO genre (name) VALUES ($1) RETURNING *;';
    const queryArgs = [name];
    const { rows } = pool.query(insertGenreQuery, queryArgs);
    return rows[0]; // This will return the genre created
  } catch (error) {
    console.error(`Error creating genre (name: ${name}):`, error);
  }
}

module.exports = { getAllAuthors, getAllGenres };
