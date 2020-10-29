const BookmarksService = {
  getAllBookmarks(knex) {
    return knex.select("*").from("items");
  },
  getById(knex, id) {
    return knex.from("items").select("*").where("id", id).first();
  },
};

module.exports = BookmarksService;
