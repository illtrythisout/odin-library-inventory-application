const db = require('../db/queries');

exports.indexGet = async (req, res) => {
  const books = await db.getAllFullBooks();
  console.log(books);
  res.render('index', { books });
};

exports.createBookGet = async (req, res) => {
  const authors = await db.getAllAuthors();
  const authorNames = authors.map((author) => author.name);

  const genres = await db.getAllGenres();
  const genreNames = genres.map((genre) => genre.name);
  res.render('createBook', {
    title: 'Add Book',
    authors: authorNames,
    genres: genreNames,
  });
};

exports.createBookPost = async (req, res) => {
  const { title, author, pages, genre } = req.body;
  await db.insertFullBook({ title, author, pages, genre });
  res.redirect('/');
};

exports.deleteBookPost = async (req, res) => {
  await db.deleteFullBook(req.params.id);
  res.redirect('/');
};
