// import all models
const Post = require("./post");
const Category = require("./category");
const User = require("./user");

Post.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

Category.hasMany(Post, {
  foreignKey: "category_id",
  as: "posts",
});

User.hasMany(Post, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Post.belongsTo(User, {
  foreignKey: "user_id",
  as:"user",
});

module.exports = {
  Post,
  Category,
  User,
};
