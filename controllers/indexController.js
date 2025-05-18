const db = require('../db/queries');

function indexGet(req, res) {
  res.render('index');
}

function createBookGet(req, res) {
  console.log(db.getAllAuthors());
  res.render('createBook', {
    title: 'Add Book',
    authors: ['Bob', 'Dylan'],
    genres: ['sci-fi', 'bio'],
  });
}

module.exports = { indexGet, createBookGet };
