const pool = require('./pool');

exports.getFullBook = async function getFullBook(title) {
  try {
    const query = `
    SELECT books.title, authors.name AS author, genres.name AS genre, books.num_of_pages
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
};

exports.createFullBook = async function createFullBook({
  title,
  author,
  genre,
  pages,
}) {
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
      bookId = insertBook(title, pages);
    }

    /*
    If the array of rows returned is empty (no author found) an author is created,
    if not, the author found is used
    */
    const authorArr = await getAuthor(author);
    const authorId = authorArr.length ? authorArr[0] : insertAuthor(author).id;

    const genreArr = await getGenre(genre);
    const genreId = genreArr.length ? genreArr[0] : insertGenre(genre).id;

    const bookAuthorsQuery =
      'INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2);';
    const bookAuthorsQueryArgs = [bookId, authorId];
    await pool.query(bookAuthorsQuery, bookAuthorsQueryArgs);

    const bookGenresQuery =
      'INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2);';
    const bookGenresQueryArgs = [bookId, authorId];
    await pool.query(bookGenresQuery, bookGenresQueryArgs);

    returnObj.success = true;
    returnObj.value = getFullBook(title);
    return returnObj;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating book:', error);
  } finally {
    client.release();
  }
};

exports.getAllBooks = async function getAllBooks() {
  try {
    const query = 'SELECT * FROM books';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting all books:', error);
  }
};

exports.getBook = async function getBook(title) {
  try {
    const query = 'SELECT * FROM books WHERE title = $1';
    const queryArgs = [title];
    const { rows } = await pool.query(query, queryArgs);
    return rows;
  } catch (error) {
    console.error(`Error getting book (title: ${title}):`, error);
  }
};

exports.insertBook = async function insertBook(title, pages) {
  try {
    const insertBookQuery =
      'INSERT INTO books (title, num_of_pages) VALUES ($1, $2) RETURNING *;';
    const queryArgs = [title, pages];
    const { rows } = await pool.query(insertBookQuery, queryArgs);
    return rows[0]; // This will return the book inserted
  } catch (error) {
    console.error(`Error creating book (title: ${title}):`, error);
  }
};

exports.getAllAuthors = async function getAllAuthors() {
  try {
    const query = 'SELECT * FROM authors';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting all authors:', error);
  }
};

exports.getAuthor = async function getAuthor(name) {
  try {
    const query = 'SELECT * FROM authors WHERE name LIKE ($1)';
    const queryArgs = [name];
    const { rows } = await pool.query(query, queryArgs);
    return rows;
  } catch (error) {
    console.error(`Error getting author (name: ${name}):`, error);
  }
};

exports.insertAuthor = async function insertAuthor(name) {
  try {
    const insertAuthorQuery =
      'INSERT INTO authors (name) VALUES ($1) RETURNING *;';
    const queryArgs = [name];
    const { rows } = await pool.query(insertAuthorQuery, queryArgs);
    return rows[0]; // This will return the author inserted
  } catch (error) {
    console.error(`Error creating author (name: ${name}):`, error);
  }
};

exports.getAllGenres = async function getAllGenres() {
  try {
    const query = 'SELECT * FROM genres';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting all genres:', error);
  }
};

exports.getGenre = async function getGenre(name) {
  try {
    const query = 'SELECT * FROM genres WHERE name LIKE ($1)';
    const queryArgs = [name];
    const { rows } = await pool.query(query, queryArgs);
    return rows;
  } catch (error) {
    console.error(`Error getting genre (name: ${name}):`, error);
  }
};

exports.insertGenre = async function insertGenre(name) {
  try {
    const insertGenreQuery =
      'INSERT INTO genres (name) VALUES ($1) RETURNING *;';
    const queryArgs = [name];
    const { rows } = await pool.query(insertGenreQuery, queryArgs);
    return rows[0]; // This will return the genre inserted
  } catch (error) {
    console.error(`Error creating genre (name: ${name}):`, error);
  }
};
