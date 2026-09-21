const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', async function (req, res) {
  try {
    const getBooks = await new Promise((resolve, reject) => {
      resolve(books);
    });
    res.send(JSON.stringify(getBooks, null, 4));
  } catch (error) {
    res.status(500).send({ message: "Error fetching the books" });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    let isbn = req.params.isbn;
    const getBook = await new Promise((resolve, reject) => {
      let book = books[isbn];
      if (book) {
        resolve(book);
      }
      else {
        reject(new Error("Cannot find the book"));
      }
    });
    res.send(getBook);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

public_users.get('/author/:author', async function (req, res) {
  try {
    let author = req.params.author;
    const getBookByAuthor = await new Promise((resolve, reject) => {
      let theAuthor;
      let found = false;

      for (let i = 1; i <= Object.keys(books).length; i++) {
        if (books[i] && books[i].author === author) {
          theAuthor = books[i];
          found = true;
          break;
        }
      }

      if (found) {
        resolve(theAuthor);
      } else {
        reject(new Error("Invalid Author entered !"));
      }
    });

    res.send(getBookByAuthor);

  } catch (error) {
    res.status(404).send(error.message);
  }
});

public_users.get('/title/:title', async function (req, res) {
  try {
    let title = req.params.title;
    const getBookByTitle = await new Promise((resolve, reject) => {
      let theTitle;
      let found = false;
      for (let i = 1; i <= Object.keys(books).length; i++) {
        if (books[i] && books[i].title === title) {
          theTitle = books[i];
          found = true;
          break;
        }
      }
      if (found) {
        resolve(theTitle);
      } else {
        reject(new Error("Invalid Author entered !"));
      }
    });

    res.send(getBookByTitle);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
