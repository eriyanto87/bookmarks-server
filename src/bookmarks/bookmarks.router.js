const express = require("express");
const { v4: uuid } = require("uuid");
const bookmarks = require("../store");
const logger = require("../logger");

const BookmarksService = require("./bookmarks-service");
const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route("/bookmark")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    BookmarksService.getAllBookmarks(knexInstance)
      .then((bookmarks) => {
        res.send(bookmarks);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res) => {
    const { url, title, description, rating } = req.body;

    //validations
    if (!url) {
      logger.error(`url is required`);
      return res.status(400).send("Please provide a url");
    }
    if (!title) {
      logger.error(`title is required`);
      return res.status(400).send("Please provide a title");
    }

    if (!url.includes(".com")) {
      logger.error(`invalid url input`);
      return res.status(400).send("Please enter a valid URL");
    }

    if (rating < 0 || rating > 5) {
      logger.error(`invalid rating input`);
      return res
        .status(400)
        .send(
          "Please provide a number between 1 to 5. 1 is the worst and 5 is the best"
        );
    }

    const id = uuid();

    const newBookmark = {
      id,
      url,
      title,
      description,
      rating,
    };

    bookmarks.push(newBookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json({ id: id });
  });

bookmarksRouter
  .route("/bookmark/:id")
  .get((req, res, next) => {
    const knexInstance = req.get.app("db");
    const { id } = req.params;
    BookmarksService.getById(knexInstance, id)
      .then((bookmark) => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${id} not found.`);
          return res.status(404).send("Bookmark was not found!");
        }
        res.json(bookmark);
      })
      .catch(next);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex((b) => b.id === id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(404).send("Bookmark was not found");
    }

    bookmarks.splice(bookmarkIndex, 1);

    res.status(201).end();
  });

module.exports = bookmarksRouter;
