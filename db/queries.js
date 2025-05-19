const pool = require('./pool');

async function getAllFullBooks() {
  try {
    const query = `
    SELECT books.id, books.title, authors.name AS author, genres.name AS genre, books.num_of_pages
    FROM books
    JOIN books_authors
    ON books.id = books_authors.book_id
    JOIN authors
    ON books_authors.author_id = authors.id
    JOIN books_genres
    ON books.id = books_genres.book_id
    JOIN genres
    ON books_genres.genre_id = genres.id
    `;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error(`Error getting full book (title: ${title}):`, error);
  }
}

async function getFullBook(title) {
  try {
    const query = `
    SELECT books.id, books.title, authors.name AS author, genres.name AS genre, books.num_of_pages
    FROM books
    JOIN books_authors
    ON books.id = books_authors.book_id
    JOIN authors
    ON books_authors.author_id = authors.id
    JOIN books_genres
    ON books.id = books_genres.book_id
    JOIN genres
    ON books_genres.genre_id = genres.id
    WHERE books.title = $1
    `;
    const queryArgs = [title];
    const { rows } = await pool.query(query, queryArgs);
    return rows;
  } catch (error) {
    console.error(`Error getting full book (title: ${title}):`, error);
  }
}

async function insertFullBook({ title, author, genre, pages }) {
  const client = await pool.connect();
  try {
    let returnObj = {};

    await client.query('BEGIN');

    // Create book if not exists
    const bookArr = await getBook(title);
    let bookId;
    if (bookArr.length) {
      returnObj.success = false;
      returnObj.error = `Book of title ${title} already exists`;
      return returnObj;
    } else {
      bookId = (await insertBook(title, pages)).id;
    }

    /*
    If the array of rows returned is empty (no author found) an author is created,
    if not, the author found is used
    */
    const authorArr = await getAuthor(author);
    const authorId = authorArr.length
      ? authorArr[0].id
      : (await insertAuthor(author)).id;

    const genreArr = await getGenre(genre);
    const genreId = genreArr.length
      ? genreArr[0].id
      : (await insertGenre(genre)).id;

    const bookAuthorsQuery =
      'INSERT INTO books_authors (book_id, author_id) VALUES ($1, $2);';
    const bookAuthorsQueryArgs = [bookId, authorId];
    await client.query(bookAuthorsQuery, bookAuthorsQueryArgs);

    const bookGenresQuery =
      'INSERT INTO books_genres (book_id, genre_id) VALUES ($1, $2);';
    const bookGenresQueryArgs = [bookId, genreId];
    await client.query(bookGenresQuery, bookGenresQueryArgs);

    returnObj.success = true;
    returnObj.value = getFullBook(title);
    return returnObj;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating full book:', error);
  } finally {
    client.release();
  }
}

async function deleteFullBook(id) {
  const client = await pool.connect();
  try {
    console.log(id);
    const deleteBookQuery = 'DELETE FROM books WHERE id = $1';
    const deleteBookAuthorQuery =
      'DELETE FROM books_authors WHERE book_id = $1';
    const deleteBookGenreQuery = 'DELETE FROM books_genres WHERE book_id = $1';

    const queryArgs = [id];

    await client.query(deleteBookAuthorQuery, queryArgs);
    await client.query(deleteBookGenreQuery, queryArgs);
    await client.query(deleteBookQuery, queryArgs);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting full book:', error);
  } finally {
    client.release();
  }
}

async function getAllBooks() {
  try {
    const query = 'SELECT * FROM books';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting all books:', error);
  }
}

async function getBook(title) {
  try {
    const query = 'SELECT * FROM books WHERE title = $1';
    const queryArgs = [title];
    const { rows } = await pool.query(query, queryArgs);
    return rows;
  } catch (error) {
    console.error(`Error getting book (title: ${title}):`, error);
  }
}

async function insertBook(title, pages) {
  try {
    const insertBookQuery =
      'INSERT INTO books (title, num_of_pages) VALUES ($1, $2) RETURNING *;';
    const queryArgs = [title, pages];
    const { rows } = await pool.query(insertBookQuery, queryArgs);
    return rows[0]; // This will return the book inserted
  } catch (error) {
    console.error(`Error creating book (title: ${title}):`, error);
  }
}

async function getAllAuthors() {
  try {
    const query = 'SELECT * FROM authors';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting all authors:', error);
  }
}

async function getAuthor(name) {
  try {
    const query = 'SELECT * FROM authors WHERE name LIKE ($1)';
    const queryArgs = [name];
    const { rows } = await pool.query(query, queryArgs);
    return rows;
  } catch (error) {
    console.error(`Error getting author (name: ${name}):`, error);
  }
}

async function insertAuthor(name) {
  try {
    const insertAuthorQuery =
      'INSERT INTO authors (name) VALUES ($1) RETURNING *;';
    const queryArgs = [name];
    const { rows } = await pool.query(insertAuthorQuery, queryArgs);
    return rows[0]; // This will return the author inserted
  } catch (error) {
    console.error(`Error creating author (name: ${name}):`, error);
  }
}

async function getAllGenres() {
  try {
    const query = 'SELECT * FROM genres';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting all genres:', error);
  }
}

async function getGenre(name) {
  try {
    const query = 'SELECT * FROM genres WHERE name LIKE ($1)';
    const queryArgs = [name];
    const { rows } = await pool.query(query, queryArgs);
    return rows;
  } catch (error) {
    console.error(`Error getting genre (name: ${name}):`, error);
  }
}

async function insertGenre(name) {
  try {
    const insertGenreQuery =
      'INSERT INTO genres (name) VALUES ($1) RETURNING *;';
    const queryArgs = [name];
    const { rows } = await pool.query(insertGenreQuery, queryArgs);
    return rows[0]; // This will return the genre inserted
  } catch (error) {
    console.error(`Error creating genre (name: ${name}):`, error);
  }
}

module.exports = {
  getAllFullBooks,
  getFullBook,
  insertFullBook,
  deleteFullBook,
  getAllBooks,
  getBook,
  insertBook,
  getAllAuthors,
  getAuthor,
  insertAuthor,
  getAllGenres,
  getGenre,
  insertGenre,
};
