// create a new router
const app = require("express").Router();

// import the models
const { Post, User, Category } = require("../models/index");

// Route to add a new post
app.post("/", async (req, res) => {
  try {
    const { title, content, username, categoryName } = req.body;
    const post = await Post.create({ title, content, username,  categoryName });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error adding post" });
  }
});

// Route to get all posts
app.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
          include: [
            { model: User, as: "user", attributes: ["username"] }, 
            { model: Category, as: "category", attributes: ["categoryName"] }
          ],
        } );

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving posts", error });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving post" });
  }
});

// Route to update a post
app.put("/:id", async (req, res) => {
  try {
    const { title, content, category_id } = req.body;
    const post = await Post.update(
      { title, content, category_id },
      { where: { id: req.params.id } }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
});

// Route to delete a post
app.delete("/:id", async (req, res) => {
  try {
    const post = await Post.destroy({ where: { id: req.params.id } });

    if (rowsDeleted === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

// export the router
module.exports = app;
