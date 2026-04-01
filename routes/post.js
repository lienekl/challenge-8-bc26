// create a new router
const app = require("express").Router();

// import the models
const { Post, User, Category } = require("../models/index");

// Route to add a new post
app.post("/", async (req, res) => {
  try {
    const { title, content, userId, category_id } = req.body;
    const post = await Post.create({ title, content, user_id:userId, category_id });
   
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
    });

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
const { authMiddleware } = require("../utils/auth");
app.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own posts!" });
    }

    await post.destroy();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

// export the router
module.exports = app;
