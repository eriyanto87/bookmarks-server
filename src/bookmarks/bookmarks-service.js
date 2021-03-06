const BookmarksService = {
  getAllBookmarks(knex) {
    return knex.select("*").from("items");
  },
  getById(knex, id) {
    return knex.from("items").select("*").where("id", id).first();
  },
  insertBookmark(knex, newBookmark) {
    return knex
      .insert("newBookmark")
      .into("items")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteBookmark(knex, id) {
    return knex.where({ id }).delete();
  },
  updateBookmark(knex, id, newBookmarkFields) {
    return knex("items").where({ id }).update(newBookmarkFields);
  },
};

module.exports = BookmarksService;
