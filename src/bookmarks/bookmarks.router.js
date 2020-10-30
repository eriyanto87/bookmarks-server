const express = require("express");
const xss = require("xss");
const { v4: uuid } = require("uuid");
const bookmarks = require("../store");
const logger = require("../logger");

const BookmarksService = require("./bookmarks-service");
const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    BookmarksService.getAllBookmarks(knexInstance)
      .then((bookmarks) => {
        res.json({
          id: bookmarks.id,
          title: xss(bookmarks.title),
          description: xss(bookmarks.description),
          rating: xss(bookmarks.rating),
          url: xss(bookmarks.url),
        });
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

    BookmarksService.insertBookmark(req.app.get("db"), newBookmark).then(
      (bookmark) => {
        logger.info(`Bookmark with id ${id} created`);
        res
          .status(201)
          .location(`http://localhost:8000/bookmark/${id}`)
          .json({ id: id });
      }
    );
  });

bookmarksRouter
  .route("/:id")
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
  .delete((req, res, next) => {
    const { id } = req.params;
    BookmarksService.deleteBookmark(req.app.get("db"), id)
      .then((rows) => {
        logger.error(`Bookmark with id ${id} not found.`);
        return res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;
    const bookmarkToUpdate = { title, url, description, rating };

    const numOfValues = Object.values(bookmarkToUpdate).filter(Boolean).length;
    if (numOfValues === 0) {
      logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title', 'url', 'description' or 'rating'`,
        },
      });
    }

    BookmarksService.updateBookmark(
      req.app.get("db"),
      req.params.id,
      bookmarkToUpdate
    )
      .then((rows) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarksRouter;
