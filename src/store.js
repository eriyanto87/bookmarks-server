const { v4: uuid } = require("uuid");

const bookmarks = [
  {
    id: uuid(),
    url: "http://www.amazon.com",
    title: "evi",
    description: "rocks",
    rating: 4,
  },
  {
    id: uuid(),
    url: "http://www.gmail.com",
    title: "hello",
    description: "world",
    rating: 5,
  },
];

module.exports = bookmarks;
