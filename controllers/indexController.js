const db = require('../db/queries');

exports.indexGet = async (req, res) => {
  res.render('index');
};

exports.createBookGet = async (req, res) => {
  const authors = await db.getAllAuthors();
  const authorNames = authors.map((author) => author.name);
  console.log(authorNames);

  const genres = await db.getAllGenres();
  const genreNames = genres.map((genre) => genre.name);
  res.render('createBook', {
    title: 'Add Book',
    authors: authorNames,
    genres: genreNames,
  });
};
